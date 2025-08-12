#!/bin/bash

# ============================================================================
# SCRIPT PARA TRANSFERIR Y DESPLEGAR FRONTEND/BACKEND SEPARADOS
# ============================================================================

set -e

echo "📤 Preparando transferencia al servidor..."

# Verificar que SSH esté configurado
if ! command -v ssh &> /dev/null; then
    echo "❌ ERROR: SSH no está disponible"
    exit 1
fi

# Configuración del servidor
SERVER_HOST="habilispro.com"
SERVER_USER="root"
SERVER_PATH="/opt/suite-arqueologica"

echo "🌐 Servidor: $SERVER_USER@$SERVER_HOST"
echo "📁 Ruta en servidor: $SERVER_PATH"

# Crear archivo tar con archivos necesarios
echo "📦 Creando archivo de transferencia..."
tar -czf suite-arqueologica-separated.tar.gz \
    k8s/deployment-frontend.yaml \
    k8s/deployment-backend.yaml \
    k8s/service-separated.yaml \
    k8s/ingress-separated.yaml \
    k8s/secret-corrected.yaml \
    k8s/namespace.yaml \
    Dockerfile.frontend \
    Dockerfile.backend-only \
    docker-entrypoint-frontend.sh \
    docker-entrypoint-simple.sh \
    frontend-web/ \
    backend/ \
    deploy-separated-on-server.sh

echo "✅ Archivo de transferencia creado: suite-arqueologica-separated.tar.gz"

# Transferir archivos al servidor
echo "📤 Transfiriendo archivos al servidor..."
scp suite-arqueologica-separated.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

# Ejecutar comandos en el servidor
echo "🚀 Ejecutando despliegue en el servidor..."
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
set -e

echo "📥 Extrayendo archivos..."
cd /tmp
tar -xzf suite-arqueologica-separated.tar.gz

echo "📁 Creando directorio del proyecto..."
mkdir -p /opt/suite-arqueologica
cp -r k8s/ /opt/suite-arqueologica/
cp Dockerfile.frontend /opt/suite-arqueologica/
cp Dockerfile.backend-only /opt/suite-arqueologica/
cp docker-entrypoint-frontend.sh /opt/suite-arqueologica/
cp docker-entrypoint-simple.sh /opt/suite-arqueologica/
cp -r frontend-web/ /opt/suite-arqueologica/
cp -r backend/ /opt/suite-arqueologica/
cp deploy-separated-on-server.sh /opt/suite-arqueologica/

echo "📂 Navegando al directorio del proyecto..."
cd /opt/suite-arqueologica

echo "🔧 Dando permisos de ejecución..."
chmod +x docker-entrypoint-frontend.sh
chmod +x docker-entrypoint-simple.sh
chmod +x deploy-separated-on-server.sh

echo "🐳 Construyendo imagen del backend..."
docker build -f Dockerfile.backend-only -t suite-arqueologica-backend:latest .

echo "🌐 Construyendo imagen del frontend..."
docker build -f Dockerfile.frontend -t suite-arqueologica-frontend:latest .

echo "🚀 Ejecutando despliegue separado..."
./deploy-separated-on-server.sh

echo "🧹 Limpiando archivos temporales..."
rm -f /tmp/suite-arqueologica-separated.tar.gz

echo "✅ Despliegue separado completado en el servidor"
EOF

echo ""
echo "🎉 ¡Transferencia y despliegue separado completados!"
echo "🌐 Verifica la aplicación en: https://habilispro.com"
echo ""
echo "📋 Para verificar el estado en el servidor:"
echo "   ssh $SERVER_USER@$SERVER_HOST"
echo "   kubectl get pods -n suite-arqueologica" 