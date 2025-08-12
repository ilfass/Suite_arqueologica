#!/bin/bash

# ============================================================================
# SCRIPT PARA DESPLEGAR FRONTEND Y BACKEND SEPARADOS EN EL SERVIDOR
# ============================================================================

set -e

echo "🚀 Iniciando despliegue separado en el servidor..."

# Verificar directorio
if [ ! -d "/opt/suite-arqueologica" ]; then
    echo "❌ ERROR: Directorio del proyecto no encontrado"
    exit 1
fi

cd /opt/suite-arqueologica

# Verificar conexión al cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ ERROR: No se puede conectar al cluster de Kubernetes"
    exit 1
fi

echo "✅ Conexión al cluster verificada"

# Aplicar namespace
echo "📦 Aplicando namespace..."
kubectl apply -f k8s/namespace.yaml

# Eliminar deployments anteriores
echo "🗑️  Eliminando deployments anteriores..."
kubectl delete deployment suite-arqueologica -n suite-arqueologica --ignore-not-found=true

# Aplicar secretos
echo "🔐 Aplicando secretos..."
kubectl delete secret suite-arqueologica-secrets -n suite-arqueologica --ignore-not-found=true
kubectl apply -f k8s/secret-corrected.yaml

# Aplicar deployments separados
echo "📋 Aplicando deployments separados..."
kubectl apply -f k8s/deployment-backend.yaml
kubectl apply -f k8s/deployment-frontend.yaml

# Aplicar servicios separados
echo "🔌 Aplicando servicios separados..."
kubectl apply -f k8s/service-separated.yaml

# Aplicar ingress separado
echo "🌐 Aplicando ingress separado..."
kubectl apply -f k8s/ingress-separated.yaml

# Esperar a que los deployments estén listos
echo "⏳ Esperando a que los deployments estén listos..."
kubectl rollout status deployment suite-arqueologica-backend -n suite-arqueologica
kubectl rollout status deployment suite-arqueologica-frontend -n suite-arqueologica

# Verificar estado
echo "📊 Estado final:"
kubectl get pods -n suite-arqueologica
kubectl get services -n suite-arqueologica
kubectl get ingress -n suite-arqueologica

echo "✅ Despliegue separado completado exitosamente!" 