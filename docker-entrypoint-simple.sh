#!/bin/sh

# ============================================================================
# SCRIPT SIMPLE DE INICIO - SOLO BACKEND
# ============================================================================

set -e

echo "🚀 Iniciando Suite Arqueológica (solo backend)..."

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

echo "✅ Variables de entorno verificadas"

# Iniciar solo el backend
echo "🔧 Iniciando backend..."
cd /app/backend
exec node dist/index.js 