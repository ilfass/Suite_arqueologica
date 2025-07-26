'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Interfaces actualizadas para datos reales
interface ArchaeologicalSite {
  id: string;
  name: string;
  coordinates: [number, number];
  elevation: number;
  area: number;
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

interface ChronologicalData {
  id: string;
  period: string;
  startDate: number;
  endDate: number;
  culturalPhase: string;
  description: string;
  sites: string[];
  findings: string[];
  coordinates: [number, number][];
}

interface ContextualData {
  id: string;
  name: string;
  type: 'geographic' | 'cultural' | 'environmental';
  coordinates: [number, number][];
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

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  layers: MapLayer[];
  sites: ArchaeologicalSite[];
  findings: ArchaeologicalFinding[];
  chronology: ChronologicalData[];
  contextualData: ContextualData[];
  gridSystems: GridSystem[];
  measurements: Measurement[];
  measurementMode: 'distance' | 'area' | 'bearing' | 'elevation' | null;
  onMapClick: (coordinates: [number, number]) => void;
  mapView: 'satellite' | 'terrain' | 'hybrid';
}

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom,
  layers,
  sites,
  findings,
  chronology,
  contextualData,
  gridSystems,
  measurements,
  measurementMode,
  onMapClick,
  mapView
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);

  // Configurar iconos personalizados para Leaflet
  useEffect(() => {
    // Eliminar iconos por defecto de Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Crear mapa
      const map = L.map(mapRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false
      });

      // Agregar control de zoom
      L.control.zoom({
        position: 'topright'
      }).addTo(map);

      // Configurar capa base según el tipo de vista
      let baseLayer: L.TileLayer;
      
      switch (mapView) {
        case 'satellite':
          baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          });
          break;
        case 'terrain':
          baseLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          });
          break;
        default: // hybrid
          baseLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            attribution: '&copy; Google Maps',
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
          });
          break;
      }

      baseLayer.addTo(map);

      // Manejar clics en el mapa
      map.on('click', (e) => {
        onMapClick([e.latlng.lat, e.latlng.lng]);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, mapView, onMapClick]);

  // Actualizar capas cuando cambien los datos
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Limpiar capas existentes (excepto la capa base)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon || layer instanceof L.Polyline || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Agregar sitios arqueológicos
    const sitesLayer = layers.find(l => l.type === 'sites' && l.visible);
    if (sitesLayer) {
      sites.forEach(site => {
        const marker = L.marker(site.coordinates, {
          icon: L.divIcon({
            className: 'custom-marker site-marker',
            html: '🏛️',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          })
        });

        const popupContent = `
          <div class="site-popup">
            <h3><strong>${site.name}</strong></h3>
            <p><strong>Tipo:</strong> ${site.siteType}</p>
            <p><strong>Período:</strong> ${site.period}</p>
            <p><strong>Afiliación Cultural:</strong> ${site.culturalAffiliation}</p>
            <p><strong>Elevación:</strong> ${site.elevation}m</p>
            <p><strong>Área:</strong> ${site.area}m²</p>
            <p><strong>Estado:</strong> ${site.preservationStatus}</p>
            <p><strong>Excavación:</strong> ${site.excavationStatus}</p>
            <p><strong>Descripción:</strong> ${site.description}</p>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(map);
      });
    }

    // Agregar hallazgos
    const findingsLayer = layers.find(l => l.type === 'findings' && l.visible);
    if (findingsLayer) {
      findings.forEach(finding => {
        const getFindingIcon = (type: string) => {
          switch (type) {
            case 'artifact': return '🔍';
            case 'feature': return '🏗️';
            case 'ecofact': return '🌿';
            case 'structure': return '🏛️';
            default: return '📍';
          }
        };

        const marker = L.marker(finding.coordinates, {
          icon: L.divIcon({
            className: 'custom-marker finding-marker',
            html: getFindingIcon(finding.type),
            iconSize: [25, 25],
            iconAnchor: [12, 25]
          })
        });

        const popupContent = `
          <div class="finding-popup">
            <h3><strong>${finding.name}</strong></h3>
            <p><strong>Tipo:</strong> ${finding.type}</p>
            <p><strong>Material:</strong> ${finding.material}</p>
            <p><strong>Período:</strong> ${finding.period}</p>
            <p><strong>Profundidad:</strong> ${finding.depth}m</p>
            <p><strong>Condición:</strong> ${finding.condition}</p>
            <p><strong>Catálogo:</strong> ${finding.catalogNumber}</p>
            <p><strong>Contexto:</strong> ${finding.context}</p>
            <p><strong>Descripción:</strong> ${finding.description}</p>
            ${finding.dimensions.length ? `<p><strong>Dimensiones:</strong> ${finding.dimensions.length}cm x ${finding.dimensions.width}cm x ${finding.dimensions.height}cm</p>` : ''}
            ${finding.weight ? `<p><strong>Peso:</strong> ${finding.weight}g</p>` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(map);
      });
    }

    // Agregar áreas cronológicas
    const chronologyLayer = layers.find(l => l.type === 'chronology' && l.visible);
    if (chronologyLayer) {
      chronology.forEach(chron => {
        if (chron.coordinates.length >= 3) {
          const polygon = L.polygon(chron.coordinates, {
            color: '#45B7D1',
            fillColor: '#45B7D1',
            fillOpacity: 0.3,
            weight: 2
          });

          const popupContent = `
            <div class="chronology-popup">
              <h3><strong>${chron.period}</strong></h3>
              <p><strong>Fase Cultural:</strong> ${chron.culturalPhase}</p>
              <p><strong>Rango Temporal:</strong> ${chron.startDate} - ${chron.endDate} AP</p>
              <p><strong>Descripción:</strong> ${chron.description}</p>
            </div>
          `;

          polygon.bindPopup(popupContent);
          polygon.addTo(map);
        }
      });
    }

    // Agregar contextos geográficos
    const contextLayer = layers.find(l => l.type === 'context' && l.visible);
    if (contextLayer) {
      contextualData.forEach(context => {
        if (context.coordinates.length >= 3) {
          const polygon = L.polygon(context.coordinates, {
            color: '#96CEB4',
            fillColor: '#96CEB4',
            fillOpacity: 0.2,
            weight: 2
          });

          const popupContent = `
            <div class="context-popup">
              <h3><strong>${context.name}</strong></h3>
              <p><strong>Tipo:</strong> ${context.type}</p>
              <p><strong>Descripción:</strong> ${context.description}</p>
              <p><strong>Características:</strong> ${context.characteristics.join(', ')}</p>
              <p><strong>Clima:</strong> ${context.environmentalData.climate}</p>
              <p><strong>Vegetación:</strong> ${context.environmentalData.vegetation}</p>
              <p><strong>Elevación:</strong> ${context.environmentalData.elevation}m</p>
            </div>
          `;

          polygon.bindPopup(popupContent);
          polygon.addTo(map);
        }
      });
    }

    // Agregar cuadrículas de excavación
    const gridLayer = layers.find(l => l.type === 'grid' && l.visible);
    if (gridLayer) {
      gridSystems.forEach(grid => {
        if (grid.active) {
          grid.cells.forEach(cell => {
            const polygon = L.polygon(cell.coordinates, {
              color: '#FFEAA7',
              fillColor: cell.excavated ? '#FF6B35' : '#FFEAA7',
              fillOpacity: cell.excavated ? 0.4 : 0.2,
              weight: 1
            });

            const popupContent = `
              <div class="grid-popup">
                <h3><strong>Cuadrícula ${cell.label}</strong></h3>
                <p><strong>Estado:</strong> ${cell.excavated ? 'Excavada' : 'No excavada'}</p>
                <p><strong>Profundidad:</strong> ${cell.depth}m</p>
                <p><strong>Hallazgos:</strong> ${cell.findings.length}</p>
                ${cell.findings.length > 0 ? `<p><strong>Hallazgos:</strong> ${cell.findings.map(f => f.name).join(', ')}</p>` : ''}
              </div>
            `;

            polygon.bindPopup(popupContent);
            polygon.addTo(map);

            // Agregar etiqueta de la cuadrícula
            const label = L.divIcon({
              className: 'grid-label',
              html: cell.label,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            L.marker(cell.center, { icon: label }).addTo(map);
          });
        }
      });
    }

    // Agregar mediciones
    measurements.forEach(measurement => {
      if (measurement.type === 'distance' && measurement.points.length === 2) {
        const polyline = L.polyline(measurement.points, {
          color: '#FF4757',
          weight: 3,
          dashArray: '5, 5'
        });

        const popupContent = `
          <div class="measurement-popup">
            <h3><strong>Medición de Distancia</strong></h3>
            <p><strong>Valor:</strong> ${measurement.value.toFixed(2)} ${measurement.unit}</p>
            <p><strong>Descripción:</strong> ${measurement.description}</p>
            <p><strong>Fecha:</strong> ${new Date(measurement.date).toLocaleDateString()}</p>
          </div>
        `;

        polyline.bindPopup(popupContent);
        polyline.addTo(map);
      } else if (measurement.type === 'area' && measurement.points.length >= 3) {
        const polygon = L.polygon(measurement.points, {
          color: '#2ED573',
          fillColor: '#2ED573',
          fillOpacity: 0.3,
          weight: 2
        });

        const popupContent = `
          <div class="measurement-popup">
            <h3><strong>Medición de Área</strong></h3>
            <p><strong>Valor:</strong> ${measurement.value.toFixed(2)} ${measurement.unit}</p>
            <p><strong>Descripción:</strong> ${measurement.description}</p>
            <p><strong>Fecha:</strong> ${new Date(measurement.date).toLocaleDateString()}</p>
          </div>
        `;

        polygon.bindPopup(popupContent);
        polygon.addTo(map);
      }
    });

  }, [layers, sites, findings, chronology, contextualData, gridSystems, measurements]);

  // Actualizar centro del mapa
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
      setMapCenter(center);
    }
  }, [center, zoom]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '600px' }}
    />
  );
};

export default MapComponent; 