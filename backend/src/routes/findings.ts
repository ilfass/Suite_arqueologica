import express from 'express';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// GET /api/findings - Obtener hallazgos del usuario autenticado
router.get('/', AuthMiddleware.authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no autenticado' 
      });
    }

    // Por ahora, retornar un array vacío ya que no tenemos la tabla findings implementada
    // En el futuro, aquí se consultaría la base de datos
    res.json({
      success: true,
      data: [],
      message: 'Hallazgos obtenidos correctamente'
    });
  } catch (error) {
    console.error('Error obteniendo hallazgos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

export default router; 