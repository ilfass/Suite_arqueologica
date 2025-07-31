export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string | undefined;
  status: 'ACTIVE' | 'COMPLETED' | 'PLANNED' | 'CANCELLED';
  directorId: string;
  institutionId?: string | undefined;
  location: {
    latitude: number;
    longitude: number;
    address?: string | undefined;
  };
  budget?: number | undefined;
  objectives: string[];
  methodology: string;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  name: string;
  description: string;
  projectId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  size: number; // en metros cuadrados
  type: 'EXCAVATION' | 'SURVEY' | 'CONSERVATION' | 'DOCUMENTATION';
  status: 'ACTIVE' | 'COMPLETED' | 'PLANNED';
  assignedResearchers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Site {
  id: string;
  name: string;
  description: string;
  areaId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: 'SETTLEMENT' | 'CEMETERY' | 'TEMPLE' | 'FORTIFICATION' | 'WORKSHOP' | 'OTHER';
  period: string;
  culturalAffiliation: string;
  preservationStatus: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  discoveries: Discovery[];
  images: string[];
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Discovery {
  id: string;
  siteId: string;
  type: 'ARTIFACT' | 'STRUCTURE' | 'BURIAL' | 'INSCRIPTION' | 'OTHER';
  description: string;
  date: string;
  discovererId: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  } | undefined;
  images: string[];
  notes: string;
  createdAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  startDate: string;
  endDate?: string | undefined;
  status: 'ACTIVE' | 'COMPLETED' | 'PLANNED' | 'CANCELLED';
  directorId: string;
  institutionId?: string | undefined;
  location: {
    latitude: number;
    longitude: number;
    address?: string | undefined;
  };
  budget?: number | undefined;
  objectives: string[];
  methodology: string;
}

export interface UpdateProjectRequest {
  name?: string | undefined;
  description?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  status?: 'ACTIVE' | 'COMPLETED' | 'PLANNED' | 'CANCELLED' | undefined;
  location?: {
    latitude: number;
    longitude: number;
    address?: string | undefined;
  } | undefined;
  budget?: number | undefined;
  objectives?: string[] | undefined;
  methodology?: string | undefined;
}

export interface CreateAreaRequest {
  name: string;
  description: string;
  projectId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  size: number;
  type: 'EXCAVATION' | 'SURVEY' | 'CONSERVATION' | 'DOCUMENTATION';
  status: 'ACTIVE' | 'COMPLETED' | 'PLANNED';
  assignedResearchers: string[];
}

export interface CreateSiteRequest {
  name: string;
  description: string;
  areaId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: 'SETTLEMENT' | 'CEMETERY' | 'TEMPLE' | 'FORTIFICATION' | 'WORKSHOP' | 'OTHER';
  period: string;
  culturalAffiliation: string;
  preservationStatus: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  images?: string[] | undefined;
  documents?: string[] | undefined;
}

export interface CreateDiscoveryRequest {
  siteId: string;
  type: 'ARTIFACT' | 'STRUCTURE' | 'BURIAL' | 'INSCRIPTION' | 'OTHER';
  description: string;
  date: string;
  discovererId: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  } | undefined;
  images?: string[] | undefined;
  notes?: string | undefined;
}

export interface ContextResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
} 