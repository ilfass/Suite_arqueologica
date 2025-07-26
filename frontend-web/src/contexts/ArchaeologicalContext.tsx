'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  ArchaeologicalProject,
  ArchaeologicalArea,
  ArchaeologicalSite,
  FieldworkSession,
  ArchaeologicalFinding,
  ArchaeologicalSample,
  LaboratoryAnalysis,
  ChronologicalData,
  ArchaeologicalContext as ArchContext,
  FormContext
} from '../types/archaeological';

// ============================================================================
// TIPOS DE ACCIONES DEL REDUCER
// ============================================================================

type ArchaeologicalAction =
  | { type: 'SET_PROJECTS'; payload: ArchaeologicalProject[] }
  | { type: 'ADD_PROJECT'; payload: ArchaeologicalProject }
  | { type: 'UPDATE_PROJECT'; payload: ArchaeologicalProject }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_AREAS'; payload: ArchaeologicalArea[] }
  | { type: 'ADD_AREA'; payload: ArchaeologicalArea }
  | { type: 'UPDATE_AREA'; payload: ArchaeologicalArea }
  | { type: 'DELETE_AREA'; payload: string }
  | { type: 'SET_SITES'; payload: ArchaeologicalSite[] }
  | { type: 'ADD_SITE'; payload: ArchaeologicalSite }
  | { type: 'UPDATE_SITE'; payload: ArchaeologicalSite }
  | { type: 'DELETE_SITE'; payload: string }
  | { type: 'SET_FIELDWORK_SESSIONS'; payload: FieldworkSession[] }
  | { type: 'ADD_FIELDWORK_SESSION'; payload: FieldworkSession }
  | { type: 'UPDATE_FIELDWORK_SESSION'; payload: FieldworkSession }
  | { type: 'DELETE_FIELDWORK_SESSION'; payload: string }
  | { type: 'SET_FINDINGS'; payload: ArchaeologicalFinding[] }
  | { type: 'ADD_FINDING'; payload: ArchaeologicalFinding }
  | { type: 'UPDATE_FINDING'; payload: ArchaeologicalFinding }
  | { type: 'DELETE_FINDING'; payload: string }
  | { type: 'SET_SAMPLES'; payload: ArchaeologicalSample[] }
  | { type: 'ADD_SAMPLE'; payload: ArchaeologicalSample }
  | { type: 'UPDATE_SAMPLE'; payload: ArchaeologicalSample }
  | { type: 'DELETE_SAMPLE'; payload: string }
  | { type: 'SET_LABORATORY_ANALYSES'; payload: LaboratoryAnalysis[] }
  | { type: 'ADD_LABORATORY_ANALYSIS'; payload: LaboratoryAnalysis }
  | { type: 'UPDATE_LABORATORY_ANALYSIS'; payload: LaboratoryAnalysis }
  | { type: 'DELETE_LABORATORY_ANALYSIS'; payload: string }
  | { type: 'SET_CHRONOLOGICAL_DATA'; payload: ChronologicalData[] }
  | { type: 'ADD_CHRONOLOGICAL_DATA'; payload: ChronologicalData }
  | { type: 'UPDATE_CHRONOLOGICAL_DATA'; payload: ChronologicalData }
  | { type: 'DELETE_CHRONOLOGICAL_DATA'; payload: string }
  | { type: 'SET_CURRENT_CONTEXT'; payload: ArchContext }
  | { type: 'CLEAR_CURRENT_CONTEXT' }
  | { type: 'LOAD_MOCK_DATA' };

// ============================================================================
// ESTADO INICIAL
// ============================================================================

