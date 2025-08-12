#!/bin/bash

# ============================================================================
# SCRIPT PARA DESPLEGAR FRONTEND NEXT.JS AL SERVIDOR
# ============================================================================

set -e

echo "🚀 Iniciando despliegue del frontend Next.js..."

# 1. Construir imagen del frontend
echo "📦 Construyendo imagen del frontend Next.js..."
docker build -f Dockerfile.frontend-nextjs -t suite-arqueologica-frontend-nextjs:latest .

# 2. Transferir imagen al servidor
echo "📤 Transferiendo imagen al servidor..."
docker save suite-arqueologica-frontend-nextjs:latest | ssh root@habilispro.com "docker load"

# 3. Crear deployment para el frontend
echo "⚙️ Creando deployment del frontend..."
ssh root@habilispro.com "cat > /tmp/deployment-frontend-nextjs.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: suite-arqueologica-frontend-nextjs
  namespace: suite-arqueologica
  labels:
    app: suite-arqueologica-frontend-nextjs
    version: v1.0.0
spec:
  replicas: 1
  selector:
    matchLabels:
      app: suite-arqueologica-frontend-nextjs
  template:
    metadata:
      labels:
        app: suite-arqueologica-frontend-nextjs
        version: v1.0.0
    spec:
      containers:
      - name: frontend
        image: suite-arqueologica-frontend-nextjs:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          value: \"production\"
        - name: PORT
          value: \"3000\"
        - name: NEXT_PUBLIC_SUPABASE_URL
          valueFrom:
            secretKeyRef:
              name: suite-arqueologica-secrets
              key: SUPABASE_URL
        - name: NEXT_PUBLIC_SUPABASE_ANON_KEY
          valueFrom:
            secretKeyRef:
              name: suite-arqueologica-secrets
              key: SUPABASE_ANON_KEY
        - name: NEXT_PUBLIC_API_URL
          value: \"https://habilispro.com/api\"
        resources:
          requests:
            memory: \"256Mi\"
            cpu: \"200m\"
          limits:
            memory: \"512Mi\"
            cpu: \"500m\"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 60
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
EOF"

# 4. Crear servicio para el frontend
echo "🔧 Creando servicio del frontend..."
ssh root@habilispro.com "cat > /tmp/service-frontend-nextjs.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: suite-arqueologica-frontend-nextjs
  namespace: suite-arqueologica
  labels:
    app: suite-arqueologica-frontend-nextjs
spec:
  selector:
    app: suite-arqueologica-frontend-nextjs
  ports:
  - name: http
    port: 3000
    targetPort: 3000
    protocol: TCP
  type: ClusterIP
EOF"

# 5. Crear ingress para el frontend
echo "🌐 Creando ingress del frontend..."
ssh root@habilispro.com "cat > /tmp/ingress-frontend-nextjs.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: suite-arqueologica-ingress-nextjs
  namespace: suite-arqueologica
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/force-ssl-redirect: \"true\"
    nginx.ingress.kubernetes.io/ssl-redirect: \"true\"
    nginx.ingress.kubernetes.io/proxy-body-size: \"10m\"
    nginx.ingress.kubernetes.io/proxy-read-timeout: \"300\"
    nginx.ingress.kubernetes.io/proxy-send-timeout: \"300\"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      add_header X-Frame-Options DENY;
      add_header X-Content-Type-Options nosniff;
      add_header X-XSS-Protection \"1; mode=block\";
      add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;
      add_header Referrer-Policy \"strict-origin-when-cross-origin\";
spec:
  tls:
  - hosts:
    - habilispro.com
    - www.habilispro.com
    secretName: suite-arqueologica-tls
  rules:
  - host: habilispro.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: suite-arqueologica-frontend-nextjs
            port:
              number: 3000
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: suite-arqueologica-backend-simple
            port:
              number: 4000
  - host: www.habilispro.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: suite-arqueologica-frontend-nextjs
            port:
              number: 3000
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: suite-arqueologica-backend-simple
            port:
              number: 4000
EOF"

# 6. Aplicar configuración de Kubernetes
echo "🔧 Aplicando configuración de Kubernetes..."

# Eliminar deployments anteriores
ssh root@habilispro.com "kubectl delete deployment suite-arqueologica-frontend-nextjs -n suite-arqueologica --ignore-not-found=true"
ssh root@habilispro.com "kubectl delete deployment suite-arqueologica-backend-simple -n suite-arqueologica --ignore-not-found=true"

# Aplicar nuevos deployments
ssh root@habilispro.com "kubectl apply -f /tmp/deployment-frontend-nextjs.yaml"
ssh root@habilispro.com "kubectl apply -f /tmp/service-frontend-nextjs.yaml"

# Eliminar ingress anterior y aplicar el nuevo
ssh root@habilispro.com "kubectl delete ingress suite-arqueologica-ingress-simple -n suite-arqueologica --ignore-not-found=true"
ssh root@habilispro.com "kubectl apply -f /tmp/ingress-frontend-nextjs.yaml"

# 7. Esperar a que los pods estén listos
echo "⏳ Esperando a que los pods estén listos..."
ssh root@habilispro.com "kubectl wait --for=condition=ready pod -l app=suite-arqueologica-frontend-nextjs -n suite-arqueologica --timeout=300s"
ssh root@habilispro.com "kubectl wait --for=condition=ready pod -l app=suite-arqueologica-backend-simple -n suite-arqueologica --timeout=300s"

# 8. Verificar estado
echo "🔍 Verificando estado del despliegue..."
ssh root@habilispro.com "kubectl get pods -n suite-arqueologica"
ssh root@habilispro.com "kubectl get services -n suite-arqueologica"
ssh root@habilispro.com "kubectl get ingress -n suite-arqueologica"

echo "✅ Despliegue del frontend Next.js completado!"
echo "🌐 URL: https://habilispro.com"
echo "🔧 API: https://habilispro.com/api/health" 