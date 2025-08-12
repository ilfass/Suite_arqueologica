import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Función para obtener el token de autenticación
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Cliente axios configurado
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface GridUnit {
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

export interface Finding {
  id: string;
  type: 'ceramic' | 'lithic' | 'bone' | 'metal' | 'other';
  coordinates: [number, number];
  depth: number;
  description: string;
  date_found: string;
  catalog_number?: string;
}

export interface Measurement {
  id: string;
  type: 'distance' | 'area' | 'point';
  coordinates: [number, number][];
  value: number;
  unit: string;
  label: string;
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'topography' | 'chronology' | 'findings' | 'grid' | 'excavation' | 'satellite';
  visible: boolean;
  color: string;
  opacity: number;
  data: any[];
  icon?: string;
}

// Servicio para obtener datos de mapping
export const mappingApi = {
  // Obtener todas las cuadrículas
  async getGridUnits(): Promise<GridUnit[]> {
    try {
      const response = await apiClient.get('/excavations/grid-units');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching grid units:', error);
      // Retornar datos de ejemplo si el backend no responde
      return [
        {
          id: '1',
          code: 'A1',
          coordinates: { north: 19.4326, south: 19.4325, east: -99.1332, west: -99.1333 },
          status: 'completed',
          findings_count: 12,
          depth: 2.5,
          area: 100,
          notes: 'Excavación completa con hallazgos cerámicos'
        },
        {
          id: '2',
          code: 'A2',
          coordinates: { north: 19.4326, south: 19.4325, east: -99.1331, west: -99.1332 },
          status: 'active',
          findings_count: 8,
          depth: 1.8,
          area: 100,
          notes: 'En progreso - nivel 2'
        },
        {
          id: '3',
          code: 'B1',
          coordinates: { north: 19.4325, south: 19.4324, east: -99.1332, west: -99.1333 },
          status: 'planned',
          findings_count: 0,
          depth: 0,
          area: 100,
          notes: 'Planificada para próxima temporada'
        },
        {
          id: '4',
          code: 'B2',
          coordinates: { north: 19.4325, south: 19.4324, east: -99.1331, west: -99.1332 },
          status: 'active',
          findings_count: 15,
          depth: 3.2,
          area: 100,
          notes: 'Excavación en curso - múltiples niveles'
        }
      ];
    }
  },

  // Obtener todos los hallazgos
  async getFindings(): Promise<Finding[]> {
    try {
      const response = await apiClient.get('/objects/findings');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching findings:', error);
      // Retornar datos de ejemplo si el backend no responde
      return [
        {
          id: '1',
          type: 'ceramic',
          coordinates: [19.43255, -99.13325],
          depth: 1.2,
          description: 'Fragmento de vasija cerámica con decoración incisa',
          date_found: '2024-01-15',
          catalog_number: 'CER-001'
        },
        {
          id: '2',
          type: 'lithic',
          coordinates: [19.43258, -99.13328],
          depth: 0.8,
          description: 'Herramienta lítica de obsidiana',
          date_found: '2024-01-16',
          catalog_number: 'LIT-002'
        },
        {
          id: '3',
          type: 'bone',
          coordinates: [19.43252, -99.13322],
          depth: 2.1,
          description: 'Fragmento óseo de animal',
          date_found: '2024-01-17',
          catalog_number: 'BON-003'
        }
      ];
    }
  },

  // Obtener mediciones
  async getMeasurements(): Promise<Measurement[]> {
    try {
      const response = await apiClient.get('/excavations/measurements');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching measurements:', error);
      // Retornar datos de ejemplo si el backend no responde
      return [
        {
          id: '1',
          type: 'distance',
          coordinates: [[19.4326, -99.1332], [19.4325, -99.1331]],
          value: 15.5,
          unit: 'm',
          label: 'Distancia A1-A2'
        },
        {
          id: '2',
          type: 'area',
          coordinates: [[19.4326, -99.1333], [19.4325, -99.1332], [19.4325, -99.1333]],
          value: 100,
          unit: 'm²',
          label: 'Área excavación A1'
        }
      ];
    }
  },

  // Crear nueva cuadrícula
  async createGridUnit(gridUnit: Omit<GridUnit, 'id'>): Promise<GridUnit> {
    try {
      const response = await apiClient.post('/excavations/grid-units', gridUnit);
      return response.data.data;
    } catch (error) {
      console.error('Error creating grid unit:', error);
      throw error;
    }
  },

  // Actualizar cuadrícula
  async updateGridUnit(id: string, gridUnit: Partial<GridUnit>): Promise<GridUnit> {
    try {
      const response = await apiClient.put(`/excavations/grid-units/${id}`, gridUnit);
      return response.data.data;
    } catch (error) {
      console.error('Error updating grid unit:', error);
      throw error;
    }
  },

  // Eliminar cuadrícula
  async deleteGridUnit(id: string): Promise<void> {
    try {
      await apiClient.delete(`/excavations/grid-units/${id}`);
    } catch (error) {
      console.error('Error deleting grid unit:', error);
      throw error;
    }
  },

  // Crear nuevo hallazgo
  async createFinding(finding: Omit<Finding, 'id'>): Promise<Finding> {
    try {
      const response = await apiClient.post('/objects/findings', finding);
      return response.data.data;
    } catch (error) {
      console.error('Error creating finding:', error);
      throw error;
    }
  },

  // Actualizar hallazgo
  async updateFinding(id: string, finding: Partial<Finding>): Promise<Finding> {
    try {
      const response = await apiClient.put(`/objects/findings/${id}`, finding);
      return response.data.data;
    } catch (error) {
      console.error('Error updating finding:', error);
      throw error;
    }
  },

  // Eliminar hallazgo
  async deleteFinding(id: string): Promise<void> {
    try {
      await apiClient.delete(`/objects/findings/${id}`);
    } catch (error) {
      console.error('Error deleting finding:', error);
      throw error;
    }
  },

  // Crear nueva medición
  async createMeasurement(measurement: Omit<Measurement, 'id'>): Promise<Measurement> {
    try {
      const response = await apiClient.post('/excavations/measurements', measurement);
      return response.data.data;
    } catch (error) {
      console.error('Error creating measurement:', error);
      throw error;
    }
  },

  // Obtener estadísticas de mapping
  async getMappingStats(): Promise<{
    totalGridUnits: number;
    totalFindings: number;
    totalMeasurements: number;
    totalArea: number;
    activeExcavations: number;
    completedExcavations: number;
  }> {
    try {
      const response = await apiClient.get('/excavations/mapping-stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching mapping stats:', error);
      return {
        totalGridUnits: 0,
        totalFindings: 0,
        totalMeasurements: 0,
        totalArea: 0,
        activeExcavations: 0,
        completedExcavations: 0
      };
    }
  },

  // Exportar datos de mapping
  async exportMappingData(): Promise<Blob> {
    try {
      const response = await apiClient.get('/excavations/export-mapping', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting mapping data:', error);
      throw error;
    }
  }
}; 