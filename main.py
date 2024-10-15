from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
from typing import List

app = FastAPI(title="RIKONOTES", description="Your personal task destroyer С:")

# Подключение к MongoDB
cluster = MongoClient("mongodb+srv://mi1en:1234@cluster0.qbxk9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = cluster["test"]
collection = db["users"]

post1 = {"_id": 1, "name": "anya"}
post2 = {"_id": 2, "name": "peter"}

users_collection = db['users']
tasks_collection = db['tasks']

user_data = {
    "username": "user1",
    "password": "password1",
    "secret_word": "secret"
}
user_id = users_collection.insert_one(user_data).inserted_id
print(f"User created with ID: {user_id}")

task_data = {
    "title": "Задание 1",
    "description": "Описание задачи",
    "due_date": "2023-12-31T23:59:59",
    "user_id": user_id
}
task_id = tasks_collection.insert_one(task_data).inserted_id
print(f"Задача создана с ID: {task_id}")

class User(BaseModel):
    username: str
    password: str
    secret_word: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, value):
        list_symbols = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"
        list_letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        flag_s = 1
        for c in value:
            if c not in list_symbols:
                flag_s = 0
                break
        if flag_s == 0:
            raise ValueError("В логине можно использовать только латиницу, цифры и символ нижнего подчеркивания")
        flag_l = 0
        for c in value:
            if c in list_letters:
                flag_l = 1
                break
        if flag_l == 0:
            raise ValueError("В логине должна быть хотя бы одна буква")
        if len(value) < 5:
            raise ValueError("Слишком короткий логин, должно быть хотя бы 5 символов")
        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        password_length = len(value)
        if password_length < 8:
            raise ValueError("Длина пароля должна быть не менее 8 символов")
        if password_length > 16:
            raise ValueError("Длина пароля должна быть не более 16 символов")
        list_numbers = "0123456789"
        list_letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        flag_n = 0
        flag_l = 0
        for c in value:
            if c in list_numbers:
                flag_n = 1
                break
        for c in value:
            if c in list_letters:
                flag_l = 1
                break
        if flag_n == 0:
            raise ValueError("Пароль должен содержать хотя бы одну цифру")
        if flag_l == 0:
            raise ValueError("Пароль должен содержать хотя бы одну букву")
        return value

@app.post("/register")
def register_user(user: User):
    # Сохранение пользователя в MongoDB
    user_data = user.model_dump()
    result = users_collection.insert_one(user_data)
    return {"message": "User registered successfully", "user_id": str(result.inserted_id)}

class Task(BaseModel):
    title: str
    description: str
    due_date: datetime
    user_id: str  # Ссылка на пользователя, которому принадлежит задача

@app.post("/tasks")
def create_task(task: Task):
    # Сохранение задачи в MongoDB
    task_data = task.model_dump()
    task_data["user_id"] = ObjectId(task_data["user_id"])  # Преобразуем user_id в ObjectId
    result = tasks_collection.insert_one(task_data)
    return {"message": "Task created successfully", "task_id": str(result.inserted_id)}

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    # Получение всех задач из MongoDB
    tasks = list(tasks_collection.find())
    for task in tasks:
        task["_id"] = str(task["_id"])
        task["user_id"] = str(task["user_id"])
    return tasks

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: str):
    # Получение задачи по ID из MongoDB
    task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    if task:
        task["_id"] = str(task["_id"])
        task["user_id"] = str(task["user_id"])
        return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task: Task):
    # Обновление задачи в MongoDB
    task_data = task.model_dump()
    task_data["user_id"] = ObjectId(task_data["user_id"])  # Преобразуем user_id в ObjectId
    result = tasks_collection.update_one({"_id": ObjectId(task_id)}, {"$set": task_data})
    if result.modified_count == 1:
        task_data["_id"] = task_id
        task_data["user_id"] = str(task_data["user_id"])
        return task_data
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    # Удаление задачи из MongoDB
    result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 1:
        return {"message": "Task deleted successfully"}
    raise HTTPException(status_code=404, detail="Task not found")

# Запуск приложения
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)