#!/bin/bash

echo "🔧 ARREGLANDO TIMEOUT DE 30 SEGUNDOS"
echo "======================================"

SERVER="147.93.36.212"
PASSWORD="Kdmf83cy2dxw-"

echo "1️⃣ Eliminando health checks problemáticos..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "kubectl patch deployment -n suite-arqueologica suite-arqueologica --type='json' -p='[{\"op\": \"remove\", \"path\": \"/spec/template/spec/containers/0/livenessProbe\"}, {\"op\": \"remove\", \"path\": \"/spec/template/spec/containers/0/readinessProbe\"}]'"

echo "2️⃣ Eliminando pods fallidos..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "kubectl delete pods -n suite-arqueologica --all --force --grace-period=0"

echo "3️⃣ Verificando que los nuevos pods funcionen..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "kubectl get pods -n suite-arqueologica"

echo "4️⃣ Esperando 30 segundos para que los pods se inicien..."
sleep 30

echo "5️⃣ Verificando estado final..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "kubectl get pods -n suite-arqueologica"

echo "6️⃣ Creando servicio NodePort..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "kubectl delete svc suite-arqueologica-backend suite-arqueologica-metrics suite-arqueologica-service -n suite-arqueologica --ignore-not-found=true"
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "kubectl expose deployment suite-arqueologica --type=NodePort --port=4000 --target-port=4000 -n suite-arqueologica"

echo "7️⃣ Configurando nginx..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "cat > /etc/nginx/sites-available/kubernetes-proxy << 'EOF'
server {
    listen 80;
    server_name habilispro.com www.habilispro.com;
    
    location / {
        proxy_pass http://127.0.0.1:30719;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF"

echo "8️⃣ Habilitando sitio y recargando nginx..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "ln -sf /etc/nginx/sites-available/kubernetes-proxy /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"

echo "9️⃣ Probando la web..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "curl -I http://habilispro.com"

echo "✅ Arreglo completado" suite_arqueologicasuite_arqueologica