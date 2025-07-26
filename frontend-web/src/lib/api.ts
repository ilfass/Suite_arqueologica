import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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
  email: string;
  password: string;
  fullName: string;
  role: User['role'];
  institution?: string;
  specialization?: string;
  is_public_researcher?: boolean;
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

  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
      // El backend devuelve { success: true, data: { user, token } }
      return response.data.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
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