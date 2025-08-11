#!/bin/bash

# ============================================================================
# SCRIPT DE INSTALACIÓN K3S - SUITE ARQUEOLÓGICA
# Optimizado para VPS Hostinger: 2 CPU, 8GB RAM, 100GB SSD
# ============================================================================

set -e

echo "🚀 Instalando K3s en tu VPS Hostinger..."

# Variables de configuración
K3S_VERSION="v1.28.0+k3s1"
DOMAIN="habilispro.com"
EMAIL="lic.fabiande@gmail.com"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Verificar que somos root
if [ "$EUID" -ne 0 ]; then
    error "Este script debe ejecutarse como root"
fi

log "✅ Verificando sistema..."

# Actualizar sistema
log "📦 Actualizando sistema..."
apt update && apt upgrade -y

# Instalar dependencias
log "🔧 Instalando dependencias..."
apt install -y curl wget git htop ufw fail2ban

# Configurar firewall
log "🔥 Configurando firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 6443  # Puerto de K3s
ufw --force enable

# Instalar K3s (Kubernetes ligero)
log "🐳 Instalando K3s..."
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=$K3S_VERSION sh -

# Configurar K3s para tu VPS
log "⚙️ Configurando K3s..."
mkdir -p /etc/rancher/k3s

# Configuración optimizada para tu VPS
cat > /etc/rancher/k3s/config.yaml << EOF
write-kubeconfig-mode: "0644"
  tls-san:
  - "147.93.36.212"
  - "srv918820.hstgr.cloud"
  - "habilispro.com"
  - "www.habilispro.com"
node-label:
  - "node-role.kubernetes.io/worker=true"
kubelet-arg:
  - "max-pods=50"
  - "eviction-hard=memory.available<100Mi"
  - "eviction-soft=memory.available<200Mi"
  - "eviction-soft-grace-period=memory.available=30s"
disable:
  - traefik
  - servicelb
  - local-storage
EOF

# Reiniciar K3s
systemctl restart k3s

# Esperar a que K3s esté listo
log "⏳ Esperando a que K3s esté listo..."
for i in {1..60}; do
    if kubectl get nodes &> /dev/null; then
        log "✅ K3s iniciado correctamente"
        break
    fi
    if [ $i -eq 60 ]; then
        error "K3s no se inició en 60 segundos"
    fi
    sleep 1
done

# Instalar Helm
log "📦 Instalando Helm..."
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Instalar NGINX Ingress Controller
log "🌐 Instalando NGINX Ingress Controller..."
kubectl create namespace ingress-nginx
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.resources.requests.cpu=100m \
  --set controller.resources.requests.memory=128Mi \
  --set controller.resources.limits.cpu=200m \
  --set controller.resources.limits.memory=256Mi

# Instalar Cert-Manager para SSL automático
log "🔒 Instalando Cert-Manager..."
kubectl create namespace cert-manager
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --set installCRDs=true \
  --set resources.requests.cpu=100m \
  --set resources.requests.memory=128Mi \
  --set resources.limits.cpu=200m \
  --set resources.limits.memory=256Mi

# Crear ClusterIssuer para Let's Encrypt
log "📜 Configurando Let's Encrypt..."
cat > cluster-issuer.yaml << EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: $EMAIL
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

kubectl apply -f cluster-issuer.yaml

# Instalar Prometheus + Grafana (opcional)
log "📊 Instalando Prometheus + Grafana..."
kubectl create namespace monitoring
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set grafana.enabled=true \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set prometheus.prometheusSpec.resources.requests.cpu=100m \
  --set prometheus.prometheusSpec.resources.requests.memory=256Mi \
  --set prometheus.prometheusSpec.resources.limits.cpu=200m \
  --set prometheus.prometheusSpec.resources.limits.memory=512Mi

# Configurar alias útiles
log "🔧 Configurando alias útiles..."
cat >> ~/.bashrc << 'EOF'

# Kubernetes aliases
alias k='kubectl'
alias kg='kubectl get'
alias kd='kubectl describe'
alias kl='kubectl logs'
alias kp='kubectl get pods'
alias ks='kubectl get services'
alias ki='kubectl get ingress'

# Suite Arqueológica aliases
alias suite-logs='kubectl logs -f deployment/suite-arqueologica -n suite-arqueologica'
alias suite-status='kubectl get pods -n suite-arqueologica'
alias suite-restart='kubectl rollout restart deployment/suite-arqueologica -n suite-arqueologica'
EOF

# Mostrar información del cluster
log "📋 Información del cluster:"
kubectl get nodes
kubectl get pods --all-namespaces

log "✅ Instalación de K3s completada!"
log "📊 URLs:"
log "   • Kubernetes Dashboard: kubectl proxy"
log "   • Grafana: kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80"
log "   • Prometheus: kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090"

log "🔧 Comandos útiles:"
log "   • Ver pods: kubectl get pods --all-namespaces"
log "   • Ver servicios: kubectl get services --all-namespaces"
log "   • Ver ingress: kubectl get ingress --all-namespaces"
log "   • Monitoreo: kubectl top nodes && kubectl top pods --all-namespaces" 