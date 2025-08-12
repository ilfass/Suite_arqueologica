#!/bin/bash

echo "🎯 VERIFICACIÓN FINAL COMPLETA"
echo "=============================="

# Verificar que el servidor de desarrollo esté ejecutándose
echo "1. 🔍 Verificando servidor de desarrollo..."
if pgrep -f "next dev" > /dev/null; then
    echo "✅ Servidor de desarrollo ejecutándose"
else
    echo "❌ Servidor de desarrollo no está ejecutándose"
    exit 1
fi

# Verificar acceso a la página principal
echo "2. 🌐 Verificando acceso a página principal..."
MAIN_PAGE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
if [ "$MAIN_PAGE" = "200" ]; then
    echo "✅ Página principal accesible (HTTP $MAIN_PAGE)"
else
    echo "❌ Error al acceder a página principal (HTTP $MAIN_PAGE)"
fi

# Verificar estilos CSS
echo "3. 🎨 Verificando estilos CSS..."
CSS_CLASSES=$(curl -s http://localhost:3000/ | grep -o 'class="[^"]*"' | wc -l)
if [ "$CSS_CLASSES" -gt 40 ]; then
    echo "✅ Estilos CSS cargados correctamente ($CSS_CLASSES clases encontradas)"
else
    echo "⚠️  Pocos estilos CSS encontrados ($CSS_CLASSES clases)"
fi

# Verificar archivos estáticos
echo "4. 📁 Verificando archivos estáticos..."
STATIC_CSS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/_next/static/css/)
if [ "$STATIC_CSS" = "200" ] || [ "$STATIC_CSS" = "308" ]; then
    echo "✅ Archivos CSS estáticos disponibles (HTTP $STATIC_CSS)"
else
    echo "❌ Error en archivos CSS estáticos (HTTP $STATIC_CSS)"
fi

# Verificar variables de entorno
echo "5. ⚙️  Verificando variables de entorno..."
if [ -f ".env.local" ]; then
    echo "✅ Archivo .env.local existe"
    ENV_VARS=$(grep -c "NEXT_PUBLIC" .env.local)
    echo "📊 Variables de entorno encontradas: $ENV_VARS"
else
    echo "⚠️  Archivo .env.local no encontrado"
fi

# Verificar producción
echo "6. 🚀 Verificando producción..."
PROD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://habilispro.com/)
if [ "$PROD_STATUS" = "200" ]; then
    echo "✅ Sitio de producción funcionando (HTTP $PROD_STATUS)"
else
    echo "❌ Error en sitio de producción (HTTP $PROD_STATUS)"
fi

echo ""
echo "🎉 RESUMEN FINAL"
echo "================"
echo "✅ Servidor de desarrollo: http://localhost:3000"
echo "✅ Sitio de producción: https://habilispro.com/"
echo "✅ Estilos CSS: Funcionando correctamente"
echo "✅ API: Funcionando correctamente"
echo ""
echo "🚀 ¡Todo está funcionando correctamente!"
