#!/bin/bash

# ============================================================================
# SCRIPT PARA EJECUTAR BACKEND DIRECTAMENTE EN EL SERVIDOR
# ============================================================================

echo "🚀 Iniciando backend directamente en el servidor..."

# 1. Transferir código del backend
echo "📤 Transferiendo código del backend..."
ssh root@habilispro.com "mkdir -p /opt/suite-arqueologica-backend"
scp -r backend/* root@habilispro.com:/opt/suite-arqueologica-backend/

# 2. Instalar Node.js si no está instalado
echo "📦 Verificando Node.js..."
ssh root@habilispro.com "if ! command -v node &> /dev/null; then curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs; fi"

# 3. Instalar dependencias
echo "📦 Instalando dependencias..."
ssh root@habilispro.com "cd /opt/suite-arqueologica-backend && npm install"

# 4. Crear archivo de variables de entorno
echo "🔧 Configurando variables de entorno..."
ssh root@habilispro.com "cat > /opt/suite-arqueologica-backend/.env << 'EOF'
NODE_ENV=production
PORT=4000
SUPABASE_URL=https://avpaiyyjixtdopbciedr.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjAzMjMsImV4cCI6MjA2NDIzNjMyM30.1rreoeSBexWbEKdRtIbSwQcWwD3i53RAqFWt5qe820A
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjAzMjMsImV4cCI6MjA2NDIzNjMyM30.1rreoeSBexWbEKdRtIbSwQcWwD3i53RAqFWt5qe820A
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc
JWT_SECRET=suite_arqueologica_jwt_secret_key_2024
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://habilispro.com
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF"

# 5. Crear servicio systemd
echo "⚙️ Configurando servicio systemd..."
ssh root@habilispro.com "cat > /etc/systemd/system/suite-arqueologica-backend.service << 'EOF'
[Unit]
Description=Suite Arqueologica Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/suite-arqueologica-backend
ExecStart=/usr/bin/node src/index.ts
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=4000

[Install]
WantedBy=multi-user.target
EOF"

# 6. Recargar systemd y habilitar servicio
echo "🔄 Configurando servicio..."
ssh root@habilispro.com "systemctl daemon-reload"
ssh root@habilispro.com "systemctl enable suite-arqueologica-backend"
ssh root@habilispro.com "systemctl start suite-arqueologica-backend"

# 7. Verificar estado
echo "🔍 Verificando estado del servicio..."
ssh root@habilispro.com "systemctl status suite-arqueologica-backend"

# 8. Configurar nginx para proxy
echo "🌐 Configurando nginx..."
ssh root@habilispro.com "cat > /etc/nginx/sites-available/suite-arqueologica-backend << 'EOF'
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

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

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
    }
}
EOF"

# 9. Habilitar sitio y recargar nginx
ssh root@habilispro.com "ln -sf /etc/nginx/sites-available/suite-arqueologica-backend /etc/nginx/sites-enabled/"
ssh root@habilispro.com "nginx -t && systemctl reload nginx"

echo "✅ Backend configurado y ejecutándose!"
echo "🌐 URL: https://habilispro.com"
echo "🔧 API: https://habilispro.com/api/health" 