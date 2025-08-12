#!/bin/bash

# ============================================================================
# SCRIPT PARA EJECUTAR EN EL SERVIDOR - DESPLIEGUE COMPLETO
# ============================================================================

set -e

echo "🚀 Iniciando despliegue completo en el servidor..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

echo "✅ Directorio del proyecto verificado"

# Verificar que kubectl esté disponible
if ! command -v kubectl &> /dev/null; then
    echo "❌ ERROR: kubectl no está instalado"
    exit 1
fi

# Verificar conexión al cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ ERROR: No se puede conectar al cluster de Kubernetes"
    echo "💡 Verifica que estés ejecutando este script en el servidor con acceso al cluster"
    exit 1
fi

echo "✅ Conexión al cluster verificada"

# Mostrar información del cluster
echo "📊 Información del cluster:"
kubectl cluster-info

# Aplicar el namespace
echo "📦 Aplicando namespace..."
kubectl apply -f k8s/namespace.yaml

# Eliminar el secret anterior si existe
echo "🗑️  Eliminando secret anterior..."
kubectl delete secret suite-arqueologica-secrets -n suite-arqueologica --ignore-not-found=true

# Aplicar el nuevo secret con los valores correctos
echo "🔐 Aplicando nuevo secret con valores reales..."
kubectl apply -f k8s/secret-corrected.yaml

# Verificar que el secret se aplicó correctamente
echo "✅ Verificando secret..."
kubectl get secret suite-arqueologica-secrets -n suite-arqueologica

# Aplicar todos los recursos de Kubernetes
echo "📋 Aplicando recursos de Kubernetes..."
kubectl apply -f k8s/

# Verificar el estado de los pods
echo "🔍 Verificando estado de los pods..."
kubectl get pods -n suite-arqueologica

# Esperar a que el deployment esté listo
echo "⏳ Esperando a que el deployment esté listo..."
kubectl rollout status deployment suite-arqueologica -n suite-arqueologica

# Verificar el estado final
echo "📊 Estado final del despliegue:"
kubectl get all -n suite-arqueologica

# Verificar el ingress
echo "🌐 Verificando ingress..."
kubectl get ingress -n suite-arqueologica

# Verificar logs del deployment
echo "📋 Logs del deployment:"
kubectl logs -n suite-arqueologica deployment/suite-arqueologica --tail=20

echo ""
echo "🎉 ¡Despliegue completado exitosamente!"
echo "🌐 La aplicación debería estar disponible en: https://habilispro.com"
echo ""
echo "📋 Para verificar el estado:"
echo "   kubectl get pods -n suite-arqueologica"
echo "   kubectl logs -n suite-arqueologica deployment/suite-arqueologica"
echo ""
echo "🔍 Para diagnosticar problemas:"
echo "   kubectl describe pod -n suite-arqueologica"
echo "   kubectl get events -n suite-arqueologica" 