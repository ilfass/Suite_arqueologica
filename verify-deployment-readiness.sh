#!/bin/bash

# ============================================================================
# SCRIPT PARA VERIFICAR PREPARACIÓN DEL DESPLIEGUE
# ============================================================================

set -e

echo "🔍 Verificando preparación para el despliegue..."

# Verificar archivos necesarios
echo "📁 Verificando archivos necesarios..."

required_files=(
    "k8s/namespace.yaml"
    "k8s/secret-corrected.yaml"
    "k8s/deployment.yaml"
    "k8s/service.yaml"
    "k8s/ingress.yaml"
    "frontend-web/.env.production"
    "Dockerfile"
    "docker-entrypoint.sh"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - NO ENCONTRADO"
        exit 1
    fi
done

# Verificar imagen Docker
echo ""
echo "🐳 Verificando imagen Docker..."
if docker images | grep -q "suite-arqueologica.*latest"; then
    echo "✅ Imagen Docker suite-arqueologica:latest encontrada"
else
    echo "❌ Imagen Docker no encontrada. Ejecuta: ./fix-frontend-config.sh"
    exit 1
fi

# Verificar configuración del frontend
echo ""
echo "⚙️  Verificando configuración del frontend..."
if grep -q "NEXT_PUBLIC_API_URL=/api" frontend-web/.env.production; then
    echo "✅ NEXT_PUBLIC_API_URL configurado correctamente para producción"
else
    echo "❌ NEXT_PUBLIC_API_URL no configurado correctamente"
    exit 1
fi

# Verificar secretos
echo ""
echo "🔐 Verificando secretos..."
if grep -q "aHR0cHM6Ly9hdnBhaXl5aml4dGRvcGJjaWVkci5zdXBhYmFzZS5jbwo=" k8s/secret-corrected.yaml; then
    echo "✅ Secretos con valores reales de Supabase"
else
    echo "❌ Secretos no contienen valores reales"
    exit 1
fi

# Verificar conectividad al servidor
echo ""
echo "🌐 Verificando conectividad al servidor..."
if curl -f -s https://habilispro.com > /dev/null; then
    echo "✅ Servidor accesible"
else
    echo "⚠️  Servidor no accesible desde local"
fi

echo ""
echo "🎉 ¡Todo listo para el despliegue!"
echo "📋 Para desplegar ejecuta: ./deploy-to-server.sh" 