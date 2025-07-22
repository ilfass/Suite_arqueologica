# Página de Mapping - Suite Arqueológica

## Descripción

La página de mapping es una herramienta integral de Sistemas de Información Geográfica (SIG) diseñada específicamente para arqueólogos e investigadores. Permite la visualización, gestión y análisis de datos espaciales relacionados con sitios arqueológicos.

## Funcionalidades Principales

### 🗺️ Mapa Interactivo
- **Mapa base**: OpenStreetMap y vista satelital
- **Zoom y navegación**: Controles intuitivos de zoom y pan
- **Escala**: Indicador de escala en tiempo real
- **Coordenadas**: Visualización de coordenadas actuales

### 🔲 Gestión de Cuadrículas
- **Visualización**: Cuadrículas de excavación con códigos únicos
- **Estados**: Planificada, Activa, Completada
- **Información**: Área, profundidad, número de hallazgos
- **Editor**: Crear, editar y eliminar cuadrículas
- **Colores**: Diferenciación visual por estado

### 🏺 Gestión de Hallazgos
- **Tipos**: Cerámica, Lítico, Óseo, Metal, Otro
- **Georreferenciación**: Coordenadas precisas
- **Metadatos**: Profundidad, fecha, descripción, número de catálogo
- **Formulario**: Interfaz intuitiva para agregar/editar hallazgos
- **Visualización**: Marcadores coloridos en el mapa

### 📏 Herramientas de Medición
- **Distancia**: Medir distancias entre puntos
- **Área**: Calcular áreas de polígonos
- **Puntos**: Marcar puntos de referencia
- **Polígonos**: Dibujar áreas de interés
- **Cálculos automáticos**: Resultados en tiempo real

### 🎛️ Control de Capas
- **Capas temáticas**: Topografía, Cronología, Hallazgos, Cuadrícula, Excavaciones
- **Visibilidad**: Activar/desactivar capas
- **Opacidad**: Control de transparencia (0-100%)
- **Iconos**: Identificación visual por tipo

### 📊 Estadísticas y Análisis
- **Resumen**: Número de cuadrículas, hallazgos, mediciones
- **Área total**: Superficie excavada
- **Exportación**: Datos en formato JSON
- **Filtros**: Por tipo, estado, fecha

## Componentes Técnicos

### MapComponent.tsx
- **Biblioteca**: Leaflet.js para mapas interactivos
- **Funcionalidades**:
  - Renderizado de cuadrículas como rectángulos
  - Marcadores personalizados para hallazgos
  - Herramientas de dibujo y medición
  - Popups informativos
  - Leyenda interactiva

### FindingForm.tsx
- **Validación**: Coordenadas, profundidad, descripción
- **Campos**: Tipo, coordenadas, profundidad, descripción, fecha, catálogo
- **Interfaz**: Modal responsive con formulario completo

### GridEditor.tsx
- **Gestión**: CRUD completo de cuadrículas
- **Validación**: Coordenadas válidas, códigos únicos
- **Interfaz**: Tabla con acciones y formulario de edición

### mapping.css
- **Estilos**: Diseño moderno y responsive
- **Temas**: Soporte para modo claro/oscuro
- **Animaciones**: Transiciones suaves
- **Accesibilidad**: Contraste y navegación por teclado

## Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Mapas**: Leaflet.js, OpenStreetMap
- **Estilos**: Tailwind CSS, CSS Modules
- **Iconos**: Emoji y iconos personalizados
- **Validación**: Formularios con validación en tiempo real

## Estructura de Datos

### GridUnit
```typescript
interface GridUnit {
  id: string;
  code: string;
  coordinates: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  status: 'planned' | 'active' | 'completed';
  findings_count: number;
  depth: number;
  area: number;
  notes?: string;
}
```

### Finding
```typescript
interface Finding {
  id: string;
  type: 'ceramic' | 'lithic' | 'bone' | 'metal' | 'other';
  coordinates: [number, number];
  depth: number;
  description: string;
  date_found: string;
  catalog_number?: string;
}
```

### MapLayer
```typescript
interface MapLayer {
  id: string;
  name: string;
  type: 'topography' | 'chronology' | 'findings' | 'grid' | 'excavation' | 'satellite';
  visible: boolean;
  color: string;
  opacity: number;
  data: any[];
  icon?: string;
}
```

## Instalación y Configuración

### Dependencias
```bash
npm install leaflet @types/leaflet
```

### Configuración de Leaflet
- Iconos personalizados para marcadores
- Estilos CSS para controles
- Configuración de capas base

### Variables de Entorno
```env
NEXT_PUBLIC_MAP_CENTER_LAT=19.4326
NEXT_PUBLIC_MAP_CENTER_LNG=-99.1332
NEXT_PUBLIC_MAP_ZOOM=16
```

## Uso

### Navegación Básica
1. **Zoom**: Usar controles +/- o rueda del mouse
2. **Pan**: Arrastrar el mapa
3. **Centro**: Botón de casa para volver al centro

### Gestión de Cuadrículas
1. Hacer clic en "🔲 Gestionar Cuadrículas"
2. Agregar nueva cuadrícula con "➕ Agregar Cuadrícula"
3. Editar existentes con "Editar"
4. Guardar cambios con "💾 Guardar Cambios"

### Agregar Hallazgos
1. Hacer clic en "🏺 Agregar Hallazgo"
2. Completar formulario con datos del hallazgo
3. Hacer clic en "Guardar"

### Herramientas de Medición
1. Seleccionar herramienta deseada
2. Hacer clic en el mapa para marcar puntos
3. Doble clic para finalizar medición
4. Ver resultados en popup

### Control de Capas
1. Usar checkboxes para activar/desactivar
2. Ajustar opacidad con sliders
3. Ver cambios en tiempo real

## Características Avanzadas

### Exportación de Datos
- Formato JSON con timestamp
- Incluye todas las capas, cuadrículas y hallazgos
- Descarga automática del archivo

### Responsive Design
- Adaptación a dispositivos móviles
- Controles táctiles optimizados
- Interfaz adaptable a diferentes tamaños

### Performance
- Carga dinámica de componentes
- Optimización de renderizado
- Lazy loading de mapas

### Accesibilidad
- Navegación por teclado
- Contraste adecuado
- Textos alternativos
- ARIA labels

## Mantenimiento

### Actualizaciones
- Mantener dependencias actualizadas
- Revisar compatibilidad con nuevas versiones de Leaflet
- Actualizar tipos TypeScript según sea necesario

### Debugging
- Console logs para desarrollo
- Errores de validación visibles
- Estados de carga claros

### Testing
- Pruebas de funcionalidad de mapas
- Validación de formularios
- Responsive design testing

## Contribución

### Estándares de Código
- TypeScript estricto
- Componentes funcionales con hooks
- Estilos con Tailwind CSS
- Documentación inline

### Flujo de Trabajo
1. Crear feature branch
2. Implementar funcionalidad
3. Agregar tests si es necesario
4. Documentar cambios
5. Crear pull request

## Licencia

Este componente es parte de la Suite Arqueológica y sigue las mismas políticas de licencia del proyecto principal. 