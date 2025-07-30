'use client';

import React, { useState, useEffect } from 'react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface PublicInvestigator {
  id: string;
  name: string;
  institution: string;
  specialization: string;
  bio: string;
  email: string;
  website?: string;
  projects: PublicProject[];
  publications: PublicPublication[];
  image?: string;
  isPublic: boolean;
}

interface PublicProject {
  id: string;
  name: string;
  description: string;
  location: string;
  period: string;
  status: 'active' | 'completed' | 'planning';
  publicFindings: PublicFinding[];
  publicReports: PublicReport[];
  images: string[];
  lastUpdated: string;
}

interface PublicFinding {
  id: string;
  name: string;
  type: string;
  description: string;
  period: string;
  location: string;
  image?: string;
  discoveryDate: string;
}

interface PublicReport {
  id: string;
  title: string;
  type: string;
  date: string;
  abstract: string;
  downloadUrl?: string;
}

interface PublicPublication {
  id: string;
  title: string;
  journal: string;
  year: string;
  authors: string[];
  abstract: string;
  doi?: string;
  downloadUrl?: string;
}

interface PublicInvestigatorPageProps {
  params: {
    id: string;
  };
}

const PublicInvestigatorPage: React.FC<PublicInvestigatorPageProps> = ({ params }) => {
  const [investigator, setInvestigator] = useState<PublicInvestigator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<PublicProject | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'publications' | 'about'>('projects');

  // Obtener datos del investigador basándose en el ID
  useEffect(() => {
    const fetchInvestigatorData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simular datos del investigador (en el futuro vendría del backend)
        const investigatorData: PublicInvestigator = {
          id: params.id,
          name: 'Dr. Fabian de Haro',
          institution: 'Universidad Nacional de Buenos Aires',
          specialization: 'Arqueología, Antropología, Historia',
          bio: 'Investigador arqueológico especializado en arqueología de la costa atlántica y sitios prehispánicos. Con más de 15 años de experiencia en excavaciones y análisis de materiales arqueológicos.',
          email: 'lic.fabiande@gmail.com',
          website: '',
          isPublic: true,
          projects: [
            {
              id: 'proj-001',
              name: 'Proyecto Arqueológico La Laguna',
              description: 'Investigación de sitios prehispánicos en la costa atlántica argentina',
              location: 'Costa Atlántica, Buenos Aires',
              period: '2020-2024',
              status: 'active',
              publicFindings: [
                {
                  id: 'finding-001',
                  name: 'Cerámica prehispánica',
                  type: 'Cerámica',
                  description: 'Fragmentos de cerámica decorada del período prehispánico',
                  period: 'Siglo XV',
                  location: 'Sitio La Laguna',
                  discoveryDate: '2023-06-15'
                }
              ],
              publicReports: [
                {
                  id: 'report-001',
                  title: 'Informe de excavación 2023',
                  type: 'Excavación',
                  date: '2023-12-01',
                  abstract: 'Resultados de la campaña de excavación 2023 en el sitio La Laguna'
                }
              ],
              images: [],
              lastUpdated: '2024-01-15'
            }
          ],
          publications: [
            {
              id: 'pub-001',
              title: 'Análisis de materiales cerámicos en sitios costeros',
              journal: 'Revista de Arqueología Argentina',
              year: '2023',
              authors: ['Fabian de Haro', 'María González'],
              abstract: 'Estudio comparativo de materiales cerámicos encontrados en sitios costeros prehispánicos',
              doi: '10.1234/arqueologia.2023.001'
            }
          ]
        };

        setInvestigator(investigatorData);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos del investigador:', error);
        setError('Error al cargar los datos del investigador');
        setLoading(false);
      }
    };

    fetchInvestigatorData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vidriera del investigador...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Vidriera no disponible</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!investigator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Investigador no encontrado</h1>
          <p className="text-gray-600">La vidriera que buscas no existe o no está disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-3xl text-gray-500">👨‍🔬</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{investigator.name}</h1>
              <p className="text-lg text-gray-600 mb-1">{investigator.institution}</p>
              <p className="text-gray-500">{investigator.specialization}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Proyectos ({investigator.projects.length})
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'publications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📚 Publicaciones ({investigator.publications.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ℹ️ Acerca de
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'projects' && (
          <div>
            {investigator.projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos públicos</h3>
                <p className="text-gray-500">Este investigador aún no ha publicado proyectos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investigator.projects.map((project) => (
                  <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div><span className="font-medium">Ubicación:</span> {project.location}</div>
                          <div><span className="font-medium">Período:</span> {project.period}</div>
                          <div><span className="font-medium">Estado:</span> {project.status}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {project.publicFindings.length} hallazgos • {project.publicReports.length} informes
                      </div>
                      <Button
                        onClick={() => setSelectedProject(project)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'publications' && (
          <div>
            {investigator.publications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay publicaciones</h3>
                <p className="text-gray-500">Este investigador aún no ha publicado artículos.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {investigator.publications.map((publication) => (
                  <Card key={publication.id} className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{publication.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{publication.abstract}</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div><span className="font-medium">Revista:</span> {publication.journal}</div>
                      <div><span className="font-medium">Año:</span> {publication.year}</div>
                      <div><span className="font-medium">Autores:</span> {publication.authors.join(', ')}</div>
                      {publication.doi && <div><span className="font-medium">DOI:</span> {publication.doi}</div>}
                    </div>
                    {publication.downloadUrl && (
                      <Button
                        onClick={() => window.open(publication.downloadUrl, '_blank')}
                        className="mt-3 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        📥 Descargar
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Biografía</h3>
              <p className="text-gray-600 mb-6">{investigator.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Información de Contacto</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Email:</span> {investigator.email}</div>
                    {investigator.website && (
                      <div><span className="font-medium">Sitio web:</span> {investigator.website}</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Estadísticas</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{investigator.projects.length}</div>
                      <div className="text-gray-600">Proyectos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {investigator.projects.reduce((sum, p) => sum + p.publicFindings.length, 0)}
                      </div>
                      <div className="text-gray-600">Hallazgos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{investigator.publications.length}</div>
                      <div className="text-gray-600">Publicaciones</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {investigator.projects.reduce((sum, p) => sum + p.publicReports.length, 0)}
                      </div>
                      <div className="text-gray-600">Informes</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Modal de Detalles del Proyecto */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h2>
                <Button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              {/* Hallazgos Públicos */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🏺 Hallazgos Destacados</h3>
                {selectedProject.publicFindings.length === 0 ? (
                  <p className="text-gray-500">No hay hallazgos públicos para mostrar</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.publicFindings.map((finding) => (
                      <Card key={finding.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-gray-200 rounded w-16 h-16 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-500">🏺</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-1">{finding.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{finding.description}</p>
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">Tipo:</span> {finding.type} | 
                              <span className="font-medium ml-2">Período:</span> {finding.period} |
                              <span className="font-medium ml-2">Descubierto:</span> {finding.discoveryDate}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Informes Públicos */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Informes Públicos</h3>
                {selectedProject.publicReports.length === 0 ? (
                  <p className="text-gray-500">No hay informes públicos para mostrar</p>
                ) : (
                  <div className="space-y-3">
                    {selectedProject.publicReports.map((report) => (
                      <Card key={report.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-1">{report.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{report.abstract}</p>
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">Fecha:</span> {report.date} |
                              <span className="font-medium ml-2">Tipo:</span> {report.type}
                            </div>
                          </div>
                          {report.downloadUrl && (
                            <Button
                              onClick={() => window.open(report.downloadUrl, '_blank')}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              📥 Descargar
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setSelectedProject(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicInvestigatorPage; 