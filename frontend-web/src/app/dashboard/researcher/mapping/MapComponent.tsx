'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Función para calcular el área de un polígono usando la fórmula de Gauss
const calculatePolygonArea = (points: L.LatLng[]): number => {
  if (points.length < 3) return 0;
  
  let area = 0;
  const R = 6371000; // Radio de la Tierra en metros
  
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const lat1 = points[i].lat * Math.PI / 180;
    const lat2 = points[j].lat * Math.PI / 180;
    const dLon = (points[j].lng - points[i].lng) * Math.PI / 180;
    
    area += Math.atan2(
      Math.sin(dLon) * Math.cos(lat2),
      Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
    );
  }
  
  area = Math.abs(area * R * R);
  return area;
};
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

interface Finding {
  id: string;
  type: 'ceramic' | 'lithic' | 'bone' | 'metal' | 'other';
  coordinates: [number, number];
  depth: number;
  description: string;
  date_found: string;
  catalog_number?: string;
}

interface Measurement {
  id: string;
  type: 'distance' | 'area' | 'point';
  coordinates: [number, number][];
  value: number;
  unit: string;
  label: string;
}

interface MapComponentProps {
  layers: MapLayer[];
  gridUnits: GridUnit[];
  findings: Finding[];
  measurements: Measurement[];
  center: [number, number];
  zoom: number;
  selectedTool: string;
  onMapChange: (center: [number, number], zoom: number) => void;
  onFindingSelect: (finding: Finding | null) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  layers,
  gridUnits,
  findings,
  measurements,
  center,
  zoom,
  selectedTool,
  onMapChange,
  onFindingSelect
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [measurementLayer, setMeasurementLayer] = useState<L.LayerGroup | null>(null);
  const [drawingLayer, setDrawingLayer] = useState<L.LayerGroup | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<L.LatLng[]>([]);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Crear el mapa
      const mapInstance = L.map(mapRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false
      });

      // Agregar capa base de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      // Agregar capa de satélite
      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri'
      });

      // Crear capas de control
      const baseMaps = {
        "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
        "Satélite": satelliteLayer
      };

      L.control.layers(baseMaps).addTo(mapInstance);

      // Crear capas para mediciones y dibujo
      const measurementLayerGroup = L.layerGroup().addTo(mapInstance);
      const drawingLayerGroup = L.layerGroup().addTo(mapInstance);

      setMeasurementLayer(measurementLayerGroup);
      setDrawingLayer(drawingLayerGroup);
      setMap(mapInstance);
      mapInstanceRef.current = mapInstance;

      // Eventos del mapa
      mapInstance.on('moveend', () => {
        const center = mapInstance.getCenter();
        const zoom = mapInstance.getZoom();
        onMapChange([center.lat, center.lng], zoom);
      });

      // Agregar controles de zoom
      L.control.zoom({
        position: 'topright'
      }).addTo(mapInstance);

      // Agregar escala
      L.control.scale({
        position: 'bottomleft'
      }).addTo(mapInstance);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Actualizar capas cuando cambien
  useEffect(() => {
    if (!map) return;

    // Limpiar capas existentes
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Agregar cuadrículas
    gridUnits.forEach((unit) => {
      const bounds: L.LatLngBoundsLiteral = [
        [unit.coordinates.south, unit.coordinates.west],
        [unit.coordinates.north, unit.coordinates.east]
      ];

      const getStatusColor = (status: string) => {
        switch (status) {
          case 'completed': return '#8B5CF6';
          case 'active': return '#10B981';
          case 'planned': return '#3B82F6';
          default: return '#6B7280';
        }
      };

      const rectangle = L.rectangle(bounds, {
        color: getStatusColor(unit.status),
        weight: 2,
        fillOpacity: 0.3
      }).addTo(map);

      // Agregar popup con información
      rectangle.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-lg">${unit.code}</h3>
          <p class="text-sm"><strong>Estado:</strong> ${unit.status}</p>
          <p class="text-sm"><strong>Hallazgos:</strong> ${unit.findings_count}</p>
          <p class="text-sm"><strong>Profundidad:</strong> ${unit.depth}m</p>
          <p class="text-sm"><strong>Área:</strong> ${unit.area}m²</p>
          ${unit.notes ? `<p class="text-sm"><strong>Notas:</strong> ${unit.notes}</p>` : ''}
        </div>
      `);
    });

    // Agregar hallazgos
    findings.forEach((finding) => {
      const getFindingColor = (type: string) => {
        switch (type) {
          case 'ceramic': return '#EF4444';
          case 'lithic': return '#3B82F6';
          case 'bone': return '#10B981';
          case 'metal': return '#8B5CF6';
          default: return '#6B7280';
        }
      };

      const getFindingIcon = (type: string) => {
        const color = getFindingColor(type);
        return L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });
      };

      const marker = L.marker(finding.coordinates, {
        icon: getFindingIcon(finding.type)
      }).addTo(map);

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-lg capitalize">${finding.type}</h3>
          <p class="text-sm">${finding.description}</p>
          <p class="text-sm"><strong>Profundidad:</strong> ${finding.depth}m</p>
          <p class="text-sm"><strong>Fecha:</strong> ${finding.date_found}</p>
          ${finding.catalog_number ? `<p class="text-sm"><strong>Catálogo:</strong> ${finding.catalog_number}</p>` : ''}
        </div>
      `);

      marker.on('click', () => {
        onFindingSelect(finding);
      });
    });

    // Agregar mediciones
    if (measurementLayer) {
      measurementLayer.clearLayers();
      
      measurements.forEach((measurement) => {
        if (measurement.type === 'distance' && measurement.coordinates.length >= 2) {
          const polyline = L.polyline(measurement.coordinates, {
            color: '#FF6B6B',
            weight: 3,
            dashArray: '5, 10'
          }).addTo(measurementLayer);

          polyline.bindPopup(`
            <div class="p-2">
              <h3 class="font-bold">${measurement.label}</h3>
              <p class="text-sm">${measurement.value} ${measurement.unit}</p>
            </div>
          `);
        } else if (measurement.type === 'area' && measurement.coordinates.length >= 3) {
          const polygon = L.polygon(measurement.coordinates, {
            color: '#4ECDC4',
            weight: 2,
            fillOpacity: 0.3
          }).addTo(measurementLayer);

          polygon.bindPopup(`
            <div class="p-2">
              <h3 class="font-bold">${measurement.label}</h3>
              <p class="text-sm">${measurement.value} ${measurement.unit}</p>
            </div>
          `);
        }
      });
    }
  }, [map, gridUnits, findings, measurements, measurementLayer]);

  // Manejar herramientas de medición
  useEffect(() => {
    if (!map || !drawingLayer) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!selectedTool) return;

      if (selectedTool === 'point') {
        const marker = L.marker(e.latlng).addTo(drawingLayer);
        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">Punto marcado</h3>
            <p class="text-sm">Lat: ${e.latlng.lat.toFixed(6)}</p>
            <p class="text-sm">Lng: ${e.latlng.lng.toFixed(6)}</p>
          </div>
        `);
      } else if (selectedTool === 'measure' || selectedTool === 'area') {
        setDrawingPoints([...drawingPoints, e.latlng]);
        
        if (drawingPoints.length > 0) {
          const lastPoint = drawingPoints[drawingPoints.length - 1];
          const polyline = L.polyline([lastPoint, e.latlng], {
            color: '#FF6B6B',
            weight: 2,
            dashArray: '5, 5'
          }).addTo(drawingLayer);
        }

        const marker = L.marker(e.latlng, {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #FF6B6B; width: 8px; height: 8px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [8, 8],
            iconAnchor: [4, 4]
          })
        }).addTo(drawingLayer);
      }
    };

    const handleMapDoubleClick = () => {
      if (selectedTool === 'measure' && drawingPoints.length >= 2) {
        // Calcular distancia
        let totalDistance = 0;
        for (let i = 1; i < drawingPoints.length; i++) {
          totalDistance += drawingPoints[i-1].distanceTo(drawingPoints[i]);
        }
        
        const polyline = L.polyline(drawingPoints, {
          color: '#FF6B6B',
          weight: 3
        }).addTo(drawingLayer);

        polyline.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">Distancia medida</h3>
            <p class="text-sm">${totalDistance.toFixed(2)} metros</p>
          </div>
        `);

        setDrawingPoints([]);
      } else if (selectedTool === 'area' && drawingPoints.length >= 3) {
        // Calcular área
        const polygon = L.polygon(drawingPoints, {
          color: '#4ECDC4',
          weight: 2,
          fillOpacity: 0.3
        }).addTo(drawingLayer);

        // Calcular área usando la fórmula de Gauss
        const area = calculatePolygonArea(drawingPoints);
        
        polygon.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">Área calculada</h3>
            <p class="text-sm">${(area / 10000).toFixed(2)} hectáreas</p>
            <p class="text-sm">${area.toFixed(2)} m²</p>
          </div>
        `);

        setDrawingPoints([]);
      }
    };

    if (selectedTool) {
      map.on('click', handleMapClick);
      map.on('dblclick', handleMapDoubleClick);
      
      // Cambiar cursor
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.off('click', handleMapClick);
      map.off('dblclick', handleMapDoubleClick);
      map.getContainer().style.cursor = '';
      
      // Limpiar dibujo en progreso
      if (drawingLayer) {
        drawingLayer.clearLayers();
      }
      setDrawingPoints([]);
    }

    return () => {
      map.off('click', handleMapClick);
      map.off('dblclick', handleMapDoubleClick);
    };
  }, [map, selectedTool, drawingLayer]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-300"
        style={{ zIndex: 1 }}
      />
      
      {/* Leyenda */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 text-xs shadow-lg">
        <h4 className="font-bold mb-2">Leyenda</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Cerámica</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Lítico</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Óseo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Metal</span>
          </div>
          <hr className="my-1" />
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-purple-500 bg-purple-500 bg-opacity-30"></div>
            <span>Completada</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-green-500 bg-green-500 bg-opacity-30"></div>
            <span>Activa</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 bg-blue-500 bg-opacity-30"></div>
            <span>Planificada</span>
          </div>
        </div>
      </div>

      {/* Instrucciones de herramientas */}
      {selectedTool && (
        <div className="absolute top-4 left-4 bg-blue-600 text-white rounded-lg p-3 text-sm shadow-lg max-w-xs">
          <h4 className="font-bold mb-1">Instrucciones:</h4>
          {selectedTool === 'measure' && (
            <p>Haz clic para marcar puntos. Doble clic para finalizar y calcular la distancia.</p>
          )}
          {selectedTool === 'area' && (
            <p>Haz clic para marcar vértices. Doble clic para finalizar y calcular el área.</p>
          )}
          {selectedTool === 'point' && (
            <p>Haz clic en el mapa para agregar un punto de referencia.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MapComponent; 