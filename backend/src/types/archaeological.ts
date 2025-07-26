// Tipos para fichas arqueológicas basadas en estándares internacionales
// ICOMOS, ICANH, CSIC, SAA

// ========================================
// TIPOS PARA SITIOS ARQUEOLÓGICOS
// ========================================

export interface AdministrativeDivision {
  country: string;
  state?: string;
  city?: string;
  district?: string;
  municipality?: string;
}

export interface Chronology {
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string
  certainty_level: 'definite' | 'probable' | 'possible' | 'uncertain';
  dating_methods?: string[];
}

export interface Threats {
  natural: string[];
  anthropogenic: string[];
  climate_change: string[];
  other: string[];
}

export interface ResearchHistory {
  year: number;
  researcher: string;
  institution: string;
  type: 'survey' | 'excavation' | 'analysis' | 'conservation';
  description: string;
  publications?: string[];
}

export interface ArchaeologicalSite {
  // Identificación básica
  id: string;
  site_code: string;
  name: string;
  alternative_names?: string[];
  
  // Ubicación geográfica
  location: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  administrative_division?: AdministrativeDivision;
  coordinates_precision?: 'GPS' | 'map' | 'estimation';
  elevation?: number;
  elevation_reference?: string;
  
  // Clasificación y tipología
  site_type: SiteType;
  site_category?: SiteCategory;
  cultural_period?: string;
  cultural_affiliation?: string;
  chronology?: Chronology;
  
  // Características físicas
  area_size?: number;
  area_unit?: 'hectares' | 'acres' | 'm2';
  site_boundaries?: string;
  topography?: string;
  geology?: string;
  vegetation?: string;
  water_sources?: string;
  
  // Estado de conservación
  preservation_status: PreservationStatus;
  threats?: Threats;
  conservation_measures?: string;
  accessibility?: string;
  
  // Historia de investigación
  discovery_date?: string;
  discoverer?: string;
  research_history?: ResearchHistory[];
  previous_excavations?: string;
  published_references?: string[];
  
  // Contexto arqueológico
  stratigraphy_summary?: string;
  cultural_layers?: string;
  associated_sites?: string[];
  environmental_context?: string;
  
  // Documentación
  documentation_status?: 'complete' | 'incomplete' | 'pending';
  survey_methods?: SurveyMethod[];
  mapping_status?: 'complete' | 'partial' | 'pending';
  photographic_documentation?: boolean;
  
  // Legal y administrativo
  legal_protection?: string;
  ownership?: string;
  permits_required?: boolean;
  permit_status?: string;
  
  // Metadatos
  status: SiteStatus;
  created_by?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  tags?: string[];
}

export type SiteType = 
  | 'settlement' | 'cemetery' | 'workshop' | 'ceremonial' | 'domestic' 
  | 'industrial' | 'agricultural' | 'military' | 'religious' | 'funerary'
  | 'trading_post' | 'quarry' | 'mine' | 'road' | 'bridge' | 'aqueduct'
  | 'fortification' | 'palace' | 'temple' | 'sanctuary' | 'other';

export type SiteCategory = 
  | 'urban' | 'rural' | 'coastal' | 'mountain' | 'desert' | 'forest'
  | 'riverine' | 'lacustrine' | 'island' | 'cave' | 'rock_shelter';

export type PreservationStatus = 
  | 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export type SurveyMethod = 
  | 'surface_survey' | 'aerial_photography' | 'satellite_imagery' 
  | 'geophysical_survey' | 'test_pits' | 'systematic_sampling'
  | 'walkover_survey' | 'metal_detector' | 'ground_penetrating_radar'
  | 'magnetometry' | 'resistivity' | 'other';

export type SiteStatus = 
  | 'active' | 'inactive' | 'archived' | 'destroyed';

// ========================================
// TIPOS PARA OBJETOS
// ========================================

export interface Dimensions {
  length?: number;
  width?: number;
  height?: number;
  thickness?: number;
  diameter?: number;
  unit?: 'mm' | 'cm' | 'm';
}

export interface DatingResults {
  method: string;
  date: string;
  uncertainty?: string;
  laboratory?: string;
  reference_number?: string;
}

export interface Object {
  // Identificación básica
  id: string;
  catalog_number: string;
  site_id: string;
  excavation_id?: string;
  
