#!/bin/bash

# ============================================================================
# SCRIPT PARA DESPLEGAR SOLO EL BACKEND
# ============================================================================

set -e

echo "🚀 Iniciando despliegue del backend simple..."

# 1. Construir imagen del backend
echo "📦 Construyendo imagen del backend..."
docker build -f Dockerfile.backend-simple -t suite-arqueologica-backend-simple:latest .

# 2. Transferir imagen al servidor
echo "📤 Transferiendo imagen al servidor..."
docker save suite-arqueologica-backend-simple:latest | ssh root@habilispro.com "docker load"

# 3. Aplicar configuración de Kubernetes
echo "⚙️ Aplicando configuración de Kubernetes..."

# Eliminar deployment anterior si existe
ssh root@habilispro.com "kubectl delete deployment suite-arqueologica-backend-simple -n suite-arqueologica --ignore-not-found=true"

# Aplicar nuevos archivos
scp k8s/deployment-backend-simple.yaml root@habilispro.com:/tmp/
scp k8s/service-backend-simple.yaml root@habilispro.com:/tmp/
scp k8s/ingress-backend-simple.yaml root@habilispro.com:/tmp/

ssh root@habilispro.com "kubectl apply -f /tmp/deployment-backend-simple.yaml"
ssh root@habilispro.com "kubectl apply -f /tmp/service-backend-simple.yaml"

# Eliminar ingress anterior y aplicar el nuevo
ssh root@habilispro.com "kubectl delete ingress suite-arqueologica-ingress -n suite-arqueologica --ignore-not-found=true"
ssh root@habilispro.com "kubectl apply -f /tmp/ingress-backend-simple.yaml"

# 4. Esperar a que el pod esté listo
echo "⏳ Esperando a que el pod esté listo..."
ssh root@habilispro.com "kubectl wait --for=condition=ready pod -l app=suite-arqueologica-backend-simple -n suite-arqueologica --timeout=300s"

# 5. Verificar estado
echo "🔍 Verificando estado del despliegue..."
ssh root@habilispro.com "kubectl get pods -n suite-arqueologica"
ssh root@habilispro.com "kubectl get services -n suite-arqueologica"
ssh root@habilispro.com "kubectl get ingress -n suite-arqueologica"

echo "✅ Despliegue del backend simple completado!"
echo "🌐 URL: https://habilispro.com"
echo "🔧 API: https://habilispro.com/api/health" 