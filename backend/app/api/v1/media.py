from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from minio import Minio
import os
from datetime import timedelta

router = APIRouter(prefix="/media", tags=["media"])

class MediaRequest(BaseModel):
    filename: str
    content_type: str

class MediaResponse(BaseModel):
    url: str
    method: str = "PUT"
    headers: dict = {}

@router.post("/presign", response_model=MediaResponse)
async def presign_upload(req: MediaRequest):
    endpoint = os.getenv("MINIO_ENDPOINT", "minio.infra.svc.cluster.local:9000")
    access_key = os.getenv("MINIO_ACCESS_KEY", "minio-root")
    secret_key = os.getenv("MINIO_SECRET_KEY", "minio-secret-1234")
    bucket = os.getenv("MINIO_BUCKET", "media")
    secure = os.getenv("MINIO_SECURE", "false").lower() == "true"

    client = Minio(endpoint, access_key=access_key, secret_key=secret_key, secure=secure)

    # Crear bucket si no existe (idempotente)
    found = client.bucket_exists(bucket)
    if not found:
        client.make_bucket(bucket)

    url = client.presigned_put_object(bucket, req.filename, expires=timedelta(hours=1))
    return MediaResponse(url=url, headers={"Content-Type": req.content_type})

