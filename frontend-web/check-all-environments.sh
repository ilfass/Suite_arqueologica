#!/bin/bash

echo "🔍 Verificación completa de estilos en todos los entornos"
echo "=================================================="

# Verificar entorno de desarrollo
echo "1. 🛠️  ENTORNO DE DESARROLLO (localhost:3000)"
echo "----------------------------------------"
DEV_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
if [ "$DEV_RESPONSE" = "200" ]; then
    echo "✅ Servidor de desarrollo responde correctamente (HTTP $DEV_RESPONSE)"
else
    echo "❌ Error en servidor de desarrollo (HTTP $DEV_RESPONSE)"
fi

DEV_CLASSES=$(curl -s http://localhost:3000/ | grep -o 'class="[^"]*"' | grep -E "(bg-|text-|flex|grid)" | wc -l)
echo "📊 Clases de Tailwind CSS encontradas: $DEV_CLASSES"

# Verificar entorno de producción
echo ""
echo "2. 🌐 ENTORNO DE PRODUCCIÓN (habilispro.com)"
echo "----------------------------------------"
PROD_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://habilispro.com/)
if [ "$PROD_RESPONSE" = "200" ]; then
    echo "✅ Sitio de producción responde correctamente (HTTP $PROD_RESPONSE)"
else
    echo "❌ Error en sitio de producción (HTTP $PROD_RESPONSE)"
fi

PROD_CLASSES=$(curl -s https://habilispro.com/ | grep -o 'class="[^"]*"' | grep -E "(bg-|text-|flex|grid)" | wc -l)
echo "📊 Clases de Tailwind CSS encontradas: $PROD_CLASSES"

# Verificar API
echo ""
echo "3. 🔌 VERIFICACIÓN DE API"
echo "----------------------------------------"
API_DEV=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/health)
API_PROD=$(curl -s -o /dev/null -w "%{http_code}" https://habilispro.com/api/health)

echo "🔧 API Desarrollo: HTTP $API_DEV"
echo "🌐 API Producción: HTTP $API_PROD"

# Resumen
echo ""
echo "📋 RESUMEN"
echo "=================================================="
if [ "$DEV_RESPONSE" = "200" ] && [ "$PROD_RESPONSE" = "200" ]; then
    echo "✅ Ambos entornos están funcionando correctamente"
else
    echo "⚠️  Hay problemas en alguno de los entornos"
fi

if [ "$DEV_CLASSES" -gt 20 ] && [ "$PROD_CLASSES" -gt 20 ]; then
    echo "✅ Los estilos CSS se están cargando correctamente en ambos entornos"
else
    echo "⚠️  Problemas con la carga de estilos CSS"
fi

echo "🎯 Verificación completada"
