#!/bin/bash

# ============================================================================
# SCRIPT PARA TRANSFERIR ARCHIVOS AL SERVIDOR Y EJECUTAR DESPLIEGUE
# ============================================================================

set -e

echo "📤 Preparando transferencia al servidor..."

# Verificar que SSH esté configurado
if ! command -v ssh &> /dev/null; then
    echo "❌ ERROR: SSH no está disponible"
    exit 1
fi

# Configuración del servidor (ajustar según tu configuración)
SERVER_HOST="habilispro.com"
SERVER_USER="root"
SERVER_PATH="/opt/suite-arqueologica"

echo "🌐 Servidor: $SERVER_USER@$SERVER_HOST"
echo "📁 Ruta en servidor: $SERVER_PATH"

# Crear archivo tar con TODOS los archivos necesarios
echo "📦 Creando archivo de transferencia con código completo..."
tar -czf suite-arqueologica-deploy.tar.gz \
    k8s/ \
    frontend-web/ \
    backend/ \
    Dockerfile \
    docker-entrypoint.sh \
    docker-entrypoint-improved.sh \
    deploy-on-server.sh \
    package.json \
    package-lock.json

echo "✅ Archivo de transferencia creado: suite-arqueologica-deploy.tar.gz"

# Transferir archivos al servidor
echo "📤 Transfiriendo archivos al servidor..."
scp suite-arqueologica-deploy.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

# Ejecutar comandos en el servidor
echo "🚀 Ejecutando despliegue en el servidor..."
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
set -e

echo "📥 Extrayendo archivos..."
cd /tmp
tar -xzf suite-arqueologica-deploy.tar.gz

echo "📁 Creando directorio del proyecto..."
mkdir -p /opt/suite-arqueologica
cp -r k8s/ /opt/suite-arqueologica/
cp -r frontend-web/ /opt/suite-arqueologica/
cp -r backend/ /opt/suite-arqueologica/
cp Dockerfile /opt/suite-arqueologica/
cp docker-entrypoint.sh /opt/suite-arqueologica/
cp docker-entrypoint-improved.sh /opt/suite-arqueologica/
cp deploy-on-server.sh /opt/suite-arqueologica/
cp package.json /opt/suite-arqueologica/
cp package-lock.json /opt/suite-arqueologica/

echo "📂 Navegando al directorio del proyecto..."
cd /opt/suite-arqueologica

echo "🔧 Dando permisos de ejecución..."
chmod +x deploy-on-server.sh
chmod +x docker-entrypoint.sh
chmod +x docker-entrypoint-improved.sh

echo "🐳 Construyendo imagen Docker..."
docker build -t suite-arqueologica:latest .

echo "🚀 Ejecutando despliegue..."
./deploy-on-server.sh

echo "🧹 Limpiando archivos temporales..."
rm -f /tmp/suite-arqueologica-deploy.tar.gz

echo "✅ Despliegue completado en el servidor"
EOF

echo ""
echo "🎉 ¡Transferencia y despliegue completados!"
echo "🌐 Verifica la aplicación en: https://habilispro.com"
echo ""
echo "📋 Para verificar el estado en el servidor:"
echo "   ssh $SERVER_USER@$SERVER_HOST"
echo "   kubectl get pods -n suite-arqueologica" 