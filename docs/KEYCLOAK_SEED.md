# Seed Keycloak - realm suite-arqueologica

## Pasos
1. Crear realm `suite-arqueologica`.
2. Crear roles de realm: `admin`, `director`, `investigador`, `estudiante`, `visitante`.
3. Crear client `suite-frontend` (public) con redirect URIs (http://localhost:3000/* y dominio VPN), PKCE.
4. Crear client `suite-backend` (confidential) con `service accounts`, scopes y secret (guardar en Secret K8s).
5. Opcional: crear grupos por proyecto y mapear roles.

## Export/Import
- Usar Keycloak operator/Helm con `realm.json` exportado.
- Mantener secretos fuera de Git.
