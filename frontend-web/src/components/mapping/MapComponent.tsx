'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPoint {
  id: string;
  name: string;
  type: 'site' | 'finding' | 'sample' | 'excavation';
  coordinates: [number, number];
  description: string;
  date: string;
  status: string;
}

interface GridCell {
  id: string;
  coordinates: [number, number][];
  center: [number, number];
  label: string;
  findings: MapPoint[];
}

interface MapComponentProps {
  points: MapPoint[];
  onPointClick: (point: MapPoint) => void;
  onMapClick: (coordinates: [number, number]) => void;
  measurementMode: 'distance' | 'area' | 'bearing' | null;
  selectedGrid: string;
  onGridSelect: (gridId: string) => void;
}

// Componente para manejar eventos del mapa
const MapEvents: React.FC<{
  onMapClick: (coordinates: [number, number]) => void;
  measurementMode: 'distance' | 'area' | 'bearing' | null;
}> = ({ onMapClick, measurementMode }) => {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onMapClick([lat, lng]);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);

  return null;
};

// Componente para la cuadrícula arqueológica
const ArchaeologicalGrid: React.FC<{
  gridCells: GridCell[];
  selectedGrid: string;
  onGridSelect: (gridId: string) => void;
}> = ({ gridCells, selectedGrid, onGridSelect }) => {
  return (
    <>
      {gridCells.map((cell) => (
        <Polygon
          key={cell.id}
          positions={cell.coordinates}
          pathOptions={{
            color: selectedGrid === cell.id ? '#ff4444' : '#666666',
            weight: selectedGrid === cell.id ? 3 : 1,
            fillColor: selectedGrid === cell.id ? '#ff6666' : '#ffffff',
            fillOpacity: selectedGrid === cell.id ? 0.3 : 0.1,
          }}
          eventHandlers={{
            click: () => onGridSelect(cell.id),
          }}
        >
          <Popup>
            <div>
              <h3 className="font-semibold">Cuadrícula {cell.label}</h3>
              <p className="text-sm text-gray-600">
                Hallazgos: {cell.findings.length}
              </p>
              {cell.findings.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Hallazgos:</h4>
                  <ul className="text-xs">
                    {cell.findings.map((finding) => (
                      <li key={finding.id} className="mt-1">
                        {finding.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Popup>
        </Polygon>
      ))}
    </>
  );
};

// Función para codificar SVG con caracteres Unicode
const encodeSVG = (svgString: string): string => {
  const encoded = encodeURIComponent(svgString).replace(/%([0-9A-F]{2})/g,
    (match, p1) => String.fromCharCode(parseInt(p1, 16))
  );
  return btoa(encoded);
};

// Iconos personalizados para diferentes tipos de hallazgos
const getCustomIcon = (type: string) => {
  const iconSize = [25, 25];
  const iconAnchor = [12, 12];
  
  let iconUrl = '';
  let color = '#3388ff';
  
  switch (type) {
    case 'site':
      iconUrl = 'data:image/svg+xml;base64,' + encodeSVG(`
        <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12.5" cy="12.5" r="10" fill="${color}" stroke="white" stroke-width="2"/>
          <text x="12.5" y="16" text-anchor="middle" fill="white" font-size="12">🏛️</text>
        </svg>
      `);
      break;
    case 'finding':
      iconUrl = 'data:image/svg+xml;base64,' + encodeSVG(`
        <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12.5" cy="12.5" r="10" fill="#ff6b6b" stroke="white" stroke-width="2"/>
          <text x="12.5" y="16" text-anchor="middle" fill="white" font-size="12">🏺</text>
        </svg>
      `);
      break;
    case 'sample':
      iconUrl = 'data:image/svg+xml;base64,' + encodeSVG(`
        <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12.5" cy="12.5" r="10" fill="#4ecdc4" stroke="white" stroke-width="2"/>
          <text x="12.5" y="16" text-anchor="middle" fill="white" font-size="12">🧪</text>
        </svg>
      `);
      break;
    case 'excavation':
      iconUrl = 'data:image/svg+xml;base64,' + encodeSVG(`
        <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12.5" cy="12.5" r="10" fill="#45b7d1" stroke="white" stroke-width="2"/>
          <text x="12.5" y="16" text-anchor="middle" fill="white" font-size="12">⛏️</text>
        </svg>
      `);
      break;
    default:
      iconUrl = 'data:image/svg+xml;base64,' + encodeSVG(`
        <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12.5" cy="12.5" r="10" fill="${color}" stroke="white" stroke-width="2"/>
          <text x="12.5" y="16" text-anchor="middle" fill="white" font-size="12">📍</text>
        </svg>
      `);
  }
  
  return new L.Icon({
    iconUrl,
    iconSize: iconSize as [number, number],
    iconAnchor: iconAnchor as [number, number],
    popupAnchor: [0, -12] as [number, number],
  });
};

const MapComponent: React.FC<MapComponentProps> = ({
  points,
  onPointClick,
  onMapClick,
  measurementMode,
  selectedGrid,
  onGridSelect,
}) => {
  const [gridCells, setGridCells] = useState<GridCell[]>([]);
  
  // Generar cuadrícula arqueológica
  useEffect(() => {
    const baseLat = -34.6037;
    const baseLng = -58.3816;
    const cellSize = 0.001; // Tamaño de cada celda en grados
    
    const cells: GridCell[] = [];
    const gridLabels = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
    
    gridLabels.forEach((label, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      const centerLat = baseLat + (row * cellSize) + (cellSize / 2);
      const centerLng = baseLng + (col * cellSize) + (cellSize / 2);
      
      const coordinates: [number, number][] = [
        [centerLat - cellSize/2, centerLng - cellSize/2],
        [centerLat - cellSize/2, centerLng + cellSize/2],
        [centerLat + cellSize/2, centerLng + cellSize/2],
        [centerLat + cellSize/2, centerLng - cellSize/2],
      ];
      
      // Encontrar hallazgos en esta cuadrícula
      const findings = points.filter(point => {
        const [lat, lng] = point.coordinates;
        return lat >= centerLat - cellSize/2 && 
               lat <= centerLat + cellSize/2 && 
               lng >= centerLng - cellSize/2 && 
               lng <= centerLng + cellSize/2;
      });
      
      cells.push({
        id: label,
        coordinates,
        center: [centerLat, centerLng],
        label,
        findings,
      });
    });
    
    setGridCells(cells);
  }, [points]);

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[-34.6037, -58.3816]}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Cuadrícula arqueológica */}
        <ArchaeologicalGrid
          gridCells={gridCells}
          selectedGrid={selectedGrid}
          onGridSelect={onGridSelect}
        />
        
        {/* Marcadores de puntos */}
        {points.map((point) => (
          <Marker
            key={point.id}
            position={point.coordinates}
            icon={getCustomIcon(point.type)}
            eventHandlers={{
              click: () => onPointClick(point),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg">{point.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{point.description}</p>
                <div className="text-xs text-gray-500">
                  <p><strong>Tipo:</strong> {point.type}</p>
                  <p><strong>Fecha:</strong> {point.date}</p>
                  <p><strong>Estado:</strong> {point.status}</p>
                  <p><strong>Coordenadas:</strong> {point.coordinates[0].toFixed(6)}, {point.coordinates[1].toFixed(6)}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Eventos del mapa */}
        <MapEvents
          onMapClick={onMapClick}
          measurementMode={measurementMode}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent; 