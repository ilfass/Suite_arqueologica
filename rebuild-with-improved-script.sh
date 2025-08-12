#!/bin/bash

# ============================================================================
# SCRIPT PARA RECONSTRUIR IMAGEN CON SCRIPT MEJORADO
# ============================================================================

set -e

echo "🔧 Reconstruyendo imagen Docker con script mejorado..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

echo "✅ Directorio del proyecto verificado"

# Construir nueva imagen con script mejorado
echo "🐳 Construyendo imagen Docker..."
docker build -t suite-arqueologica:latest .

echo "✅ Imagen construida exitosamente"

# Transferir al servidor y desplegar
echo "📤 Transfiriendo al servidor..."
./transfer-and-deploy.sh

echo "🎉 ¡Reconstrucción y despliegue completados!" 