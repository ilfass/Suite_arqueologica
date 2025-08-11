from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from ...db import get_session
from ...models import Site

router = APIRouter(prefix="/sites", tags=["sites"])

class SiteIn(BaseModel):
    area_id: UUID
    name: str
    description: str | None = None

class SiteOut(BaseModel):
    id: UUID
    area_id: UUID
    name: str
    description: str | None

    class Config:
        from_attributes = True

@router.get("/", response_model=list[SiteOut])
async def list_sites(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Site))
    return result.scalars().all()

@router.post("/", response_model=SiteOut)
async def create_site(data: SiteIn, session: AsyncSession = Depends(get_session)):
    site = Site(area_id=data.area_id, name=data.name, description=data.description)
    session.add(site)
    await session.commit()
    await session.refresh(site)
    return site
