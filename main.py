from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, field_validator
from pymongo import MongoClient
from datetime import datetime, timedelta
from bson import ObjectId
from typing import List
from jose import JWTError, jwt
from passlib.context import CryptContext
from starlette.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="RIKONOTES", description="Your personal task destroyer С:")

# Подключение к MongoDB
cluster = MongoClient(
    "mongodb+srv://mi1en:1234@cluster0.qbxk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = cluster["test"]
users_collection = db['users']
tasks_collection = db['tasks']

# Секретный ключ для JWT
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Настройка парольного хэширования
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class User(BaseModel):
    username: str
    password: str
    secret_word: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class Task(BaseModel):
    title: str
    description: str
    user_id: str  # Ссылка на пользователя, которому принадлежит задача
    date: datetime
    is_done: bool = False


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(username: str):
    user = users_collection.find_one({"username": username})
    if user:
        user["_id"] = str(user["_id"])
    return user


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


@app.get("/register", response_class=HTMLResponse)
async def get_registration_page():
    with open("templates/registration.html", "r", encoding="utf-8") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content)


@app.post("/register")
def register_user(user: User):
    # Проверка, существует ли пользователь с таким именем
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    # Хэширование пароля
    user_data = user.model_dump()
    user_data["password"] = get_password_hash(user.password)
    result = users_collection.insert_one(user_data)
    return {"message": "User registered successfully", "user_id": str(result.inserted_id)}

@app.get("/main", response_class=HTMLResponse)
async def get_start_page():
    with open("templates/main-page.html", "r", encoding="utf-8") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content)


@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/", response_class=HTMLResponse)
async def get_login_page():
    with open("templates/login.html", "r", encoding="utf-8") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content)


@app.post("/tasks")
def create_task(task: Task, current_user: dict = Depends(get_current_user)):
    # Сохранение задачи в MongoDB
    task_data = task.model_dump()
    task_data["user_id"] = ObjectId(current_user["_id"])  # Используем текущего пользователя
    result = tasks_collection.insert_one(task_data)
    return {"message": "Task created successfully", "task_id": str(result.inserted_id)}


@app.get("/tasks", response_model=List[Task])
def get_tasks(current_user: dict = Depends(get_current_user)):
    # Получение всех задач текущего пользователя из MongoDB
    tasks = list(tasks_collection.find({"user_id": ObjectId(current_user["_id"])}))
    for task in tasks:
        task["_id"] = str(task["_id"])
        task["user_id"] = str(task["user_id"])
    return tasks


@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: str, current_user: dict = Depends(get_current_user)):
    # Получение задачи по ID из MongoDB
    task = tasks_collection.find_one({"_id": ObjectId(task_id), "user_id": ObjectId(current_user["_id"])})
    if task:
        task["_id"] = str(task["_id"])
        task["user_id"] = str(task["user_id"])
        return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task: Task, current_user: dict = Depends(get_current_user)):
    # Обновление задачи в MongoDB
    task_data = task.model_dump()
    task_data["user_id"] = ObjectId(current_user["_id"])  # Используем текущего пользователя
    result = tasks_collection.update_one({"_id": ObjectId(task_id), "user_id": ObjectId(current_user["_id"])},
                                         {"$set": task_data})
    if result.modified_count == 1:
        task_data["_id"] = task_id
        task_data["user_id"] = str(task_data["user_id"])
        return task_data
    raise HTTPException(status_code=404, detail="Task not found")


@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    # Удаление задачи из MongoDB
    result = tasks_collection.delete_one({"_id": ObjectId(task_id), "user_id": ObjectId(current_user["_id"])})
    if result.deleted_count == 1:
        return {"message": "Task deleted successfully"}
    raise HTTPException(status_code=404, detail="Task not found")


@app.get("/users/{user_id}", response_model=User)
def get_user_by_id(user_id: str, current_user: dict = Depends(get_current_user)):
    # Проверка, что пользователь пытается получить свои данные
    if str(current_user["_id"]) != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Получение пользователя по ID из MongoDB
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        user["_id"] = str(user["_id"])
        return user
    raise HTTPException(status_code=404, detail="User not found")


# Настройка статических файлов
app.mount("/static", StaticFiles(directory="static"), name="static")

# Запуск приложения
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)