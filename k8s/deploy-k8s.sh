#!/bin/bash

# ============================================================================
# SCRIPT DE DEPLOY KUBERNETES - SUITE ARQUEOLÓGICA
# ============================================================================

set -e

echo "🚀 Iniciando deploy de Suite Arqueológica en Kubernetes..."

# Variables de configuración
NAMESPACE="suite-arqueologica"
REGISTRY="tu-registry.com"
IMAGE_TAG="latest"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Verificar que kubectl esté instalado
if ! command -v kubectl &> /dev/null; then
    error "kubectl no está instalado. Por favor instálalo primero."
fi

# Verificar conexión al cluster
if ! kubectl cluster-info &> /dev/null; then
    error "No se puede conectar al cluster de Kubernetes."
fi

log "✅ Conexión al cluster verificada"

# Construir imagen Docker
log "🔨 Construyendo imagen Docker..."
docker build -t $REGISTRY/suite-arqueologica:$IMAGE_TAG .

# Subir imagen al registry
log "📤 Subiendo imagen al registry..."
docker push $REGISTRY/suite-arqueologica:$IMAGE_TAG

# Crear namespace si no existe
log "📁 Creando namespace..."
kubectl apply -f k8s/namespace.yaml

# Aplicar ConfigMap y Secrets
log "🔐 Aplicando ConfigMap y Secrets..."
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# Aplicar Deployment
log "🚀 Aplicando Deployment..."
kubectl apply -f k8s/deployment.yaml

# Aplicar Services
log "🔌 Aplicando Services..."
kubectl apply -f k8s/service.yaml

# Aplicar Ingress
log "🌐 Aplicando Ingress..."
kubectl apply -f k8s/ingress.yaml

# Aplicar HPA
log "📈 Aplicando Horizontal Pod Autoscaler..."
kubectl apply -f k8s/hpa.yaml

# Aplicar monitoreo (si Prometheus está instalado)
if kubectl get namespace monitoring &> /dev/null; then
    log "📊 Aplicando configuración de monitoreo..."
    kubectl apply -f k8s/monitoring.yaml
else
    warn "Namespace 'monitoring' no encontrado. Saltando configuración de monitoreo."
fi

# Esperar a que los pods estén listos
log "⏳ Esperando a que los pods estén listos..."
kubectl wait --for=condition=ready pod -l app=suite-arqueologica -n $NAMESPACE --timeout=300s

# Verificar estado
log "🔍 Verificando estado del deploy..."
kubectl get pods -n $NAMESPACE
kubectl get services -n $NAMESPACE
kubectl get ingress -n $NAMESPACE

# Mostrar logs de los pods
log "📋 Logs de los pods:"
kubectl logs -l app=suite-arqueologica -n $NAMESPACE --tail=10

log "✅ Deploy en Kubernetes completado exitosamente!"
log "📊 URLs:"
log "   • Frontend: https://tu-dominio.com"
log "   • API: https://tu-dominio.com/api"
log "   • Health Check: https://tu-dominio.com/api/health"

log "🔧 Comandos útiles:"
log "   • Ver pods: kubectl get pods -n $NAMESPACE"
log "   • Ver logs: kubectl logs -f deployment/suite-arqueologica -n $NAMESPACE"
log "   • Escalar: kubectl scale deployment suite-arqueologica --replicas=5 -n $NAMESPACE"
log "   • Monitoreo: kubectl top pods -n $NAMESPACE"
log "   • Describir: kubectl describe deployment suite-arqueologica -n $NAMESPACE" 