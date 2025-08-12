#!/bin/bash

echo "🔍 VERIFICANDO EL ARREGLO"
echo "=========================="

# Verificar estado de los pods
echo "1️⃣ Estado de los pods:"
sshpass -p "Kdmf83cy2dxw-" ssh -o StrictHostKeyChecking=no root@147.93.36.212 "kubectl get pods -n suite-arqueologica"

echo ""
echo "2️⃣ Verificando servicios:"
sshpass -p "Kdmf83cy2dxw-" ssh -o StrictHostKeyChecking=no root@147.93.36.212 "kubectl get svc -n suite-arqueologica"

echo ""
echo "3️⃣ Probando la web:"
curl -I http://habilispro.com

echo ""
echo "4️⃣ Contenido de la web:"
curl -s http://habilispro.com | head -5

echo ""
echo "✅ Verificación completada" 