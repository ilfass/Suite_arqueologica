from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ...db import get_session
from ...models import Project
from uuid import UUID

router = APIRouter(prefix="/projects", tags=["projects"])

class ProjectIn(BaseModel):
    name: str
    description: str | None = None

class ProjectOut(BaseModel):
    id: UUID
    name: str
    description: str | None

    class Config:
        from_attributes = True

@router.get("/", response_model=list[ProjectOut])
async def list_projects(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Project))
    return result.scalars().all()

@router.post("/", response_model=ProjectOut)
async def create_project(data: ProjectIn, session: AsyncSession = Depends(get_session)):
    project = Project(name=data.name, description=data.description)
    session.add(project)
    await session.commit()
    await session.refresh(project)
    return project
