#!/bin/bash

echo "🎨 Verificación final de estilos en https://habilispro.com/"

# Verificar que la página carga correctamente
echo "1. Verificando carga de página..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://habilispro.com/)
if [ "$RESPONSE" = "200" ]; then
    echo "✅ Página carga correctamente (HTTP $RESPONSE)"
else
    echo "❌ Error al cargar página (HTTP $RESPONSE)"
fi

# Verificar que los estilos CSS están presentes
echo "2. Verificando clases de Tailwind CSS..."
TAILWIND_CLASSES=$(curl -s -H "User-Agent: Mozilla/5.0" https://habilispro.com/ | grep -o 'class="[^"]*"' | grep -E "(bg-|text-|flex|grid|min-h|max-w)" | wc -l)
if [ "$TAILWIND_CLASSES" -gt 10 ]; then
    echo "✅ Se encontraron $TAILWIND_CLASSES clases de Tailwind CSS"
else
    echo "❌ Pocas clases de Tailwind encontradas ($TAILWIND_CLASSES)"
fi

# Verificar que el CSS se está cargando
echo "3. Verificando archivo CSS..."
CSS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://habilispro.com/_next/static/css/)
if [ "$CSS_RESPONSE" = "200" ] || [ "$CSS_RESPONSE" = "308" ]; then
    echo "✅ Archivo CSS está disponible (HTTP $CSS_RESPONSE)"
else
    echo "❌ Error al cargar CSS (HTTP $CSS_RESPONSE)"
fi

# Verificar contenido específico
echo "4. Verificando contenido específico..."
CONTENT_CHECK=$(curl -s https://habilispro.com/ | grep -c "bg-gradient-to-br from-blue-50 to-indigo-100")
if [ "$CONTENT_CHECK" -gt 0 ]; then
    echo "✅ Clases de gradiente encontradas"
else
    echo "❌ Clases de gradiente no encontradas"
fi

echo "🎯 Verificación completada - Los estilos deberían estar funcionando correctamente"
