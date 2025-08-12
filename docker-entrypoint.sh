#!/bin/sh

# ============================================================================
# SCRIPT DE INICIO PARA DOCKER - SUITE ARQUEOLÓGICA
# ============================================================================

set -e

echo "🚀 Iniciando Suite Arqueológica en modo producción..."

# Función para logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Verificar variables de entorno críticas
if [ -z "$SUPABASE_URL" ]; then
    echo "❌ ERROR: SUPABASE_URL no está definida"
    exit 1
fi

if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ ERROR: SUPABASE_ANON_KEY no está definida"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ ERROR: JWT_SECRET no está definida"
    exit 1
fi

log "✅ Variables de entorno verificadas"

# Iniciar backend en segundo plano
log "🔧 Iniciando backend..."
cd /app/backend
node dist/index.js &
BACKEND_PID=$!

# Esperar a que el backend esté listo (aumentado a 60 segundos)
log "⏳ Esperando a que el backend esté listo..."
for i in $(seq 1 60); do
    if curl -f http://localhost:4000/api/health > /dev/null 2>&1; then
        log "✅ Backend iniciado correctamente"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "❌ ERROR: Backend no se inició en 60 segundos"
        exit 1
    fi
    sleep 1
done

# Iniciar frontend
log "🌐 Iniciando frontend..."
cd /app/frontend-web
npm start &
FRONTEND_PID=$!

# Esperar a que el frontend esté listo (aumentado a 90 segundos)
log "⏳ Esperando a que el frontend esté listo..."
for i in $(seq 1 90); do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log "✅ Frontend iniciado correctamente"
        break
    fi
    if [ $i -eq 90 ]; then
        echo "⚠️  ADVERTENCIA: Frontend no se inició en 90 segundos, pero continuando..."
        # No salir con error, solo continuar
        break
    fi
    sleep 1
done

log "🎉 Suite Arqueológica iniciada correctamente!"
log "📊 URLs disponibles:"
log "   • Frontend: http://localhost:3000"
log "   • API: http://localhost:4000/api"
log "   • Health Check: http://localhost:4000/api/health"

# Función para manejar señales de terminación
cleanup() {
    log "🛑 Recibida señal de terminación, cerrando aplicaciones..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    wait
    log "✅ Aplicaciones cerradas correctamente"
    exit 0
}

# Configurar trap para manejar señales
trap cleanup SIGTERM SIGINT

# Mantener el script ejecutándose
wait 