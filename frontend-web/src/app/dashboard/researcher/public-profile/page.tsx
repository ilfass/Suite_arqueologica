'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

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
        
        // Obtener datos del usuario
        const userResponse = await fetch('http://localhost:4000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserData(userData);
          
          // Configuración inicial basada en datos reales
          const initialConfig: PublicProfileConfig = {
            isPublic: false,
            displayName: userData.full_name || userData.email || '',
            bio: 'Investigador arqueológico especializado en...',
            specialization: 'Arqueología, Antropología, Historia',
            institution: 'Universidad Nacional',
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
          if (userData.id && userData.id !== 'undefined' && userData.id !== null) {
            setPreviewUrl(`/public/investigator/${userData.id}`);
            console.log('🔧 URL de vista previa establecida:', `/public/investigator/${userData.id}`);
          } else {
            console.error('ID de usuario no válido:', userData.id);
            setPreviewUrl('');
          }
        }

        // Obtener proyectos del usuario
        const projectsResponse = await fetch('http://localhost:4000/api/projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData);
          console.log('📋 Proyectos cargados:', projectsData.length);
        } else {
          console.log('No se pudieron cargar los proyectos');
          setProjects([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Aquí se guardaría la configuración en el backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Configuración guardada:', config);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('❌ Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublic = () => {
    setConfig(prev => ({ ...prev, isPublic: !prev.isPublic }));
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🌐 Configurar Mi Vidriera Pública</h1>
          <p className="text-gray-600">
            Personaliza la información que se muestra en tu página pública para que otros investigadores y el público puedan conocer tu trabajo.
          </p>
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
              </div>
            </Card>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => window.open(previewUrl, '_blank')}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
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
                    onClick={() => window.open(previewUrl, '_blank')}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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