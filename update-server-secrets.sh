#!/bin/bash

# ============================================================================
# SCRIPT PARA ACTUALIZAR SECRETOS EN EL SERVIDOR
# ============================================================================

set -e

echo "🔧 Actualizando secretos en el servidor..."

# Verificar que kubectl esté disponible
if ! command -v kubectl &> /dev/null; then
    echo "❌ ERROR: kubectl no está instalado o no está en el PATH"
    exit 1
fi

# Verificar conexión al cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ ERROR: No se puede conectar al cluster de Kubernetes"
    exit 1
fi

echo "✅ Conexión al cluster verificada"

# Aplicar el namespace si no existe
echo "📦 Verificando namespace..."
kubectl apply -f k8s/namespace.yaml

# Eliminar el secret anterior si existe
echo "🗑️  Eliminando secret anterior..."
kubectl delete secret suite-arqueologica-secrets -n suite-arqueologica --ignore-not-found=true

# Aplicar el nuevo secret con los valores correctos
echo "🔐 Aplicando nuevo secret..."
kubectl apply -f k8s/secret-corrected.yaml

# Verificar que el secret se aplicó correctamente
echo "✅ Verificando secret..."
kubectl get secret suite-arqueologica-secrets -n suite-arqueologica

echo "🔄 Reiniciando deployment para aplicar nuevos secretos..."
kubectl rollout restart deployment suite-arqueologica -n suite-arqueologica

echo "⏳ Esperando a que el deployment se reinicie..."
kubectl rollout status deployment suite-arqueologica -n suite-arqueologica

echo "✅ Secretos actualizados correctamente!"
echo "🌐 La aplicación debería estar funcionando en https://habilispro.com" 