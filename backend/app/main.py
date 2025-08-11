from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.health import router as health_router

app = FastAPI(title="Suite Arqueológica API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api")
async def root():
    return {
        "name": "Suite Arqueológica API",
        "version": "0.1.0",
        "endpoints": [
            "/api/v1/health",
        ],
    }

app.include_router(health_router, prefix="/api/v1", tags=["health"])
