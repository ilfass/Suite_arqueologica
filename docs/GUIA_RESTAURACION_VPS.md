# 🚨 Guía de Restauración VPS - Suite Arqueológica

## 📋 **Situación Actual**

**VPS**: 147.93.36.212 (Hostinger)  
**Problema**: Servicios SSH y web caídos  
**Síntomas**: 
- ✅ Ping funciona
- ❌ SSH rechaza conexiones (puerto 22)
- ❌ HTTP/HTTPS no responde (puertos 80/443)

## 🎯 **Plan de Restauración**

### **Opción 1: Panel de Control de Hostinger (Recomendado)**

#### **Paso 1: Acceder al Panel**
1. Ve a: https://hpanel.hostinger.com
2. Inicia sesión con tus credenciales
3. Ve a la sección "VPS"

#### **Paso 2: Verificar Estado del VPS**
1. Busca tu VPS (IP: 147.93.36.212)
2. Verifica el estado: "Running", "Stopped", "Error"
3. Revisa los logs del sistema

#### **Paso 3: Usar Consola Web**
1. Haz clic en tu VPS
2. Busca la opción "Console" o "Terminal"
3. Accede a la consola web del servidor

#### **Paso 4: Restaurar Servicios SSH**
```bash
# Verificar si SSH está instalado
which sshd

# Si no está instalado
apt update
apt install -y openssh-server

# Verificar estado del servicio
systemctl status ssh

# Si no está ejecutándose
systemctl start ssh
systemctl enable ssh

# Verificar configuración
cat /etc/ssh/sshd_config | grep Port

# Si el puerto no está configurado
echo "Port 22" >> /etc/ssh/sshd_config
systemctl restart ssh
```

#### **Paso 5: Restaurar Servicios Web**
```bash
# Verificar NGINX
systemctl status nginx

# Si no está ejecutándose
systemctl start nginx
systemctl enable nginx

# Verificar K3s
systemctl status k3s

# Si no está ejecutándose
systemctl start k3s
systemctl enable k3s

# Verificar firewall
ufw status
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
```

### **Opción 2: Reinicio del VPS**

Si la consola web no funciona:

1. **Reinicio Suave**:
   - Panel de control → VPS → Reiniciar
   - Espera 2-3 minutos
   - Intenta conectar por SSH

2. **Reinicio Forzado** (si es necesario):
   - Panel de control → VPS → Forzar reinicio
   - Espera 5-10 minutos
   - Verifica servicios

### **Opción 3: Restauración desde Backup**

Si los servicios siguen caídos:

1. **Verificar Backups**:
   - Panel de control → Backups
   - Buscar backup reciente funcional

2. **Restaurar Backup**:
   - Seleccionar backup
   - Confirmar restauración
   - Esperar completar

## 🔧 **Scripts de Restauración Automática**

### **Usar Script de Restauración**
```bash
# Una vez que SSH esté disponible
./scripts/restore-vps-services.sh

# O restaurar servicios específicos
./scripts/restore-vps-services.sh --ssh
./scripts/restore-vps-services.sh --web
```

### **Verificar Estado**
```bash
# Verificar servicios
./scripts/restore-vps-services.sh --check

# Ver información del sistema
./scripts/restore-vps-services.sh --info
```

## 📊 **Verificación Post-Restauración**

### **1. Verificar SSH**
```bash
ssh root@147.93.36.212
# Debería conectarse sin problemas
```

### **2. Verificar Servicios Web**
```bash
# Desde el VPS
curl -I http://localhost
curl -I https://habilispro.com

# Desde tu máquina local
curl -I https://habilispro.com
```

### **3. Verificar K3s**
```bash
# Desde el VPS
kubectl get nodes
kubectl get pods --all-namespaces
```

### **4. Verificar Aplicación**
```bash
# Verificar pods de la Suite Arqueológica
kubectl get pods -n suite-arqueologica
kubectl logs -l app=suite-arqueologica -n suite-arqueologica
```

## 🚨 **Problemas Comunes y Soluciones**

### **Problema: SSH sigue sin funcionar**
**Solución**:
```bash
# Desde consola web
systemctl stop ssh
systemctl start ssh
systemctl status ssh

# Verificar logs
journalctl -u ssh -f
```

### **Problema: Servicios web no responden**
**Solución**:
```bash
# Verificar NGINX
systemctl status nginx
systemctl restart nginx

# Verificar puertos
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# Verificar firewall
ufw status
ufw allow 80/tcp
ufw allow 443/tcp
```

### **Problema: K3s no funciona**
**Solución**:
```bash
# Reiniciar K3s
systemctl restart k3s

# Verificar logs
journalctl -u k3s -f

# Verificar configuración
cat /etc/rancher/k3s/config.yaml
```

## 📞 **Contacto de Emergencia**

### **Si nada funciona:**

1. **Contactar Soporte de Hostinger**:
   - Email: support@hostinger.com
   - Chat en vivo: https://www.hostinger.com/contact
   - Teléfono: Disponible en panel de control

2. **Información para el ticket**:
   ```
   VPS IP: 147.93.36.212
   Dominio: habilispro.com
   Problema: Servicios SSH y web caídos
   Último acceso: [fecha]
   Acciones realizadas: [lista de intentos]
   ```

## 🔄 **Prevención Futura**

### **1. Configurar Monitoreo**
```bash
# El sistema de monitoreo ya está configurado
./scripts/vps-monitor-daemon.sh start
```

### **2. Configurar Backups Automáticos**
- Panel de control → Backups → Configurar
- Programar backups diarios/semanales

### **3. Configurar Alertas**
- Configurar notificaciones por email
- Configurar webhooks para Slack/Discord

## 📋 **Checklist de Restauración**

- [ ] Acceder al panel de control de Hostinger
- [ ] Verificar estado del VPS
- [ ] Usar consola web o reiniciar
- [ ] Restaurar servicios SSH
- [ ] Restaurar servicios web
- [ ] Verificar K3s
- [ ] Verificar aplicación
- [ ] Probar acceso externo
- [ ] Configurar monitoreo
- [ ] Documentar incidente

---

**Última actualización**: $(date)  
**Estado**: VPS con problemas de conectividad  
**Próximo paso**: Acceder al panel de control de Hostinger 