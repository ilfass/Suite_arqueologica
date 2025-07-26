'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

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

interface ArchaeologicalMapProps {
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

const ArchaeologicalMap = dynamic(
  () => import('./MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa arqueológico...</p>
        </div>
      </div>
    )
  }
) as React.FC<ArchaeologicalMapProps>;

export default ArchaeologicalMap; 