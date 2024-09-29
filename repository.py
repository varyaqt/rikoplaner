from sqlalchemy import select

from database2 import new_session, Table
from schemas import STaskAdd, STask


class TaskRepository:
    @classmethod
    async def add_one(cls, data: STaskAdd) -> int:
        async with new_session() as session:
            task_dict = data.model_dump()

            task = Table(**task_dict)
            session.add(task)
            await session.flush()
            await session.commit()
            return task.id


    @classmethod
    async def find_all(cls) -> list[STask]:
        async with new_session() as session:
            query = select(Table)
            result = await session.execute(query)
            task_models = result.scalars().all()
            task_schemas = [STask.model_validate() for task_model in task_models]
            return task_schemas
