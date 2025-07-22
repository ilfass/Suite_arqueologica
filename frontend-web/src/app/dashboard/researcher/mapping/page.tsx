'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import ArchaeologicalMap from '../../../../components/mapping/ArchaeologicalMap';

interface MapLayer {
  id: string;
  name: string;
  type: 'topography' | 'chronology' | 'findings' | 'grid' | 'excavation';
  visible: boolean;
  color: string;
  data: any[];
}

interface MapPoint {
  id: string;
  name: string;
  type: 'site' | 'finding' | 'sample' | 'excavation';
  coordinates: [number, number];
  description: string;
  date: string;
  status: string;
}

const MappingPage: React.FC = () => {
  const { user } = useAuth();
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string>('');
  const [showAddPoint, setShowAddPoint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapView, setMapView] = useState<'satellite' | 'topographic'>('satellite');
  const [zoomLevel, setZoomLevel] = useState(10);
  const [measurementMode, setMeasurementMode] = useState<'distance' | 'area' | 'bearing' | null>(null);
  const [newPoint, setNewPoint] = useState({
    name: '',
    type: 'site' as const,
    description: '',
    coordinates: [-34.6037, -58.3816] as [number, number]
  });
  const [measurementResults, setMeasurementResults] = useState<string[]>([]);
  const [selectedGrid, setSelectedGrid] = useState<string>('');
  const [currentCoordinates, setCurrentCoordinates] = useState<[number, number]>([-34.6037, -58.3816]);
  const [measurementPoints, setMeasurementPoints] = useState<[number, number][]>([]);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setLayers([
        {
          id: '1',
          name: 'Topografía',
          type: 'topography',
          visible: true,
          color: '#4F46E5',
          data: []
        },
        {
          id: '2',
          name: 'Cronología',
          type: 'chronology',
          visible: true,
          color: '#DC2626',
          data: []
        },
        {
          id: '3',
          name: 'Hallazgos',
          type: 'findings',
          visible: true,
          color: '#059669',
          data: []
        },
        {
          id: '4',
          name: 'Cuadrícula de Excavación',
          type: 'grid',
          visible: true,
          color: '#7C3AED',
          data: []
        },
        {
          id: '5',
          name: 'Áreas de Excavación',
          type: 'excavation',
          visible: true,
          color: '#EA580C',
          data: []
        }
      ]);

      setPoints([
        {
          id: '1',
          name: 'Sitio Pampeano La Laguna',
          type: 'site',
          coordinates: [-34.6037, -58.3816],
          description: 'Sitio de cazadores recolectores del Holoceno temprano',
          date: '2024-01-15',
          status: 'active'
        },
        {
          id: '2',
          name: 'Hallazgo Lítico - Punta de Proyectil',
          type: 'finding',
          coordinates: [-34.6035, -58.3814],
          description: 'Punta de proyectil de cuarzo con retoque bifacial',
          date: '2024-01-16',
          status: 'documented'
        },
        {
          id: '3',
          name: 'Muestra de Carbón',
          type: 'sample',
          coordinates: [-34.6038, -58.3818],
          description: 'Muestra para datación C14',
          date: '2024-01-17',
          status: 'sent_to_lab'
        },
        {
          id: '4',
          name: 'Cuadrícula A1',
          type: 'excavation',
          coordinates: [-34.6036, -58.3815],
          description: 'Unidad de excavación 1x1m',
          date: '2024-01-18',
          status: 'in_progress'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLayerToggle = (layerId: string) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const handleAddPoint = () => {
    setShowAddPoint(true);
  };

  const handleSavePoint = () => {
    if (newPoint.name.trim()) {
      const point: MapPoint = {
        id: Date.now().toString(),
        name: newPoint.name,
        type: newPoint.type,
        coordinates: currentCoordinates,
        description: newPoint.description,
        date: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      setPoints([...points, point]);
      setNewPoint({
        name: '',
        type: 'site',
        description: '',
        coordinates: [-34.6037, -58.3816]
      });
      setShowAddPoint(false);
      setMeasurementResults([`Punto "${point.name}" agregado en las coordenadas ${currentCoordinates[0].toFixed(6)}, ${currentCoordinates[1].toFixed(6)}`]);
    }
  };

  const handleMeasureDistance = () => {
    setMeasurementMode('distance');
    setMeasurementResults(['Modo de medición de distancia activado', 'Haz clic en dos puntos del mapa para medir']);
  };

  const handleMeasureArea = () => {
    setMeasurementMode('area');
    setMeasurementResults(['Modo de medición de área activado', 'Haz clic en múltiples puntos para crear un polígono']);
  };

  const handleMeasureBearing = () => {
    setMeasurementMode('bearing');
    setMeasurementResults(['Modo de medición de rumbo activado', 'Haz clic en dos puntos para medir el rumbo']);
  };

  const handleCreatePolygon = () => {
    setMeasurementMode('area');
    setMeasurementResults(['Modo de creación de polígono activado', 'Haz clic en múltiples puntos para crear el polígono']);
  };

  const handleGeoreference = () => {
    setMeasurementResults(['Modo de georreferenciación activado', 'Selecciona puntos de control en la imagen']);
  };

  const handleMapViewChange = (view: 'satellite' | 'topographic') => {
    setMapView(view);
    setMeasurementResults([`Vista cambiada a: ${view === 'satellite' ? 'Satélite' : 'Topográfica'}`]);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 20));
    setMeasurementResults([`Zoom aumentado a nivel ${zoomLevel + 1}`]);
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1));
    setMeasurementResults([`Zoom reducido a nivel ${zoomLevel - 1}`]);
  };

  const handleCenter = () => {
    setMeasurementResults(['Mapa centrado en el sitio principal']);
  };

  const handleGridSelect = (grid: string) => {
    setSelectedGrid(grid);
    setMeasurementResults([`Cuadrícula ${grid} seleccionada`]);
  };

  const handleCreateGrid = () => {
    setMeasurementResults(['Creando nueva cuadrícula de excavación...']);
  };

  const handleMarkCoordinates = () => {
    setMeasurementResults(['Modo de marcado de coordenadas activado', 'Haz clic en el mapa para marcar coordenadas']);
  };

  const handleMapClick = (coordinates: [number, number]) => {
    setCurrentCoordinates(coordinates);
    
    if (measurementMode === 'distance' && measurementPoints.length < 2) {
      setMeasurementPoints([...measurementPoints, coordinates]);
      if (measurementPoints.length === 1) {
        const distance = calculateDistance(measurementPoints[0], coordinates);
        setMeasurementResults([`Distancia medida: ${distance.toFixed(2)} metros`]);
        setMeasurementPoints([]);
      } else {
        setMeasurementResults(['Haz clic en el segundo punto para medir la distancia']);
      }
    } else if (measurementMode === 'area') {
      setMeasurementPoints([...measurementPoints, coordinates]);
      setMeasurementResults([`Punto ${measurementPoints.length + 1} agregado. Haz clic en más puntos o presiona "Finalizar" para calcular el área`]);
    } else if (measurementMode === 'bearing') {
      setMeasurementPoints([...measurementPoints, coordinates]);
      if (measurementPoints.length === 1) {
        const bearing = calculateBearing(measurementPoints[0], coordinates);
        setMeasurementResults([`Rumbo calculado: ${bearing.toFixed(1)}°`]);
        setMeasurementPoints([]);
      } else {
        setMeasurementResults(['Haz clic en el segundo punto para calcular el rumbo']);
      }
    } else {
      setMeasurementResults([`Coordenadas marcadas: ${coordinates[0].toFixed(6)}, ${coordinates[1].toFixed(6)}`]);
    }
  };

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

  const calculateBearing = (point1: [number, number], point2: [number, number]): number => {
    const λ1 = point1[1] * Math.PI / 180;
    const λ2 = point2[1] * Math.PI / 180;
    const φ1 = point1[0] * Math.PI / 180;
    const φ2 = point2[0] * Math.PI / 180;

    const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);

    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  const calculatePolygonArea = (points: [number, number][]): number => {
    if (points.length < 3) return 0;
    
    // Convertir a coordenadas cartesianas aproximadas
    const R = 6371e3; // Radio de la Tierra en metros
    const centerLat = points.reduce((sum, p) => sum + p[0], 0) / points.length;
    const centerLng = points.reduce((sum, p) => sum + p[1], 0) / points.length;
    
    const cartesianPoints = points.map(([lat, lng]) => {
      const dLat = (lat - centerLat) * Math.PI / 180;
      const dLng = (lng - centerLng) * Math.PI / 180;
      return [
        R * dLat,
        R * dLng * Math.cos(centerLat * Math.PI / 180)
      ];
    });
    
    // Calcular área usando la fórmula del polígono
    let area = 0;
    for (let i = 0; i < cartesianPoints.length; i++) {
      const j = (i + 1) % cartesianPoints.length;
      area += cartesianPoints[i][0] * cartesianPoints[j][1];
      area -= cartesianPoints[j][0] * cartesianPoints[i][1];
    }
    
    return Math.abs(area) / 2;
  };

  const handleClearMeasurementMode = () => {
    setMeasurementMode(null);
    setMeasurementResults([]);
    setMeasurementPoints([]);
  };

  const handlePointClick = (point: MapPoint) => {
    setMeasurementResults([
      `Punto seleccionado: ${point.name}`,
      `Tipo: ${point.type}`,
      `Coordenadas: ${point.coordinates[0]}, ${point.coordinates[1]}`,
      `Estado: ${point.status}`
    ]);
  };

  const handleDeletePoint = (pointId: string) => {
    setPoints(points.filter(p => p.id !== pointId));
    setMeasurementResults(['Punto eliminado del mapa']);
  };

  const handleExportData = () => {
    const data = {
      layers,
      points,
      mapView,
      zoomLevel,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mapping-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setMeasurementResults(['Datos del mapa exportados correctamente']);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.points) setPoints(data.points);
          if (data.layers) setLayers(data.layers);
          setMeasurementResults(['Datos importados correctamente']);
        } catch (error) {
          setMeasurementResults(['Error al importar datos: formato inválido']);
        }
      };
      reader.readAsText(file);
    }
  };

  const getPointIcon = (type: string) => {
    switch (type) {
      case 'site': return '🏛️';
      case 'finding': return '🏺';
      case 'sample': return '🧪';
      case 'excavation': return '⛏️';
      default: return '📍';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'documented': return 'bg-blue-100 text-blue-800';
      case 'sent_to_lab': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow h-96"></div>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-3 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mapeo SIG Integrado</h1>
              <p className="text-gray-600 mt-2">Planificación y mapeo del sitio arqueológico</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleMeasureDistance}>
                📏 Medir Distancia
              </Button>
              <Button variant="outline" onClick={handleCreatePolygon}>
                🔷 Crear Polígono
              </Button>
              <Button variant="outline" onClick={handleGeoreference}>
                📍 Georreferenciar
              </Button>
              <Button variant="outline" onClick={handleExportData}>
                📤 Exportar
              </Button>
              <label className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-gray-300 bg-transparent hover:bg-gray-50 h-10 px-4 py-2 cursor-pointer">
                📥 Importar
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
              <Button variant="primary" onClick={handleAddPoint}>
                + Agregar Punto
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mapa Principal */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Mapa del Sitio</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant={mapView === 'satellite' ? 'primary' : 'outline'} 
                      size="sm"
                      onClick={() => handleMapViewChange('satellite')}
                    >
                      🗺️ Vista Satélite
                    </Button>
                    <Button 
                      variant={mapView === 'topographic' ? 'primary' : 'outline'} 
                      size="sm"
                      onClick={() => handleMapViewChange('topographic')}
                    >
                      📊 Vista Topográfica
                    </Button>
                  </div>
                </div>
                
                {/* Mapa Real con Leaflet */}
                <div className="bg-gray-100 rounded-lg h-96 relative">
                  <ArchaeologicalMap
                    points={points}
                    onPointClick={handlePointClick}
                    onMapClick={handleMapClick}
                    measurementMode={measurementMode}
                    selectedGrid={selectedGrid}
                    onGridSelect={handleGridSelect}
                  />
                </div>

                {/* Controles del Mapa */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleZoomIn}>
                      🔍 Zoom In
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleZoomOut}>
                      🔍 Zoom Out
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCenter}>
                      🏠 Centrar
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Zoom: {zoomLevel} | Coordenadas: {currentCoordinates[0].toFixed(6)}, {currentCoordinates[1].toFixed(6)}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Panel de Control */}
          <div className="space-y-6">
            {/* Capas */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Capas Temáticas</h3>
                <div className="space-y-3">
                  {layers.map((layer) => (
                    <div key={layer.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={layer.visible}
                          onChange={() => handleLayerToggle(layer.id)}
                          className="mr-3"
                        />
                        <div 
                          className="w-4 h-4 rounded mr-3"
                          style={{ backgroundColor: layer.color }}
                        ></div>
                        <span className="text-sm font-medium">{layer.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{layer.data.length} elementos</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Puntos en el Mapa */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Puntos en el Mapa</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {points.map((point) => (
                    <div key={point.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center cursor-pointer" onClick={() => handlePointClick(point)}>
                        <span className="text-xl mr-3">{getPointIcon(point.type)}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{point.name}</p>
                          <p className="text-xs text-gray-500">{point.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(point.status)}`}>
                          {point.status.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => handleDeletePoint(point.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                          title="Eliminar punto"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Herramientas de Medición */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Herramientas de Medición</h3>
                <div className="space-y-3">
                  <Button 
                    variant={measurementMode === 'distance' ? 'primary' : 'outline'} 
                    className="w-full justify-start"
                    onClick={handleMeasureDistance}
                  >
                    📏 Medir Distancia
                  </Button>
                  <Button 
                    variant={measurementMode === 'area' ? 'primary' : 'outline'} 
                    className="w-full justify-start"
                    onClick={handleMeasureArea}
                  >
                    📐 Medir Área
                  </Button>
                  <Button 
                    variant={measurementMode === 'bearing' ? 'primary' : 'outline'} 
                    className="w-full justify-start"
                    onClick={handleMeasureBearing}
                  >
                    🧭 Medir Rumbo
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleMarkCoordinates}
                  >
                    📍 Marcar Coordenadas
                  </Button>
                </div>
                {measurementResults.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium text-blue-900">Estado de medición:</h4>
                      <div className="flex gap-2">
                        {measurementMode === 'area' && measurementPoints.length > 2 && (
                          <button
                            onClick={() => {
                              const area = calculatePolygonArea(measurementPoints);
                              setMeasurementResults([`Área calculada: ${area.toFixed(2)} metros cuadrados`]);
                              setMeasurementPoints([]);
                            }}
                            className="text-green-600 hover:text-green-800 text-xs"
                          >
                            ✅ Finalizar
                          </button>
                        )}
                        <button
                          onClick={handleClearMeasurementMode}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          ✕ Limpiar
                        </button>
                      </div>
                    </div>
                    {measurementResults.map((result, index) => (
                      <p key={index} className="text-xs text-blue-700">{result}</p>
                    ))}
                    {measurementPoints.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <p className="text-xs text-blue-600">
                          Puntos marcados: {measurementPoints.length}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Cuadrículas */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cuadrículas de Excavación</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'].map((grid) => (
                      <Button 
                        key={grid} 
                        variant={selectedGrid === grid ? 'primary' : 'outline'} 
                        size="sm"
                        onClick={() => handleGridSelect(grid)}
                      >
                        {grid}
                      </Button>
                    ))}
                  </div>
                  <Button variant="primary" className="w-full" onClick={handleCreateGrid}>
                    + Crear Nueva Cuadrícula
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Información del Sitio */}
        <div className="mt-8">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sitio</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Ubicación</h4>
                  <p className="text-sm text-gray-600">Región Pampeana, Argentina</p>
                  <p className="text-sm text-gray-600">Coordenadas: -34.6037, -58.3816</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Cronología</h4>
                  <p className="text-sm text-gray-600">Holoceno Temprano</p>
                  <p className="text-sm text-gray-600">~10,000 - 8,000 años AP</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Cultura</h4>
                  <p className="text-sm text-gray-600">Cazadores Recolectores</p>
                  <p className="text-sm text-gray-600">Tecnología Lítica</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal para agregar punto */}
      {showAddPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Punto</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del punto
                </label>
                <Input
                  type="text"
                  value={newPoint.name}
                  onChange={(e) => setNewPoint({...newPoint, name: e.target.value})}
                  placeholder="Ej: Hallazgo Lítico"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={newPoint.type}
                  onChange={(e) => setNewPoint({...newPoint, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="site">Sitio</option>
                  <option value="finding">Hallazgo</option>
                  <option value="sample">Muestra</option>
                  <option value="excavation">Excavación</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={newPoint.description}
                  onChange={(e) => setNewPoint({...newPoint, description: e.target.value})}
                  placeholder="Descripción del punto..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coordenadas
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    value={newPoint.coordinates[0]}
                    onChange={(e) => setNewPoint({
                      ...newPoint, 
                      coordinates: [parseFloat(e.target.value), newPoint.coordinates[1]]
                    })}
                    placeholder="Latitud"
                    step="0.0001"
                  />
                  <Input
                    type="number"
                    value={newPoint.coordinates[1]}
                    onChange={(e) => setNewPoint({
                      ...newPoint, 
                      coordinates: [newPoint.coordinates[0], parseFloat(e.target.value)]
                    })}
                    placeholder="Longitud"
                    step="0.0001"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddPoint(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleSavePoint} className="flex-1">
                  Guardar Punto
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MappingPage; 