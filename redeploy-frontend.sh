#!/bin/bash

echo "🚀 Recompilando y desplegando frontend con estilos actualizados..."

# Construir nueva imagen Docker
echo "1. Construyendo nueva imagen Docker..."
docker build -t suite-arqueologica:latest ./frontend-web

# Etiquetar imagen para el registro
echo "2. Etiquetando imagen..."
docker tag suite-arqueologica:latest 147.93.36.212:5000/suite-arqueologica:latest

# Subir imagen al registro
echo "3. Subiendo imagen al registro..."
docker push 147.93.36.212:5000/suite-arqueologica:latest

# Aplicar deployment actualizado
echo "4. Aplicando deployment actualizado..."
ssh root@147.93.36.212 "kubectl rollout restart deployment/suite-arqueologica -n suite-arqueologica"

echo "5. Esperando que se despliegue..."
sleep 30

echo "6. Verificando estado..."
ssh root@147.93.36.212 "kubectl get pods -n suite-arqueologica"

echo "✅ Frontend actualizado y desplegado"
