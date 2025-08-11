import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export interface Site {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  area_id: string;
  project_id: string;
  status: 'active' | 'completed' | 'planning';
  type: 'excavation' | 'survey' | 'monitoring';
  findings_count: number;
  artifacts_count: number;
  samples_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Get all sites for a researcher
export const getSites = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const { data: sites, error } = await supabase
    .from('sites')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return next(new AppError('Error al obtener sitios', 500));
  }

  res.status(200).json({
    success: true,
    data: sites || []
  });
});

// Get single site
export const getSite = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const { data: site, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .eq('created_by', userId)
    .single();

  if (error) {
    return next(new AppError('Sitio no encontrado', 404));
  }

  res.status(200).json({
    success: true,
    data: site
  });
});

// Create new site
export const createSite = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const {
    name,
    description,
    coordinates,
    area_id,
    project_id,
    status,
    type
  } = req.body;

  // Validaciones básicas
  if (!name || !description) {
    return next(new AppError('Faltan campos requeridos', 400));
  }

  const siteData = {
    name,
    description,
    coordinates: coordinates || [0, 0],
    area_id,
    project_id,
    status: status || 'planning',
    type: type || 'excavation',
    findings_count: 0,
    artifacts_count: 0,
    samples_count: 0,
    created_by: userId
  };

  const { data: site, error } = await supabase
    .from('sites')
    .insert([siteData])
    .select()
    .single();

  if (error) {
    console.error('❌ Error creando sitio:', error);
    console.error('📝 Datos enviados:', siteData);
    return next(new AppError(`Error al crear sitio: ${error.message}`, 500));
  }

  res.status(201).json({
    success: true,
    data: site
  });
});

// Update site
export const updateSite = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const {
    name,
    description,
    coordinates,
    area_id,
    project_id,
    status,
    type
  } = req.body;

  const updateData = {
    name,
    description,
    coordinates,
    area_id,
    project_id,
    status,
    type,
    updated_at: new Date().toISOString()
  };

  const { data: site, error } = await supabase
    .from('sites')
    .update(updateData)
    .eq('id', id)
    .eq('created_by', userId)
    .select()
    .single();

  if (error) {
    return next(new AppError('Error al actualizar sitio', 500));
  }

  res.status(200).json({
    success: true,
    data: site
  });
});

// Delete site
export const deleteSite = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', id)
    .eq('created_by', userId);

  if (error) {
    return next(new AppError('Error al eliminar sitio', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Sitio eliminado exitosamente'
  });
});

// Get site statistics
export const getSiteStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const { data: sites, error } = await supabase
    .from('sites')
    .select('status, type')
    .eq('created_by', userId);

  if (error) {
    return next(new AppError('Error al obtener estadísticas', 500));
  }

  const stats = {
    total: sites?.length || 0,
    byStatus: {
      active: sites?.filter(s => s.status === 'active').length || 0,
      completed: sites?.filter(s => s.status === 'completed').length || 0,
      planning: sites?.filter(s => s.status === 'planning').length || 0
    },
    byType: {
      excavation: sites?.filter(s => s.type === 'excavation').length || 0,
      survey: sites?.filter(s => s.type === 'survey').length || 0,
      monitoring: sites?.filter(s => s.type === 'monitoring').length || 0
    }
  };

  res.status(200).json({
    success: true,
    data: stats
  });
}); 