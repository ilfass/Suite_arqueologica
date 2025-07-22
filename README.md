# Suite Arqueológica

Sistema completo de gestión arqueológica con roles de usuario diferenciados y funcionalidades especializadas.

## 🏗️ Estructura del Proyecto

```
suite_arqueologica/
├── backend/                 # API REST con Express y TypeScript
├── frontend-web/           # Aplicación web con Next.js
├── frontend-mobile/        # Aplicación móvil (en desarrollo)
├── database/              # Migraciones y esquemas de base de datos
├── docs/                  # Documentación del proyecto
│   ├── final-reports/     # Reportes finales importantes
│   └── development/       # Documentación de desarrollo
├── scripts/               # Scripts de utilidad
│   └── utilities/         # Scripts de configuración y mantenimiento
├── assets/                # Recursos estáticos
│   └── screenshots/       # Capturas de pantalla del sistema
└── shared/                # Código compartido entre frontend y backend
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- PostgreSQL o Supabase
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd suite_arqueologica
```

2. **Configurar el backend**
```bash
cd backend
npm install
cp env.example .env
# Configurar variables de entorno en .env
npm run dev
```

3. **Configurar el frontend web**
```bash
cd frontend-web
npm install
npm run dev
```

4. **Configurar la base de datos**
```bash
# Ejecutar migraciones
cd database
npm run migrate
```

## 👥 Roles de Usuario

- **Admin**: Gestión completa del sistema, usuarios e instituciones
- **Director**: Aprobación de proyectos y gestión de investigadores
- **Researcher**: Creación y gestión de sitios arqueológicos y excavaciones
- **Student**: Acceso a datos públicos y tutoriales
- **Institution**: Gestión de proyectos institucionales
- **Guest**: Acceso limitado a información pública

## 📚 Documentación

- [Análisis Completo del Sistema](docs/ANALISIS_COMPLETO_SISTEMA.md)
- [Plan de Reorganización](docs/PLAN_REORGANIZACION_PROYECTO.md)
- [Estado Final de Roles](docs/ESTADO_ROLES_FINAL.md)
- [Reportes Finales](docs/final-reports/)

## 🛠️ Scripts de Utilidad

- `scripts/utilities/setup_database.js` - Configuración inicial de la base de datos
- `scripts/utilities/create_missing_users.js` - Creación de usuarios de prueba
- `scripts/utilities/restart_system.js` - Reinicio completo del sistema

## 📊 Estado del Proyecto

✅ **Completado:**
- Sistema de autenticación con roles
- CRUD completo para sitios arqueológicos
- CRUD completo para excavaciones
- Dashboard diferenciado por roles
- API REST funcional
- Frontend web responsive

🔄 **En Desarrollo:**
- Aplicación móvil
- Funcionalidades avanzadas de mapeo
- Reportes automatizados

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el sistema, contacta al equipo de desarrollo. 