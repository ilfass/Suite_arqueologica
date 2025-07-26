import axios from 'axios';
import { apiClient } from './api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Project {
  id: string;
  name: string;
  description: string;
  methodology: string;
  objectives: string[];
  start_date: string;
  end_date: string;
  budget: number;
  team_size: number;
  director: string;
  site_id: string;
  status: 'planning' | 'active' | 'completed' | 'archived';
  progress: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  milestones?: Milestone[];
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  created_at: string;
  updated_at: string;
}

export interface ProjectStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_budget: number;
  average_progress: number;
}

export interface CreateProjectData {
  name: string;
  description: string;
  methodology: string;
  objectives: string[];
  start_date: string;
  end_date: string;
  budget: number;
  team_size: number;
  director: string;
  site_id: string;
  status?: 'planning' | 'active' | 'completed' | 'archived';
}

export interface CreateMilestoneData {
  project_id: string;
  title: string;
  description: string;
  date: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'delayed';
}

// Obtener todos los proyectos del investigador
export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Obtener un proyecto específico
export const getProject = async (id: string): Promise<Project> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

// Crear un nuevo proyecto
export const createProject = async (projectData: any): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects`, projectData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Actualizar un proyecto
export const updateProject = async (id: string, projectData: Partial<CreateProjectData>): Promise<Project> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/projects/${id}`, projectData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Eliminar un proyecto
export const deleteProject = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/projects/${id}`);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Crear un nuevo hito
export const createMilestone = async (milestoneData: CreateMilestoneData): Promise<Milestone> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects/milestones`, milestoneData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
};

// Actualizar un hito
export const updateMilestone = async (id: string, milestoneData: Partial<CreateMilestoneData>): Promise<Milestone> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/projects/milestones/${id}`, milestoneData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
};

// Eliminar un hito
export const deleteMilestone = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/projects/milestones/${id}`);
  } catch (error) {
    console.error('Error deleting milestone:', error);
    throw error;
  }
};

// Obtener estadísticas de proyectos
export const getProjectStats = async (): Promise<ProjectStats> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/stats`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching project stats:', error);
    throw error;
  }
};

// Obtener sitios arqueológicos para el selector
export const getSites = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sites`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching sites:', error);
    return [];
  }
}; 