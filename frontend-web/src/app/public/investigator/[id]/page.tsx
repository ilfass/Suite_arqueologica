'use client';

import React, { useState, useEffect } from 'react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface InvestigatorProfile {
  id: string;
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
  isPublic: boolean;
}

interface PublicInvestigatorPageProps {
  params: {
    id: string;
  };
}

const PublicInvestigatorPage: React.FC<PublicInvestigatorPageProps> = ({ params }) => {
  const [profile, setProfile] = useState<InvestigatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        // Obtener datos reales de la base de datos
        const response = await fetch(`/api/auth/public-profile/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener el perfil público');
        }

        const data = await response.json();
        
        if (!data.success || !data.data) {
          throw new Error('Datos de perfil no válidos');
        }

        const publicProfile = data.data;
        
        // Verificar si el perfil es público
        if (!publicProfile.is_public) {
          setError('Este perfil no está disponible públicamente');
          setLoading(false);
          return;
        }

        // Mapear los datos de la base de datos al formato del frontend
        const profile: InvestigatorProfile = {
          id: publicProfile.user_id,
          displayName: publicProfile.display_name || 'Investigador',
          bio: publicProfile.bio || 'Sin descripción disponible',
          specialization: publicProfile.specialization || 'Arqueología',
          institution: publicProfile.institution || 'Institución no especificada',
          location: publicProfile.location || 'Ubicación no especificada',
          email: publicProfile.email || '',
          website: publicProfile.website || '',
          socialMedia: publicProfile.social_media || {},
          publicProjects: publicProfile.public_projects || [],
          publicFindings: publicProfile.public_findings || [],
          publicReports: publicProfile.public_reports || [],
          publicPublications: publicProfile.public_publications || [],
          customMessage: publicProfile.custom_message || 'Bienvenidos a mi espacio de investigación arqueológica.',
          isPublic: publicProfile.is_public
        };
        
        setProfile(profile);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando perfil:', error);
        setError('No se pudo cargar el perfil del investigador');
        setLoading(false);
      }
    };

    loadProfile();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil del investigador...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Perfil no encontrado</h1>
          <p className="text-gray-600 mb-4">{error || 'El investigador solicitado no existe o su perfil no está disponible.'}</p>
          <Button onClick={() => window.history.back()} className="bg-blue-600 text-white">
            ← Volver
          </Button>
        </div>
      </div>
    );
  }

  if (!profile.isPublic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Perfil Privado</h1>
          <p className="text-gray-600 mb-4">Este perfil de investigador no está disponible públicamente.</p>
          <Button onClick={() => window.history.back()} className="bg-blue-600 text-white">
            ← Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Suite Arqueológica</h1>
            </div>
            <Button onClick={() => window.history.back()} className="bg-gray-500 text-white">
              ← Volver
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Perfil Principal */}
        <div className="mb-8">
          <Card className="p-8">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-blue-600 font-bold">
                    {profile.displayName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>

              {/* Información Principal */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile.displayName}</h1>
                <p className="text-lg text-gray-600 mb-2">{profile.specialization}</p>
                <p className="text-gray-500 mb-4">{profile.institution} • {profile.location}</p>
                
                {profile.customMessage && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                    <p className="text-blue-800 italic">"{profile.customMessage}"</p>
                  </div>
                )}

                {/* Redes Sociales */}
                {profile.socialMedia && (
                  <div className="flex space-x-4">
                    {profile.socialMedia.linkedin && (
                      <a href={profile.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:text-blue-800">
                        LinkedIn
                      </a>
                    )}
                    {profile.socialMedia.researchGate && (
                      <a href={profile.socialMedia.researchGate} target="_blank" rel="noopener noreferrer" 
                         className="text-green-600 hover:text-green-800">
                        ResearchGate
                      </a>
                    )}
                    {profile.socialMedia.academia && (
                      <a href={profile.socialMedia.academia} target="_blank" rel="noopener noreferrer" 
                         className="text-purple-600 hover:text-purple-800">
                        Academia.edu
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Biografía */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📖 Biografía</h2>
            <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
          </Card>

          {/* Proyecto Destacado */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">⭐ Proyecto Destacado</h2>
            <h3 className="font-semibold text-gray-700 mb-2">{profile.featuredProject}</h3>
            <p className="text-gray-600">Proyecto principal de investigación actual.</p>
          </Card>
        </div>

        {/* Proyectos Públicos */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🗺️ Proyectos de Investigación</h2>
            <div className="space-y-3">
              {profile.publicProjects.map((project, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{project}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Hallazgos */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🔍 Hallazgos Importantes</h2>
            <div className="space-y-3">
              {profile.publicFindings.map((finding, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{finding}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Publicaciones */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📚 Publicaciones</h2>
            <div className="space-y-4">
              {profile.publicPublications.map((publication, index) => (
                <div key={index} className="border-l-4 border-purple-400 pl-4">
                  <p className="text-gray-700">{publication}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Información de Contacto */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📧 Información de Contacto</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Email:</span> {profile.email}</p>
              {profile.website && (
                <p><span className="font-semibold">Sitio web:</span> 
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 ml-1">
                    {profile.website}
                  </a>
                </p>
              )}
              <p><span className="font-semibold">Institución:</span> {profile.institution}</p>
              <p><span className="font-semibold">Ubicación:</span> {profile.location}</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PublicInvestigatorPage; 