#!/bin/bash

# ============================================================================
# SCRIPT PARA DESPLEGAR VERSIÓN LIGERA
# ============================================================================

set -e

echo "🚀 Desplegando versión ligera..."

# Transferir archivo al servidor
echo "📤 Transfiriendo archivo..."
scp k8s/deployment-light.yaml root@habilispro.com:/tmp/

# Aplicar en el servidor
echo "🔧 Aplicando deployment ligero..."
ssh root@habilispro.com << 'EOF'
set -e

# Eliminar deployment anterior
kubectl delete deployment suite-arqueologica -n suite-arqueologica --ignore-not-found=true

# Aplicar deployment ligero
kubectl apply -f /tmp/deployment-light.yaml

# Limpiar archivo temporal
rm -f /tmp/deployment-light.yaml

echo "✅ Deployment ligero aplicado"
EOF

echo "🎉 ¡Despliegue ligero completado!"
echo "📋 Para verificar: ssh root@habilispro.com 'kubectl get pods -n suite-arqueologica'" 