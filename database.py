from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

# Создаем асинхронный движок SQLAlchemy
engine = create_async_engine(
    "sqlite+aiosqlite:///tasks.db",
    echo=True  # Опционально: включаем логирование SQL-запросов
)


# Создаем асинхронную сессию
new_session = sessionmaker(
    engine,
    expire_on_commit=False,  # Указываем, что сессия не должна истекать после коммита
    class_=AsyncSession  # Указываем, что это асинхронная сессия
)


class Model(DeclarativeBase):
    pass


class Table(Model):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    description: Mapped[str | None]


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Model.metadata.create_all)


async def delete_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Model.metadata.drop_all)

