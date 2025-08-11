# Suite Arqueológica

Plataforma web integral para registro, gestión, análisis y publicación de datos arqueológicos.

## Pila técnica
- Frontend: Next.js (TS), Tailwind, PWA, MapLibre/Leaflet
- Backend: FastAPI (Python), Alembic, SQLAlchemy
- BD: PostgreSQL 16 + PostGIS
- Storage: MinIO (S3)
- Auth: Keycloak (OIDC)
- K8s: NGINX Ingress, cert-manager, Prometheus+Grafana, Loki

## Puesta en marcha local (backend)
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn app.main:app --reload --app-dir backend
```

## Endpoints
- GET /api
- GET /api/v1/health

## Despliegue
Ver `docs/DEPLOY_K8S.md`. 