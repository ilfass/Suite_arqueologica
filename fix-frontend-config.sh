#!/bin/bash

# ============================================================================
# SCRIPT PARA CORREGIR CONFIGURACIÓN DEL FRONTEND EN EL SERVIDOR
# ============================================================================

set -e

echo "🔧 Corrigiendo configuración del frontend en el servidor..."

# Crear archivo de configuración para producción
cat > frontend-web/.env.production << EOF
NEXT_PUBLIC_SUPABASE_URL=https://avpaiyyjixtdopbciedr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzY4ODQsImV4cCI6MjA2ODcwMzI4NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
NEXT_PUBLIC_API_URL=/api
EOF

echo "✅ Archivo .env.production creado"

# Verificar que el archivo se creó correctamente
echo "📋 Contenido del archivo .env.production:"
cat frontend-web/.env.production

echo "🔄 Reconstruyendo la imagen Docker..."
docker build -t suite-arqueologica:latest .

echo "✅ Configuración del frontend corregida"
echo "🌐 La aplicación debería funcionar correctamente en https://habilispro.com" 