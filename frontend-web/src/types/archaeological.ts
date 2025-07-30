// ============================================================================
// SISTEMA DE TIPOS ARQUEOLÓGICOS INTEGRADOS Y ESCALABLES
// ============================================================================

// ============================================================================
// ENTIDADES PRINCIPALES (JERARQUÍA)
// ============================================================================

export interface ArchaeologicalProject {
  id: string;
  name: string;
  description: string;
  institution: string;
  principalInvestigator: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  objectives: string[];
  projectType: string;
  status: 'active' | 'completed' | 'suspended' | 'planned';
  areas: string[]; // IDs de áreas/regiones
  createdAt: string;
  updatedAt: string;
}

export interface ArchaeologicalArea {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number][]; // Polígono del área
  characteristics: string[];
  climate: string;
  vegetation: string;
  waterSources: string[];
  elevation: number;
  accessibility: string;
  culturalContext: string;
  projectId: string; // Referencia al proyecto padre
  sites: string[]; // IDs de sitios
  createdAt: string;
  updatedAt: string;
}

export interface ArchaeologicalSite {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  elevation: number;
  area: number; // en metros cuadrados
  siteType: string;
  preservationStatus: string;
  excavationStatus: string;
  culturalAffiliation: string;
  occupationHistory: string;
  environmentalContext: string;
  areaId: string; // Referencia al área padre
  projectId: string; // Referencia al proyecto padre
  fieldworkSessions: string[]; // IDs de trabajos de campo
  findings: string[]; // IDs de hallazgos
  samples: string[]; // IDs de muestras
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ENTIDADES DE TRABAJO DE CAMPO
// ============================================================================

export interface FieldworkSession {
  id: string;
  name: string;
  date: string;
  teamMembers: string[];
  weatherConditions: string;
  methodology: string;
  excavationUnits: string[];
  identifiedStrata: string[];
  generalObservations: string;
  siteId: string; // Referencia al sitio
  areaId: string; // Referencia al área
  projectId: string; // Referencia al proyecto
  findings: string[]; // IDs de hallazgos generados
  samples: string[]; // IDs de muestras recolectadas
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ENTIDADES DE HALLAZGOS Y MUESTRAS
// ============================================================================

export interface ArchaeologicalFinding {
  id: string;
  name: string;
  type: 'artifact' | 'feature' | 'ecofact' | 'structure';
  material: string;
  description: string;
  coordinates: [number, number];
  depth: number;
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
  associations: string[];
  photos: string[];
  drawings: string[];
  fieldworkSessionId: string; // Referencia al trabajo de campo
  siteId: string; // Referencia al sitio
  areaId: string; // Referencia al área
  projectId: string; // Referencia al proyecto
  laboratoryAnalyses: string[]; // IDs de análisis de laboratorio
  chronologicalData: string[]; // IDs de datos cronológicos
  createdAt: string;
  updatedAt: string;
}

export interface ArchaeologicalSample {
  id: string;
  name: string;
  type: 'soil' | 'charcoal' | 'ceramic' | 'bone' | 'shell' | 'metal' | 'textile' | 'wood' | 'other';
  description: string;
  coordinates: [number, number];
  depth: number;
  context: string;
  collectionMethod: string;
  preservationMethod: string;
  destination: string; // Para qué análisis
  fieldworkSessionId: string; // Referencia al trabajo de campo
  siteId: string; // Referencia al sitio
  areaId: string; // Referencia al área
  projectId: string; // Referencia al proyecto
  laboratoryAnalyses: string[]; // IDs de análisis de laboratorio
  chronologicalData: string[]; // IDs de datos cronológicos
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ENTIDADES DE LABORATORIO
// ============================================================================

export interface LaboratoryAnalysis {
  id: string;
  name: string;
  date: string;
  technician: string;
  analysisType: 'ceramic' | 'lithic' | 'organic' | 'metallurgical' | 'radiocarbon' | 'pollen' | 'other';
  methodology: string;
  results: string;
  observations: string;
  recommendations: string;
  findings: string[]; // IDs de hallazgos analizados
  samples: string[]; // IDs de muestras procesadas
  projectId: string; // Referencia al proyecto
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ENTIDADES DE CRONOLOGÍA
// ============================================================================

export interface ChronologicalData {
  id: string;
  period: string;
  startDate: number; // años antes del presente
  endDate: number;
  culturalPhase: string;
  description: string;
  datingMethod: string;
  confidence: 'high' | 'medium' | 'low';
  sites: string[]; // IDs de sitios asociados
  findings: string[]; // IDs de hallazgos asociados
  samples: string[]; // IDs de muestras asociadas
  projectId: string; // Referencia al proyecto
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS DE FORMULARIOS
// ============================================================================

export interface ProjectFormData {
  name: string;
  description: string;
  institution: string;
  principalInvestigator: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  objectives: string[];
  projectType: string;
  status: 'active' | 'completed' | 'suspended' | 'planned';
  areas: string[];
}

export interface AreaFormData {
  name: string;
  description: string;
  coordinates: [number, number][];
  characteristics: string[];
  climate: string;
  vegetation: string;
  waterSources: string[];
  elevation: number;
  accessibility: string;
  culturalContext: string;
  projectId: string;
}

export interface SiteFormData {
  name: string;
  description: string;
  coordinates: [number, number];
  elevation: number;
  area: number;
  siteType: string;
  preservationStatus: string;
  excavationStatus: string;
  culturalAffiliation: string;
  occupationHistory: string;
  environmentalContext: string;
  areaId: string;
  projectId: string;
}

export interface FieldworkFormData {
  name: string;
  date: string;
  teamMembers: string[];
  weatherConditions: string;
  methodology: string;
  excavationUnits: string[];
  identifiedStrata: string[];
  generalObservations: string;
  siteId: string;
  areaId: string;
  projectId: string;
}

export interface FindingFormData {
  name: string;
  type: 'artifact' | 'feature' | 'ecofact' | 'structure' | 'sample' | 'human_remains' | 'faunal' | 'floral' | 'geological';
  material: string;
  description: string;
  coordinates: [number, number];
  depth: number;
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
  associations: string[];
  photos: string[];
  drawings: string[];
  fieldworkSessionId: string;
  siteId: string;
  areaId: string;
  projectId: string;
  // Análisis y conservación
  conservationTreatment?: string;
  analyses?: string[];
  currentLocation?: string;
  conservationNotes?: string;
  // Documentación asociada
  associatedDocuments: {
    title: string;
    authorRole: 'author' | 'coauthor' | 'other';
    isPublished: boolean;
    publicationLink?: string;
    notes?: string;
  }[];
}

export interface SampleFormData {
  name: string;
  type: 'soil' | 'charcoal' | 'ceramic' | 'bone' | 'shell' | 'metal' | 'textile' | 'wood' | 'other';
  description: string;
  coordinates: [number, number];
  depth: number;
  context: string;
  collectionMethod: string;
  preservationMethod: string;
  destination: string;
  fieldworkSessionId: string;
  siteId: string;
  areaId: string;
  projectId: string;
}

export interface LaboratoryFormData {
  name: string;
  date: string;
  technician: string;
  analysisType: 'ceramic' | 'lithic' | 'organic' | 'metallurgical' | 'radiocarbon' | 'pollen' | 'other';
  methodology: string;
  results: string;
  observations: string;
  recommendations: string;
  findings: string[];
  samples: string[];
  projectId: string;
}

export interface ChronologyFormData {
  period: string;
  startDate: number;
  endDate: number;
  culturalPhase: string;
  description: string;
  datingMethod: string;
  confidence: 'high' | 'medium' | 'low';
  sites: string[];
  findings: string[];
  samples: string[];
  projectId: string;
}

// ============================================================================
// TIPOS DE CONTEXTO Y ESTADO
// ============================================================================

export interface ArchaeologicalContext {
  projectId: string;
  projectName: string;
  areaId: string;
  areaName: string;
  siteId: string;
  siteName: string;
  fieldworkSessionId?: string;
  fieldworkSessionName?: string;
}

export interface FormContext {
  currentProject?: ArchaeologicalProject;
  currentArea?: ArchaeologicalArea;
  currentSite?: ArchaeologicalSite;
  currentFieldworkSession?: FieldworkSession;
  availableProjects: ArchaeologicalProject[];
  availableAreas: ArchaeologicalArea[];
  availableSites: ArchaeologicalSite[];
  availableFieldworkSessions: FieldworkSession[];
}

// ============================================================================
// TIPOS DE VALIDACIÓN
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// ============================================================================
// TIPOS DE EXPORTACIÓN
// ============================================================================

export interface ExportData {
  project: ArchaeologicalProject;
  areas: ArchaeologicalArea[];
  sites: ArchaeologicalSite[];
  fieldworkSessions: FieldworkSession[];
  findings: ArchaeologicalFinding[];
  samples: ArchaeologicalSample[];
  laboratoryAnalyses: LaboratoryAnalysis[];
  chronologicalData: ChronologicalData[];
  exportDate: string;
  exportFormat: 'json' | 'csv' | 'pdf';
}

// ============================================================================
// TIPOS DE BÚSQUEDA Y FILTROS
// ============================================================================

export interface SearchFilters {
  projectId?: string;
  areaId?: string;
  siteId?: string;
  fieldworkSessionId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  type?: string;
  material?: string;
  condition?: string;
}

export interface SearchResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  filters: SearchFilters;
} 