interface ArchaeologicalState {
  projects: ArchaeologicalProject[];
  areas: ArchaeologicalArea[];
  sites: ArchaeologicalSite[];
  fieldworkSessions: FieldworkSession[];
  findings: ArchaeologicalFinding[];
  samples: ArchaeologicalSample[];
  laboratoryAnalyses: LaboratoryAnalysis[];
  chronologicalData: ChronologicalData[];
  currentContext: ArchContext | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ArchaeologicalState = {
  projects: [],
  areas: [],
  sites: [],
  fieldworkSessions: [],
  findings: [],
  samples: [],
  laboratoryAnalyses: [],
  chronologicalData: [],
  currentContext: null,
  isLoading: false,
  error: null
};

// ============================================================================
// REDUCER
// ============================================================================

function archaeologicalReducer(state: ArchaeologicalState, action: ArchaeologicalAction): ArchaeologicalState {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        areas: state.areas.filter(a => a.projectId !== action.payload),
        sites: state.sites.filter(s => s.projectId !== action.payload),
        fieldworkSessions: state.fieldworkSessions.filter(f => f.projectId !== action.payload),
        findings: state.findings.filter(f => f.projectId !== action.payload),
        samples: state.samples.filter(s => s.projectId !== action.payload),
        laboratoryAnalyses: state.laboratoryAnalyses.filter(l => l.projectId !== action.payload),
        chronologicalData: state.chronologicalData.filter(c => c.projectId !== action.payload)
      };
    case 'SET_AREAS':
      return { ...state, areas: action.payload };
    case 'ADD_AREA':
      return { ...state, areas: [...state.areas, action.payload] };
    case 'UPDATE_AREA':
      return {
        ...state,
        areas: state.areas.map(a => a.id === action.payload.id ? action.payload : a)
      };
    case 'DELETE_AREA':
      return {
        ...state,
        areas: state.areas.filter(a => a.id !== action.payload),
        sites: state.sites.filter(s => s.areaId !== action.payload),
        fieldworkSessions: state.fieldworkSessions.filter(f => f.areaId !== action.payload),
        findings: state.findings.filter(f => f.areaId !== action.payload),
        samples: state.samples.filter(s => s.areaId !== action.payload)
      };
    case 'SET_SITES':
      return { ...state, sites: action.payload };
    case 'ADD_SITE':
      return { ...state, sites: [...state.sites, action.payload] };
    case 'UPDATE_SITE':
      return {
        ...state,
        sites: state.sites.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_SITE':
      return {
        ...state,
        sites: state.sites.filter(s => s.id !== action.payload),
        fieldworkSessions: state.fieldworkSessions.filter(f => f.siteId !== action.payload),
        findings: state.findings.filter(f => f.siteId !== action.payload),
        samples: state.samples.filter(s => s.siteId !== action.payload)
      };
    case 'SET_FIELDWORK_SESSIONS':
      return { ...state, fieldworkSessions: action.payload };
    case 'ADD_FIELDWORK_SESSION':
      return { ...state, fieldworkSessions: [...state.fieldworkSessions, action.payload] };
    case 'UPDATE_FIELDWORK_SESSION':
      return {
        ...state,
        fieldworkSessions: state.fieldworkSessions.map(f => f.id === action.payload.id ? action.payload : f)
      };
    case 'DELETE_FIELDWORK_SESSION':
      return {
        ...state,
        fieldworkSessions: state.fieldworkSessions.filter(f => f.id !== action.payload),
        findings: state.findings.filter(f => f.fieldworkSessionId !== action.payload),
        samples: state.samples.filter(s => s.fieldworkSessionId !== action.payload)
      };
    case 'SET_FINDINGS':
      return { ...state, findings: action.payload };
    case 'ADD_FINDING':
      return { ...state, findings: [...state.findings, action.payload] };
    case 'UPDATE_FINDING':
      return {
        ...state,
        findings: state.findings.map(f => f.id === action.payload.id ? action.payload : f)
      };
    case 'DELETE_FINDING':
      return { ...state, findings: state.findings.filter(f => f.id !== action.payload) };
    case 'SET_SAMPLES':
      return { ...state, samples: action.payload };
    case 'ADD_SAMPLE':
      return { ...state, samples: [...state.samples, action.payload] };
    case 'UPDATE_SAMPLE':
      return {
        ...state,
        samples: state.samples.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_SAMPLE':
      return { ...state, samples: state.samples.filter(s => s.id !== action.payload) };
    case 'SET_LABORATORY_ANALYSES':
      return { ...state, laboratoryAnalyses: action.payload };
    case 'ADD_LABORATORY_ANALYSIS':
      return { ...state, laboratoryAnalyses: [...state.laboratoryAnalyses, action.payload] };
    case 'UPDATE_LABORATORY_ANALYSIS':
      return {
        ...state,
        laboratoryAnalyses: state.laboratoryAnalyses.map(l => l.id === action.payload.id ? action.payload : l)
      };
    case 'DELETE_LABORATORY_ANALYSIS':
      return { ...state, laboratoryAnalyses: state.laboratoryAnalyses.filter(l => l.id !== action.payload) };
    case 'SET_CHRONOLOGICAL_DATA':
      return { ...state, chronologicalData: action.payload };
    case 'ADD_CHRONOLOGICAL_DATA':
      return { ...state, chronologicalData: [...state.chronologicalData, action.payload] };
    case 'UPDATE_CHRONOLOGICAL_DATA':
      return {
        ...state,
        chronologicalData: state.chronologicalData.map(c => c.id === action.payload.id ? action.payload : c)
      };
    case 'DELETE_CHRONOLOGICAL_DATA':
      return { ...state, chronologicalData: state.chronologicalData.filter(c => c.id !== action.payload) };
    case 'SET_CURRENT_CONTEXT':
      return { ...state, currentContext: action.payload };
    case 'CLEAR_CURRENT_CONTEXT':
      return { ...state, currentContext: null };
    case 'LOAD_MOCK_DATA':
      return {
        ...state,
        projects: generateMockProjects(),
        areas: generateMockAreas(),
        sites: generateMockSites(),
        fieldworkSessions: generateMockFieldworkSessions(),
        findings: generateMockFindings(),
        samples: generateMockSamples(),
        laboratoryAnalyses: generateMockLaboratoryAnalyses(),
        chronologicalData: generateMockChronologicalData()
      };
    default:
      return state;
  }
}

// ============================================================================
// GENERACIÓN DE DATOS MOCK
// ============================================================================

function generateMockProjects(): ArchaeologicalProject[] {
  return [
    {
      id: 'proj-001',
      name: 'Proyecto Cazadores Recolectores - La Laguna',
      description: 'Investigación arqueológica de cazadores-recolectores del Holoceno tardío en la región pampeana',
      institution: 'Universidad Nacional de La Plata',
      principalInvestigator: 'Dr. María González',
      startDate: '2024-01-15',
      endDate: '2026-12-31',
      budget: 150000,
      currency: 'ARS',
      objectives: ['Documentar patrones de asentamiento', 'Analizar tecnología lítica', 'Estudiar dieta y subsistencia'],
      projectType: 'Investigación',
      status: 'active',
      areas: ['area-001', 'area-002'],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: 'proj-002',
      name: 'Estudio de Poblamiento Pampeano',
      description: 'Investigación sobre patrones de asentamiento en la llanura pampeana',
      institution: 'CONICET - Universidad de Buenos Aires',
      principalInvestigator: 'Dr. Carlos López',
      startDate: '2024-03-01',
      endDate: '2025-12-31',
      budget: 200000,
      currency: 'ARS',
      objectives: ['Estudiar patrones de asentamiento', 'Analizar cronología', 'Documentar tecnología'],
      projectType: 'Investigación',
      status: 'active',
      areas: ['area-003'],
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z'
    },
    {
      id: 'proj-003',
      name: 'Arqueología de la Llanura Bonaerense',
      description: 'Análisis de sitios costeros y de interior en la provincia de Buenos Aires',
      institution: 'Universidad Nacional del Sur',
      principalInvestigator: 'Dra. Ana Martínez',
      startDate: '2025-01-01',
      endDate: '2027-12-31',
      budget: 180000,
      currency: 'ARS',
      objectives: ['Documentar sitios costeros', 'Analizar adaptaciones', 'Estudiar cronología'],
      projectType: 'Investigación',
      status: 'planned',
      areas: ['area-004'],
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z'
    },
    {
      id: 'proj-004',
      name: 'Arqueología Prehispánica del Valle del Cauca - Colombia',
      description: 'Investigación de asentamientos prehispánicos en el Valle del Cauca',
      institution: 'Universidad del Valle',
      principalInvestigator: 'Dr. Roberto Silva',
      startDate: '2024-06-01',
      endDate: '2026-05-31',
      budget: 500000,
      currency: 'COP',
      objectives: ['Documentar asentamientos prehispánicos', 'Analizar patrones de ocupación', 'Estudiar cronología'],
      projectType: 'Investigación',
      status: 'active',
      areas: ['area-005', 'area-006'],
      createdAt: '2024-06-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z'
    },
    {
      id: 'proj-005',
      name: 'Sitios Arqueológicos del Desierto de Atacama - Chile',
      description: 'Estudio de ocupaciones humanas en el desierto más árido del mundo',
      institution: 'Universidad de Chile',
      principalInvestigator: 'Dra. Carmen Ruiz',
      startDate: '2024-02-15',
      endDate: '2025-08-15',
      budget: 300000,
      currency: 'CLP',
      objectives: ['Documentar geoglifos', 'Estudiar ocupaciones prehispánicas', 'Analizar adaptaciones'],
      projectType: 'Investigación',
      status: 'active',
      areas: ['area-007', 'area-008'],
      createdAt: '2024-02-15T00:00:00Z',
      updatedAt: '2024-02-15T00:00:00Z'
    },
    {
      id: 'proj-006',
      name: 'Arqueología Medieval de Castilla y León - España',
      description: 'Investigación de asentamientos medievales en la región castellana',
      institution: 'Universidad de Valladolid',
      principalInvestigator: 'Dr. Juan Pérez',
      startDate: '2025-03-01',
      endDate: '2027-02-28',
      budget: 400000,
      currency: 'EUR',
      objectives: ['Documentar fortificaciones medievales', 'Estudiar patrones de asentamiento', 'Analizar cronología'],
      projectType: 'Investigación',
      status: 'planned',
      areas: ['area-009', 'area-010'],
      createdAt: '2024-11-01T00:00:00Z',
      updatedAt: '2024-11-01T00:00:00Z'
    }
  ];
}

function generateMockAreas(): ArchaeologicalArea[] {
  return [
    {
      id: 'area-001',
      name: 'Laguna La Brava',
      description: 'Área de laguna con recursos hídricos y faunísticos abundantes',
      coordinates: [[-38.1234, -61.5678], [-38.1200, -61.5650]],
      characteristics: ['Recursos hídricos', 'Vegetación ribereña', 'Fauna acuática'],
      climate: 'Templado húmedo',
      vegetation: 'Pastizales y vegetación ribereña',
      waterSources: ['Laguna La Brava', 'Arroyo secundario'],
      elevation: 150,
      accessibility: 'Accesible por camino de tierra',
      culturalContext: 'Área de cazadores-recolectores pampeanos',
      projectId: 'proj-001',
      sites: ['site-001'],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: 'area-002',
      name: 'Arroyo Seco',
      description: 'Zona de cauces antiguos con hallazgos líticos',
      coordinates: [[-38.2345, -61.6789], [-38.2300, -61.6750]],
      characteristics: ['Cauces antiguos', 'Depósitos aluviales', 'Hallazgos líticos'],
      climate: 'Templado seco',
      vegetation: 'Pastizales y arbustos',
      waterSources: ['Arroyo Seco', 'Napa freática'],
      elevation: 120,
      accessibility: 'Accesible por camino rural',
      culturalContext: 'Área de cazadores-recolectores',
      projectId: 'proj-001',
      sites: ['site-002'],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: 'area-003',
      name: 'Monte Hermoso',
      description: 'Sitio costero con ocupaciones múltiples',
      coordinates: [[-38.3456, -61.7890], [-38.3400, -61.7850]],
      characteristics: ['Costa atlántica', 'Dunas costeras', 'Ocupaciones múltiples'],
      climate: 'Templado marítimo',
      vegetation: 'Vegetación costera',
      waterSources: ['Océano Atlántico', 'Arroyos costeros'],
      elevation: 10,
      accessibility: 'Accesible por ruta costera',
      culturalContext: 'Área de ocupaciones costeras',
      projectId: 'proj-002',
      sites: ['site-003'],
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z'
    },
    {
      id: 'area-004',
      name: 'Costa Bonaerense',
      description: 'Sector costero de la provincia de Buenos Aires',
      coordinates: [[-38.4567, -61.8901], [-38.4500, -61.8850]],
      characteristics: ['Costa atlántica', 'Acantilados', 'Sitios costeros'],
      climate: 'Templado marítimo',
      vegetation: 'Vegetación costera y dunas',
      waterSources: ['Océano Atlántico', 'Lagunas costeras'],
      elevation: 5,
      accessibility: 'Accesible por ruta costera',
      culturalContext: 'Área de adaptaciones costeras',
      projectId: 'proj-003',
      sites: ['site-004'],
      createdAt: '2024-12-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z'
    },
    {
      id: 'area-005',
      name: 'Valle del Cauca Central',
      description: 'Zona central del valle con asentamientos prehispánicos',
      coordinates: [[3.4372, -76.5225], [3.4400, -76.5200]],
      characteristics: ['Valle interandino', 'Fertilidad agrícola', 'Asentamientos prehispánicos'],
      climate: 'Tropical húmedo',
      vegetation: 'Bosque tropical y cultivos',
      waterSources: ['Río Cauca', 'Afluentes menores'],
      elevation: 1000,
      accessibility: 'Accesible por carretera',
      culturalContext: 'Área de asentamientos prehispánicos',
      projectId: 'proj-004',
      sites: ['site-005'],
      createdAt: '2024-06-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z'
    },
    {
      id: 'area-006',
      name: 'Cordillera Occidental',
      description: 'Sector montañoso con sitios de altura',
      coordinates: [[3.5234, -76.6789], [3.5200, -76.6750]],
      characteristics: ['Cordillera andina', 'Sitios de altura', 'Geoglifos'],
      climate: 'Templado de montaña',
      vegetation: 'Páramo y bosque andino',
      waterSources: ['Ríos de montaña', 'Lagunas glaciares'],
      elevation: 3000,
      accessibility: 'Accesible por caminos de montaña',
      culturalContext: 'Área de ocupaciones de altura',
      projectId: 'proj-004',
      sites: ['site-006'],
      createdAt: '2024-06-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z'
    },
    {
      id: 'area-007',
      name: 'Desierto de Atacama Norte',
      description: 'Sector norte del desierto con geoglifos y petroglifos',
      coordinates: [[-22.9087, -68.1997], [-22.9050, -68.1950]],
      characteristics: ['Desierto árido', 'Geoglifos', 'Petroglifos'],
      climate: 'Desértico',
      vegetation: 'Vegetación xerófila',
      waterSources: ['Oasis', 'Napa freática'],
      elevation: 2500,
      accessibility: 'Accesible por caminos desérticos',
      culturalContext: 'Área de geoglifos y petroglifos',
      projectId: 'proj-005',
      sites: ['site-007'],
      createdAt: '2024-02-15T00:00:00Z',
      updatedAt: '2024-02-15T00:00:00Z'
    },
    {
      id: 'area-008',
      name: 'Salar de Atacama',
      description: 'Zona del salar con ocupaciones prehispánicas',
      coordinates: [[-23.4567, -68.3456], [-23.4500, -68.3400]],
      characteristics: ['Salar', 'Ocupaciones prehispánicas', 'Fortificaciones'],
      climate: 'Desértico de altura',
      vegetation: 'Vegetación halófila',
      waterSources: ['Salar', 'Oasis'],
      elevation: 2300,
      accessibility: 'Accesible por caminos del salar',
      culturalContext: 'Área de ocupaciones prehispánicas',
      projectId: 'proj-005',
      sites: ['site-008'],
      createdAt: '2024-02-15T00:00:00Z',
      updatedAt: '2024-02-15T00:00:00Z'
    },
    {
      id: 'area-009',
      name: 'Valle del Duero',
      description: 'Valle histórico con asentamientos medievales',
      coordinates: [[41.6529, -4.7284], [41.6500, -4.7250]],
      characteristics: ['Valle histórico', 'Asentamientos medievales', 'Fortificaciones'],
      climate: 'Mediterráneo continental',
      vegetation: 'Bosque mediterráneo y cultivos',
      waterSources: ['Río Duero', 'Afluentes'],
      elevation: 700,
      accessibility: 'Accesible por carretera',
      culturalContext: 'Área de asentamientos medievales',
      projectId: 'proj-006',
      sites: ['site-009'],
      createdAt: '2024-11-01T00:00:00Z',
      updatedAt: '2024-11-01T00:00:00Z'
    },
    {
      id: 'area-010',
      name: 'Sierra de Gredos',
      description: 'Zona montañosa con fortificaciones medievales',
      coordinates: [[40.2345, -5.1234], [40.2300, -5.1200]],
      characteristics: ['Sierra montañosa', 'Fortificaciones medievales', 'Torreones'],
      climate: 'Mediterráneo de montaña',
      vegetation: 'Bosque de montaña',
      waterSources: ['Ríos de montaña', 'Manantiales'],
      elevation: 1500,
      accessibility: 'Accesible por caminos de montaña',
      culturalContext: 'Área de fortificaciones medievales',
      projectId: 'proj-006',
      sites: ['site-010'],
      createdAt: '2024-11-01T00:00:00Z',
      updatedAt: '2024-11-01T00:00:00Z'
    }
  ];
}

function generateMockSites(): ArchaeologicalSite[] {
  return [
    {
      id: 'site-001',
      name: 'Sitio Pampeano La Laguna',
      description: 'Sitio arqueológico de cazadores-recolectores del Holoceno tardío',
      coordinates: [-34.6037, -58.3816],
      elevation: 150,
      area: 2500,
      siteType: 'Campamento base',
      preservationStatus: 'Bueno',
      excavationStatus: 'En progreso',
      culturalAffiliation: 'Cazadores-recolectores pampeanos',
      occupationHistory: 'Ocupación recurrente durante el Holoceno tardío',
      environmentalContext: 'Próximo a laguna con recursos hídricos',
      areaId: 'area-001',
      projectId: 'proj-001',
      fieldworkSessions: ['fieldwork-001'],
      findings: ['finding-001', 'finding-002', 'finding-003'],
      samples: ['sample-001', 'sample-002'],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ];
}

function generateMockFieldworkSessions(): FieldworkSession[] {
  return [
    {
      id: 'fieldwork-001',
      name: 'Excavación Cuadrícula A1-A4',
      date: '2024-03-15',
      teamMembers: ['Dr. María González', 'Lic. Carlos López', 'Est. Ana Martínez'],
      weatherConditions: 'Soleado, 25°C, viento suave',
      methodology: 'Excavación por niveles naturales, tamizado de 1/4"',
      excavationUnits: ['A1', 'A2', 'A3', 'A4'],
      identifiedStrata: ['Estrato 1: Suelo orgánico', 'Estrato 2: Suelo mineral'],
      generalObservations: 'Excelente preservación de materiales orgánicos',
      siteId: 'site-001',
      areaId: 'area-001',
      projectId: 'proj-001',
      findings: ['finding-001', 'finding-002', 'finding-003'],
      samples: ['sample-001', 'sample-002'],
      createdAt: '2024-03-15T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z'
    }
  ];
}

function generateMockFindings(): ArchaeologicalFinding[] {
  return [
    {
      id: 'finding-001',
      name: 'Punta de proyectil lanceolada',
      type: 'artifact',
      material: 'Sílex',
      description: 'Punta de proyectil lanceolada con retoque bifacial',
      coordinates: [-34.6038, -58.3817],
      depth: 0.5,
      dimensions: { length: 8.5, width: 2.3, height: 0.8 },
      weight: 15.2,
      condition: 'Completa',
      catalogNumber: 'ART-001',
      context: 'Estrato 2, Cuadrícula A3',
      associations: ['finding-002'],
      photos: [],
      drawings: [],
      fieldworkSessionId: 'fieldwork-001',
      siteId: 'site-001',
      areaId: 'area-001',
      projectId: 'proj-001',
      laboratoryAnalyses: ['lab-001'],
      chronologicalData: ['chron-001'],
      createdAt: '2024-03-15T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z'
    },
    {
      id: 'finding-002',
      name: 'Fragmento de cerámica',
      type: 'artifact',
      material: 'Arcilla',
      description: 'Fragmento de cerámica con decoración incisa',
      coordinates: [-34.6036, -58.3815],
      depth: 0.3,
      dimensions: { length: 4.2, width: 3.1, height: 0.6 },
      weight: 8.7,
      condition: 'Fragmentado',
      catalogNumber: 'ART-002',
      context: 'Estrato 1, Cuadrícula B2',
      associations: ['finding-001'],
      photos: [],
      drawings: [],
      fieldworkSessionId: 'fieldwork-001',
      siteId: 'site-001',
      areaId: 'area-001',
      projectId: 'proj-001',
      laboratoryAnalyses: ['lab-002'],
      chronologicalData: ['chron-001'],
      createdAt: '2024-03-15T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z'
    },
    {
      id: 'finding-003',
      name: 'Fogón',
      type: 'feature',
      material: 'Carbón y cenizas',
      description: 'Estructura de fogón circular con restos de carbón',
      coordinates: [-34.6037, -58.3816],
      depth: 0.2,
      dimensions: { diameter: 1.2 },
      condition: 'Bueno',
      catalogNumber: 'FEAT-001',
      context: 'Estrato 1, Cuadrícula A2',
      associations: [],
      photos: [],
      drawings: [],
      fieldworkSessionId: 'fieldwork-001',
      siteId: 'site-001',
      areaId: 'area-001',
      projectId: 'proj-001',
      laboratoryAnalyses: [],
      chronologicalData: ['chron-001'],
      createdAt: '2024-03-15T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z'
    }
  ];
}

function generateMockSamples(): ArchaeologicalSample[] {
  return [
    {
      id: 'sample-001',
      name: 'Muestra de carbón - Fogón',
      type: 'charcoal',
      description: 'Muestra de carbón del fogón para datación radiocarbónica',
      coordinates: [-34.6037, -58.3816],
      depth: 0.2,
      context: 'Fogón, Estrato 1, Cuadrícula A2',
      collectionMethod: 'Recolección manual con pinzas',
      preservationMethod: 'Almacenamiento en papel de aluminio',
      destination: 'Laboratorio de datación radiocarbónica',
      fieldworkSessionId: 'fieldwork-001',
      siteId: 'site-001',
      areaId: 'area-001',
      projectId: 'proj-001',
      laboratoryAnalyses: ['lab-003'],
      chronologicalData: ['chron-001'],
      createdAt: '2024-03-15T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z'
    },
    {
      id: 'sample-002',
      name: 'Muestra de suelo - Estrato 2',
      type: 'soil',
      description: 'Muestra de suelo para análisis de fitolitos',
      coordinates: [-34.6038, -58.3817],
      depth: 0.5,
      context: 'Estrato 2, Cuadrícula A3',
      collectionMethod: 'Recolección con pala estéril',
      preservationMethod: 'Almacenamiento en bolsa de plástico',
      destination: 'Laboratorio de análisis de fitolitos',
      fieldworkSessionId: 'fieldwork-001',
      siteId: 'site-001',
      areaId: 'area-001',
      projectId: 'proj-001',
      laboratoryAnalyses: ['lab-004'],
      chronologicalData: ['chron-001'],
      createdAt: '2024-03-15T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z'
    }
  ];
}

function generateMockLaboratoryAnalyses(): LaboratoryAnalysis[] {
  return [
    {
      id: 'lab-001',
      name: 'Análisis tecnológico - Punta de proyectil',
      date: '2024-04-01',
      technician: 'Lic. Roberto Silva',
      analysisType: 'lithic',
      methodology: 'Análisis tecnológico y tipológico',
      results: 'Punta de proyectil lanceolada con retoque bifacial, técnica de presión',
      observations: 'Excelente calidad del material, retoque fino',
      recommendations: 'Realizar análisis de uso y desgaste',
      findings: ['finding-001'],
      samples: [],
      projectId: 'proj-001',
      createdAt: '2024-04-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z'
    },
    {
      id: 'lab-002',
      name: 'Análisis cerámico - Fragmento',
      date: '2024-04-02',
      technician: 'Dra. Laura Fernández',
      analysisType: 'ceramic',
      methodology: 'Análisis macroscópico y microscópico',
      results: 'Cerámica con desgrasante mineral, decoración incisa',
      observations: 'Buena cocción, pasta homogénea',
      recommendations: 'Realizar análisis de composición química',
      findings: ['finding-002'],
      samples: [],
      projectId: 'proj-001',
      createdAt: '2024-04-02T00:00:00Z',
      updatedAt: '2024-04-02T00:00:00Z'
    },
    {
      id: 'lab-003',
      name: 'Datación radiocarbónica - Carbón',
      date: '2024-04-15',
      technician: 'Dr. Juan Pérez',
      analysisType: 'radiocarbon',
      methodology: 'AMS radiocarbon dating',
      results: '2450 ± 50 años AP',
      observations: 'Muestra bien preservada, sin contaminación',
      recommendations: 'Resultado confiable, calibrar con curva SHCal20',
      findings: [],
      samples: ['sample-001'],
      projectId: 'proj-001',
      createdAt: '2024-04-15T00:00:00Z',
      updatedAt: '2024-04-15T00:00:00Z'
    },
    {
      id: 'lab-004',
      name: 'Análisis de fitolitos - Suelo',
      date: '2024-04-20',
      technician: 'Lic. Carmen Ruiz',
      analysisType: 'organic',
      methodology: 'Extracción y análisis de fitolitos',
      results: 'Presencia de fitolitos de gramíneas y arbustos',
      observations: 'Buena preservación de fitolitos',
      recommendations: 'Realizar análisis cuantitativo',
      findings: [],
      samples: ['sample-002'],
      projectId: 'proj-001',
      createdAt: '2024-04-20T00:00:00Z',
      updatedAt: '2024-04-20T00:00:00Z'
    }
  ];
}

function generateMockChronologicalData(): ChronologicalData[] {
  return [
    {
      id: 'chron-001',
      period: 'Holoceno tardío',
      startDate: 3000,
      endDate: 500,
      culturalPhase: 'Fase Pampeana Tardía',
      description: 'Período de cazadores-recolectores especializados',
      datingMethod: 'Radiocarbono, estratigrafía',
      confidence: 'high',
      sites: ['site-001'],
      findings: ['finding-001', 'finding-002', 'finding-003'],
      samples: ['sample-001', 'sample-002'],
      projectId: 'proj-001',
      createdAt: '2024-04-15T00:00:00Z',
      updatedAt: '2024-04-15T00:00:00Z'
    }
  ];
}

// ============================================================================
// CONTEXTO
// ============================================================================

interface ArchaeologicalContextType {
  state: ArchaeologicalState;
  dispatch: React.Dispatch<ArchaeologicalAction>;
  
  // Métodos de utilidad
  getProjectById: (id: string) => ArchaeologicalProject | undefined;
  getAreaById: (id: string) => ArchaeologicalArea | undefined;
  getSiteById: (id: string) => ArchaeologicalSite | undefined;
  getFieldworkSessionById: (id: string) => FieldworkSession | undefined;
  getFindingById: (id: string) => ArchaeologicalFinding | undefined;
  getSampleById: (id: string) => ArchaeologicalSample | undefined;
  getLaboratoryAnalysisById: (id: string) => LaboratoryAnalysis | undefined;
  getChronologicalDataById: (id: string) => ChronologicalData | undefined;
  
  // Métodos de filtrado
  getAreasByProject: (projectId: string) => ArchaeologicalArea[];
  getSitesByArea: (areaId: string) => ArchaeologicalSite[];
  getFieldworkSessionsBySite: (siteId: string) => FieldworkSession[];
  getFindingsByFieldworkSession: (fieldworkSessionId: string) => ArchaeologicalFinding[];
  getSamplesByFieldworkSession: (fieldworkSessionId: string) => ArchaeologicalSample[];
  getFindingsBySite: (siteId: string) => ArchaeologicalFinding[];
  getSamplesBySite: (siteId: string) => ArchaeologicalSample[];
  
  // Métodos de contexto
  setCurrentContext: (context: ArchContext) => void;
  clearCurrentContext: () => void;
  getFormContext: () => FormContext;
}

const ArchaeologicalContext = createContext<ArchaeologicalContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface ArchaeologicalProviderProps {
  children: ReactNode;
}

export function ArchaeologicalProvider({ children }: ArchaeologicalProviderProps) {
  const [state, dispatch] = useReducer(archaeologicalReducer, initialState);

  // Cargar datos mock al inicializar
  useEffect(() => {
    dispatch({ type: 'LOAD_MOCK_DATA' });
  }, []);

  // Métodos de utilidad
  const getProjectById = (id: string) => state.projects.find(p => p.id === id);
  const getAreaById = (id: string) => state.areas.find(a => a.id === id);
  const getSiteById = (id: string) => state.sites.find(s => s.id === id);
  const getFieldworkSessionById = (id: string) => state.fieldworkSessions.find(f => f.id === id);
  const getFindingById = (id: string) => state.findings.find(f => f.id === id);
  const getSampleById = (id: string) => state.samples.find(s => s.id === id);
  const getLaboratoryAnalysisById = (id: string) => state.laboratoryAnalyses.find(l => l.id === id);
  const getChronologicalDataById = (id: string) => state.chronologicalData.find(c => c.id === id);

  // Métodos de filtrado
  const getAreasByProject = (projectId: string) => state.areas.filter(a => a.projectId === projectId);
  const getSitesByArea = (areaId: string) => state.sites.filter(s => s.areaId === areaId);
  const getFieldworkSessionsBySite = (siteId: string) => state.fieldworkSessions.filter(f => f.siteId === siteId);
  const getFindingsByFieldworkSession = (fieldworkSessionId: string) => state.findings.filter(f => f.fieldworkSessionId === fieldworkSessionId);
  const getSamplesByFieldworkSession = (fieldworkSessionId: string) => state.samples.filter(s => s.fieldworkSessionId === fieldworkSessionId);
  const getFindingsBySite = (siteId: string) => state.findings.filter(f => f.siteId === siteId);
  const getSamplesBySite = (siteId: string) => state.samples.filter(s => s.siteId === siteId);

  // Métodos de contexto
  const setCurrentContext = (context: ArchContext) => {
    dispatch({ type: 'SET_CURRENT_CONTEXT', payload: context });
  };

  const clearCurrentContext = () => {
    dispatch({ type: 'CLEAR_CURRENT_CONTEXT' });
  };

  const getFormContext = (): FormContext => {
    const currentProject = state.currentContext?.projectId ? getProjectById(state.currentContext.projectId) : undefined;
    const currentArea = state.currentContext?.areaId ? getAreaById(state.currentContext.areaId) : undefined;
    const currentSite = state.currentContext?.siteId ? getSiteById(state.currentContext.siteId) : undefined;
    const currentFieldworkSession = state.currentContext?.fieldworkSessionId ? getFieldworkSessionById(state.currentContext.fieldworkSessionId) : undefined;

    return {
      currentProject,
      currentArea,
      currentSite,
      currentFieldworkSession,
      availableProjects: state.projects,
      availableAreas: currentProject ? getAreasByProject(currentProject.id) : state.areas,
      availableSites: currentArea ? getSitesByArea(currentArea.id) : state.sites,
      availableFieldworkSessions: currentSite ? getFieldworkSessionsBySite(currentSite.id) : state.fieldworkSessions
    };
  };

  const value: ArchaeologicalContextType = {
    state,
    dispatch,
    getProjectById,
    getAreaById,
    getSiteById,
    getFieldworkSessionById,
    getFindingById,
    getSampleById,
    getLaboratoryAnalysisById,
    getChronologicalDataById,
    getAreasByProject,
    getSitesByArea,
    getFieldworkSessionsBySite,
    getFindingsByFieldworkSession,
    getSamplesByFieldworkSession,
    getFindingsBySite,
    getSamplesBySite,
    setCurrentContext,
    clearCurrentContext,
    getFormContext
  };

  return (
    <ArchaeologicalContext.Provider value={value}>
      {children}
    </ArchaeologicalContext.Provider>
  );
}

// ============================================================================
// HOOK PERSONALIZADO
// ============================================================================

export function useArchaeological() {
  const context = useContext(ArchaeologicalContext);
  if (context === undefined) {
    throw new Error('useArchaeological must be used within an ArchaeologicalProvider');
  }
  return context;
} 