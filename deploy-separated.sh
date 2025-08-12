#!/bin/bash

# ============================================================================
# SCRIPT PARA DESPLEGAR FRONTEND Y BACKEND SEPARADOS
# ============================================================================

set -e

echo "🔧 Construyendo imágenes separadas..."

# Construir imagen del backend
echo "🐳 Construyendo imagen del backend..."
docker build -f Dockerfile.backend-only -t suite-arqueologica-backend:latest .

# Construir imagen del frontend
echo "🌐 Construyendo imagen del frontend..."
docker build -f Dockerfile.frontend -t suite-arqueologica-frontend:latest .

echo "✅ Imágenes construidas exitosamente"

# Transferir al servidor
echo "📤 Transfiriendo al servidor..."
./transfer-and-deploy-separated.sh

echo "🎉 ¡Despliegue separado completado!" 