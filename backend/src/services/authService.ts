import jwt from 'jsonwebtoken';
import { User, UserRole, SubscriptionPlan } from '../types/user';
import supabase from '../config/supabase';
import { AppError } from '../utils/appError';
import { JWTPayload } from '../middleware/authMiddleware';

export class AuthService {
  /**
   * Generar token JWT
   */
  private static generateToken(user: any): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError('JWT_SECRET not configured', 500);
    }

    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    } as any);
  }

  /**
   * Registrar nuevo usuario
   */
  static async register(email: string, password: string, fullName: string, role: UserRole): Promise<{ user: User; token: string }> {
    try {
      // Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw new AppError(authError.message, 400);

      if (!authData.user) throw new AppError('Error creating user', 500);

      // Crear perfil de usuario en la base de datos
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            first_name: fullName.split(' ')[0] || fullName,
            last_name: fullName.split(' ').slice(1).join(' ') || '',
            role,
            is_active: true,
            specialization: 'Arqueología',
            academic_degree: 'Doctorado',
            institution: 'Universidad Nacional de La Plata'
          },
        ])
        .select()
        .single();

      if (userError) throw new AppError(userError.message, 400);

      // Generar token JWT
      const token = this.generateToken(userData);

      return {
        user: userData,
        token,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error registering user', 500);
    }
  }

  /**
   * Iniciar sesión
   */
  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw new AppError(authError.message, 401);

      if (!authData.user) throw new AppError('User not found', 404);

      let { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (userError) throw new AppError(userError.message, 400);
      
      // Si el usuario no existe en la tabla users, crear perfil temporal o usar datos básicos
      if (!userData) {
        console.log('🔧 Usuario no encontrado en tabla users, creando perfil temporal...');
        console.log('🆔 ID del usuario:', authData.user.id);
        console.log('📧 Email del usuario:', authData.user.email);
        
        // Para usuarios existentes en Supabase Auth, crear un perfil temporal
        userData = {
          id: authData.user.id,
          email: authData.user.email,
          first_name: authData.user.email?.split('@')[0] || 'Usuario',
          last_name: '',
          role: 'RESEARCHER',
          is_active: true,
          specialization: 'Arqueología',
          academic_degree: 'Doctorado',
          institution: 'Universidad Nacional de La Plata',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log('✅ Perfil temporal creado para:', userData.email);
        console.log('⚠️  Nota: Este es un perfil temporal. Para persistencia, contacte al administrador.');
      }

      // Generar token JWT
      const token = this.generateToken(userData);

      return {
        user: userData,
        token,
      };
    } catch (error) {
      console.log('❌ Error en login:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error logging in', 500);
    }
  }

  /**
   * Cerrar sesión
   */
  static async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new AppError(error.message, 400);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error logging out', 500);
    }
  }

  /**
   * Obtener usuario actual
   */
  static async getCurrentUser(userId: string): Promise<User> {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw new AppError(userError.message, 400);
      if (!userData) throw new AppError('User not found', 404);

      return userData;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error getting current user', 500);
    }
  }

  /**
   * Actualizar perfil de usuario
   */
  static async updateProfile(userId: string, updateData: Partial<User>): Promise<User> {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (userError) throw new AppError(userError.message, 400);
      if (!userData) throw new AppError('User not found', 404);

      return userData;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating profile', 500);
    }
  }

  /**
   * Cambiar contraseña
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Obtener el usuario actual
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single();

      if (userError || !user) throw new AppError('User not found', 404);

      // Cambiar contraseña en Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw new AppError(updateError.message, 400);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error changing password', 500);
    }
  }

  /**
   * Solicitar restablecimiento de contraseña
   */
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
      });

      if (error) throw new AppError(error.message, 400);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error requesting password reset', 500);
    }
  }

  /**
   * Verificar token de restablecimiento
   */
  static async verifyResetToken(token: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery',
      });

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }
} 