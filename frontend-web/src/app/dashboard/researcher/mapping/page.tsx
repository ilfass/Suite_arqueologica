'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useArchaeological } from '../../../../contexts/ArchaeologicalContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import ArchaeologicalMap from '../../../../components/mapping/ArchaeologicalMap';


// Interfaces para el sistema de mapeo arqueológico basado en fichas reales
interface ArchaeologicalContext {
  projectId: string;
  projectName: string;
  areaId: string;
  areaName: string;
  siteId: string;
  siteName: string;
  areaCoords: [number, number] | null;
  siteCoords: [number, number] | null;
}

// Datos de sitios arqueológicos (de la ficha de sitio)
interface ArchaeologicalSite {
  id: string;
  name: string;
  coordinates: [number, number];
  elevation: number;
  area: number; // en metros cuadrados
  description: string;
  period: string;
  culturalAffiliation: string;
  siteType: string;
  preservationStatus: string;
  excavationStatus: string;
  findings: ArchaeologicalFinding[];
  chronology: ChronologicalData[];
  context: ContextualData[];
}

// Datos de hallazgos (de la ficha de objeto/hallazgo)
interface ArchaeologicalFinding {
  id: string;
  name: string;
  type: 'artifact' | 'feature' | 'ecofact' | 'structure';
  coordinates: [number, number];
  depth: number;
  material: string;
  period: string;
  description: string;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
    diameter?: number;
  };
  weight?: number;
  condition: string;
  catalogNumber: string;
  context: string;
  associatedSite: string;
}

// Datos cronológicos (de la ficha de periodo temporal/cronología)
interface ChronologicalData {
  id: string;
  period: string;
  startDate: number; // años antes del presente
  endDate: number;
  culturalPhase: string;
  description: string;
  sites: string[]; // IDs de sitios asociados
  findings: string[]; // IDs de hallazgos asociados
  coordinates: [number, number][]; // Área geográfica del periodo
}

// Datos contextuales (de la ficha de área/región)
interface ContextualData {
  id: string;
  name: string;
  type: 'geographic' | 'cultural' | 'environmental';
  coordinates: [number, number][]; // Polígono del área
  description: string;
  characteristics: string[];
  associatedSites: string[];
  environmentalData: {
    climate: string;
    vegetation: string;
    waterSources: string[];
    elevation: number;
  };
}

// Capas del mapa basadas en datos reales
interface MapLayer {
  id: string;
  name: string;
  type: 'sites' | 'findings' | 'chronology' | 'context' | 'grid' | 'excavation';
  visible: boolean;
  color: string;
  opacity: number;
  data: ArchaeologicalSite[] | ArchaeologicalFinding[] | ChronologicalData[] | ContextualData[];
  description: string;
  icon: string;
}

// Sistema de cuadrícula basado en datos reales
interface GridSystem {
  id: string;
  name: string;
  type: 'metric' | 'imperial' | 'custom';
  size: number;
  orientation: number;
  origin: [number, number];
  cells: GridCell[];
  active: boolean;
  associatedSite: string;
}

interface GridCell {
  id: string;
  coordinates: [number, number][];
  center: [number, number];
  label: string;
  findings: ArchaeologicalFinding[];
  excavated: boolean;
  depth: number;
  soilLayers: SoilLayer[];
}

interface SoilLayer {
  id: string;
  depth: number;
  description: string;
  color: string;
  texture: string;
  findings: ArchaeologicalFinding[];
}

// Mediciones arqueológicas
interface Measurement {
  id: string;
  type: 'distance' | 'area' | 'bearing' | 'elevation';
  points: [number, number][];
  value: number;
  unit: string;
  description: string;
  date: string;
  associatedSite?: string;
}

const MappingPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { state: archState, getProjectById, getAreaById, getSiteById, getFindingsBySite, getSamplesBySite } = useArchaeological();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Contexto arqueológico
  const [context, setContext] = useState<ArchaeologicalContext>({
    projectId: '',
    projectName: '',
    areaId: '',
    areaName: '',
    siteId: '',
    siteName: '',
    areaCoords: null,
    siteCoords: null
  });
  
  // Estados del sistema de mapeo basado en datos reales
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [sites, setSites] = useState<ArchaeologicalSite[]>([]);
  const [findings, setFindings] = useState<ArchaeologicalFinding[]>([]);
  const [chronology, setChronology] = useState<ChronologicalData[]>([]);
  const [contextualData, setContextualData] = useState<ContextualData[]>([]);
  const [gridSystems, setGridSystems] = useState<GridSystem[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  
  // Estados de la interfaz
  const [activeGrid, setActiveGrid] = useState<string | null>(null);
  const [measurementMode, setMeasurementMode] = useState<'distance' | 'area' | 'bearing' | 'elevation' | null>(null);
  const [mapView, setMapView] = useState<'satellite' | 'terrain' | 'hybrid'>('hybrid');
  const [zoomLevel, setZoomLevel] = useState(15);
  const [currentCoordinates, setCurrentCoordinates] = useState<[number, number]>([-34.6037, -58.3816]);
  
  // Estados de modales
  const [showGridSettings, setShowGridSettings] = useState(false);
  const [showLayerManager, setShowLayerManager] = useState(false);
  const [showMeasurementPanel, setShowMeasurementPanel] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  // Estado para el modal simple de hallazgo
  const [showFindingForm, setShowFindingForm] = useState(false);
  const [findingForm, setFindingForm] = useState({
    project: context.projectName || '',
    area: context.areaName || '',
    site: context.siteName || '',
    coordinates: context.siteCoords || [0, 0],
    depth: 0,
    description: '',
    date_found: new Date().toISOString().split('T')[0],
    catalog_number: '',
    type: 'artifact',
  });
  
  // Estados de medición
  const [measurementPoints, setMeasurementPoints] = useState<[number, number][]>([]);
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Función para calcular el centro de un polígono
  const calculatePolygonCenter = (coordinates: [number, number][]): [number, number] => {
    if (coordinates.length === 0) return [0, 0];
    
    const sumLat = coordinates.reduce((sum, coord) => sum + coord[0], 0);
    const sumLng = coordinates.reduce((sum, coord) => sum + coord[1], 0);
    
    return [sumLat / coordinates.length, sumLng / coordinates.length];
  };

  // Cargar contexto desde URL parameters
  useEffect(() => {
    if (searchParams) {
      const projectId = searchParams.get('projectId') || '';
      const projectName = searchParams.get('projectName') || '';
      const areaId = searchParams.get('areaId') || '';
      const areaName = searchParams.get('areaName') || '';
      const siteId = searchParams.get('siteId') || '';
      const siteName = searchParams.get('siteName') || '';
      
      let areaCoords: [number, number] | null = null;
      let siteCoords: [number, number] | null = null;
      
      try {
        const areaCoordsStr = searchParams.get('areaCoords');
        const siteCoordsStr = searchParams.get('siteCoords');
        
        if (areaCoordsStr) {
          areaCoords = JSON.parse(areaCoordsStr);
        }
        if (siteCoordsStr) {
          siteCoords = JSON.parse(siteCoordsStr);
        }
      } catch (error) {
        console.error('Error parsing coordinates:', error);
      }
      
      setContext({
        projectId,
        projectName,
        areaId,
        areaName,
        siteId,
        siteName,
        areaCoords,
        siteCoords
      });
      
      // Centrar mapa en las coordenadas del sitio si están disponibles
      if (siteCoords) {
        setCurrentCoordinates(siteCoords);
      } else if (areaCoords) {
        setCurrentCoordinates(areaCoords);
      }
    }
  }, [searchParams]);

  // Cargar datos arqueológicos reales basados en el contexto
  useEffect(() => {
    if (context.siteId) {
      loadArchaeologicalData();
    }
  }, [context]);

  // Función para cargar datos arqueológicos reales desde el contexto
  const loadArchaeologicalData = () => {
    if (!context.siteId) return;

    // Obtener datos reales del contexto arqueológico
    const currentSite = getSiteById(context.siteId);
    const currentArea = context.areaId ? getAreaById(context.areaId) : null;
    const currentProject = context.projectId ? getProjectById(context.projectId) : null;
    
    // Obtener hallazgos y muestras del sitio
    const siteFindings = getFindingsBySite(context.siteId);
    const siteSamples = getSamplesBySite(context.siteId);

    // Centrar el mapa en el sitio si tiene coordenadas
    if (currentSite?.coordinates) {
      setCurrentCoordinates(currentSite.coordinates);
      setZoomLevel(16); // Zoom más cercano para el sitio
    } else if (currentArea?.coordinates && currentArea.coordinates.length > 0) {
      // Centrar en el área si no hay sitio específico
      const centerCoords = calculatePolygonCenter(currentArea.coordinates);
      setCurrentCoordinates(centerCoords);
      setZoomLevel(14); // Zoom para el área
    }

    // Convertir datos del contexto a formato del mapa
    const realSites: ArchaeologicalSite[] = currentSite ? [{
      id: currentSite.id,
      name: currentSite.name,
      coordinates: currentSite.coordinates,
      elevation: currentSite.elevation,
      area: currentSite.area,
      description: currentSite.description,
      period: currentSite.culturalAffiliation,
      culturalAffiliation: currentSite.culturalAffiliation,
      siteType: currentSite.siteType,
      preservationStatus: currentSite.preservationStatus,
      excavationStatus: currentSite.excavationStatus,
        findings: [],
        chronology: [],
        context: []
    }] : [];

    const realFindings: ArchaeologicalFinding[] = siteFindings.map(finding => ({
      id: finding.id,
      name: finding.name,
      type: finding.type,
      coordinates: finding.coordinates,
      depth: finding.depth,
      material: finding.material,
      period: finding.context,
      description: finding.description,
      dimensions: finding.dimensions,
      weight: finding.weight,
      condition: finding.condition,
      catalogNumber: finding.catalogNumber,
      context: finding.context,
      associatedSite: finding.siteId
    }));

    const realSamples: ArchaeologicalFinding[] = siteSamples.map(sample => ({
      id: sample.id,
      name: sample.name,
      type: 'ecofact' as const,
      coordinates: sample.coordinates,
      depth: sample.depth,
      material: sample.type,
      period: sample.context,
      description: sample.description,
      dimensions: {},
      condition: 'Bueno',
      catalogNumber: sample.id,
      context: sample.context,
      associatedSite: sample.siteId
    }));

    const mockFindings: ArchaeologicalFinding[] = [
      {
        id: 'finding-001',
        name: 'Punta de proyectil lanceolada',
        type: 'artifact',
        coordinates: [-34.6038, -58.3817],
        depth: 0.5,
        material: 'Sílex',
        period: 'Holoceno tardío',
        description: 'Punta de proyectil lanceolada con retoque bifacial',
        dimensions: {
          length: 8.5,
          width: 2.3,
          height: 0.8
        },
        weight: 15.2,
        condition: 'Completa',
        catalogNumber: 'ART-001',
        context: 'Estrato 2, Cuadrícula A3',
        associatedSite: 'site-001'
      },
      {
        id: 'finding-002',
        name: 'Fragmento de cerámica',
        type: 'artifact',
        coordinates: [-34.6036, -58.3815],
        depth: 0.3,
        material: 'Arcilla',
        period: 'Holoceno tardío',
        description: 'Fragmento de cerámica con decoración incisa',
        dimensions: {
          length: 4.2,
          width: 3.1,
          height: 0.6
        },
        weight: 8.7,
        condition: 'Fragmentado',
        catalogNumber: 'ART-002',
        context: 'Estrato 1, Cuadrícula B2',
        associatedSite: 'site-001'
      },
      {
        id: 'finding-003',
        name: 'Fogón',
        type: 'feature',
        coordinates: [-34.6037, -58.3816],
        depth: 0.2,
        material: 'Carbón y cenizas',
        period: 'Holoceno tardío',
        description: 'Estructura de fogón circular con restos de carbón',
        dimensions: {
          diameter: 1.2
        },
        condition: 'Bueno',
        catalogNumber: 'FEAT-001',
        context: 'Estrato 1, Cuadrícula A2',
        associatedSite: 'site-001'
      }
    ];

    const mockChronology: ChronologicalData[] = [
      {
        id: 'chron-001',
        period: 'Holoceno tardío',
        startDate: 3000,
        endDate: 500,
        culturalPhase: 'Fase Pampeana Tardía',
        description: 'Período de cazadores-recolectores especializados',
        sites: ['site-001'],
        findings: ['finding-001', 'finding-002', 'finding-003'],
        coordinates: [[-34.6040, -58.3820], [-34.6030, -58.3810]]
      }
    ];

    const mockContext: ContextualData[] = [
      {
        id: 'context-001',
        name: 'Laguna La Brava',
        type: 'geographic',
        coordinates: [[-34.6050, -58.3830], [-34.6020, -58.3800]],
        description: 'Área de laguna con recursos hídricos y faunísticos',
        characteristics: ['Recursos hídricos', 'Vegetación ribereña', 'Fauna acuática'],
        associatedSites: ['site-001'],
        environmentalData: {
          climate: 'Templado húmedo',
          vegetation: 'Pastizales y vegetación ribereña',
          waterSources: ['Laguna La Brava', 'Arroyo secundario'],
          elevation: 150
        }
      }
    ];

    // Crear sistema de cuadrícula basado en el sitio
    const mockGridSystem: GridSystem = {
      id: 'grid-001',
      name: 'Cuadrícula Principal 5x5m',
      type: 'metric',
      size: 5,
      orientation: 0,
      origin: [-34.6037, -58.3816],
      cells: [],
      active: true,
      associatedSite: 'site-001'
    };

    // Generar celdas de cuadrícula
    const gridCells: GridCell[] = [];
    const gridSize = 5;
    const numCells = 4; // 4x4 cuadrícula
    
    for (let i = 0; i < numCells; i++) {
      for (let j = 0; j < numCells; j++) {
        const cellId = `cell-${i}-${j}`;
        const centerLat = -34.6037 + (i - 1.5) * (gridSize / 111000); // Aproximación
        const centerLng = -58.3816 + (j - 1.5) * (gridSize / (111000 * Math.cos(-34.6037 * Math.PI / 180)));
        
        const cellFindings = mockFindings.filter(f => {
          const latDiff = Math.abs(f.coordinates[0] - centerLat);
          const lngDiff = Math.abs(f.coordinates[1] - centerLng);
          return latDiff < (gridSize / 222000) && lngDiff < (gridSize / (222000 * Math.cos(-34.6037 * Math.PI / 180)));
        });

        gridCells.push({
          id: cellId,
          coordinates: [
            [centerLat - gridSize/222000, centerLng - gridSize/(222000 * Math.cos(-34.6037 * Math.PI / 180))],
            [centerLat + gridSize/222000, centerLng - gridSize/(222000 * Math.cos(-34.6037 * Math.PI / 180))],
            [centerLat + gridSize/222000, centerLng + gridSize/(222000 * Math.cos(-34.6037 * Math.PI / 180))],
            [centerLat - gridSize/222000, centerLng + gridSize/(222000 * Math.cos(-34.6037 * Math.PI / 180))]
          ],
          center: [centerLat, centerLng],
          label: `${String.fromCharCode(65 + i)}${j + 1}`,
          findings: cellFindings,
          excavated: cellFindings.length > 0,
          depth: 0.5,
          soilLayers: [
            {
              id: `soil-${cellId}-1`,
              depth: 0.3,
              description: 'Estrato superior - Suelo orgánico',
              color: '#8B4513',
              texture: 'Franco-arcilloso',
              findings: cellFindings.filter(f => f.depth <= 0.3)
            },
            {
              id: `soil-${cellId}-2`,
              depth: 0.8,
              description: 'Estrato inferior - Suelo mineral',
              color: '#654321',
              texture: 'Arcilloso',
              findings: cellFindings.filter(f => f.depth > 0.3)
            }
          ]
        });
      }
    }

    mockGridSystem.cells = gridCells;

    // Actualizar estados con datos reales
    setSites(realSites);
    setFindings([...realFindings, ...realSamples]);
    setChronology(mockChronology);
    setContextualData(mockContext);
    setGridSystems([mockGridSystem]);

    // Crear capas del mapa basadas en datos reales
    const newLayers: MapLayer[] = [
      {
        id: 'sites-layer',
        name: 'Sitios Arqueológicos',
        type: 'sites',
        visible: true,
        color: '#FF6B35',
        opacity: 0.8,
        data: realSites,
        description: 'Ubicaciones de sitios arqueológicos registrados',
        icon: '🏛️'
      },
      {
        id: 'findings-layer',
        name: 'Hallazgos',
        type: 'findings',
        visible: true,
        color: '#4ECDC4',
        opacity: 0.7,
        data: [...realFindings, ...realSamples],
        description: 'Artefactos, estructuras y ecofactos encontrados',
        icon: '🔍'
      },
      {
        id: 'chronology-layer',
        name: 'Cronología',
        type: 'chronology',
        visible: true,
        color: '#45B7D1',
        opacity: 0.6,
        data: mockChronology,
        description: 'Períodos cronológicos y fases culturales',
        icon: '⏰'
      },
      {
        id: 'context-layer',
        name: 'Contexto',
        type: 'context',
        visible: true,
        color: '#96CEB4',
        opacity: 0.5,
        data: mockContext,
        description: 'Áreas geográficas y contextos ambientales',
        icon: '🗺️'
      },
      {
        id: 'grid-layer',
        name: 'Cuadrícula',
        type: 'grid',
        visible: true,
        color: '#FFEAA7',
        opacity: 0.4,
        data: [],
        description: 'Sistema de cuadrícula de excavación',
        icon: '📐'
      }
    ];

    setLayers(newLayers);
  };

  // Funciones de manejo de capas
  const handleLayerToggle = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  // Funciones de medición
  const handleMeasurementMode = (mode: 'distance' | 'area' | 'bearing' | 'elevation') => {
    setMeasurementMode(mode);
    setIsMeasuring(true);
    setMeasurementPoints([]);
  };

  const handleMapClick = (coordinates: [number, number]) => {
    if (isMeasuring && measurementMode) {
      setMeasurementPoints(prev => [...prev, coordinates]);
      
      if (measurementMode === 'distance' && measurementPoints.length === 1) {
        // Calcular distancia
        const distance = calculateDistance(measurementPoints[0], coordinates);
        const newMeasurement: Measurement = {
          id: `meas-${Date.now()}`,
          type: 'distance',
          points: [measurementPoints[0], coordinates],
          value: distance,
          unit: 'metros',
          description: `Distancia entre puntos`,
          date: new Date().toISOString(),
          associatedSite: context.siteId
        };
        setMeasurements(prev => [...prev, newMeasurement]);
        setIsMeasuring(false);
        setMeasurementPoints([]);
        setMeasurementMode(null);
      } else if (measurementMode === 'area' && measurementPoints.length >= 2) {
        // Calcular área (simplificado)
        const area = calculateArea([...measurementPoints, coordinates]);
        const newMeasurement: Measurement = {
          id: `meas-${Date.now()}`,
          type: 'area',
          points: [...measurementPoints, coordinates],
          value: area,
          unit: 'metros cuadrados',
          description: `Área del polígono`,
          date: new Date().toISOString(),
          associatedSite: context.siteId
        };
        setMeasurements(prev => [...prev, newMeasurement]);
        setIsMeasuring(false);
        setMeasurementPoints([]);
        setMeasurementMode(null);
      }
    }
  };

  // Funciones de cálculo
  const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = point1[0] * Math.PI / 180;
    const φ2 = point2[0] * Math.PI / 180;
    const Δφ = (point2[0] - point1[0]) * Math.PI / 180;
    const Δλ = (point2[1] - point1[1]) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const calculateArea = (points: [number, number][]): number => {
    // Cálculo simplificado del área de un polígono
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i][0] * points[j][1];
      area -= points[j][0] * points[i][1];
    }
    return Math.abs(area) * 111000 * 111000 / 2; // Conversión aproximada a metros cuadrados
  };

  // Función de exportación
  const handleExportData = () => {
    const exportData = {
      context,
      sites,
      findings,
      chronology,
      contextualData,
      gridSystems,
      measurements,
      layers: layers.filter(l => l.visible),
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `archaeological_data_${context.siteName}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Estadísticas
  const stats = {
    sites: sites.length,
    findings: findings.length,
    chronology: chronology.length,
    context: contextualData.length,
    measurements: measurements.length,
    activeLayers: layers.filter(l => l.visible).length
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando información del usuario...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Restringido</h2>
          <p className="text-gray-600">Debes iniciar sesión para acceder al Sistema SIG Arqueológico.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold">Sistema SIG Arqueológico</h1>
              <p className="text-blue-100">
                {context.projectName} → {context.areaName} → {context.siteName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Zoom: {zoomLevel}x</span>
            <span className="text-sm">Vista: {mapView}</span>
            <Button
              onClick={() => setShowFindingForm(true)}
              className="px-3 py-1 bg-green-600 text-white hover:bg-green-700 text-sm"
            >
              ➕ Nuevo Hallazgo
            </Button>
            <button
              onClick={() => setCurrentCoordinates(context.siteCoords || [-34.6037, -58.3816])}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              title="Centrar mapa"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Banner de Contexto Arqueológico */}
      {context.siteId && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mx-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">🗺️ Contexto Arqueológico</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>📋 Proyecto: {context.projectName || 'No seleccionado'}</span>
                <span>📍 Área: {context.areaName || 'No seleccionada'}</span>
                <span>🏛️ Sitio: {context.siteName || 'No seleccionado'}</span>
                <span>📊 Hallazgos: {findings.length}</span>
                <span>🔬 Muestras: {archState.samples.filter(s => s.siteId === context.siteId).length}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => {
                  if (context.siteCoords) {
                    setCurrentCoordinates(context.siteCoords);
                    setZoomLevel(16);
                  }
                }}
                className="px-3 py-1 bg-blue-500 text-white hover:bg-blue-600 text-sm"
                disabled={!context.siteCoords}
              >
                🎯 Centrar en Sitio
              </Button>
              <Button
                onClick={() => router.push('/dashboard/researcher')}
                className="px-3 py-1 bg-gray-500 text-white hover:bg-gray-600 text-sm"
              >
                ← Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-white border-r border-gray-200 p-4 space-y-4">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {[
                { id: 'layers', name: 'Capas', icon: '🗂️' },
                { id: 'tools', name: 'Herramientas', icon: '🔧' },
                { id: 'data', name: 'Datos', icon: '📊' },
                { id: 'export', name: 'Exportar', icon: '📤' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className="flex-1 py-2 px-3 text-sm font-medium rounded-md bg-white shadow-sm"
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Capas */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Capas del Sistema</h3>
              {layers.map(layer => (
                <div key={layer.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() => handleLayerToggle(layer.id)}
                    className="rounded"
                  />
                  <span className="text-sm">{layer.icon} {layer.name}</span>
                  <span className="text-xs text-gray-500">({layer.data.length})</span>
                </div>
              ))}
            </div>

            {/* Herramientas de medición */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Mediciones</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { mode: 'distance', label: 'Distancia', icon: '📏' },
                  { mode: 'area', label: 'Área', icon: '📐' },
                  { mode: 'bearing', label: 'Rumbo', icon: '🧭' },
                  { mode: 'elevation', label: 'Elevación', icon: '⛰️' }
                ].map(tool => (
                  <button
                    key={tool.mode}
                    onClick={() => handleMeasurementMode(tool.mode as any)}
                    className={`p-2 text-sm rounded border transition-colors ${
                      measurementMode === tool.mode
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg">{tool.icon}</div>
                      <div>{tool.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Estadísticas</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="font-medium text-blue-800">Sitios</div>
                  <div className="text-blue-600">{stats.sites}</div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <div className="font-medium text-green-800">Hallazgos</div>
                  <div className="text-green-600">{stats.findings}</div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="font-medium text-purple-800">Cronología</div>
                  <div className="text-purple-600">{stats.chronology}</div>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <div className="font-medium text-orange-800">Contexto</div>
                  <div className="text-orange-600">{stats.context}</div>
                </div>
              </div>
            </div>

            {/* Exportar */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Exportar Datos</h3>
              <button
                onClick={handleExportData}
                className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                📤 Exportar Datos Arqueológicos
              </button>
            </div>
          </div>
        )}

        {/* Mapa principal */}
        <div className="flex-1">
          <div className="p-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Mapa Arqueológico</h2>
                <div className="flex space-x-2">
                  <select
                    value={mapView}
                    onChange={(e) => setMapView(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="satellite">Satélite</option>
                    <option value="terrain">Terreno</option>
                    <option value="hybrid">Híbrido</option>
                  </select>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(prev + 1, 20))}
                    className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(prev - 1, 1))}
                    className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    -
                  </button>
                </div>
              </div>
              
              <div className="h-[600px] bg-gray-100 rounded-lg relative">
                <ArchaeologicalMap
                  center={currentCoordinates}
                  zoom={zoomLevel}
                  layers={layers}
                  sites={sites}
                  findings={findings}
                  chronology={chronology}
                  contextualData={contextualData}
                  gridSystems={gridSystems}
                  measurements={measurements}
                  measurementMode={measurementMode}
                  onMapClick={handleMapClick}
                  mapView={mapView}
                />
                
                {/* Indicador de medición */}
                {isMeasuring && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg">
                    Modo: {measurementMode} - Puntos: {measurementPoints.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de Nuevo Hallazgo SIMPLE */}
      {showFindingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Nuevo Hallazgo</h2>
            <form onSubmit={e => { e.preventDefault(); setShowFindingForm(false); }}>
              <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Proyecto</label>
                  <input type="text" className="w-full border rounded p-2 bg-gray-100" value={findingForm.project} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Área</label>
                  <input type="text" className="w-full border rounded p-2 bg-gray-100" value={findingForm.area} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sitio</label>
                  <input type="text" className="w-full border rounded p-2 bg-gray-100" value={findingForm.site} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de hallazgo</label>
                  <input type="date" className="w-full border rounded p-2" value={findingForm.date_found} onChange={e => setFindingForm(f => ({ ...f, date_found: e.target.value }))} required />
                </div>
              </div>
              <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Coordenadas (Lat, Lng)</label>
                  <div className="flex space-x-2">
                    <input type="number" step="any" className="w-1/2 border rounded p-2" value={findingForm.coordinates[0]} onChange={e => setFindingForm(f => ({ ...f, coordinates: [parseFloat(e.target.value), f.coordinates[1]] }))} required />
                    <input type="number" step="any" className="w-1/2 border rounded p-2" value={findingForm.coordinates[1]} onChange={e => setFindingForm(f => ({ ...f, coordinates: [f.coordinates[0], parseFloat(e.target.value)] }))} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Profundidad (m)</label>
                  <input type="number" step="any" className="w-full border rounded p-2" value={findingForm.depth} onChange={e => setFindingForm(f => ({ ...f, depth: parseFloat(e.target.value) }))} required />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea className="w-full border rounded p-2" value={findingForm.description} onChange={e => setFindingForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Número de Catálogo</label>
                  <input type="text" className="w-full border rounded p-2" value={findingForm.catalog_number} onChange={e => setFindingForm(f => ({ ...f, catalog_number: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Hallazgo</label>
                  <select className="w-full border rounded p-2" value={findingForm.type} onChange={e => setFindingForm(f => ({ ...f, type: e.target.value }))} required>
                    <option value="artifact">Artefacto</option>
                    <option value="feature">Estructura</option>
                    <option value="ecofact">Ecofacto</option>
                    <option value="structure">Construcción</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowFindingForm(false)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MappingPage; 