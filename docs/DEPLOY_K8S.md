# Despliegue en Kubernetes (VPN)

## Namespaces
- infra: Postgres+PostGIS, MinIO, Keycloak
- app: backend, frontend
- observability: Prometheus, Grafana, Loki

## Requisitos
- Cluster K8s dentro de VPN habilispro.com / 147.93.36.212
- NGINX Ingress + cert-manager
- Registry interno (Harbor o registry:2)

## Backend
```bash
helm upgrade --install suite-backend k8s/helm-charts/app/backend \
  -n app \
  --set image.repository=registry.local/suite/backend \
  --set image.tag=$(git rev-parse --short HEAD)
```

## Infra recomendada
Usar operadores oficiales (CloudNativePG, MinIO Operator, Keycloak Helm) y parametrizar valores en `values.yaml`.