  // Clasificación
  name: string;
  object_type: ObjectType;
  object_category?: string;
  functional_classification?: string;
  typological_classification?: string;
  
  // Materiales y tecnología
  primary_material: string;
  secondary_materials?: string[];
  manufacturing_technique?: string;
  surface_treatment?: string;
  decoration?: string;
  
  // Dimensiones y peso
  dimensions?: Dimensions;
  weight?: number;
  weight_unit?: 'grams' | 'kg';
  volume?: number;
  volume_unit?: 'cm3' | 'ml';
  
  // Estado de conservación
  condition: ObjectCondition;
  preservation_issues?: string[];
  conservation_treatments?: string;
  storage_location?: string;
  
  // Contexto de hallazgo
  discovery_date?: string;
  discovery_location?: {
    latitude: number;
    longitude: number;
  };
  stratigraphic_unit?: string;
  depth?: number;
  depth_unit?: 'cm' | 'm';
  associated_materials?: string[];
  spatial_context?: string;
  
  // Análisis y estudios
  analysis_status?: 'pending' | 'in_progress' | 'completed';
  laboratory_analysis?: string[];
  dating_methods?: string[];
  dating_results?: DatingResults[];
  provenance_analysis?: string;
  
  // Documentación fotográfica
  images?: string[];
  drawings?: string[];
  sketches?: string[];
  documentation_quality?: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Interpretación
  function_hypothesis?: string;
  cultural_affiliation?: string;
  chronological_period?: string;
  trade_evidence?: boolean;
  
  // Metadatos
  created_by?: string;
  created_at: string;
  updated_at: string;
  description?: string;
  notes?: string;
  tags?: string[];
}

export type ObjectType = 
  | 'tool' | 'ceramic' | 'lithic' | 'metal' | 'bone' | 'shell' | 'wood'
  | 'textile' | 'leather' | 'glass' | 'stone' | 'jewelry' | 'weapon'
  | 'ornament' | 'ritual_object' | 'architectural_element' | 'other';

export type ObjectCondition = 
  | 'excellent' | 'good' | 'fair' | 'poor' | 'fragmentary';

// ========================================
// TIPOS PARA EXCAVACIONES
// ========================================

export interface TeamMember {
  user_id: string;
  role: string;
  start_date?: string;
  end_date?: string;
}

export interface ExcavationUnit {
  unit_number: string;
  unit_type: string;
  dimensions?: Dimensions;
  depth?: number;
  description?: string;
}

export interface ArchaeologicalFeature {
  feature_number: string;
  feature_type: string;
  description?: string;
  dimensions?: Dimensions;
  depth?: number;
  stratigraphic_unit?: string;
  associated_objects?: string[];
  function_hypothesis?: string;
  photographs?: string[];
  drawings?: string[];
  plans?: string[];
}

export interface Excavation {
  // Identificación básica
  id: string;
  excavation_code: string;
  site_id: string;
  name: string;
  description?: string;
  
  // Planificación y objetivos
  objectives?: string[];
  research_questions?: string[];
  methodology?: string;
  excavation_strategy?: string;
  
  // Cronología
  start_date: string;
  end_date?: string;
  planned_duration?: number;
  actual_duration?: number;
  season_number?: number;
  
  // Equipo y responsabilidades
  team_leader?: string;
  team_members?: TeamMember[];
  external_collaborators?: string[];
  institutions_involved?: string[];
  
  // Área de excavación
  excavation_area?: number;
  area_unit?: 'm2' | 'hectares';
  grid_system?: string;
  excavation_units?: ExcavationUnit[];
  depth_excavated?: number;
  depth_unit?: 'cm' | 'm';
  
  // Metodología de excavación
  excavation_method?: ExcavationMethod;
  stratigraphic_recording?: boolean;
  three_dimensional_recording?: boolean;
  sampling_strategy?: string;
  sieving_methods?: string[];
  
  // Hallazgos y resultados
  findings_summary?: string;
  objects_recovered?: number;
  features_identified?: string[];
  structures_discovered?: string[];
  human_remains?: boolean;
  faunal_remains?: boolean;
  botanical_remains?: boolean;
  
  // Documentación de campo
  field_notes?: boolean;
  photographic_documentation?: boolean;
  video_documentation?: boolean;
  drawings_created?: boolean;
  mapping_completed?: boolean;
  
