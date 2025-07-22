'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

interface PublicSite {
  id: string;
  name: string;
  description: string;
  location: string;
  period: string;
  site_type: string;
  photos_count: number;
  models_3d_count: number;
  public_documents_count: number;
  last_update: string;
  is_public: boolean;
}

interface PublicDocument {
  id: string;
  title: string;
  description: string;
  type: 'report' | 'article' | 'presentation' | 'guide';
  author: string;
  institution: string;
  publication_date: string;
  download_count: number;
  file_size: string;
  is_public: boolean;
}

interface PublicMap {
  id: string;
  title: string;
  description: string;
  site_name: string;
  map_type: 'excavation' | 'topographic' | 'archaeological' | '3d_model';
  scale: string;
  created_date: string;
  last_update: string;
  is_public: boolean;
}

interface ContactForm {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  created_at: string;
}

const GuestDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [publicSites, setPublicSites] = useState<PublicSite[]>([]);
  const [publicDocuments, setPublicDocuments] = useState<PublicDocument[]>([]);
  const [publicMaps, setPublicMaps] = useState<PublicMap[]>([]);
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [stats, setStats] = useState({
    publicSites: 0,
    publicDocuments: 0,
    publicMaps: 0,
    totalDownloads: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular datos para el demo
    setTimeout(() => {
      setPublicSites([
        {
          id: '1',
          name: 'Teotihuacán',
          description: 'La ciudad de los dioses, uno de los sitios arqueológicos más importantes de Mesoamérica',
          location: 'Estado de México, México',
          period: 'Clásico (100-650 d.C.)',
          site_type: 'Ciudad Prehispánica',
          photos_count: 45,
          models_3d_count: 8,
          public_documents_count: 12,
          last_update: '2024-01-15T14:30:00Z',
          is_public: true
        },
        {
          id: '2',
          name: 'Chichen Itza',
          description: 'Centro ceremonial maya declarado Patrimonio de la Humanidad',
          location: 'Yucatán, México',
          period: 'Clásico Tardío (600-900 d.C.)',
          site_type: 'Centro Ceremonial',
          photos_count: 32,
          models_3d_count: 5,
          public_documents_count: 8,
          last_update: '2024-01-10T10:00:00Z',
          is_public: true
        },
        {
          id: '3',
          name: 'Palenque',
          description: 'Ciudad maya conocida por su arquitectura y escultura',
          location: 'Chiapas, México',
          period: 'Clásico (226-799 d.C.)',
          site_type: 'Ciudad Maya',
          photos_count: 28,
          models_3d_count: 3,
          public_documents_count: 6,
          last_update: '2024-01-05T16:00:00Z',
          is_public: true
        }
      ]);

      setPublicDocuments([
        {
          id: '1',
          title: 'Guía Turística de Teotihuacán',
          description: 'Guía completa para visitantes del sitio arqueológico',
          type: 'guide',
          author: 'INAH',
          institution: 'Instituto Nacional de Antropología e Historia',
          publication_date: '2024-01-15',
          download_count: 1250,
          file_size: '2.5 MB',
          is_public: true
        },
        {
          id: '2',
          title: 'Reporte de Excavaciones 2023',
          description: 'Resultados de las excavaciones realizadas en el sector norte',
          type: 'report',
          author: 'Dr. María González',
          institution: 'INAH',
          publication_date: '2024-01-10',
          download_count: 890,
          file_size: '5.2 MB',
          is_public: true
        },
        {
          id: '3',
          title: 'Arqueología Maya: Introducción',
          description: 'Artículo introductorio sobre la arqueología maya',
          type: 'article',
          author: 'Dr. Carlos Pérez',
          institution: 'Universidad Nacional',
          publication_date: '2024-01-05',
          download_count: 567,
          file_size: '1.8 MB',
          is_public: true
        }
      ]);

      setPublicMaps([
        {
          id: '1',
          title: 'Plano General de Teotihuacán',
          description: 'Mapa topográfico completo del sitio arqueológico',
          site_name: 'Teotihuacán',
          map_type: 'topographic',
          scale: '1:5000',
          created_date: '2024-01-15',
          last_update: '2024-01-15T14:30:00Z',
          is_public: true
        },
        {
          id: '2',
          title: 'Excavaciones Sector Norte',
          description: 'Mapa de las excavaciones realizadas en el sector norte',
          site_name: 'Teotihuacán',
          map_type: 'excavation',
          scale: '1:1000',
          created_date: '2024-01-10',
          last_update: '2024-01-10T10:00:00Z',
          is_public: true
        },
        {
          id: '3',
          title: 'Modelo 3D del Templo de la Luna',
          description: 'Reconstrucción digital del templo principal',
          site_name: 'Teotihuacán',
          map_type: '3d_model',
          scale: '1:100',
          created_date: '2024-01-05',
          last_update: '2024-01-05T16:00:00Z',
          is_public: true
        }
      ]);

      setContactForms([
        {
          id: '1',
          name: 'Juan Pérez',
          email: 'juan.perez@email.com',
          subject: 'Consulta sobre visitas guiadas',
          message: 'Me gustaría información sobre las visitas guiadas disponibles en Teotihuacán.',
          status: 'responded',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'María García',
          email: 'maria.garcia@email.com',
          subject: 'Solicitud de información académica',
          message: 'Soy estudiante de arqueología y necesito información para mi tesis sobre Teotihuacán.',
          status: 'pending',
          created_at: '2024-01-14T15:45:00Z'
        }
      ]);

      setStats({
        publicSites: 3,
        publicDocuments: 3,
        publicMaps: 3,
        totalDownloads: 2707,
        totalViews: 15420,
      });

      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleViewSites = () => {
    router.push('/dashboard/guest/sites');
  };

  const handleViewDocuments = () => {
    router.push('/dashboard/guest/documents');
  };

  const handleViewMaps = () => {
    router.push('/dashboard/guest/maps');
  };

  const handleContact = () => {
    router.push('/dashboard/guest/contact');
  };

  const handleDownloadDocument = (documentId: string) => {
    // Simular descarga
    console.log(`Descargando documento ${documentId}`);
    alert('Descarga iniciada (simulado)');
  };

  const handleViewMap = (mapId: string) => {
    // Simular visualización de mapa
    console.log(`Visualizando mapa ${mapId}`);
    alert('Abriendo mapa (simulado)');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información pública...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Portal Público
              </h1>
              <p className="text-gray-600">
                Bienvenido, {user?.full_name} - Información Arqueológica Pública
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                GUEST • Acceso Público
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 border-red-300 hover:bg-red-50"
                data-testid="logout-button"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <Card>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                🏛️ Bienvenido al Portal Público de Arqueología
              </h2>
              <p className="text-gray-600 mb-4">
                Explora sitios arqueológicos, descarga documentos públicos y descubre la riqueza cultural de México
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={handleViewSites}>Explorar Sitios</Button>
                <Button variant="outline" onClick={handleViewDocuments}>Ver Documentos</Button>
                <Button variant="outline" onClick={handleContact}>Contactar</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.publicSites}</div>
              <div className="text-sm text-gray-600">Sitios Públicos</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.publicDocuments}</div>
              <div className="text-sm text-gray-600">Documentos Públicos</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.publicMaps}</div>
              <div className="text-sm text-gray-600">Mapas Disponibles</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.totalDownloads}</div>
              <div className="text-sm text-gray-600">Descargas Totales</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card title="Acceso Rápido">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={handleViewSites}
                className="w-full"
              >
                🏛️ Explorar Sitios
              </Button>
              <Button 
                onClick={handleViewDocuments}
                className="w-full"
              >
                📚 Documentos
              </Button>
              <Button 
                onClick={handleViewMaps}
                className="w-full"
              >
                🗺️ Mapas y Modelos
              </Button>
              <Button 
                variant="outline"
                onClick={handleContact}
                className="w-full"
              >
                📧 Contactar
              </Button>
            </div>
          </Card>
        </div>

        {/* Public Sites and Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Sites */}
          <Card title="Sitios Arqueológicos Destacados">
            <div className="space-y-4">
              {publicSites.map((site) => (
                <div key={site.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{site.name}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Público
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{site.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Ubicación:</span>
                      <span className="font-medium ml-1">{site.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Período:</span>
                      <span className="font-medium ml-1">{site.period}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Fotos:</span>
                      <span className="font-medium ml-1">{site.photos_count}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Modelos 3D:</span>
                      <span className="font-medium ml-1">{site.models_3d_count}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Ver Detalles</Button>
                      <Button size="sm" variant="outline">Galería</Button>
                      <Button size="sm" variant="outline">Mapa</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Public Documents */}
          <Card title="Documentos Públicos">
            <div className="space-y-4">
              {publicDocuments.map((document) => (
                <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{document.title}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {document.type === 'guide' ? 'Guía' : 
                       document.type === 'report' ? 'Reporte' : 
                       document.type === 'article' ? 'Artículo' : 'Presentación'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{document.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Autor:</span>
                      <span className="font-medium ml-1">{document.author}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Institución:</span>
                      <span className="font-medium ml-1">{document.institution}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Descargas:</span>
                      <span className="font-medium ml-1">{document.download_count}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Tamaño:</span>
                      <span className="font-medium ml-1">{document.file_size}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadDocument(document.id)}
                      >
                        📥 Descargar
                      </Button>
                      <Button size="sm" variant="outline">Vista Previa</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Maps and Models */}
        <div className="mt-8">
          <Card title="Mapas y Modelos 3D Públicos">
            <div className="space-y-4">
              {publicMaps.map((map) => (
                <div key={map.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{map.title}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {map.map_type === 'topographic' ? 'Topográfico' : 
                       map.map_type === 'excavation' ? 'Excavación' : 
                       map.map_type === 'archaeological' ? 'Arqueológico' : 'Modelo 3D'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{map.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Sitio:</span>
                      <span className="font-medium ml-1">{map.site_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Escala:</span>
                      <span className="font-medium ml-1">{map.scale}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Creado:</span>
                      <span className="font-medium ml-1">{map.created_date}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Actualizado:</span>
                      <span className="font-medium ml-1">{new Date(map.last_update).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewMap(map.id)}
                      >
                        🗺️ Ver Mapa
                      </Button>
                      <Button size="sm" variant="outline">Descargar</Button>
                      <Button size="sm" variant="outline">Información</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Contact and Information */}
        <div className="mt-8">
          <Card title="Información y Contacto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">📞 Contacto</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" onClick={handleContact} className="w-full">Formulario de Contacto</Button>
                  <Button variant="outline" size="sm" className="w-full">Información de Visitas</Button>
                  <Button variant="outline" size="sm" className="w-full">Horarios y Tarifas</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">📚 Recursos</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">Biblioteca Digital</Button>
                  <Button variant="outline" size="sm" className="w-full">Galería de Fotos</Button>
                  <Button variant="outline" size="sm" className="w-full">Videos Educativos</Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">ℹ️ Información</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">Acerca de INAH</Button>
                  <Button variant="outline" size="sm" className="w-full">Política de Privacidad</Button>
                  <Button variant="outline" size="sm" className="w-full">Términos de Uso</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Contact Forms */}
        {contactForms.length > 0 && (
          <div className="mt-8">
            <Card title="Mis Consultas Recientes">
              <div className="space-y-4">
                {contactForms.map((form) => (
                  <div key={form.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{form.subject}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        form.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        form.status === 'responded' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {form.status === 'pending' ? 'Pendiente' : 
                         form.status === 'responded' ? 'Respondida' : 'Cerrada'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{form.message}</p>
                    <div className="text-sm text-gray-500">
                      Enviado: {new Date(form.created_at).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default GuestDashboardPage; 