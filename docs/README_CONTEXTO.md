# 🎯 Sistema de Contexto Arqueológico - README

## 📋 Descripción Rápida

El sistema de contexto permite a los investigadores establecer un contexto de trabajo (Proyecto + Área + Sitio) que afecta la habilitación de herramientas y se muestra en un banner superior.

## 🚀 Estado Actual

✅ **FUNCIONANDO CORRECTAMENTE** - Todos los componentes operativos

## 📁 Archivos Clave

```
frontend-web/src/
├── hooks/useInvestigatorContext.ts          # Hook principal
├── components/ui/ContextBanner.tsx          # Banner visual
├── components/ui/UnifiedContextSelector.tsx # Selector modal
└── app/dashboard/researcher/layout.tsx      # Layout (ÚNICO banner)
```

## 🔧 Funcionamiento

### Flujo Básico
1. **Sin contexto** → Banner amarillo + Herramientas deshabilitadas
2. **Con contexto** → Banner verde + Herramientas habilitadas
3. **Selector** → Modal para cambiar contexto
4. **Persistencia** → Se guarda en localStorage

### Lógica de Herramientas
- **Contexto mínimo** (Proyecto + Área): 7 herramientas básicas
- **Contexto completo** (Proyecto + Área + Sitio): 8 herramientas (incluye Mapeo SIG)

## 🧪 Pruebas Rápidas

```bash
# Diagnóstico completo
node scripts/diagnostico_contexto.js

# Prueba del sistema
node scripts/test_context_banner.js

# Verificar duplicación
node scripts/check_banner_duplication.js
```

## ⚠️ Reglas Importantes

1. **Banner ÚNICO** - Solo en `layout.tsx`, NO en páginas individuales
2. **Hook ÚNICO** - Usar `useInvestigatorContext`, NO otros hooks
3. **Evento ÚNICO** - `contextUpdated` para sincronización
4. **localStorage** - Clave `investigator-context`

## 🔍 Diagnóstico Rápido

### Síntomas Comunes

| Problema | Síntoma | Solución |
|----------|---------|----------|
| Banner duplicado | Múltiples banners verdes | Eliminar de páginas individuales |
| Contexto no actualiza | Banner no cambia | Verificar evento `contextUpdated` |
| Herramientas no habilitan | Siempre deshabilitadas | Verificar `hasMinimalContext` |
| Bucle infinito | Re-renderizados constantes | Revisar dependencias de `useEffect` |

### Verificación Manual

```javascript
// En consola del navegador
localStorage.getItem('investigator-context')  // Ver contexto guardado
document.querySelector('.bg-green-50')        // Ver banner verde
document.querySelectorAll('[data-testid*="tool-"]')  // Ver herramientas
```

## 📚 Documentación Completa

Para detalles técnicos completos, ver: `docs/SISTEMA_CONTEXTO_ARQUEOLOGICO.md`

## 🆘 Si Se Rompe

1. Ejecutar `node scripts/diagnostico_contexto.js`
2. Revisar logs del navegador
3. Verificar `localStorage`
4. Consultar documentación completa

---

**Última verificación:** Enero 2025  
**Estado:** ✅ Operativo 