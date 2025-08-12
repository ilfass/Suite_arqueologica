# Guía de Despliegue Manual en el Servidor

## 🎯 Objetivo
Desplegar la aplicación Suite Arqueológica en el servidor con la configuración corregida.

## 📋 Pasos para Ejecutar en el Servidor

### 1. Conectarse al Servidor
```bash
ssh root@habilispro.com
```

### 2. Navegar al Directorio del Proyecto
```bash
cd /opt/suite-arqueologica
```

### 3. Verificar Archivos Necesarios
```bash
ls -la
# Deberías ver:
# - k8s/
# - frontend-web/.env.production
# - Dockerfile
# - docker-entrypoint.sh
# - deploy-on-server.sh
```

### 4. Ejecutar el Despliegue
```bash
./deploy-on-server.sh
```

## 🔧 Si los archivos no están en el servidor

### Opción A: Transferir desde tu máquina local
```bash
# En tu máquina local:
scp -r k8s/ root@habilispro.com:/opt/suite-arqueologica/
scp frontend-web/.env.production root@habilispro.com:/opt/suite-arqueologica/
scp Dockerfile root@habilispro.com:/opt/suite-arqueologica/
scp docker-entrypoint.sh root@habilispro.com:/opt/suite-arqueologica/
scp deploy-on-server.sh root@habilispro.com:/opt/suite-arqueologica/
```

### Opción B: Crear archivos directamente en el servidor

#### 1. Crear el archivo de configuración del frontend
```bash
cat > /opt/suite-arqueologica/frontend-web/.env.production << 'EOF'
NEXT_PUBLIC_OIDC_ISSUER=https://keycloak.habilispro.com/realms/suite-arqueologica
NEXT_PUBLIC_OIDC_CLIENT_ID=suite-frontend
NEXT_PUBLIC_API_URL=/api
EOF
```

#### 2. (Opcional) Secretos de despliegue
Usar Secrets de Kubernetes para variables sensibles (DB, OIDC). No almacenar credenciales en Git.

## 🚀 Comandos de Despliegue

### 1. Aplicar Namespace
```bash
kubectl apply -f k8s/namespace.yaml
```

### 2. Eliminar Secret Anterior
```bash
kubectl delete secret suite-arqueologica-secrets -n suite-arqueologica --ignore-not-found=true
```

### 3. Aplicar Nuevo Secret
```bash
kubectl apply -f k8s/secret-corrected.yaml
```

### 4. Aplicar Recursos de Kubernetes
```bash
kubectl apply -f k8s/
```

### 5. Verificar Estado
```bash
kubectl get pods -n suite-arqueologica
kubectl rollout status deployment suite-arqueologica -n suite-arqueologica
```

## 🔍 Verificación

### Verificar que la aplicación funcione:
```bash
# Verificar pods
kubectl get pods -n suite-arqueologica

# Verificar servicios
kubectl get services -n suite-arqueologica

# Verificar ingress
kubectl get ingress -n suite-arqueologica

# Ver logs
kubectl logs -n suite-arqueologica deployment/suite-arqueologica
```

### Probar la aplicación:
- Navegar a https://habilispro.com
- Verificar que la página cargue correctamente
- Probar login/registro
- Verificar conexión con la API

## 🛠️ Solución de Problemas

### Si hay errores en los pods:
```bash
kubectl describe pod -n suite-arqueologica
kubectl logs -n suite-arqueologica <nombre-del-pod>
```

### Si el ingress no funciona:
```bash
kubectl get ingress -n suite-arqueologica -o yaml
```

### Si hay problemas de configuración:
```bash
kubectl get secret suite-arqueologica-secrets -n suite-arqueologica -o yaml
```

## 🎯 Resultado Esperado

Después del despliegue exitoso:
- ✅ https://habilispro.com debería cargar correctamente
- ✅ La API debería estar disponible en /api
- ✅ El login y registro deberían funcionar
- ✅ La base de datos PostgreSQL interna (VPN) debería estar conectada