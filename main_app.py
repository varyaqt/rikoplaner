from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator


app = FastAPI()


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
        if flag_s==0:
            raise ValueError("В логине можно использовать только латиницу, цифры и символ нижнего подчеркивания")
        flag_l = 0
        for c in value:
            if c in list_letters:
                flag_l = 1
                break
        if flag_l==0:
            raise ValueError("В логине должна быть хотя бы одна буква")
        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        password_length = len(value)
        if password_length < 8:
            raise ValueError("Длина пароля должна быть не меньше 8 символов")
        if password_length > 16:
            raise ValueError("Длина пароля должна быть не больше 16 символов")
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
        if flag_n==0:
            raise ValueError("Пароль должен содержать хотя бы одну цифру")
        if flag_l==0:
            raise ValueError("Пароль должен содержать хотя бы одну букву")
        return value

@app.post("/register")
def register_user(user: User):
    # здесь добавить логику для сохранения в базу данных
    return {"message": "User registered successfully", "user": user}