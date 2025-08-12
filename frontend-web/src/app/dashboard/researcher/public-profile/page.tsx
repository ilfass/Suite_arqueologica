'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { useRouter } from 'next/navigation';

interface PublicProfileConfig {
  isPublic: boolean;
  displayName: string;
  bio: string;
  specialization: string;
  institution: string;
  location: string;
  email: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    researchGate?: string;
    academia?: string;
  };
  featuredProject?: string;
  publicProjects: string[];
  publicFindings: string[];
  publicReports: string[];
  publicPublications: string[];
  customMessage?: string;
  profileImage?: string;
  coverImage?: string;
}

const PublicProfilePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [config, setConfig] = useState<PublicProfileConfig>({
    isPublic: false,
    displayName: '',
    bio: '',
    specialization: '',
    institution: '',
    location: '',
    email: '',
    website: '',
    socialMedia: {},
    publicProjects: [],
    publicFindings: [],
    publicReports: [],
    publicPublications: [],
    customMessage: ''
  });

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [projects, setProjects] = useState<any[]>([]);

  // Cargar datos del usuario y proyectos
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Usar datos del contexto de autenticación si están disponibles
        if (user) {
          setUserData(user);
          
          // Cargar configuración del perfil público desde el backend
          const token = localStorage.getItem('auth_token');
          if (token) {
            const profileResponse = await fetch('/api/auth/public-profile', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              const profile = profileData.data;
              
              // Configuración inicial basada en datos del backend
              const initialConfig: PublicProfileConfig = {
                isPublic: profile.is_public || false,
                displayName: profile.display_name || user.full_name || user.email || '',
                bio: profile.bio || 'Investigador arqueológico especializado en...',
                specialization: profile.specialization || 'Arqueología, Antropología, Historia',
                institution: profile.institution || 'Universidad Nacional',
                location: profile.location || 'Buenos Aires, Argentina',
                email: profile.email || user.email || '',
                website: profile.website || '',
                socialMedia: profile.social_media || {},
                publicProjects: profile.public_projects || [],
                publicFindings: profile.public_findings || [],
                publicReports: profile.public_reports || [],
                publicPublications: profile.public_publications || [],
                customMessage: profile.custom_message || 'Bienvenidos a mi espacio de investigación arqueológica.'
              };
              
              setConfig(initialConfig);
              console.log('✅ Configuración cargada desde el backend');

              // Generar URL de vista previa
              if (user.id) {
                const previewUrl = `http://localhost:3000/public/investigator/${user.id}`;
                setPreviewUrl(previewUrl);
                console.log('🔧 URL final de vista previa:', previewUrl);
              }
            }

            // Obtener proyectos reales del usuario desde la API
            try {
              const projectsResponse = await fetch('/api/projects', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });

              if (projectsResponse.ok) {
                const projectsData = await projectsResponse.json();
                if (projectsData.success && projectsData.data) {
                  setProjects(projectsData.data);
                  console.log('📋 Proyectos reales cargados:', projectsData.data.length);
                } else {
                  console.log('⚠️ No se pudieron cargar proyectos reales, usando lista vacía');
                  setProjects([]);
                }
              } else {
                console.log('⚠️ Error cargando proyectos, usando lista vacía');
                setProjects([]);
              }
            } catch (error) {
              console.error('❌ Error obteniendo proyectos:', error);
              setProjects([]);
            }
          }
        } else {
          // Si no hay usuario en el contexto, intentar cargar desde la API
          const token = localStorage.getItem('auth_token');
          if (token) {
            const userResponse = await fetch('/api/auth/profile', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (userResponse.ok) {
              const userData = await userResponse.json();
              setUserData(userData);
              
              // Configuración inicial basada en datos reales
              const initialConfig: PublicProfileConfig = {
                isPublic: userData.is_public_researcher || false,
                displayName: userData.full_name || userData.email || '',
                bio: userData.bio || 'Investigador arqueológico especializado en...',
                specialization: userData.specialization || 'Arqueología, Antropología, Historia',
                institution: userData.institution || 'Universidad Nacional',
                location: 'Buenos Aires, Argentina',
                email: userData.email || '',
                website: '',
                socialMedia: {},
                publicProjects: [],
                publicFindings: [],
                publicReports: [],
                publicPublications: [],
                customMessage: 'Bienvenidos a mi espacio de investigación arqueológica.'
              };
              
              setConfig(initialConfig);
              
              // Establecer URL de vista previa
              let previewUrl = '/public/investigator/demo'; // URL por defecto
              
              if (userData && userData.id && userData.id !== 'undefined' && userData.id !== null) {
                previewUrl = `/public/investigator/${userData.id}`;
              }
              setPreviewUrl(previewUrl);
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Preparar datos para enviar al backend
      const profileData = {
        isPublic: config.isPublic,
        displayName: config.displayName,
        bio: config.bio,
        specialization: config.specialization,
        institution: config.institution,
        location: config.location,
        email: config.email,
        website: config.website,
        socialMedia: config.socialMedia,
        customMessage: config.customMessage,
        publicProjects: config.publicProjects,
        publicFindings: config.publicFindings,
        publicReports: config.publicReports,
        publicPublications: config.publicPublications
      };

      // Enviar datos al backend
      const response = await fetch('/api/auth/public-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Configuración guardada:', result);
        alert('Configuración guardada exitosamente');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la configuración');
      }
    } catch (error) {
      console.error('❌ Error guardando configuración:', error);
      alert(`Error al guardar la configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublic = () => {
    setConfig(prev => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const handleBack = () => {
    // Redirigir al dashboard del investigador en lugar de usar history.back()
    router.push('/dashboard/researcher');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">🌐 Configurar Mi Vidriera Pública</h1>
              <p className="text-gray-600">
                Personaliza la información que se muestra en tu página pública para que otros investigadores y el público puedan conocer tu trabajo.
              </p>
            </div>
            <Button
              onClick={handleBack}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              ← Volver
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de Configuración */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estado Público */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Visibilidad Pública</h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded text-sm ${
                    config.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {config.isPublic ? 'Público' : 'Privado'}
                  </span>
                  <Button
                    onClick={handleTogglePublic}
                    className={`px-4 py-2 rounded ${
                      config.isPublic 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {config.isPublic ? 'Hacer Privado' : 'Hacer Público'}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {config.isPublic 
                  ? 'Tu vidriera es visible públicamente. Los visitantes pueden ver tu información y trabajo.'
                  : 'Tu vidriera es privada. Solo tú puedes verla.'
                }
              </p>
            </Card>

            {/* Información Personal */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Personal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre para mostrar *
                  </label>
                  <input
                    type="text"
                    value={config.displayName}
                    onChange={(e) => setConfig(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dr. Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institución *
                  </label>
                  <input
                    type="text"
                    value={config.institution}
                    onChange={(e) => setConfig(prev => ({ ...prev, institution: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Universidad Nacional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialización *
                  </label>
                  <input
                    type="text"
                    value={config.specialization}
                    onChange={(e) => setConfig(prev => ({ ...prev, specialization: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Arqueología, Antropología, Historia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={config.location}
                    onChange={(e) => setConfig(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Buenos Aires, Argentina"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biografía *
                  </label>
                  <textarea
                    rows={4}
                    value={config.bio}
                    onChange={(e) => setConfig(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe tu experiencia, especializaciones y áreas de investigación..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contacto
                  </label>
                  <input
                    type="email"
                    value={config.email}
                    onChange={(e) => setConfig(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tu.email@institucion.edu.ar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio web
                  </label>
                  <input
                    type="url"
                    value={config.website}
                    onChange={(e) => setConfig(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://tu-sitio-web.com"
                  />
                </div>
              </div>
            </Card>

            {/* Redes Sociales */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Redes Sociales Académicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter/X
                  </label>
                  <input
                    type="text"
                    value={config.socialMedia?.twitter || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="@tu_usuario"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    value={config.socialMedia?.linkedin || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="URL de tu perfil"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ResearchGate
                  </label>
                  <input
                    type="text"
                    value={config.socialMedia?.researchGate || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, researchGate: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="URL de tu perfil"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academia.edu
                  </label>
                  <input
                    type="text"
                    value={config.socialMedia?.academia || ''}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      socialMedia: { ...prev.socialMedia, academia: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="URL de tu perfil"
                  />
                </div>
              </div>
            </Card>

            {/* Contenido Público */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contenido Público</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje personal
                  </label>
                  <textarea
                    rows={3}
                    value={config.customMessage}
                    onChange={(e) => setConfig(prev => ({ ...prev, customMessage: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Un mensaje personal para los visitantes de tu vidriera..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proyecto destacado
                  </label>
                  <select
                    value={config.featuredProject || ''}
                    onChange={(e) => setConfig(prev => ({ ...prev, featuredProject: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar proyecto</option>
                    {projects && projects.length > 0 ? (
                      projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No hay proyectos disponibles</option>
                    )}
                  </select>
                </div>

                {/* Hallazgos Públicos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hallazgos públicos (uno por línea)
                  </label>
                  <textarea
                    rows={4}
                    value={config.publicFindings.join('\n')}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      publicFindings: e.target.value.split('\n').filter(item => item.trim() !== '')
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Descubrimiento de alfarería prehispánica en Tafí del Valle&#10;Identificación de patrones de asentamiento en el período tardío&#10;Análisis de materiales líticos en contextos domésticos"
                  />
                  <p className="text-xs text-gray-500 mt-1">Agrega un hallazgo por línea</p>
                </div>

                {/* Reportes Públicos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reportes públicos (uno por línea)
                  </label>
                  <textarea
                    rows={4}
                    value={config.publicReports.join('\n')}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      publicReports: e.target.value.split('\n').filter(item => item.trim() !== '')
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Informe de Excavación 2022 - Sitio Tafí 1&#10;Análisis de Materiales Cerámicos - Temporada 2021&#10;Estudio de Distribución Espacial - Valle de Tafí"
                  />
                  <p className="text-xs text-gray-500 mt-1">Agrega un reporte por línea</p>
                </div>

                {/* Publicaciones Públicas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publicaciones públicas (una por línea)
                  </label>
                  <textarea
                    rows={4}
                    value={config.publicPublications.join('\n')}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      publicPublications: e.target.value.split('\n').filter(item => item.trim() !== '')
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: De Haro, F. (2023). 'Patrones de Asentamiento en el Valle de Tafí'. Revista Arqueológica Argentina.&#10;De Haro, F. et al. (2022). 'Análisis de Cerámica Prehispánica del Noroeste'. Arqueología del NOA."
                  />
                  <p className="text-xs text-gray-500 mt-1">Agrega una publicación por línea</p>
                </div>
              </div>
            </Card>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => {
                  if (previewUrl && previewUrl.trim() !== '') {
                    window.open(previewUrl, '_blank');
                  } else {
                    alert('No se puede generar la vista previa. Asegúrate de que tu perfil esté configurado correctamente.');
                  }
                }}
                disabled={!previewUrl || previewUrl.trim() === ''}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                👁️ Vista Previa
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? '💾 Guardando...' : '💾 Guardar Cambios'}
              </Button>
            </div>
          </div>

          {/* Panel de Vista Previa */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Vista Previa</h2>
              
              {config.isPublic ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-gray-200 rounded-full w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h3 className="font-bold text-gray-800">{config.displayName || 'Tu Nombre'}</h3>
                    <p className="text-sm text-gray-600">{config.institution || 'Tu Institución'}</p>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-700 mb-3">
                      {config.bio || 'Tu biografía aparecerá aquí...'}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Proyectos:</span>
                        <span className="font-medium">{config.publicProjects.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hallazgos:</span>
                        <span className="font-medium">{config.publicFindings.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Publicaciones:</span>
                        <span className="font-medium">{config.publicPublications.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => {
                      if (previewUrl && previewUrl.trim() !== '') {
                        window.open(previewUrl, '_blank');
                      } else {
                        alert('No se puede generar la vista previa. Asegúrate de que tu perfil esté configurado correctamente.');
                      }
                    }}
                    disabled={!previewUrl || previewUrl.trim() === ''}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🔍 Ver Vidriera Completa
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-4">🔒</div>
                  <p>Tu vidriera está configurada como privada</p>
                  <p className="text-sm mt-2">Activa la visibilidad pública para mostrar tu trabajo</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage; 