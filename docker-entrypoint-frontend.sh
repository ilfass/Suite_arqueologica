#!/bin/sh

# ============================================================================
# SCRIPT DE INICIO PARA FRONTEND - SUITE ARQUEOLÓGICA
# ============================================================================

set -e

echo "🌐 Iniciando Frontend de Suite Arqueológica..."

# Verificar variables de entorno críticas
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ ERROR: NEXT_PUBLIC_SUPABASE_URL no está definida"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida"
    exit 1
fi

echo "✅ Variables de entorno verificadas"

# Iniciar frontend
echo "🚀 Iniciando Next.js..."
cd /app/frontend-web
exec npm start 