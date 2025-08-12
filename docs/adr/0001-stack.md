# ADR 0001 - Selección de stack

- Frontend: Next.js (TypeScript), PWA, Tailwind, MapLibre/Leaflet
- Backend: FastAPI (Python), SQLAlchemy, Alembic
- Auth: Keycloak (OIDC)
- BD: PostgreSQL 16 + PostGIS
- Storage: MinIO (S3)
- Observabilidad: Prometheus, Grafana, Loki
- K8s: NGINX Ingress, cert-manager

Razonamiento: stack libre, maduro, con soporte async y ecosistema robusto.

