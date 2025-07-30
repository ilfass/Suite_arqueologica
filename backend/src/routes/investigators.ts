import express from 'express';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Obtener configuración de vidriera pública de un investigador
router.get('/:id/public-profile', AuthMiddleware.authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Verificar que el usuario solo puede ver su propia configuración
    if (userId !== id) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permisos para ver esta configuración' 
      });
    }

    // Por ahora, devolver configuración por defecto
    // En el futuro, esto vendría de la base de datos
    const publicProfile = {
      id: userId,
      isPublic: false,
      displayName: req.user?.fullName || req.user?.email || '',
      bio: 'Investigador arqueológico especializado en...',
      specialization: 'Arqueología, Antropología, Historia',
      institution: 'Universidad Nacional',
      location: 'Buenos Aires, Argentina',
      email: req.user?.email || '',
      website: '',
      socialMedia: {},
      publicProjects: [],
      publicFindings: [],
      publicReports: [],
      publicPublications: [],
      customMessage: 'Bienvenidos a mi espacio de investigación arqueológica.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: publicProfile
    });

  } catch (error) {
    console.error('Error obteniendo configuración de vidriera:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Actualizar configuración de vidriera pública
router.put('/:id/public-profile', AuthMiddleware.authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updateData = req.body;

    // Verificar que el usuario solo puede actualizar su propia configuración
    if (userId !== id) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permisos para actualizar esta configuración' 
      });
    }

    // Validar datos requeridos
    if (!updateData.displayName) {
      return res.status(400).json({ 
        success: false, 
        message: 'El nombre para mostrar es requerido' 
      });
    }

    // Por ahora, simular guardado exitoso
    // En el futuro, esto se guardaría en la base de datos
    const updatedProfile = {
      id: userId,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      data: updatedProfile
    });

  } catch (error) {
    console.error('Error actualizando configuración de vidriera:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

export default router; 