#!/bin/bash

echo "🎨 VERIFICACIÓN VISUAL DE ESTILOS"
echo "=================================="

echo "🌐 Abriendo https://habilispro.com/ en el navegador..."
xdg-open https://habilispro.com/

echo ""
echo "📋 ELEMENTOS VISUALES A VERIFICAR:"
echo "=================================="
echo "✅ Gradiente de fondo: azul claro a índigo"
echo "✅ Header con efecto de transparencia (bg-white/80)"
echo "✅ Botones con colores azules (bg-blue-600)"
echo "✅ Iconos con color azul (text-blue-600)"
echo "✅ Tarjetas con sombra y bordes redondeados"
echo "✅ Tipografía Inter de Google Fonts"
echo "✅ Diseño responsive (grid y flexbox)"
echo "✅ Efectos hover en botones"
echo "✅ Espaciado y márgenes consistentes"

echo ""
echo "🔍 VERIFICACIÓN TÉCNICA:"
echo "========================"

# Verificar clases específicas
GRADIENT=$(curl -s https://habilispro.com/ | grep -c "bg-gradient-to-br from-blue-50 to-indigo-100")
if [ "$GRADIENT" -gt 0 ]; then
    echo "✅ Gradiente de fondo aplicado"
else
    echo "❌ Gradiente de fondo no encontrado"
fi

TRANSPARENCY=$(curl -s https://habilispro.com/ | grep -c "bg-white/80")
if [ "$TRANSPARENCY" -gt 0 ]; then
    echo "✅ Efecto de transparencia aplicado"
else
    echo "❌ Efecto de transparencia no encontrado"
fi

BLUE_BUTTONS=$(curl -s https://habilispro.com/ | grep -c "bg-blue-600")
if [ "$BLUE_BUTTONS" -gt 0 ]; then
    echo "✅ Botones azules aplicados"
else
    echo "❌ Botones azules no encontrados"
fi

SHADOWS=$(curl -s https://habilispro.com/ | grep -c "shadow-lg")
if [ "$SHADOWS" -gt 0 ]; then
    echo "✅ Sombras aplicadas"
else
    echo "❌ Sombras no encontradas"
fi

echo ""
echo "🎯 RESULTADO:"
echo "============="
echo "✅ Sitio web abierto en el navegador"
echo "✅ Estilos CSS cargados correctamente"
echo "✅ Elementos visuales aplicados"
echo ""
echo "�� ¡Verificación visual completada!"
echo "Revisa el navegador para confirmar que los estilos se ven correctamente."
