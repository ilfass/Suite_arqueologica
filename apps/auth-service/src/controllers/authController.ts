import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { logger } from '../utils/logger';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../../../shared/types/auth';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const registerData: RegisterRequest = req.body;
      logger.info(`📝 Registro de usuario: ${registerData.email}`);

      const result = await this.authService.register(registerData);
      
      logger.info(`✅ Usuario registrado exitosamente: ${registerData.email}`);
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result
      });
    } catch (error) {
      logger.error('❌ Error en registro:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error en el registro',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const loginData: LoginRequest = req.body;
      logger.info(`🔐 Login intento: ${loginData.email}`);

      const result = await this.authService.login(loginData);
      
      logger.info(`✅ Login exitoso: ${loginData.email}`);
      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: result
      });
    } catch (error) {
      logger.error('❌ Error en login:', error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Credenciales inválidas',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      logger.info('🚪 Logout solicitado');

      await this.authService.logout(refreshToken);
      
      logger.info('✅ Logout exitoso');
      res.status(200).json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      logger.error('❌ Error en logout:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error en logout'
      });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      logger.info('🔄 Refresh token solicitado');

      const result = await this.authService.refreshToken(refreshToken);
      
      logger.info('✅ Token refrescado exitosamente');
      res.status(200).json({
        success: true,
        message: 'Token refrescado exitosamente',
        data: result
      });
    } catch (error) {
      logger.error('❌ Error en refresh token:', error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Token de refresh inválido'
      });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      logger.info(`👤 Obteniendo perfil: ${userId}`);
      const profile = await this.authService.getProfile(userId);
      
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      logger.error('❌ Error obteniendo perfil:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error obteniendo perfil'
      });
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      logger.info(`✏️ Actualizando perfil: ${userId}`);
      const result = await this.authService.updateProfile(userId, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: result
      });
    } catch (error) {
      logger.error('❌ Error actualizando perfil:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error actualizando perfil'
      });
    }
  };

  verifyToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      logger.info('🔍 Verificando token');

      const result = await this.authService.verifyToken(token);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('❌ Error verificando token:', error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Token inválido'
      });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      logger.info(`📧 Solicitud de reset de contraseña: ${email}`);

      await this.authService.forgotPassword(email);
      
      res.status(200).json({
        success: true,
        message: 'Email de reset enviado exitosamente'
      });
    } catch (error) {
      logger.error('❌ Error en forgot password:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error enviando email de reset'
      });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      logger.info('🔑 Reset de contraseña solicitado');

      await this.authService.resetPassword(token, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (error) {
      logger.error('❌ Error en reset password:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error actualizando contraseña'
      });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const { currentPassword, newPassword } = req.body;
      logger.info(`🔑 Cambio de contraseña: ${userId}`);

      await this.authService.changePassword(userId, currentPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Contraseña cambiada exitosamente'
      });
    } catch (error) {
      logger.error('❌ Error cambiando contraseña:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error cambiando contraseña'
      });
    }
  };
}

export const authController = new AuthController(); 