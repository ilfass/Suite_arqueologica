import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { supabase } from '../config/supabase';

export const authController = {
  register: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
      // Campos específicos para STUDENT
      studentDocumentId,
      studentHighestDegree,
      studentDiscipline,
      studentFormationInstitution,
      studentCurrentInstitution,
      studentCurrentPosition,
      studentCvLink,
    } = req.body;

    if (!email || !password || !firstName || !lastName || !country || !province || !city || !role || !termsAccepted) {
      return next(new AppError('Please provide all required fields', 400));
    }

    // En desarrollo, permitir registro sin confirmación de email
    const skipEmailConfirmation = process.env.NODE_ENV === 'development' && req.query.skipEmailConfirmation === 'true';
    
    // Para desarrollo, si hay rate limit, usar un email temporal
    let emailToUse = email;
    if (process.env.NODE_ENV === 'development' && req.query.useTempEmail === 'true') {
      emailToUse = `temp-${Date.now()}@example.com`;
    }

    const result = await AuthService.register({
      email: emailToUse,
      password,
      firstName,
      lastName,
      country,
      province,
      city,
      phone,
      role,
      termsAccepted,
      // Campos específicos según el rol
      ...(role === 'INSTITUTION' && {
        institutionName,
        institutionAddress,
        institutionWebsite,
        institutionDepartment,
        institutionEmail,
        institutionAlternativeEmail,
      }),
      ...(role === 'DIRECTOR' && {
        documentId,
        highestDegree,
        discipline,
        formationInstitution,
        currentInstitution,
        currentPosition,
        cvLink,
      }),
      ...(role === 'RESEARCHER' && {
        documentId,
        career,
        year,
        formationInstitution,
        researcherRole,
        researchArea,
        directorId,
      }),
      ...(role === 'STUDENT' && {
        documentId: studentDocumentId,
        highestDegree: studentHighestDegree,
        discipline: studentDiscipline,
        formationInstitution: studentFormationInstitution,
        currentInstitution: studentCurrentInstitution,
        currentPosition: studentCurrentPosition,
        cvLink: studentCvLink,
      }),
    },
    skipEmailConfirmation,
  );

    res.status(201).json({
      success: true,
      data: result,
    });
  }),

  login: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const result = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  logout: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await AuthService.logout();

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }),

  getCurrentUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const user = await AuthService.getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: user,
      },
    });
  }),

  updateProfile: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const updateData = req.body;
    const user = await AuthService.updateProfile(req.user.id, updateData);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  changePassword: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const { currentPassword, newPassword } = req.body;
    await AuthService.changePassword(req.user.id, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  }),

  requestPasswordReset: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await AuthService.requestPasswordReset(email);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });
  }),

  verifyResetToken: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const isValid = await AuthService.verifyResetToken(token);

    res.status(200).json({
      success: true,
      data: { isValid },
    });
  }),

  // Endpoint específico para desarrollo que evita rate limits
  registerDev: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== 'development') {
      return next(new AppError('Este endpoint solo está disponible en desarrollo', 403));
    }

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
      // Campos específicos para STUDENT
      studentDocumentId,
      studentHighestDegree,
      studentDiscipline,
      studentFormationInstitution,
      studentCurrentInstitution,
      studentCurrentPosition,
      studentCvLink,
    } = req.body;

    if (!email || !password || !firstName || !lastName || !country || !province || !city || !role || !termsAccepted) {
      return next(new AppError('Please provide all required fields', 400));
    }

    try {
      // Crear usuario directamente en la base de datos sin usar Supabase Auth
      const { v4: uuidv4 } = require('uuid');
      const userId = uuidv4();
      
      // Preparar datos del usuario
      const userData: any = {
        id: userId,
        email: email, // Usar el email original
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
          userData.student_document_id = studentDocumentId;
          userData.student_highest_degree = studentHighestDegree;
          userData.student_discipline = studentDiscipline;
          userData.student_formation_institution = studentFormationInstitution;
          userData.student_current_institution = studentCurrentInstitution;
          userData.student_current_position = studentCurrentPosition;
          userData.student_cv_link = studentCvLink;
          break;
      }

      // Crear perfil de usuario en la base de datos
      const { data: createdUser, error: userError } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (userError) throw new AppError(userError.message, 400);

      // Generar token JWT simple para desarrollo
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { 
          id: createdUser.id, 
          email: createdUser.email, 
          role: createdUser.role,
          fullName: `${createdUser.first_name} ${createdUser.last_name}`.trim()
        }, 
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        data: {
          user: createdUser,
          token,
          message: 'Usuario registrado exitosamente en modo desarrollo (sin confirmación de email)'
        },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error registering user in development mode', 500);
    }
  }),

  // Endpoint de login específico para desarrollo
  loginDev: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== 'development') {
      return next(new AppError('Este endpoint solo está disponible en desarrollo', 403));
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    try {
      // Buscar usuario directamente en la base de datos
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (userError || !user) {
        throw new AppError('Invalid login credentials', 401);
      }

      // En desarrollo, no verificamos la contraseña (por simplicidad)
      // En producción, esto debería usar bcrypt para verificar la contraseña
      console.log('🔧 Login de desarrollo - Usuario encontrado:', user.email);
      console.log('⚠️  Nota: En desarrollo, no se verifica la contraseña');

      // Generar token JWT
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          fullName: `${user.first_name} ${user.last_name}`.trim()
        }, 
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        data: {
          user,
          token,
          message: 'Login exitoso en modo desarrollo'
        },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error logging in development mode', 500);
    }
  }),

  // Obtener perfil público por ID de usuario (para páginas públicas)
  getPublicProfileById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new AppError('ID de usuario requerido', 400));
    }

    try {
      // Buscar configuración del perfil público
      const { data: publicProfile, error } = await supabase
        .from('public_profiles')
        .select('*')
        .eq('user_id', id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new AppError('Error retrieving public profile', 500);
      }

      // Si no existe configuración o no es público, devolver error
      if (!publicProfile || !publicProfile.is_public) {
        return next(new AppError('Perfil público no encontrado o no disponible', 404));
      }

      res.status(200).json({
        success: true,
        data: publicProfile
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error retrieving public profile', 500);
    }
  }),

  // Obtener configuración del perfil público
  getPublicProfile: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    try {
      // Buscar configuración del perfil público
      const { data: publicProfile, error } = await supabase
        .from('public_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new AppError('Error retrieving public profile', 500);
      }

      // Si no existe configuración, devolver configuración por defecto
      if (!publicProfile) {
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        const defaultProfile = {
          user_id: userId,
          is_public: false,
          display_name: user?.full_name || user?.email || '',
          bio: 'Investigador arqueológico especializado en...',
          specialization: user?.specialization || 'Arqueología, Antropología, Historia',
          institution: user?.institution || 'Universidad Nacional',
          location: 'Buenos Aires, Argentina',
          email: user?.email || '',
          website: '',
          social_media: {},
          custom_message: 'Bienvenidos a mi espacio de investigación arqueológica.',
          public_projects: [],
          public_findings: [],
          public_reports: [],
          public_publications: []
        };

        res.status(200).json({
          success: true,
          data: defaultProfile
        });
      } else {
        res.status(200).json({
          success: true,
          data: publicProfile
        });
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error retrieving public profile', 500);
    }
  }),

  // Actualizar configuración del perfil público
  updatePublicProfile: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
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
    } = req.body;

    try {
      const profileData = {
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

      // Usar upsert para manejar tanto inserción como actualización
      const { data, error } = await supabase
        .from('public_profiles')
        .upsert([profileData], {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error en upsert:', error);
        throw new AppError(`Error updating public profile: ${error.message}`, 400);
      }

      res.status(200).json({
        success: true,
        data: data,
        message: 'Perfil público actualizado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error en updatePublicProfile:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating public profile', 500);
    }
  }),
}; 