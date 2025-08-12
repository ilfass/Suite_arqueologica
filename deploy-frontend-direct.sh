#!/bin/bash

# ============================================================================
# SCRIPT PARA DESPLEGAR FRONTEND NEXT.JS DIRECTAMENTE EN EL SERVIDOR
# ============================================================================

set -e

echo "🚀 Iniciando despliegue directo del frontend Next.js..."

# 1. Transferir código del frontend
echo "📤 Transferiendo código del frontend..."
ssh root@habilispro.com "mkdir -p /opt/suite-arqueologica-frontend"
scp -r frontend-web/* root@habilispro.com:/opt/suite-arqueologica-frontend/

# 2. Instalar Node.js si no está instalado
echo "📦 Verificando Node.js..."
ssh root@habilispro.com "if ! command -v node &> /dev/null; then curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs; fi"

# 3. Instalar dependencias
echo "📦 Instalando dependencias..."
ssh root@habilispro.com "cd /opt/suite-arqueologica-frontend && npm install"

# 4. Crear archivo de variables de entorno
echo "⚙️ Configurando variables de entorno..."
ssh root@habilispro.com "cat > /opt/suite-arqueologica-frontend/.env.production << 'EOF'
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_SUPABASE_URL=https://avpaiyyjixtdopbciedr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjAzMjMsImV4cCI6MjA2NDIzNjMyM30.1rreoeSBexWbEKdRtIbSwQcWwD3i53RAqFWt5qe820A
NEXT_PUBLIC_API_URL=https://habilispro.com/api
EOF"

# 5. Construir la aplicación
echo "🔨 Construyendo aplicación..."
ssh root@habilispro.com "cd /opt/suite-arqueologica-frontend && npm run build"

# 6. Crear servicio systemd para el frontend
echo "🔧 Configurando servicio systemd..."
ssh root@habilispro.com "cat > /etc/systemd/system/suite-arqueologica-frontend.service << 'EOF'
[Unit]
Description=Suite Arqueológica Frontend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/suite-arqueologica-frontend
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=NEXT_PUBLIC_SUPABASE_URL=https://avpaiyyjixtdopbciedr.supabase.co
Environment=NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjAzMjMsImV4cCI6MjA2NDIzNjMyM30.1rreoeSBexWbEKdRtIbSwQcWwD3i53RAqFWt5qe820A
Environment=NEXT_PUBLIC_API_URL=https://habilispro.com/api
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF"

# 7. Recargar systemd y habilitar servicio
echo "🔄 Recargando systemd..."
ssh root@habilispro.com "systemctl daemon-reload && systemctl enable suite-arqueologica-frontend"

# 8. Configurar nginx para el frontend
echo "🌐 Configurando nginx..."
ssh root@habilispro.com "cat > /etc/nginx/sites-available/suite-arqueologica-frontend << 'EOF'
server {
    listen 80;
    server_name habilispro.com www.habilispro.com;

    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name habilispro.com www.habilispro.com;

    ssl_certificate /etc/letsencrypt/live/habilispro.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/habilispro.com/privkey.pem;

    # Proxy para el frontend Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Proxy para la API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Configuración de seguridad
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection \"1; mode=block\";
    add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;
    add_header Referrer-Policy \"strict-origin-when-cross-origin\";
}
EOF"

# 9. Habilitar sitio y reiniciar nginx
echo "🔄 Configurando nginx..."
ssh root@habilispro.com "ln -sf /etc/nginx/sites-available/suite-arqueologica-frontend /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"

# 10. Iniciar servicios
echo "🚀 Iniciando servicios..."
ssh root@habilispro.com "systemctl restart suite-arqueologica-backend && systemctl restart suite-arqueologica-frontend"

# 11. Verificar estado
echo "🔍 Verificando estado..."
ssh root@habilispro.com "systemctl status suite-arqueologica-frontend --no-pager"
ssh root@habilispro.com "systemctl status suite-arqueologica-backend --no-pager"

echo "✅ Despliegue del frontend Next.js completado!"
echo "🌐 URL: https://habilispro.com"
echo "🔧 API: https://habilispro.com/api/health" 