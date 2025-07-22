'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Importación dinámica del mapa para evitar problemas de SSR
const MapWithNoSSR = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="text-4xl mb-4">🗺️</div>
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  ),
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

interface ArchaeologicalMapProps {
  points: MapPoint[];
  onPointClick: (point: MapPoint) => void;
  onMapClick: (coordinates: [number, number]) => void;
  measurementMode: 'distance' | 'area' | 'bearing' | null;
  selectedGrid: string;
  onGridSelect: (gridId: string) => void;
}

const ArchaeologicalMap: React.FC<ArchaeologicalMapProps> = (props) => {
  return <MapWithNoSSR {...props} />;
};

export default ArchaeologicalMap; 