#!/bin/bash

echo "🔍 Verificando carga de estilos en https://habilispro.com/"

# Verificar que la página principal carga
echo "1. Verificando página principal..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://habilispro.com/)
if [ "$RESPONSE" = "200" ]; then
    echo "✅ Página principal carga correctamente (HTTP $RESPONSE)"
else
    echo "❌ Error al cargar página principal (HTTP $RESPONSE)"
fi

# Verificar que los estilos CSS están disponibles
echo "2. Verificando estilos CSS..."
CSS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://habilispro.com/_next/static/css/)
if [ "$CSS_RESPONSE" = "200" ] || [ "$CSS_RESPONSE" = "308" ]; then
    echo "✅ Estilos CSS están disponibles (HTTP $CSS_RESPONSE)"
else
    echo "❌ Error al cargar estilos CSS (HTTP $CSS_RESPONSE)"
fi

# Verificar que la API está funcionando
echo "3. Verificando API..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://habilispro.com/api/health)
if [ "$API_RESPONSE" = "200" ]; then
    echo "✅ API está funcionando correctamente (HTTP $API_RESPONSE)"
else
    echo "❌ Error en la API (HTTP $API_RESPONSE)"
fi

echo "🎯 Verificación completada"
