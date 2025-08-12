# ============================================================================
# DOCKERFILE PARA PRODUCCIÓN - SUITE ARQUEOLÓGICA
# ============================================================================

# Etapa 1: Construcción del Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Copiar archivos del backend
COPY backend/package*.json ./backend/
COPY backend/tsconfig.json ./backend/

# Instalar dependencias del backend (incluyendo dev para build)
RUN cd backend && npm install

# Copiar código fuente del backend
COPY backend/src ./backend/src

# Construir backend
RUN cd backend && npm run build

# Etapa 2: Construcción del Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copiar archivos del frontend
COPY frontend-web/package*.json ./frontend-web/
COPY frontend-web/next.config.js ./frontend-web/
COPY frontend-web/tsconfig.json ./frontend-web/

# Instalar dependencias del frontend (incluyendo dev para build)
RUN cd frontend-web && npm install

# Copiar código fuente del frontend
COPY frontend-web/src ./frontend-web/src
COPY frontend-web/public ./frontend-web/public

# Construir frontend
RUN cd frontend-web && npm run build

# Etapa 3: Imagen de producción
FROM node:18-alpine AS production

# Instalar dependencias del sistema
RUN apk add --no-cache dumb-init curl

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Crear directorios de trabajo
WORKDIR /app

# Copiar archivos del backend
COPY --from=backend-builder --chown=nextjs:nodejs /app/backend/dist ./backend/dist
COPY --from=backend-builder --chown=nextjs:nodejs /app/backend/package*.json ./backend/

# Copiar archivos del frontend
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend-web/.next ./frontend-web/.next
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend-web/public ./frontend-web/public
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend-web/package*.json ./frontend-web/

# Instalar dependencias de producción
RUN cd backend && npm install --omit=dev
RUN cd frontend-web && npm install --omit=dev

# Crear directorio de logs
RUN mkdir -p /var/log/suite-arqueologica && chown nextjs:nodejs /var/log/suite-arqueologica

# Script de inicio
COPY docker-entrypoint-improved.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Cambiar al usuario no-root
USER nextjs

# Exponer puertos
EXPOSE 3000 4000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=4000
ENV NEXT_PUBLIC_API_URL=/api

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Comando de inicio
ENTRYPOINT ["docker-entrypoint.sh"] 