from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.health import router as health_router
from .api.v1.projects import router as projects_router
from .api.v1.areas import router as areas_router
from .api.v1.sites import router as sites_router
from .api.v1.contexts import router as contexts_router

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
            "/api/v1/projects",
            "/api/v1/areas",
            "/api/v1/sites",
            "/api/v1/contexts",
        ],
    }

app.include_router(health_router, prefix="/api/v1", tags=["health"]) 
app.include_router(projects_router, prefix="/api/v1")
app.include_router(areas_router, prefix="/api/v1")
app.include_router(sites_router, prefix="/api/v1")
app.include_router(contexts_router, prefix="/api/v1")
