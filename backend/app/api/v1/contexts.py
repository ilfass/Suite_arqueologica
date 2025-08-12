from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from ...db import get_session
from ...models import Context

router = APIRouter(prefix="/contexts", tags=["contexts"])

class ContextIn(BaseModel):
    site_id: UUID
    title: str
    description: str | None = None

class ContextOut(BaseModel):
    id: UUID
    site_id: UUID
    title: str
    description: str | None

    class Config:
        from_attributes = True

@router.get("/", response_model=list[ContextOut])
async def list_contexts(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Context))
    return result.scalars().all()

@router.post("/", response_model=ContextOut)
async def create_context(data: ContextIn, session: AsyncSession = Depends(get_session)):
    ctx = Context(site_id=data.site_id, title=data.title, description=data.description)
    session.add(ctx)
    await session.commit()
    await session.refresh(ctx)
    return ctx

