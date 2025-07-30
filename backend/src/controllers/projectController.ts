import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { ProjectService } from '../services/projectService';

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

// Get all projects for a researcher
export const getProjects = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return next(new AppError('Error al obtener proyectos', 500));
  }

  res.status(200).json({
    success: true,
    data: projects || []
  });
});

// Get single project
export const getProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('created_by', userId)
    .single();

  if (error) {
    return next(new AppError('Proyecto no encontrado', 404));
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// Create new project
export const createProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const {
    name,
    description,
    methodology,
    objectives,
    start_date,
    end_date,
    budget,
    team_size,
    director,
    site_id,
    status = 'planning'
  } = req.body;

  // Validate required fields
  if (!name || !description || !methodology || !start_date || !end_date || !budget || !team_size || !director || !site_id) {
    return next(new AppError('Todos los campos son requeridos', 400));
  }

  const projectData = {
    name,
    description,
    methodology,
    objectives: objectives || [],
    start_date,
    end_date,
    budget: parseFloat(budget),
    team_size: parseInt(team_size),
    director,
    site_id,
    status,
    progress: 0,
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: project, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single();

  if (error) {
    return next(new AppError('Error al crear proyecto', 500));
  }

  res.status(201).json({
    success: true,
    data: project
  });
});

// Update project
export const updateProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  // Check if project exists and belongs to user
  const { data: existingProject, error: checkError } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .eq('created_by', userId)
    .single();

  if (checkError || !existingProject) {
    return next(new AppError('Proyecto no encontrado', 404));
  }

  const updateData = {
    ...req.body,
    updated_at: new Date().toISOString()
  };

  const { data: project, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return next(new AppError('Error al actualizar proyecto', 500));
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// Delete project
export const deleteProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  // Check if project exists and belongs to user
  const { data: existingProject, error: checkError } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .eq('created_by', userId)
    .single();

  if (checkError || !existingProject) {
    return next(new AppError('Proyecto no encontrado', 404));
  }

  // Delete milestones first
  await supabase
    .from('milestones')
    .delete()
    .eq('project_id', id);

  // Delete project
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    return next(new AppError('Error al eliminar proyecto', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Proyecto eliminado exitosamente'
  });
});

// Create milestone
export const createMilestone = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const { project_id, title, description, date, status = 'pending' } = req.body;

  if (!project_id || !title || !description || !date) {
    return next(new AppError('Todos los campos son requeridos', 400));
  }

  // Check if project exists and belongs to user
  const { data: project, error: checkError } = await supabase
    .from('projects')
    .select('id')
    .eq('id', project_id)
    .eq('created_by', userId)
    .single();

  if (checkError || !project) {
    return next(new AppError('Proyecto no encontrado', 404));
  }

  const milestoneData = {
    project_id,
    title,
    description,
    date,
    status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: milestone, error } = await supabase
    .from('milestones')
    .insert([milestoneData])
    .select()
    .single();

  if (error) {
    return next(new AppError('Error al crear hito', 500));
  }

  res.status(201).json({
    success: true,
    data: milestone
  });
});

// Update milestone
export const updateMilestone = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  // Check if milestone exists and belongs to user's project
  const { data: existingMilestone, error: checkError } = await supabase
    .from('milestones')
    .select(`
      *,
      projects!inner(created_by)
    `)
    .eq('id', id)
    .eq('projects.created_by', userId)
    .single();

  if (checkError || !existingMilestone) {
    return next(new AppError('Hito no encontrado', 404));
  }

  const updateData = {
    ...req.body,
    updated_at: new Date().toISOString()
  };

  const { data: milestone, error } = await supabase
    .from('milestones')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return next(new AppError('Error al actualizar hito', 500));
  }

  res.status(200).json({
    success: true,
    data: milestone
  });
});

// Delete milestone
export const deleteMilestone = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  // Check if milestone exists and belongs to user's project
  const { data: existingMilestone, error: checkError } = await supabase
    .from('milestones')
    .select(`
      *,
      projects!inner(created_by)
    `)
    .eq('id', id)
    .eq('projects.created_by', userId)
    .single();

  if (checkError || !existingMilestone) {
    return next(new AppError('Hito no encontrado', 404));
  }

  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', id);

  if (error) {
    return next(new AppError('Error al eliminar hito', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Hito eliminado exitosamente'
  });
});

// Get project statistics
export const getProjectStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const { data: projects, error } = await supabase
    .from('projects')
    .select('status, budget, progress')
    .eq('created_by', userId);

  if (error) {
    return next(new AppError('Error al obtener estadísticas', 500));
  }

  const stats = {
    total_projects: projects?.length || 0,
    active_projects: projects?.filter(p => p.status === 'active').length || 0,
    completed_projects: projects?.filter(p => p.status === 'completed').length || 0,
    total_budget: projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0,
    average_progress: projects?.length ? 
      projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length : 0
  };

  res.status(200).json({
    success: true,
    data: stats
  });
}); 