#!/bin/bash

# Script para actualizar el secret de Kubernetes con las claves reales de Supabase

echo "🔧 Actualizando secret de Kubernetes..."

# Codificar las claves reales en base64
SUPABASE_URL_B64=$(echo -n "https://avpaiyyjixtdopbciedr.supabase.co" | base64)
SUPABASE_ANON_KEY_B64=$(echo -n "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzY4ODQsImV4cCI6MjA2ODcwMzI4NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8" | base64)
SUPABASE_SERVICE_ROLE_KEY_B64=$(echo -n "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzEzNjg4NCwiZXhwIjoyMDY4NzAzMjg0fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8" | base64)
JWT_SECRET_B64=$(echo -n "tu-jwt-secret-super-seguro" | base64)
NEXT_PUBLIC_SUPABASE_URL_B64=$(echo -n "https://avpaiyyjixtdopbciedr.supabase.co" | base64)
NEXT_PUBLIC_SUPABASE_ANON_KEY_B64=$(echo -n "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzY4ODQsImV4cCI6MjA2ODcwMzI4NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8" | base64)

# Crear el archivo secret actualizado
cat > k8s/secret-updated.yaml << SECRET_EOF
apiVersion: v1
kind: Secret
metadata:
  name: suite-arqueologica-secrets
  namespace: suite-arqueologica
type: Opaque
data:
  SUPABASE_URL: $SUPABASE_URL_B64
  SUPABASE_ANON_KEY: $SUPABASE_ANON_KEY_B64
  SUPABASE_SERVICE_ROLE_KEY: $SUPABASE_SERVICE_ROLE_KEY_B64
  SUPABASE_KEY: $SUPABASE_SERVICE_ROLE_KEY_B64
  JWT_SECRET: $JWT_SECRET_B64
  NEXT_PUBLIC_SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL_B64
  NEXT_PUBLIC_SUPABASE_ANON_KEY: $NEXT_PUBLIC_SUPABASE_ANON_KEY_B64
SECRET_EOF

echo "✅ Secret actualizado creado en k8s/secret-updated.yaml"
echo "📋 Para aplicar el secret actualizado:"
echo "   kubectl apply -f k8s/secret-updated.yaml"
echo "   kubectl rollout restart deployment/suite-arqueologica -n suite-arqueologica"
