import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export interface Finding {
  id: string;
  name: string;
  type: string;
  material: string;
  description: string;
  coordinates: [number, number];
  depth: number;
  dimensions: Record<string, number>;
  weight: number;
  condition: string;
  catalog_number: string;
  context: string;
  associations: string[];
  photos: string[];
  drawings: string[];
  fieldwork_session_id: string;
  site_id: string;
  area_id: string;
  project_id: string;
  conservation_treatment: string;
  analyses: string[];
  current_location: string;
  conservation_notes: string;
  associated_documents: any[];
  discovered_by: string;
  discovered_date: string;
  status: 'new' | 'analyzed' | 'documented' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Get all findings for a researcher
export const getFindings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const { data: findings, error } = await supabase
    .from('findings')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return next(new AppError('Error al obtener hallazgos', 500));
  }

  res.status(200).json({
    success: true,
    data: findings || []
  });
});

// Get single finding
export const getFinding = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const { data: finding, error } = await supabase
    .from('findings')
    .select('*')
    .eq('id', id)
    .eq('created_by', userId)
    .single();

  if (error) {
    return next(new AppError('Hallazgo no encontrado', 404));
  }

  res.status(200).json({
    success: true,
    data: finding
  });
});

// Create new finding
export const createFinding = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const {
    name,
    type,
    material,
    description,
    coordinates,
    depth,
    dimensions,
    weight,
    condition,
    catalog_number,
    context,
    associations,
    photos,
    drawings,
    fieldwork_session_id,
    site_id,
    area_id,
    project_id,
    conservation_treatment,
    analyses,
    current_location,
    conservation_notes,
    associated_documents
  } = req.body;

  // Validaciones básicas
  if (!name || !type || !description) {
    return next(new AppError('Faltan campos requeridos', 400));
  }

  const findingData = {
    name,
    type,
    material: material || '',
    description,
    coordinates: coordinates || [0, 0],
    depth: depth || 0,
    dimensions: dimensions || {},
    weight: weight || 0,
    condition: condition || '',
    catalog_number: catalog_number || '',
    context: context || '',
    associations: associations || [],
    photos: photos || [],
    drawings: drawings || [],
    fieldwork_session_id: fieldwork_session_id || null,
    site_id: site_id || null,
    area_id: area_id || null,
    project_id: project_id || null,
    conservation_treatment: conservation_treatment || '',
    analyses: analyses || [],
    current_location: current_location || '',
    conservation_notes: conservation_notes || '',
    associated_documents: associated_documents || [],
    discovered_by: userId,
    discovered_date: new Date().toISOString().split('T')[0],
    status: 'new',
    created_by: userId
  };

  const { data: finding, error } = await supabase
    .from('findings')
    .insert([findingData])
    .select()
    .single();

  if (error) {
    console.error('❌ Error creando hallazgo:', error);
    console.error('📝 Datos enviados:', findingData);
    return next(new AppError(`Error al crear hallazgo: ${error.message}`, 500));
  }

  res.status(201).json({
    success: true,
    data: finding
  });
});

// Update finding
export const updateFinding = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const {
    name,
    type,
    material,
    description,
    coordinates,
    depth,
    dimensions,
    weight,
    condition,
    catalog_number,
    context,
    associations,
    photos,
    drawings,
    fieldwork_session_id,
    site_id,
    area_id,
    project_id,
    conservation_treatment,
    analyses,
    current_location,
    conservation_notes,
    associated_documents,
    status
  } = req.body;

  const updateData = {
    name,
    type,
    material,
    description,
    coordinates,
    depth,
    dimensions,
    weight,
    condition,
    catalog_number,
    context,
    associations,
    photos,
    drawings,
    fieldwork_session_id,
    site_id,
    area_id,
    project_id,
    conservation_treatment,
    analyses,
    current_location,
    conservation_notes,
    associated_documents,
    status,
    updated_at: new Date().toISOString()
  };

  const { data: finding, error } = await supabase
    .from('findings')
    .update(updateData)
    .eq('id', id)
    .eq('created_by', userId)
    .select()
    .single();

  if (error) {
    return next(new AppError('Error al actualizar hallazgo', 500));
  }

  res.status(200).json({
    success: true,
    data: finding
  });
});

// Delete finding
export const deleteFinding = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const { error } = await supabase
    .from('findings')
    .delete()
    .eq('id', id)
    .eq('created_by', userId);

  if (error) {
    return next(new AppError('Error al eliminar hallazgo', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Hallazgo eliminado exitosamente'
  });
});

// Get finding statistics
export const getFindingStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id;
  
  if (!userId) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const { data: findings, error } = await supabase
    .from('findings')
    .select('type, status')
    .eq('created_by', userId);

  if (error) {
    return next(new AppError('Error al obtener estadísticas', 500));
  }

  const stats = {
    total: findings?.length || 0,
    byStatus: {
      new: findings?.filter(f => f.status === 'new').length || 0,
      analyzed: findings?.filter(f => f.status === 'analyzed').length || 0,
      documented: findings?.filter(f => f.status === 'documented').length || 0,
      archived: findings?.filter(f => f.status === 'archived').length || 0
    },
    byType: {
      artifact: findings?.filter(f => f.type === 'artifact').length || 0,
      lithic: findings?.filter(f => f.type === 'lithic').length || 0,
      ceramic: findings?.filter(f => f.type === 'ceramic').length || 0,
      bone: findings?.filter(f => f.type === 'bone').length || 0,
      other: findings?.filter(f => !['artifact', 'lithic', 'ceramic', 'bone'].includes(f.type)).length || 0
    }
  };

  res.status(200).json({
    success: true,
    data: stats
  });
}); 