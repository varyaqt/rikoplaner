from pydantic import BaseModel


class STaskAdd(BaseModel):
    name: str
    description: str | None = None  # Указываем значение по умолчанию

class STask(STaskAdd):
    id: int

