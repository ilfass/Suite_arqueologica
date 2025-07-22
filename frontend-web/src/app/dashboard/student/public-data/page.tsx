'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface PublicDataset {
  id: string;
  title: string;
  description: string;
  category: 'sites' | 'objects' | 'excavations' | 'research' | 'maps';
  institution: string;
  publication_date: string;
  last_updated: string;
  size: string;
  format: string;
  downloads: number;
  rating: number;
  reviews_count: number;
  tags: string[];
  license: string;
  access_level: 'public' | 'academic' | 'restricted';
}

const PublicDataPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [datasets, setDatasets] = useState<PublicDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simular carga de datasets públicos
    setTimeout(() => {
      setDatasets([
        {
          id: '1',
          title: 'Catálogo Nacional de Sitios Arqueológicos',
          description: 'Base de datos completa de sitios arqueológicos registrados en México, incluyendo ubicación, cronología y características principales.',
          category: 'sites',
          institution: 'INAH',
          publication_date: '2023-12-01T00:00:00Z',
          last_updated: '2024-01-10T00:00:00Z',
          size: '2.5 GB',
          format: 'CSV, Shapefile',
          downloads: 1247,
          rating: 4.8,
          reviews_count: 89,
          tags: ['sitios', 'mexico', 'inah', 'catálogo'],
          license: 'Creative Commons BY-NC',
          access_level: 'public'
        },
        {
          id: '2',
          title: 'Objetos Cerámicos de Teotihuacán',
          description: 'Colección digitalizada de objetos cerámicos encontrados en las excavaciones de Teotihuacán, con análisis técnicos y fotografías.',
          category: 'objects',
          institution: 'UNAM',
          publication_date: '2023-11-15T00:00:00Z',
          last_updated: '2024-01-05T00:00:00Z',
          size: '850 MB',
          format: 'CSV, JPEG',
          downloads: 892,
          rating: 4.6,
          reviews_count: 45,
          tags: ['cerámica', 'teotihuacán', 'objetos', 'análisis'],
          license: 'Creative Commons BY',
          access_level: 'academic'
        },
        {
          id: '3',
          title: 'Mapas Arqueológicos del Valle de México',
          description: 'Conjunto de mapas arqueológicos detallados del Valle de México, incluyendo sitios, rutas comerciales y asentamientos.',
          category: 'maps',
          institution: 'INAH',
          publication_date: '2023-10-20T00:00:00Z',
          last_updated: '2024-01-12T00:00:00Z',
          size: '1.2 GB',
          format: 'Shapefile, GeoTIFF',
          downloads: 567,
          rating: 4.7,
          reviews_count: 32,
          tags: ['mapas', 'valle de mexico', 'geografía', 'sitios'],
          license: 'Creative Commons BY-NC',
          access_level: 'public'
        },
        {
          id: '4',
          title: 'Reportes de Excavación - Palenque',
          description: 'Reportes completos de excavaciones realizadas en Palenque entre 2010-2023, incluyendo hallazgos y análisis.',
          category: 'excavations',
          institution: 'INAH Chiapas',
          publication_date: '2023-09-30T00:00:00Z',
          last_updated: '2024-01-08T00:00:00Z',
          size: '3.1 GB',
          format: 'PDF, CSV',
          downloads: 423,
          rating: 4.5,
          reviews_count: 28,
          tags: ['palenque', 'excavaciones', 'reportes', 'hallazgos'],
          license: 'Creative Commons BY-NC-ND',
          access_level: 'academic'
        },
        {
          id: '5',
          title: 'Investigaciones sobre Cultura Maya',
          description: 'Compilación de investigaciones académicas sobre la cultura maya, incluyendo artículos, tesis y reportes.',
          category: 'research',
          institution: 'UNAM',
          publication_date: '2023-08-15T00:00:00Z',
          last_updated: '2024-01-15T00:00:00Z',
          size: '2.8 GB',
          format: 'PDF, DOCX',
          downloads: 678,
          rating: 4.4,
          reviews_count: 56,
          tags: ['maya', 'investigación', 'cultura', 'académico'],
          license: 'Creative Commons BY',
          access_level: 'academic'
        },
        {
          id: '6',
          title: 'Base de Datos de Radiocarbono',
          description: 'Base de datos de fechas de radiocarbono de sitios arqueológicos mexicanos, con análisis estadísticos.',
          category: 'research',
          institution: 'INAH',
          publication_date: '2023-07-10T00:00:00Z',
          last_updated: '2024-01-03T00:00:00Z',
          size: '450 MB',
          format: 'CSV, XLSX',
          downloads: 345,
          rating: 4.9,
          reviews_count: 23,
          tags: ['radiocarbono', 'cronología', 'datación', 'estadísticas'],
          license: 'Creative Commons BY-NC',
          access_level: 'restricted'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDownloadDataset = (datasetId: string) => {
    console.log('Descargando dataset:', datasetId);
    alert('Descarga iniciada. El archivo se guardará en tu carpeta de descargas.');
  };

  const handleViewDataset = (datasetId: string) => {
    router.push(`/dashboard/student/public-data/${datasetId}`);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      sites: 'bg-blue-100 text-blue-800',
      objects: 'bg-green-100 text-green-800',
      excavations: 'bg-orange-100 text-orange-800',
      research: 'bg-purple-100 text-purple-800',
      maps: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      sites: '🏛️',
      objects: '🏺',
      excavations: '⛏️',
      research: '📚',
      maps: '🗺️'
    };
    return icons[category as keyof typeof icons] || '📄';
  };

  const getAccessLevelColor = (level: string) => {
    const colors = {
      public: 'bg-green-100 text-green-800',
      academic: 'bg-blue-100 text-blue-800',
      restricted: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredDatasets = datasets.filter(dataset => {
    const matchesCategory = selectedCategory === 'all' || dataset.category === selectedCategory;
    const matchesSearch = dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos públicos...</p>
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
                Datos Públicos
              </h1>
              <p className="text-gray-600">
                Estudiante: {user?.full_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/student')}>
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y búsqueda */}
        <Card title="Búsqueda y Filtros">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar datasets..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                <option value="sites">Sitios Arqueológicos</option>
                <option value="objects">Objetos</option>
                <option value="excavations">Excavaciones</option>
                <option value="research">Investigación</option>
                <option value="maps">Mapas</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                🔄 Actualizar
              </Button>
            </div>
          </div>
        </Card>

        {/* Estadísticas */}
        <div className="mt-8">
          <Card title="Estadísticas de Datos Públicos">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{datasets.length}</div>
                <div className="text-sm text-gray-600">Total de Datasets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {datasets.filter(d => d.access_level === 'public').length}
                </div>
                <div className="text-sm text-gray-600">Acceso Público</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {datasets.reduce((sum, d) => sum + d.downloads, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Descargas Totales</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {Math.round(datasets.reduce((sum, d) => sum + d.rating, 0) / datasets.length * 10) / 10}
                </div>
                <div className="text-sm text-gray-600">Rating Promedio</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de datasets */}
        <div className="mt-8">
          <Card title={`Datasets Disponibles (${filteredDatasets.length})`}>
            <div className="space-y-4">
              {filteredDatasets.map((dataset) => (
                <div key={dataset.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getCategoryIcon(dataset.category)}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{dataset.title}</h3>
                        <p className="text-sm text-gray-600">{dataset.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>🏛️ {dataset.institution}</span>
                          <span>📅 {new Date(dataset.publication_date).toLocaleDateString('es-ES')}</span>
                          <span>📊 {dataset.size}</span>
                          <span>📁 {dataset.format}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(dataset.category)}`}>
                          {dataset.category === 'sites' ? 'Sitios' : 
                           dataset.category === 'objects' ? 'Objetos' : 
                           dataset.category === 'excavations' ? 'Excavaciones' : 
                           dataset.category === 'research' ? 'Investigación' : 'Mapas'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(dataset.access_level)}`}>
                          {dataset.access_level === 'public' ? 'Público' : 
                           dataset.access_level === 'academic' ? 'Académico' : 'Restringido'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        ⭐ {dataset.rating} ({dataset.reviews_count} reseñas)
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {dataset.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDataset(dataset.id)}
                      >
                        Ver Detalles
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        📊 Metadatos
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        💬 Reseñas
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                      >
                        📖 Licencia: {dataset.license}
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleDownloadDataset(dataset.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        📥 Descargar ({dataset.downloads})
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDatasets.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🌐</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron datasets</h3>
                <p className="text-gray-600">Ajusta los filtros para ver más opciones</p>
              </div>
            )}
          </Card>
        </div>

        {/* Categorías destacadas */}
        <div className="mt-8">
          <Card title="Categorías Destacadas">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">🏛️</div>
                <h3 className="font-medium text-gray-900">Sitios</h3>
                <p className="text-sm text-gray-600">{datasets.filter(d => d.category === 'sites').length} datasets</p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">🏺</div>
                                  <h3 className="font-medium text-gray-900">Objetos</h3>
                <p className="text-sm text-gray-600">{datasets.filter(d => d.category === 'objects').length} datasets</p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">⛏️</div>
                <h3 className="font-medium text-gray-900">Excavaciones</h3>
                <p className="text-sm text-gray-600">{datasets.filter(d => d.category === 'excavations').length} datasets</p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-medium text-gray-900">Investigación</h3>
                <p className="text-sm text-gray-600">{datasets.filter(d => d.category === 'research').length} datasets</p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">🗺️</div>
                <h3 className="font-medium text-gray-900">Mapas</h3>
                <p className="text-sm text-gray-600">{datasets.filter(d => d.category === 'maps').length} datasets</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Información sobre licencias */}
        <div className="mt-8">
          <Card title="Información sobre Licencias">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Creative Commons BY</h3>
                <p className="text-sm text-gray-600">Puedes usar, modificar y distribuir libremente, citando al autor original.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Creative Commons BY-NC</h3>
                <p className="text-sm text-gray-600">Puedes usar y modificar, pero no para fines comerciales. Cita al autor.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Creative Commons BY-NC-ND</h3>
                <p className="text-sm text-gray-600">Puedes usar, pero no modificar ni para fines comerciales. Cita al autor.</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PublicDataPage; 