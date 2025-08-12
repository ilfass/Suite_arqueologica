import axios from 'axios';

// Normaliza la base para que siempre incluya el sufijo "/api"
const rawApiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
const API_BASE_URL = rawApiBase.endsWith('/api')
  ? rawApiBase
  : `${rawApiBase.replace(/\/$/, '')}/api`;

export interface User {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'researcher' | 'student' | 'director' | 'institution' | 'guest' | 'ADMIN' | 'RESEARCHER' | 'STUDENT' | 'DIRECTOR' | 'INSTITUTION' | 'GUEST';
  institution?: string;
  specialization?: string;
  is_public_researcher?: boolean;
  created_at: string;
  updated_at: string;
  bio?: string;
  subscription_plan?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  // Campos comunes
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  province: string;
  city: string;
  phone?: string;
  role: User['role'];
  termsAccepted: boolean;
  
  // Campos específicos para INSTITUTION
  institutionName?: string;
  institutionAddress?: string;
  institutionWebsite?: string;
  institutionDepartment?: string;
  institutionEmail?: string;
  institutionAlternativeEmail?: string;
  
  // Campos específicos para DIRECTOR
  documentId?: string;
  highestDegree?: string;
  discipline?: string;
  formationInstitution?: string;
  currentInstitution?: string;
  currentPosition?: string;
  cvLink?: string;
  
  // Campos específicos para RESEARCHER
  career?: string;
  year?: string;
  researcherRole?: string;
  researchArea?: string;
  directorId?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Recuperar token del localStorage al inicializar
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
      // El backend devuelve { success: true, data: { user, token } }
      return response.data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Método de login para desarrollo que evita problemas de autenticación
  async loginDev(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login-dev`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Login dev error:', error);
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      }
      throw new Error('Error en login de desarrollo. Por favor, intenta nuevamente.');
    }
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
      // El backend devuelve { success: true, data: { user, token } }
      return response.data.data;
    } catch (error: any) {
      console.error('Register error:', error);
      
      // Manejar errores específicos
      if (error.response?.status === 429 || 
          (error.response?.data?.error?.message && 
           error.response.data.error.message.includes('rate limit'))) {
        throw new Error('Se ha excedido el límite de envío de emails de confirmación. Por favor, espera unos minutos antes de intentar nuevamente o usa un email diferente.');
      }
      
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      }
      
      if (error.response?.status === 400) {
        throw new Error('Datos de registro inválidos. Por favor, verifica que todos los campos requeridos estén completos.');
      }
      
      throw new Error('Error al registrar usuario. Por favor, intenta nuevamente.');
    }
  }

  // Método alternativo para desarrollo que evita rate limits
  async registerDev(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register-dev`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Register dev error:', error);
      throw new Error('Error en registro de desarrollo. Por favor, intenta nuevamente.');
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: this.getHeaders()
      });
      return response.data.data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, data, {
        headers: this.getHeaders()
      });
      return response.data.user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Métodos para sitios arqueológicos
  async getSites(): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/sites`, {
        headers: this.getHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Get sites error:', error);
      return [];
    }
  }

  async createSite(data: any): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/sites`, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Create site error:', error);
      throw error;
    }
  }

  // Métodos para objetos
  async getObjects(): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/objects`, {
        headers: this.getHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Get objects error:', error);
      return [];
    }
  }

  async createObject(data: any): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/objects`, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Create object error:', error);
      throw error;
    }
  }

  // Métodos para excavaciones
  async getExcavations(): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/excavations`, {
        headers: this.getHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Get excavations error:', error);
      return [];
    }
  }

  async createExcavation(data: any): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/excavations`, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Create excavation error:', error);
      throw error;
    }
  }

  // Métodos para investigadores
  async getResearchers(): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/researchers`, {
        headers: this.getHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Get researchers error:', error);
      return [];
    }
  }

  async createResearcher(data: any): Promise<any> {
    try {
      const response = await axios.post(`${API_BASE_URL}/researchers`, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Create researcher error:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient(); 