  // Análisis de laboratorio
  laboratory_analysis_planned?: string[];
  laboratory_analysis_completed?: string[];
  dating_samples_collected?: number;
  conservation_treatments_applied?: string[];
  
  // Estado y progreso
  status: ExcavationStatus;
  progress_percentage?: number;
  completion_date?: string;
  
  // Presupuesto y recursos
  budget_allocated?: number;
  budget_currency?: string;
  budget_spent?: number;
  equipment_used?: string[];
  
  // Permisos y autorizaciones
  permits_obtained?: boolean;
  permit_numbers?: string[];
  permit_expiry_date?: string;
  landowner_permission?: boolean;
  
  // Metadatos
  created_by?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  tags?: string[];
}

export type ExcavationMethod = 
  | 'open_area' | 'trench' | 'test_pit' | 'step_trench' | 'box_grid'
  | 'quadrant' | 'arbitrary_levels' | 'natural_levels' | 'other';

export type ExcavationStatus = 
  | 'planned' | 'in_progress' | 'completed' | 'suspended' | 'cancelled';

// ========================================
// TIPOS PARA UNIDADES ESTRATIGRÁFICAS
// ========================================

export interface StratigraphicUnit {
  id: string;
  excavation_id: string;
  unit_number: string;
  unit_type: string;
  
  // Características físicas
  dimensions?: Dimensions;
  depth_top?: number;
  depth_bottom?: number;
  depth_unit?: 'cm' | 'm';
  
  // Descripción
  description?: string;
  color?: string;
  texture?: string;
  composition?: string;
  inclusions?: string;
  
  // Relaciones estratigráficas
  overlies?: string[];
  underlies?: string[];
  cuts?: string[];
  cut_by?: string[];
  
  // Interpretación
  formation_process?: string;
  cultural_period?: string;
  function_hypothesis?: string;
  
  // Documentación
  photographs?: string[];
  drawings?: string[];
  samples_collected?: number;
  
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// ========================================
// TIPOS PARA MUESTRAS
// ========================================

export interface Sample {
  id: string;
  sample_number: string;
  excavation_id: string;
  stratigraphic_unit_id?: string;
  
  // Clasificación
  sample_type: SampleType;
  material?: string;
  
  // Contexto
  collection_date?: string;
  collection_method?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  depth?: number;
  depth_unit?: 'cm' | 'm';
  
  // Análisis
  analysis_requested?: string[];
  analysis_completed?: string[];
  results?: Record<string, any>;
  
