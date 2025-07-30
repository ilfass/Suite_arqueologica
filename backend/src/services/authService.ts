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
  static async register(registerData: any, skipEmailConfirmation: boolean = false): Promise<{ user: User; token: string }> {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        country,
        province,
        city,
        phone,
        role,
        termsAccepted,
        // Campos específicos para INSTITUTION
        institutionName,
        institutionAddress,
        institutionWebsite,
        institutionDepartment,
        institutionEmail,
        institutionAlternativeEmail,
        // Campos específicos para DIRECTOR
        documentId,
        highestDegree,
        discipline,
        formationInstitution,
        currentInstitution,
        currentPosition,
        cvLink,
        // Campos específicos para RESEARCHER
        career,
        year,
        researcherRole,
        researchArea,
        directorId,
      } = registerData;

      let authData: any = null;
      let authError: any = null;

      if (skipEmailConfirmation && process.env.NODE_ENV === 'development') {
        // En desarrollo, crear usuario directamente sin confirmación de email
        const { data, error } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        authData = { user: data.user };
        authError = error;
      } else {
        // Registro normal con confirmación de email
        const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
        authData = data;
        authError = error;
      }

      if (authError) {
        // Manejar específicamente el rate limit de email
        if (authError.message.includes('rate limit') || authError.message.includes('too many requests')) {
          throw new AppError('Se ha excedido el límite de envío de emails de confirmación. Por favor, espera unos minutos antes de intentar nuevamente o usa un email diferente.', 429);
        }
        throw new AppError(authError.message, 400);
      }

      if (!authData.user) throw new AppError('Error creating user', 500);

      // Preparar datos del usuario según el rol
      const userData: any = {
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        country,
        province,
        city,
        phone,
        role,
        terms_accepted: termsAccepted,
        terms_accepted_at: termsAccepted ? new Date().toISOString() : null,
        is_active: true,
      };

      // Agregar campos específicos según el rol
      switch (role) {
        case 'INSTITUTION':
          userData.institution_name = institutionName;
          userData.institution_address = institutionAddress;
          userData.institution_website = institutionWebsite;
          userData.institution_department = institutionDepartment;
          userData.institution_email = institutionEmail;
          userData.institution_alternative_email = institutionAlternativeEmail;
          break;
        
        case 'DIRECTOR':
          userData.director_document_id = documentId;
          userData.director_highest_degree = highestDegree;
          userData.director_discipline = discipline;
          userData.director_formation_institution = formationInstitution;
          userData.director_current_institution = currentInstitution;
          userData.director_current_position = currentPosition;
          userData.director_cv_link = cvLink;
          break;
        
        case 'RESEARCHER':
          userData.researcher_document_id = documentId;
          userData.researcher_career = career;
          userData.researcher_year = year;
          userData.researcher_formation_institution = formationInstitution;
          userData.researcher_role = researcherRole;
          userData.researcher_area = researchArea;
          userData.researcher_director_id = directorId;
          break;
        
        case 'STUDENT':
          userData.student_document_id = documentId;
          userData.student_highest_degree = highestDegree;
          userData.student_discipline = discipline;
          userData.student_formation_institution = formationInstitution;
          userData.student_current_institution = currentInstitution;
          userData.student_current_position = currentPosition;
          userData.student_cv_link = cvLink;
          break;
      }

      // Crear perfil de usuario en la base de datos
      const { data: createdUser, error: userError } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (userError) throw new AppError(userError.message, 400);

      // Generar token JWT
      const token = this.generateToken(createdUser);

      return {
        user: createdUser,
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

      if (userError) {
        // Si el usuario no existe en la tabla users, crear perfil temporal
        console.log('🔧 Usuario no encontrado en tabla users, creando perfil temporal...');
        console.log('🆔 ID del usuario:', userId);
        
        // Obtener información básica del usuario desde Supabase Auth
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser.user) {
          throw new AppError('User not found in auth system', 404);
        }

        const tempUser: User = {
          id: authUser.user.id,
          email: authUser.user.email || '',
          role: 'RESEARCHER' as UserRole,
          first_name: authUser.user.email?.split('@')[0] || 'Usuario',
          last_name: '',
          institution: 'Universidad Nacional de La Plata',
          specialization: 'Arqueología',
          academic_degree: 'Doctorado',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('✅ Perfil temporal creado para:', tempUser.email);
        console.log('⚠️  Nota: Este es un perfil temporal. Para persistencia, contacte al administrador.');
        
        return tempUser;
      }
      
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