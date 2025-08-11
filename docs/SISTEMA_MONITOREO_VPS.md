s# 🚀 Sistema de Monitoreo VPS - Suite Arqueológica

## 📋 Descripción General

Sistema completo de monitoreo automático para el VPS de Hostinger (147.93.36.212) que ejecuta la Suite Arqueológica en Kubernetes (K3s).

## 🎯 Características

### ✅ **Monitoreo Continuo**
- Verificación automática de conectividad SSH
- Monitoreo del cluster K3s
- Verificación de pods de la aplicación
- Control de servicios web (HTTP/HTTPS)
- Monitoreo de certificados SSL

### 🔔 **Sistema de Alertas**
- Notificaciones por email automáticas
- Soporte para webhooks (Slack, Discord, etc.)
- Alertas inteligentes basadas en cambios de estado
- Logs detallados de todos los eventos

### 📊 **Métricas y Logs**
- Logs de monitoreo en tiempo real
- Métricas del cluster Kubernetes
- Estado de recursos del VPS
- Historial de eventos

## 🛠️ Instalación y Configuración

### **Paso 1: Configurar el Sistema**
```bash
# Ejecutar configuración automática
./scripts/setup-monitoring.sh

# O configurar manualmente
./scripts/setup-monitoring.sh --setup
```

### **Paso 2: Cargar Alias**
```bash
# Cargar alias útiles
source ~/.bashrc
```

### **Paso 3: Probar el Sistema**
```bash
# Verificación única
vps-check

# Probar alertas
vps-alerts --test

# Verificar estado del daemon
vps-status
```

## 📖 Comandos Principales

### **🔧 Gestión del Daemon**
```bash
vps-start          # Iniciar monitoreo continuo
vps-stop           # Detener monitoreo
vps-restart        # Reiniciar monitoreo
vps-status         # Ver estado del daemon
```

### **🔍 Verificaciones**
```bash
vps-check          # Verificación única completa
vps-monitor        # Monitoreo detallado
vps-ping           # Ping rápido al VPS
vps-ssh            # Conectar por SSH
vps-web            # Verificar sitio web
```

### **📊 Logs y Monitoreo**
```bash
vps-logs           # Logs de monitoreo en tiempo real
vps-daemon-logs    # Logs del daemon
vps-alert-logs     # Logs de alertas
```

## 📁 Estructura de Archivos

```
scripts/
├── monitor-vps.sh              # Monitoreo detallado del VPS
├── vps-alerts.sh               # Sistema de alertas
├── vps-monitor-daemon.sh       # Daemon de monitoreo continuo
└── setup-monitoring.sh         # Configuración del sistema

logs/
├── vps-monitor.log             # Logs de monitoreo
├── vps-daemon.log              # Logs del daemon
└── vps-alerts.log              # Logs de alertas
```

## 🔧 Configuración Avanzada

### **Configurar Email**
```bash
# Instalar mailutils (Ubuntu/Debian)
sudo apt install mailutils

# Configurar SMTP local o usar servicio externo
# Las alertas se envían a: lic.fabiande@gmail.com
```

### **Configurar Webhook**
```bash
# Editar scripts/vps-alerts.sh
# Cambiar WEBHOOK_URL="" por tu URL
WEBHOOK_URL="https://hooks.slack.com/services/..."
```

### **Servicio Systemd**
```bash
# Crear servicio para auto-iniciar
sudo ./scripts/setup-monitoring.sh --systemd

# Habilitar servicio
sudo systemctl enable vps-monitor
sudo systemctl start vps-monitor
```

## 📊 Estados del Sistema

### **🟢 Estado Normal**
- Ping exitoso al VPS
- SSH disponible
- Cluster K3s funcionando
- Pods de aplicación ejecutándose
- Servicios web accesibles

### **🟡 Estado de Advertencia**
- Ping OK pero SSH no disponible
- SSH OK pero servicios web caídos
- Algunos pods con problemas

### **🔴 Estado Crítico**
- VPS completamente inaccesible
- Cluster K3s caído
- Todos los pods con errores

## 🚨 Tipos de Alertas

