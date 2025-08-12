#!/bin/bash

echo "🔧 DIAGNÓSTICO Y REPARACIÓN DE LA WEB"
echo "======================================"

# Configuración
SERVER="147.93.36.212"
PASSWORD="Kdmf83cy2dxw-"

echo "1️⃣ Deshabilitando nginx del host..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "systemctl stop nginx && systemctl disable nginx"

echo "2️⃣ Verificando estado de Kubernetes..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "kubectl get pods -n suite-arqueologica"

echo "3️⃣ Eliminando pods que están fallando..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "kubectl delete pod -n suite-arqueologica suite-arqueologica-d49bb8bf7-cmssg suite-arqueologica-d49bb8bf7-n4sz8"

echo "4️⃣ Verificando servicios..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "kubectl get svc -n suite-arqueologica"

echo "5️⃣ Verificando ingress..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "kubectl get ingress -n suite-arqueologica"

echo "6️⃣ Verificando puertos..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no root@$SERVER "netstat -tlnp | grep -E ':(80|443|3000|8080|9000)'"

echo "✅ Diagnóstico completado" 