  // Almacenamiento
  storage_location?: string;
  storage_conditions?: string;
  
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type SampleType = 
  | 'carbon' | 'ceramic' | 'lithic' | 'bone' | 'shell' | 'wood'
  | 'charcoal' | 'seeds' | 'pollen' | 'soil' | 'sediment' | 'metal'
  | 'glass' | 'textile' | 'leather' | 'other';

// ========================================
// TIPOS PARA DOCUMENTOS
// ========================================

export interface Document {
  id: string;
  title: string;
  description?: string;
  document_type: DocumentType;
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  site_id?: string;
  excavation_id?: string;
  artifact_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type DocumentType = 
  | 'report' | 'photo' | 'drawing' | 'map' | 'analysis' | 'other';

// ========================================
// TIPOS PARA MEDICIONES
// ========================================

export interface Measurement {
  id: string;
  name: string;
  measurement_type: MeasurementType;
  value: number;
  unit: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  site_id?: string;
  excavation_id?: string;
  artifact_id?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export type MeasurementType = 
  | 'distance' | 'area' | 'volume' | 'angle' | 'depth' | 'elevation';

// ========================================
// TIPOS PARA PERMISOS Y NOTIFICACIONES
// ========================================

export interface SitePermission {
  id: string;
  site_id: string;
  user_id: string;
  permission_level: 'view' | 'edit' | 'admin';
  granted_by?: string;
  granted_at: string;
  expires_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  related_entity_type?: string;
  related_entity_id?: string;
  created_at: string;
}

// ========================================
// TIPOS PARA FORMULARIOS Y CREACIÓN
// ========================================

export interface CreateSiteRequest {
  site_code: string;
  name: string;
  alternative_names?: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  administrative_division?: AdministrativeDivision;
  coordinates_precision?: string;
  elevation?: number;
  elevation_reference?: string;
  site_type: SiteType;
  site_category?: SiteCategory;
  cultural_period?: string;
  cultural_affiliation?: string;
  chronology?: Chronology;
  area_size?: number;
  area_unit?: string;
  site_boundaries?: string;
  topography?: string;
  geology?: string;
  vegetation?: string;
  water_sources?: string;
  preservation_status: PreservationStatus;
  threats?: Threats;
  conservation_measures?: string;
  accessibility?: string;
  discovery_date?: string;
  discoverer?: string;
  research_history?: ResearchHistory[];
  previous_excavations?: string;
  published_references?: string[];
  stratigraphy_summary?: string;
  cultural_layers?: string;
  associated_sites?: string[];
  environmental_context?: string;
  documentation_status?: string;
  survey_methods?: SurveyMethod[];
  mapping_status?: string;
  photographic_documentation?: boolean;
  legal_protection?: string;
  ownership?: string;
  permits_required?: boolean;
  permit_status?: string;
  notes?: string;
  tags?: string[];
}

export interface CreateObjectRequest {
  catalog_number: string;
  site_id: string;
  excavation_id?: string;
  name: string;
  object_type: ObjectType;
  object_category?: string;
  functional_classification?: string;
  typological_classification?: string;
  primary_material: string;
  secondary_materials?: string[];
  manufacturing_technique?: string;
  surface_treatment?: string;
  decoration?: string;
  dimensions?: Dimensions;
  weight?: number;
  weight_unit?: string;
  volume?: number;
  volume_unit?: string;
  condition: ObjectCondition;
  preservation_issues?: string[];
  conservation_treatments?: string;
  storage_location?: string;
  discovery_date?: string;
  discovery_location?: {
    latitude: number;
    longitude: number;
  };
  stratigraphic_unit?: string;
  depth?: number;
  depth_unit?: string;
  associated_materials?: string[];
  spatial_context?: string;
  analysis_status?: string;
  laboratory_analysis?: string[];
  dating_methods?: string[];
  dating_results?: DatingResults[];
  provenance_analysis?: string;
  images?: string[];
  drawings?: string[];
  sketches?: string[];
  documentation_quality?: string;
  function_hypothesis?: string;
  cultural_affiliation?: string;
  chronological_period?: string;
  trade_evidence?: boolean;
  description?: string;
  notes?: string;
  tags?: string[];
}

export interface CreateExcavationRequest {
  excavation_code: string;
  site_id: string;
  name: string;
  description?: string;
  objectives?: string[];
  research_questions?: string[];
  methodology?: string;
  excavation_strategy?: string;
  start_date: string;
  end_date?: string;
  planned_duration?: number;
  season_number?: number;
  team_leader?: string;
  team_members?: TeamMember[];
  external_collaborators?: string[];
  institutions_involved?: string[];
  excavation_area?: number;
  area_unit?: string;
  grid_system?: string;
  excavation_units?: ExcavationUnit[];
  depth_excavated?: number;
  depth_unit?: string;
  excavation_method?: ExcavationMethod;
  stratigraphic_recording?: boolean;
  three_dimensional_recording?: boolean;
  sampling_strategy?: string;
  sieving_methods?: string[];
  findings_summary?: string;
  objects_recovered?: number;
  features_identified?: string[];
  structures_discovered?: string[];
  human_remains?: boolean;
  faunal_remains?: boolean;
  botanical_remains?: boolean;
  field_notes?: boolean;
  photographic_documentation?: boolean;
  video_documentation?: boolean;
  drawings_created?: boolean;
  mapping_completed?: boolean;
  laboratory_analysis_planned?: string[];
  dating_samples_collected?: number;
  conservation_treatments_applied?: string[];
  status: ExcavationStatus;
  progress_percentage?: number;
  budget_allocated?: number;
  budget_currency?: string;
  equipment_used?: string[];
  permits_obtained?: boolean;
  permit_numbers?: string[];
  permit_expiry_date?: string;
  landowner_permission?: boolean;
  notes?: string;
  tags?: string[];
} 

export interface Area {
  id: string;
  name: string;
  countries: string[];
  provinces: string[];
  latitude?: string;
  longitude?: string;
  size?: string;
  size_unit?: string;
  description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectArea {
  project_id: string;
  area_id: string;
} 