### **1. Problemas de Conectividad**
- VPS completamente inaccesible
- SSH no disponible
- Servicios web caídos

### **2. Problemas de Aplicación**
- Pods con errores
- Cluster K3s con problemas
- Certificados SSL expirados

### **3. Recuperación**
- VPS vuelve a estar operativo
- Servicios restaurados
- Aplicación funcionando correctamente

## 📈 Métricas Monitoreadas

### **Conectividad**
- Ping al VPS (147.93.36.212)
- Conectividad SSH
- Accesibilidad HTTP/HTTPS
- DNS (habilispro.com)

### **Kubernetes**
- Estado del cluster K3s
- Pods de la aplicación
- Servicios y ingress
- Certificados SSL

### **Aplicación**
- Logs de la Suite Arqueológica
- Health checks
- Métricas de recursos
- Estado de la base de datos

## 🔍 Solución de Problemas

### **VPS Inaccesible**
```bash
# Verificar conectividad básica
vps-ping

# Verificar DNS
nslookup habilispro.com

# Contactar soporte de Hostinger
# Panel de control: https://hpanel.hostinger.com
```

### **Problemas de SSH**
```bash
# Verificar puerto SSH
nc -zv 147.93.36.212 22

# Verificar desde otra red
# Usar VPN o conexión móvil
```

### **Problemas de Aplicación**
```bash
# Conectar al VPS
vps-ssh

# Verificar pods
kubectl get pods -n suite-arqueologica

# Ver logs
kubectl logs -l app=suite-arqueologica -n suite-arqueologica
```

### **Problemas de Alertas**
```bash
# Probar notificaciones
vps-alerts --test

# Verificar configuración de email
echo "test" | mail -s "test" $USER

# Verificar logs de alertas
vps-alert-logs
```

## 📋 Checklist de Mantenimiento

### **Diario**
- [ ] Verificar estado del daemon: `vps-status`
- [ ] Revisar logs recientes: `vps-logs`
- [ ] Verificar alertas: `vps-alert-logs`

### **Semanal**
- [ ] Revisar métricas del cluster
- [ ] Verificar certificados SSL
- [ ] Actualizar scripts si es necesario
- [ ] Revisar configuración de alertas

### **Mensual**
- [ ] Revisar logs históricos
- [ ] Optimizar configuración
- [ ] Actualizar documentación
- [ ] Verificar backups

## 🔗 Enlaces Útiles

### **Hostinger**
- Panel de control: https://hpanel.hostinger.com
- Soporte técnico: https://www.hostinger.com/contact
- Documentación: https://www.hostinger.com/tutorials

### **Kubernetes/K3s**
- Documentación K3s: https://docs.k3s.io/
- kubectl cheat sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/

### **Suite Arqueológica**
- Repositorio: [URL del repositorio]
- Documentación: [URL de la documentación]
- Panel de administración: https://habilispro.com

## 📞 Contacto de Emergencia

### **Problemas Críticos**
1. **VPS completamente caído**: Contactar soporte de Hostinger
2. **Aplicación con errores**: Revisar logs y reiniciar pods
3. **Problemas de DNS**: Verificar configuración en panel de Hostinger
4. **Certificados SSL**: Renovar automáticamente con cert-manager

### **Información de Contacto**
- **Email**: lic.fabiande@gmail.com
- **VPS IP**: 147.93.36.212
- **Dominio**: habilispro.com
- **Proveedor**: Hostinger

## 📝 Notas de Desarrollo

### **Personalización**
- Modificar `VPS_IP` en scripts para cambiar servidor
- Ajustar `CHECK_INTERVAL` para cambiar frecuencia
- Agregar nuevos tipos de alertas según necesidades

### **Extensibilidad**
- Agregar monitoreo de base de datos
- Implementar métricas personalizadas
- Integrar con sistemas de monitoreo externos

### **Seguridad**
- Usar claves SSH en lugar de contraseñas
- Configurar firewall en el VPS
- Implementar autenticación para alertas

---

**Última actualización**: $(date)
**Versión del sistema**: 1.0.0
**Mantenido por**: Equipo de Desarrollo Suite Arqueológica 