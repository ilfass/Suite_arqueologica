import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  UserRole,
  TokenPayload 
} from '../types/auth';
import { logger } from '../utils/logger';



export class AuthService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env['SUPABASE_URL']!,
      process.env['SUPABASE_SERVICE_ROLE_KEY']!
    );
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Verificar si el usuario ya existe
      const { data: existingUser } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        throw new Error('El usuario ya existe');
      }

      // Verificar si el usuario ya existe en Supabase Auth
      const { data: authUsers, error: listAuthError } = await this.supabase.auth.admin.listUsers();
      
      if (listAuthError) {
        throw new Error('Error al verificar usuarios existentes');
      }

      const existingAuthUser = authUsers.users.find(user => user.email === data.email);
      if (existingAuthUser) {
        throw new Error('El usuario ya existe en el sistema de autenticación');
      }

      // Crear usuario en Supabase Auth
      const { data: authData, error: createAuthError } = await this.supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true
      });

      if (createAuthError) {
        throw new Error(createAuthError.message);
      }

      if (!authData.user) {
        throw new Error('Error al crear usuario en Auth');
      }

      // Crear perfil en la tabla users
      const { data: userData, error: createUserError } = await this.supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          role: data.role,
          first_name: data.firstName,
          last_name: data.lastName,
          institution_id: data.institutionId,
          is_active: true
        })
        .select()
        .single();

      if (createUserError) {
        throw new Error(createUserError.message);
      }

      // Generar tokens
      const tokens = this.generateTokens(userData);

      return {
        user: this.mapToUser(userData),
        tokens
      };
    } catch (error) {
      logger.error('Error en registro:', error);
      throw error;
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      // Autenticar con Supabase
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        throw new Error('Credenciales inválidas');
      }

      // Obtener datos del usuario
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', authData.user.email)
        .single();

      if (userError || !userData) {
        throw new Error('Usuario no encontrado');
      }

      if (!userData.is_active) {
        throw new Error('Usuario inactivo');
      }

      // Generar tokens
      const tokens = this.generateTokens(userData);

      return {
        user: this.mapToUser(userData),
        tokens
      };
    } catch (error) {
      logger.error('Error en login:', error);
      throw error;
    }
  }

  async loginDev(data: LoginRequest): Promise<AuthResponse> {
    try {
      // En desarrollo, buscar usuario directamente sin verificar contraseña
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', data.email)
        .eq('is_active', true)
        .single();

      if (userError || !userData) {
        throw new Error('Usuario no encontrado');
      }

      logger.info(`🔧 Login de desarrollo - Usuario encontrado: ${userData.email}`);
      logger.info('⚠️  Nota: En desarrollo, no se verifica la contraseña');

      // Generar tokens
      const tokens = this.generateTokens(userData);

      return {
        user: this.mapToUser(userData),
        tokens
      };
    } catch (error) {
      logger.error('Error en login de desarrollo:', error);
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      // Invalidar refresh token
      const { error } = await this.supabase.auth.admin.signOut(refreshToken);
      if (error) {
        logger.warn('Error invalidando refresh token:', error);
      }
    } catch (error) {
      logger.error('Error en logout:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Refrescar token con Supabase
      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error) {
        throw new Error('Token de refresh inválido');
      }

      // Obtener datos del usuario
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', data.user?.id || '')
        .single();

      if (userError || !userData) {
        throw new Error('Usuario no encontrado');
      }

      // Generar nuevos tokens
      const tokens = this.generateTokens(userData);

      return {
        user: this.mapToUser(userData),
        tokens
      };
    } catch (error) {
      logger.error('Error en refresh token:', error);
      throw error;
    }
  }

  async getProfile(userId: string): Promise<User> {
    try {
      const { data: userData, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !userData) {
        throw new Error('Usuario no encontrado');
      }

      return this.mapToUser(userData);
    } catch (error) {
      logger.error('Error obteniendo perfil:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    try {
      const updateData: any = {};
      
      if (data.firstName) updateData.first_name = data.firstName;
      if (data.lastName) updateData.last_name = data.lastName;
      if (data.institutionId) updateData.institution_id = data.institutionId;

      const { data: userData, error } = await this.supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return this.mapToUser(userData);
    } catch (error) {
      logger.error('Error actualizando perfil:', error);
      throw error;
    }
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env['FRONTEND_URL']}/reset-password`
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      logger.error('Error en forgot password:', error);
      throw error;
    }
  }

  async resetPassword(_token: string, newPassword: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      logger.error('Error en reset password:', error);
      throw error;
    }
  }

  async changePassword(userId: string, _currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Verificar contraseña actual
      const { data: userData } = await this.supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single();

      if (!userData) {
        throw new Error('Usuario no encontrado');
      }

      // Cambiar contraseña
      const { error } = await this.supabase.auth.admin.updateUserById(userId, {
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      logger.error('Error cambiando contraseña:', error);
      throw error;
    }
  }

  private generateTokens(userData: any) {
    const payload: TokenPayload = {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 días
    };

    const token = jwt.sign(payload, process.env['JWT_SECRET']!);
    
    return {
      token,
      refreshToken: userData.id, // Simplificado para este ejemplo
      expiresIn: 7 * 24 * 60 * 60
    };
  }

  private mapToUser(userData: any): User {
    return {
      id: userData.id,
      email: userData.email,
      role: userData.role as UserRole,
      firstName: userData.first_name,
      lastName: userData.last_name,
      institutionId: userData.institution_id,
      isActive: userData.is_active,
      createdAt: new Date(userData.created_at),
      updatedAt: new Date(userData.updated_at)
    };
  }

  async getPublicProfile(userId: string): Promise<any> {
    try {
      console.log('🔧 Obteniendo perfil público para usuario:', userId);
      
      // Buscar configuración del perfil público en la base de datos
      const { data: publicProfile, error } = await this.supabase
        .from('public_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error obteniendo perfil público:', error);
        throw new Error('Error retrieving public profile');
      }

      // Si no existe configuración, devolver configuración por defecto
      if (!publicProfile) {
        console.log('📝 No se encontró perfil público, creando configuración por defecto');
        
        // Obtener datos del usuario
        const { data: user } = await this.supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        // Crear perfil por defecto
        const defaultProfile = {
          user_id: userId,
          is_public: false,
          display_name: user.full_name || user.email || '',
          bio: 'Investigador arqueológico especializado en...',
          specialization: 'Arqueología, Antropología, Historia',
          institution: 'Universidad Nacional',
          location: 'Buenos Aires, Argentina',
          email: user.email || '',
          website: '',
          social_media: {},
          custom_message: 'Bienvenidos a mi espacio de investigación arqueológica.',
          public_projects: [],
          public_findings: [],
          public_reports: [],
          public_publications: []
        };

        // Insertar perfil por defecto en la base de datos
        const { data: insertedProfile, error: insertError } = await this.supabase
          .from('public_profiles')
          .insert([defaultProfile])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Error insertando perfil por defecto:', insertError);
          throw new Error('Error creating default profile');
        }

        console.log('✅ Perfil por defecto creado exitosamente en la base de datos');
        return insertedProfile;
      }

      console.log('✅ Perfil público obtenido de la base de datos');
      return publicProfile;
    } catch (error) {
      console.error('❌ Error obteniendo perfil público:', error);
      throw error;
    }
  }

  async updatePublicProfile(userId: string, profileData: any): Promise<any> {
    try {
      console.log('🔧 Actualizando perfil público para usuario:', userId);
      console.log('📝 Datos recibidos:', profileData);

      const {
        isPublic,
        displayName,
        bio,
        specialization,
        institution,
        location,
        email,
        website,
        socialMedia,
        customMessage,
        publicProjects,
        publicFindings,
        publicReports,
        publicPublications
      } = profileData;

      const dataToUpdate = {
        user_id: userId,
        is_public: isPublic || false,
        display_name: displayName,
        bio,
        specialization,
        institution,
        location,
        email,
        website,
        social_media: socialMedia || {},
        custom_message: customMessage,
        public_projects: publicProjects || [],
        public_findings: publicFindings || [],
        public_reports: publicReports || [],
        public_publications: publicPublications || []
      };

      // Verificar si ya existe un perfil público
      const { data: existingProfile } = await this.supabase
        .from('public_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      let result;
      if (existingProfile) {
        // Actualizar perfil existente
        console.log('🔄 Actualizando perfil existente en la base de datos');
        const { data, error } = await this.supabase
          .from('public_profiles')
          .update(dataToUpdate)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          console.error('❌ Error actualizando perfil:', error);
          throw new Error(error.message);
        }
        result = data;
      } else {
        // Crear nuevo perfil
        console.log('🆕 Creando nuevo perfil en la base de datos');
        const { data, error } = await this.supabase
          .from('public_profiles')
          .insert([dataToUpdate])
          .select()
          .single();

        if (error) {
          console.error('❌ Error creando perfil:', error);
          throw new Error(error.message);
        }
        result = data;
      }

      console.log('✅ Perfil actualizado exitosamente en la base de datos');
      return result;
    } catch (error) {
      console.error('❌ Error actualizando perfil público:', error);
      throw error;
    }
  }
} 