#!/bin/bash

# ============================================================================
# SCRIPT DE DIAGNÓSTICO DEL SERVIDOR
# ============================================================================

set -e

echo "🔍 Diagnóstico del estado del servidor..."

# Verificar conectividad al dominio
echo "🌐 Verificando conectividad a habilispro.com..."
if curl -f -s https://habilispro.com > /dev/null; then
    echo "✅ El dominio responde correctamente"
else
    echo "❌ El dominio no responde"
fi

# Verificar DNS
echo "📡 Verificando resolución DNS..."
nslookup habilispro.com

# Verificar certificado SSL
echo "🔒 Verificando certificado SSL..."
openssl s_client -connect habilispro.com:443 -servername habilispro.com < /dev/null 2>/dev/null | openssl x509 -noout -dates

# Verificar puertos
echo "🔌 Verificando puertos..."
nc -zv habilispro.com 80 2>/dev/null && echo "✅ Puerto 80 abierto" || echo "❌ Puerto 80 cerrado"
nc -zv habilispro.com 443 2>/dev/null && echo "✅ Puerto 443 abierto" || echo "❌ Puerto 443 cerrado"

# Verificar headers HTTP
echo "📋 Verificando headers HTTP..."
curl -I https://habilispro.com 2>/dev/null | head -10

# Verificar si hay algún proxy o CDN
echo "🌍 Verificando si hay CDN o proxy..."
curl -I https://habilispro.com 2>/dev/null | grep -i "cloudflare\|nginx\|apache\|caddy"

echo "📊 Diagnóstico completado" 