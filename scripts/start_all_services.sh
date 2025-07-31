#!/bin/bash

echo "🚀 Iniciando Suite Arqueológica - Arquitectura de Microservicios"
echo "================================================================"

# Función para verificar si un puerto está en uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "✅ Puerto $1 está en uso"
        return 0
    else
        echo "❌ Puerto $1 no está en uso"
        return 1
    fi
}

# Función para iniciar un servicio
start_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    
    echo ""
    echo "🔧 Iniciando $service_name..."
    
    if check_port $port; then
        echo "⚠️  $service_name ya está ejecutándose en puerto $port"
        return 0
    fi
    
    cd "$service_path"
    
    if [ ! -f "package.json" ]; then
        echo "❌ No se encontró package.json en $service_path"
        return 1
    fi
    
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependencias para $service_name..."
        npm install
    fi
    
    echo "🚀 Iniciando $service_name en puerto $port..."
    npm run dev &
    
    # Esperar un momento para que el servicio se inicie
    sleep 3
    
    if check_port $port; then
        echo "✅ $service_name iniciado exitosamente en puerto $port"
        return 0
    else
        echo "❌ Error al iniciar $service_name"
        return 1
    fi
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Debes ejecutar este script desde la raíz del proyecto"
    exit 1
fi

echo ""
echo "📋 Verificando servicios actuales..."
echo ""

# Verificar servicios existentes
check_port 3000 && echo "   - Frontend (Next.js): http://localhost:3000"
check_port 4001 && echo "   - Auth Service: http://localhost:4001"
check_port 4000 && echo "   - API Gateway: http://localhost:4000"

echo ""
echo "🔄 Iniciando servicios faltantes..."
echo ""

# Iniciar Auth Service si no está ejecutándose
if ! check_port 4001; then
    start_service "Auth Service" "apps/auth-service" 4001
fi

# Iniciar API Gateway si no está ejecutándose
if ! check_port 4000; then
    start_service "API Gateway" "gateway" 4000
fi

echo ""
echo "📊 Estado final de los servicios:"
echo ""

check_port 3000 && echo "✅ Frontend (Next.js): http://localhost:3000"
check_port 4001 && echo "✅ Auth Service: http://localhost:4001"
check_port 4000 && echo "✅ API Gateway: http://localhost:4000"

echo ""
echo "🔗 URLs de prueba:"
echo "   - Frontend: http://localhost:3000"
echo "   - Auth Service Health: http://localhost:4001/health"
echo "   - API Gateway Health: http://localhost:4000/health"
echo "   - Auth Service Register: http://localhost:4001/auth/register"
echo ""

echo "🎉 ¡Servicios iniciados! Presiona Ctrl+C para detener todos los servicios."
echo ""

# Mantener el script ejecutándose y manejar Ctrl+C
trap 'echo ""; echo "🛑 Deteniendo servicios..."; pkill -f "ts-node"; pkill -f "npm run dev"; echo "✅ Servicios detenidos"; exit 0' INT

# Esperar indefinidamente
while true; do
    sleep 10
    echo "⏰ Servicios ejecutándose... (Ctrl+C para detener)"
done 