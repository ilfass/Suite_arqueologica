from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from ...db import get_session
from ...models import Area

router = APIRouter(prefix="/areas", tags=["areas"])

class AreaIn(BaseModel):
    project_id: UUID
    name: str
    description: str | None = None

class AreaOut(BaseModel):
    id: UUID
    project_id: UUID
    name: str
    description: str | None

    class Config:
        from_attributes = True

@router.get("/", response_model=list[AreaOut])
async def list_areas(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Area))
    return result.scalars().all()

@router.post("/", response_model=AreaOut)
async def create_area(data: AreaIn, session: AsyncSession = Depends(get_session)):
    area = Area(project_id=data.project_id, name=data.name, description=data.description)
    session.add(area)
    await session.commit()
    await session.refresh(area)
    return area
