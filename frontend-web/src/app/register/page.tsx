'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import DevelopmentBanner from '../../components/ui/DevelopmentBanner';

// Tipos para los datos del formulario
interface BaseFormData {
  // Campos comunes
  firstName: string;
  lastName: string;
  country: string;
  province: string;
  city: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'DIRECTOR' | 'RESEARCHER' | 'STUDENT' | 'INSTITUTION' | 'GUEST';
  termsAccepted: boolean;
}

interface InstitutionFormData extends BaseFormData {
  role: 'INSTITUTION';
  institutionName: string;
  institutionAddress: string;
  institutionWebsite: string;
  institutionDepartment: string;
  institutionEmail: string;
  institutionAlternativeEmail: string;
}

interface DirectorFormData extends BaseFormData {
  role: 'DIRECTOR';
  documentId: string;
  highestDegree: string;
  discipline: string;
  formationInstitution: string;
  currentInstitution: string;
  currentPosition: string;
  cvLink: string;
}

interface ResearcherFormData extends BaseFormData {
  role: 'RESEARCHER';
  documentId: string;
  highestDegree: string;
  discipline: string;
  formationInstitution: string;
  currentInstitution: string;
  currentPosition: string;
  cvLink: string;
}

interface StudentFormData extends BaseFormData {
  role: 'STUDENT';
  documentId: string;
  career: string;
  year: string;
  formationInstitution: string;
  researcherRole: string;
  researchArea: string;
}

interface GuestFormData extends BaseFormData {
  role: 'GUEST';
}

