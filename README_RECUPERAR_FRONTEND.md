# Recuperar entorno Node/npm y dependencias en frontend-web

Si tienes errores como:
- `Module build failed: Error: ENOENT: no such file or directory, open '.../node_modules/buffer/index.js'`
- El directorio `node_modules/buffer/` no existe tras instalar dependencias

Sigue estos pasos para restaurar tu entorno:

---

## 1. Elimina Node.js y npm actuales (si no usas nvm)
```bash
sudo apt-get remove nodejs npm
sudo apt-get purge nodejs npm
sudo rm -rf /usr/local/lib/node_modules
sudo rm -rf ~/.npm
```

## 2. Instala Node.js LTS limpio (recomendado: usando nvm)
Si tienes nvm:
```bash
nvm install --lts
nvm use --lts
```
Si no tienes nvm, instala desde [nodejs.org](https://nodejs.org/)

## 3. Limpia y reinstala dependencias en tu proyecto
```bash
cd /home/fabian/Documentos/suite_arqueologica/frontend-web
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 4. Verifica que el directorio buffer exista
```bash
ls node_modules/buffer/
```
Deberías ver archivos como `index.js`, `package.json`, etc.

## 5. Inicia el frontend y verifica que no hay errores de compilación
```bash
npm run dev
```
Abre en el navegador la URL que indique Next.js (por ejemplo, http://localhost:3000 o http://localhost:3001).

## 6. Si todo funciona, puedes volver a ejecutar el test E2E:
```bash
cd /home/fabian/Documentos/suite_arqueologica
node reports/testing/puppeteer_investigador_e2e.js
```

---

**Si el problema persiste, revisa los permisos de tu usuario y la configuración global de npm/node.** 