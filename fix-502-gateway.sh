#!/bin/bash

echo "🔧 ARREGLANDO 502 BAD GATEWAY"
echo "=============================="

SERVER="147.93.36.212"
PASSWORD="Kdmf83cy2dxw-"

echo "1️⃣ Eliminando pods de test fallidos..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "kubectl delete pod test-app test-pod -n suite-arqueologica --force --grace-period=0"

echo "2️⃣ Verificando servicios..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "kubectl get svc -n suite-arqueologica"

echo "3️⃣ Verificando puertos en uso..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "netstat -tlnp | grep -E ':(80|443|3000|8080|9000|30719)'"

echo "4️⃣ Verificando logs de nginx..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "tail -10 /var/log/nginx/error.log"

echo "5️⃣ Verificando logs del pod que funciona..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "kubectl logs -n suite-arqueologica suite-arqueologica-565cfb7889-g778m --tail=10"

echo "6️⃣ Probando conexión directa al servicio..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "curl -I http://localhost:30719"

echo "7️⃣ Verificando configuración de nginx..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "cat /etc/nginx/sites-enabled/kubernetes-proxy"

echo "✅ Diagnóstico completado" 