type FormData = InstitutionFormData | DirectorFormData | ResearcherFormData | StudentFormData | GuestFormData;

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    // Campos comunes
    firstName: '',
    lastName: '',
    country: '',
    province: '',
    city: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'RESEARCHER',
    termsAccepted: false,
    
    // Campos específicos para RESEARCHER (rol por defecto)
    documentId: '',
    highestDegree: '',
    discipline: '',
    formationInstitution: '',
    currentInstitution: '',
    currentPosition: '',
    cvLink: '',
  } as ResearcherFormData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useDevMode, setUseDevMode] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    
    // Si está cambiando el rol, limpiar campos específicos y establecer nuevos
    if (e.target.name === 'role') {
      const newRole = value as FormData['role'];
      
      // Crear nuevo objeto con campos básicos
      const newFormData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        province: formData.province,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: newRole,
        termsAccepted: formData.termsAccepted,
      };
      
      // Agregar campos específicos según el nuevo rol
      switch (newRole) {
        case 'INSTITUTION':
          newFormData.institutionName = '';
          newFormData.institutionAddress = '';
          newFormData.institutionWebsite = '';
          newFormData.institutionDepartment = '';
          newFormData.institutionEmail = '';
          newFormData.institutionAlternativeEmail = '';
          break;
        case 'DIRECTOR':
          newFormData.documentId = '';
          newFormData.highestDegree = '';
          newFormData.discipline = '';
          newFormData.formationInstitution = '';
          newFormData.currentInstitution = '';
          newFormData.currentPosition = '';
          newFormData.cvLink = '';
          break;
        case 'RESEARCHER':
          newFormData.documentId = '';
          newFormData.highestDegree = '';
          newFormData.discipline = '';
          newFormData.formationInstitution = '';
          newFormData.currentInstitution = '';
          newFormData.currentPosition = '';
          newFormData.cvLink = '';
          break;
        case 'STUDENT':
          newFormData.documentId = '';
          newFormData.career = '';
          newFormData.year = '';
          newFormData.formationInstitution = '';
          newFormData.researcherRole = '';
          newFormData.researchArea = '';
          break;
        case 'GUEST':
          // No campos específicos
          break;
      }
      
      setFormData(newFormData);
    } else {
      // Para otros campos, actualizar normalmente
      setFormData({
        ...formData,
        [e.target.name]: value,
      });
    }
  };

  const validateForm = (): boolean => {
    // Validar campos comunes
    if (!formData.firstName || !formData.lastName || !formData.country || !formData.province || !formData.city) {
      setError('Todos los campos básicos son obligatorios');
      return false;
    }

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Email y contraseña son obligatorios');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    if (!formData.termsAccepted) {
      setError('Debes aceptar los términos y condiciones');
      return false;
    }

    // Validar campos específicos según el rol
    switch (formData.role) {
      case 'INSTITUTION':
        if (!formData.institutionName || !formData.institutionAddress || !formData.institutionDepartment || !formData.institutionEmail) {
          setError('Todos los campos de institución son obligatorios');
          return false;
        }
        break;
      
      case 'DIRECTOR':
        if (!formData.documentId || !formData.highestDegree || !formData.discipline || !formData.formationInstitution) {
          setError('Todos los campos de director son obligatorios');
          return false;
        }
        break;
      
      case 'RESEARCHER':
        if (!formData.documentId || !formData.highestDegree || !formData.discipline || !formData.formationInstitution) {
          setError('Todos los campos de investigador son obligatorios');
          return false;
        }
        break;
      
      case 'STUDENT':
        if (!formData.documentId || !formData.career || !formData.year || !formData.formationInstitution || !formData.researcherRole) {
          setError('Todos los campos de estudiante son obligatorios');
          return false;
        }
        break;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para el backend
      const registerData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        province: formData.province,
        city: formData.city,
        phone: formData.phone,
        role: formData.role,
        termsAccepted: formData.termsAccepted,
        // Campos específicos según el rol
        ...(formData.role === 'INSTITUTION' && {
          institutionName: formData.institutionName,
          institutionAddress: formData.institutionAddress,
          institutionWebsite: formData.institutionWebsite,
          institutionDepartment: formData.institutionDepartment,
          institutionEmail: formData.institutionEmail,
          institutionAlternativeEmail: formData.institutionAlternativeEmail,
        }),
        ...(formData.role === 'DIRECTOR' && {
          documentId: formData.documentId,
          highestDegree: formData.highestDegree,
          discipline: formData.discipline,
          formationInstitution: formData.formationInstitution,
          currentInstitution: formData.currentInstitution,
          currentPosition: formData.currentPosition,
          cvLink: formData.cvLink,
        }),
        ...(formData.role === 'RESEARCHER' && {
          documentId: formData.documentId,
          highestDegree: formData.highestDegree,
          discipline: formData.discipline,
          formationInstitution: formData.formationInstitution,
          currentInstitution: formData.currentInstitution,
          currentPosition: formData.currentPosition,
          cvLink: formData.cvLink,
        }),
        ...(formData.role === 'STUDENT' && {
          documentId: formData.documentId,
          career: formData.career,
          year: formData.year,
          formationInstitution: formData.formationInstitution,
          researcherRole: formData.researcherRole,
          researchArea: formData.researchArea,
        }),
      };

      if (useDevMode) {
        // Usar endpoint de desarrollo para evitar rate limits
        await apiClient.registerDev(registerData);
      } else {
        // Usar endpoint normal
      await register(registerData);
      }
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || err.response?.data?.message || 'Error al registrar usuario';
      setError(errorMessage);
      
      // Si es rate limit y estamos en desarrollo, sugerir usar modo dev
      if (err.response?.status === 429 && process.env.NODE_ENV === 'development') {
        setError(`${errorMessage}\n\n💡 Sugerencia: Activa el "Modo Desarrollo" para evitar rate limits.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderCommonFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          required
          placeholder="Fabian"
        />
        <Input
          label="Apellido"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          required
          placeholder="Ilfass"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="País"
          name="country"
          type="text"
          value={formData.country}
          onChange={handleChange}
          required
          placeholder="Argentina"
        />
        <Input
          label="Provincia"
          name="province"
          type="text"
          value={formData.province}
          onChange={handleChange}
          required
          placeholder="Buenos Aires"
        />
        <Input
          label="Ciudad"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          required
          placeholder="Tandil"
        />
      </div>

      <Input
        label="Teléfono de contacto"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder="+54 221 123-4567"
      />

      <Input
        label="Correo electrónico"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="usuario@example.com"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cargo / Rol académico o institucional
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Selecciona un rol</option>
          <option value="INSTITUTION">Institución</option>
          <option value="DIRECTOR">Director</option>
          <option value="RESEARCHER">Investigador</option>
          <option value="STUDENT">Estudiante</option>
          <option value="GUEST">Invitado</option>
        </select>
      </div>
    </>
  );

  const renderInstitutionFields = () => {
    const institutionData = formData as InstitutionFormData;
    return (
      <>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Institución</h3>
        
        <Input
          label="Nombre de la institución"
          name="institutionName"
          type="text"
          value={institutionData.institutionName}
          onChange={handleChange}
          required
          placeholder="Universidad Nacional del Centro"
        />

        <Input
          label="Dirección de la institución"
          name="institutionAddress"
          type="text"
          value={institutionData.institutionAddress}
          onChange={handleChange}
          required
          placeholder="Calle 9 N° 776, Tandil"
        />

        <Input
          label="Sitio web institucional"
          name="institutionWebsite"
          type="url"
          value={institutionData.institutionWebsite}
          onChange={handleChange}
          placeholder="https://www.unicen.edu.ar"
        />

        <Input
          label="Unidad / Departamento / Área"
          name="institutionDepartment"
          type="text"
          value={institutionData.institutionDepartment}
          onChange={handleChange}
          required
          placeholder="Facultad de Ciencias Humanas"
        />

        <Input
          label="Correo electrónico institucional"
          name="institutionEmail"
          type="email"
          value={institutionData.institutionEmail}
          onChange={handleChange}
          required
          placeholder="institucion@unicen.edu.ar"
        />

        <Input
          label="Correo alternativo (opcional)"
          name="institutionAlternativeEmail"
          type="email"
          value={institutionData.institutionAlternativeEmail}
          onChange={handleChange}
          placeholder="contacto@institucion.com"
        />
      </>
    );
  };

  const renderDirectorFields = () => {
    const directorData = formData as DirectorFormData;
    return (
      <>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Director</h3>
        
        <Input
          label="DNI/INE/Cédula/Pasaporte"
          name="documentId"
          type="text"
          value={directorData.documentId}
          onChange={handleChange}
          required
          placeholder="12345678"
        />

        <Input
          label="Título máximo alcanzado"
          name="highestDegree"
          type="text"
          value={directorData.highestDegree}
          onChange={handleChange}
          required
          placeholder="Doctor en Arqueología"
        />

        <Input
          label="Disciplina principal"
          name="discipline"
          type="text"
          value={directorData.discipline}
          onChange={handleChange}
          required
          placeholder="Arqueología"
        />

        <Input
          label="Institución de formación"
          name="formationInstitution"
          type="text"
          value={directorData.formationInstitution}
          onChange={handleChange}
          required
          placeholder="Universidad Nacional del Centro"
        />

        <Input
          label="Institución actual de pertenencia (si aplica)"
          name="currentInstitution"
          type="text"
          value={directorData.currentInstitution}
          onChange={handleChange}
          placeholder="CONICET"
        />

        <Input
          label="Cargo actual / Posición"
          name="currentPosition"
          type="text"
          value={directorData.currentPosition}
          onChange={handleChange}
          placeholder="Investigador Principal"
        />

        <Input
          label="CV / Link a ORCID / CONICET / Academia.edu (opcional)"
          name="cvLink"
          type="url"
          value={directorData.cvLink}
          onChange={handleChange}
          placeholder="https://orcid.org/0000-0000-0000-0000"
        />
      </>
    );
  };

    const renderResearcherFields = () => {
    const researcherData = formData as ResearcherFormData;
    return (
      <>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Investigador</h3>
        
        <Input
          label="DNI/INE/Cédula/Pasaporte"
          name="documentId"
          type="text"
          value={researcherData.documentId}
          onChange={handleChange}
          required
          placeholder="12345678"
        />

        <Input
          label="Título máximo alcanzado"
          name="highestDegree"
          type="text"
          value={researcherData.highestDegree}
          onChange={handleChange}
          required
          placeholder="Doctor en Arqueología"
        />

        <Input
          label="Disciplina principal"
          name="discipline"
          type="text"
          value={researcherData.discipline}
          onChange={handleChange}
          required
          placeholder="Arqueología"
        />

        <Input
          label="Institución de formación"
          name="formationInstitution"
          type="text"
          value={researcherData.formationInstitution}
          onChange={handleChange}
          required
          placeholder="Universidad Nacional del Centro"
        />

        <Input
          label="Institución actual de pertenencia (opcional)"
          name="currentInstitution"
          type="text"
          value={researcherData.currentInstitution}
          onChange={handleChange}
          placeholder="CONICET"
        />

        <Input
          label="Cargo actual / Posición (opcional)"
          name="currentPosition"
          type="text"
          value={researcherData.currentPosition}
          onChange={handleChange}
          placeholder="Investigador Principal"
        />

        <Input
          label="CV / Link a ORCID / CONICET / Academia.edu (opcional)"
          name="cvLink"
          type="url"
          value={researcherData.cvLink}
          onChange={handleChange}
          placeholder="https://orcid.org/0000-0000-0000-0000"
        />
      </>
    );
  };

  const renderStudentFields = () => {
    const studentData = formData as StudentFormData;
    return (
      <>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Estudiante</h3>
        
        <Input
          label="DNI/INE/Cédula/Pasaporte"
          name="documentId"
          type="text"
          value={studentData.documentId}
          onChange={handleChange}
          required
          placeholder="12345678"
        />

        <Input
          label="Carrera / Programa académico"
          name="career"
          type="text"
          value={studentData.career}
          onChange={handleChange}
          required
          placeholder="Licenciatura en Antropología"
        />

        <Input
          label="Año en curso"
          name="year"
          type="text"
          value={studentData.year}
          onChange={handleChange}
          required
          placeholder="3er año"
        />

        <Input
          label="Institución de formación"
          name="formationInstitution"
          type="text"
          value={studentData.formationInstitution}
          onChange={handleChange}
          required
          placeholder="Universidad Nacional del Centro"
        />

        <Input
          label="Rol"
          name="researcherRole"
          type="text"
          value={studentData.researcherRole}
          onChange={handleChange}
          required
          placeholder="Tesista, Pasante, Ayudante, Becario"
        />

        <Input
          label="Área de investigación (opcional)"
          name="researchArea"
          type="text"
          value={studentData.researchArea}
          onChange={handleChange}
          placeholder="Arqueología Maya, Antropología Biológica"
        />
      </>
    );
  };

  const renderPasswordFields = () => (
    <>
      <Input
        label="Contraseña"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        placeholder="••••••••"
        helperText="Mínimo 8 caracteres"
      />

      <Input
        label="Confirmar contraseña"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        placeholder="••••••••"
      />
    </>
  );

  const renderTermsAndConditions = () => (
    <div className="flex items-start">
      <input
        id="termsAccepted"
        name="termsAccepted"
        type="checkbox"
        checked={formData.termsAccepted}
        onChange={handleChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
        required
      />
      <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-900">
        Acepto los términos de uso y autorizo el tratamiento de mis datos según la política de privacidad
      </label>
    </div>
  );

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'INSTITUTION':
        return renderInstitutionFields();
      case 'DIRECTOR':
        return renderDirectorFields();
      case 'RESEARCHER':
        return renderResearcherFields();
      case 'STUDENT':
        return renderStudentFields();
      case 'GUEST':
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Suite Arqueológica
          </h1>
          <p className="text-gray-600">
            Crea tu cuenta
          </p>
        </div>

        <DevelopmentBanner 
          title="⚠️ Modo Desarrollo Activo - Registro"
          className="mb-6"
        >
          <p className="mb-2">
            <strong>Recordatorio importante para producción:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Configurar correctamente el servicio de email en Supabase</li>
            <li>Ajustar los límites de rate limiting según las necesidades</li>
            <li>Verificar la configuración de autenticación</li>
            <li>Revisar la configuración de seguridad</li>
            <li>Configurar variables de entorno de producción</li>
            <li>Habilitar HTTPS</li>
            <li>Configurar logs y monitoreo</li>
          </ul>
          <p className="mt-2 text-xs">
            <strong>Nota:</strong> Este banner solo aparece en modo desarrollo y no será visible en producción.
          </p>
        </DevelopmentBanner>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
              {renderCommonFields()}
            </div>

            {formData.role && formData.role !== 'GUEST' && (
              <div className="space-y-6">
                {renderRoleSpecificFields()}
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seguridad</h3>
              {renderPasswordFields()}
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Términos y Condiciones</h3>
              {renderTermsAndConditions()}
            </div>

            {/* Modo Desarrollo - Solo visible en desarrollo */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="devMode"
                      type="checkbox"
                      checked={useDevMode}
                      onChange={(e) => setUseDevMode(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="devMode" className="ml-2 text-sm font-medium text-blue-800">
                      🚀 Modo Desarrollo (Evita Rate Limits)
                    </label>
                  </div>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Solo para desarrollo
                  </span>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  Activa esta opción para usar el endpoint de desarrollo que evita los límites de rate limiting de Supabase.
                </p>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              {useDevMode ? 'Crear cuenta (Modo Dev)' : 'Crear cuenta'}
            </Button>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 