'use client';

import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface PublicInvestigator {
  id: string;
  name: string;
  institution: string;
  specialization: string;
  bio: string;
  email: string;
  website?: string;
  image?: string;
  location: string;
  publicProjects: number;
  publicFindings: number;
  publicReports: number;
  publicPublications: number;
  lastUpdated: string;
  featuredProject?: {
    id: string;
    name: string;
    description: string;
    image?: string;
  };
}

const PublicPage: React.FC = () => {
  const [investigators, setInvestigators] = useState<PublicInvestigator[]>([]);
  const [selectedInvestigator, setSelectedInvestigator] = useState<PublicInvestigator | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstitution, setFilterInstitution] = useState('all');
  const [filterSpecialization, setFilterSpecialization] = useState('all');

  // Datos de ejemplo para demostración
  useEffect(() => {
    const mockInvestigators: PublicInvestigator[] = [
      {
        id: 'inv-001',
        name: 'Dr. María González',
        institution: 'Universidad Nacional de La Plata',
        specialization: 'Arqueología Pampeana, Cazadores-Recolectores, Tecnología Lítica',
        bio: 'Investigadora especializada en arqueología de cazadores-recolectores del Holoceno tardío en la región pampeana. Doctora en Arqueología por la Universidad Nacional de La Plata.',
        email: 'maria.gonzalez@unlp.edu.ar',
        website: 'https://www.unlp.edu.ar/arqueologia',
        location: 'La Plata, Buenos Aires, Argentina',
        publicProjects: 3,
        publicFindings: 15,
        publicReports: 8,
        publicPublications: 12,
        lastUpdated: '2024-01-15',
        featuredProject: {
          id: 'proj-001',
          name: 'Proyecto Cazadores Recolectores - La Laguna',
          description: 'Investigación sobre patrones de asentamiento y subsistencia en la región pampeana durante el Holoceno tardío.',
          image: '/images/project-1-1.jpg'
        }
      },
      {
        id: 'inv-002',
        name: 'Dr. Carlos Rodríguez',
        institution: 'CONICET - Universidad de Buenos Aires',
        specialization: 'Arqueología Costera, Zooarqueología, Concheros',
        bio: 'Investigador del CONICET especializado en arqueología costera y análisis de concheros. Experto en patrones de ocupación costera y explotación de recursos marinos.',
        email: 'carlos.rodriguez@conicet.gov.ar',
        website: 'https://www.conicet.gov.ar',
        location: 'Buenos Aires, Argentina',
        publicProjects: 2,
        publicFindings: 8,
        publicReports: 5,
        publicPublications: 9,
        lastUpdated: '2023-11-30',
        featuredProject: {
          id: 'proj-002',
          name: 'Arqueología de la Costa Atlántica Bonaerense',
          description: 'Estudio de patrones de ocupación costera y explotación de recursos marinos durante el Holoceno.',
          image: '/images/project-2-1.jpg'
        }
      },
      {
        id: 'inv-003',
        name: 'Dra. Ana Silva',
        institution: 'Universidad Nacional de Córdoba',
        specialization: 'Arqueología de Montaña, Etnohistoria, Cerámica Prehispánica',
        bio: 'Investigadora especializada en arqueología de montaña y etnohistoria. Experta en análisis de cerámica prehispánica y patrones de ocupación en ambientes de altura.',
        email: 'ana.silva@unc.edu.ar',
        website: 'https://www.unc.edu.ar',
        location: 'Córdoba, Argentina',
        publicProjects: 4,
        publicFindings: 22,
        publicReports: 11,
        publicPublications: 15,
        lastUpdated: '2024-01-10',
        featuredProject: {
          id: 'proj-003',
          name: 'Arqueología de las Sierras de Córdoba',
          description: 'Investigación sobre patrones de ocupación prehispánica en las sierras de Córdoba.',
          image: '/images/project-3-1.jpg'
        }
      },
      {
        id: 'inv-004',
        name: 'Dr. Juan Pérez',
        institution: 'Universidad Nacional de Tucumán',
        specialization: 'Arqueología del Noroeste, Arquitectura Prehispánica, Análisis Espacial',
        bio: 'Investigador especializado en arqueología del noroeste argentino. Experto en arquitectura prehispánica y análisis espacial de sitios arqueológicos.',
        email: 'juan.perez@unt.edu.ar',
        website: 'https://www.unt.edu.ar',
        location: 'Tucumán, Argentina',
        publicProjects: 2,
        publicFindings: 12,
        publicReports: 6,
        publicPublications: 8,
        lastUpdated: '2023-12-20',
        featuredProject: {
          id: 'proj-004',
          name: 'Arquitectura Prehispánica del Valle de Tafí',
          description: 'Estudio de la arquitectura prehispánica y patrones de asentamiento en el Valle de Tafí.',
          image: '/images/project-4-1.jpg'
        }
      }
    ];

    setInvestigators(mockInvestigators);
    setLoading(false);
  }, []);

  const filteredInvestigators = investigators.filter(investigator => {
    const matchesSearch = investigator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investigator.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investigator.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstitution = filterInstitution === 'all' || investigator.institution.includes(filterInstitution);
    const matchesSpecialization = filterSpecialization === 'all' || investigator.specialization.includes(filterSpecialization);
    return matchesSearch && matchesInstitution && matchesSpecialization;
  });

  const institutions = Array.from(new Set(investigators.map(inv => inv.institution)));
  const specializations = Array.from(new Set(investigators.map(inv => inv.specialization.split(',')[0].trim())));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando investigadores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Público */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🏛️ Directorio de Investigadores Arqueológicos</h1>
            <p className="text-xl text-green-100 mb-8">
              Descubre el trabajo de investigadores arqueológicos en Argentina
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => window.location.href = '/login'}
                className="bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 font-semibold"
              >
                🔐 Acceso Investigadores
              </Button>
              <Button
                onClick={() => window.location.href = '/register'}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-semibold"
              >
                📝 Registrarse
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y Búsqueda */}
        <Card className="mb-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="🔍 Buscar investigadores, especializaciones o instituciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={filterInstitution}
                onChange={(e) => setFilterInstitution(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las instituciones</option>
                {institutions.map((institution) => (
                  <option key={institution} value={institution}>{institution}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las especializaciones</option>
                {specializations.map((specialization) => (
                  <option key={specialization} value={specialization}>{specialization}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Estadísticas Generales */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Estadísticas del Directorio</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{investigators.length}</div>
              <div className="text-sm text-gray-600">Investigadores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {investigators.reduce((sum, inv) => sum + inv.publicProjects, 0)}
              </div>
              <div className="text-sm text-gray-600">Proyectos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {investigators.reduce((sum, inv) => sum + inv.publicFindings, 0)}
              </div>
              <div className="text-sm text-gray-600">Hallazgos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {investigators.reduce((sum, inv) => sum + inv.publicPublications, 0)}
              </div>
              <div className="text-sm text-gray-600">Publicaciones</div>
            </div>
          </div>
        </Card>

        {/* Lista de Investigadores */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            👥 Investigadores ({filteredInvestigators.length})
          </h2>
          
          {filteredInvestigators.map((investigator) => (
            <Card key={investigator.id} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Imagen y información básica */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4">
                    <span className="text-gray-500 text-lg">👤</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{investigator.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{investigator.institution}</p>
                    <p className="text-xs text-gray-500">{investigator.location}</p>
                  </div>
                </div>

                {/* Información detallada */}
                <div className="lg:col-span-2">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Especialización</h4>
                    <p className="text-gray-700 text-sm">{investigator.specialization}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Biografía</h4>
                    <p className="text-gray-700 text-sm line-clamp-3">{investigator.bio}</p>
                  </div>

                  {/* Proyecto destacado */}
                  {investigator.featuredProject && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">⭐ Proyecto Destacado</h4>
                      <h5 className="text-sm font-medium text-blue-700 mb-1">{investigator.featuredProject.name}</h5>
                      <p className="text-xs text-blue-600">{investigator.featuredProject.description}</p>
                    </div>
                  )}
                </div>

                {/* Estadísticas y acciones */}
                <div className="lg:col-span-1">
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{investigator.publicProjects}</div>
                      <div className="text-xs text-gray-600">Proyectos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{investigator.publicFindings}</div>
                      <div className="text-xs text-gray-600">Hallazgos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{investigator.publicPublications}</div>
                      <div className="text-xs text-gray-600">Publicaciones</div>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        onClick={() => window.location.href = `/public/investigator/${investigator.id}`}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        🔍 Ver Vidriera
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredInvestigators.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">No se encontraron investigadores</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PublicPage; 