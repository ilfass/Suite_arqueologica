'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface Report {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  citations: number;
  authors: string[];
}

interface Template {
  id: string;
  name: string;
  type: string;
  description: string;
  format: string;
}

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showNewReport, setShowNewReport] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // Datos simulados
  const mockReports: Report[] = [
    {
      id: '1',
      title: 'Cazadores Recolectores de la Pampa Húmeda: Análisis de Tecnología Lítica',
      type: 'Artículo Científico',
      status: 'En Revisión',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      wordCount: 8500,
      citations: 45,
      authors: ['Dr. María González', 'Lic. Carlos Ruiz']
    },
    {
      id: '2',
      title: 'Excavación del Sitio La Laguna: Resultados Preliminares',
      type: 'Informe Técnico',
      status: 'Completado',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      wordCount: 3200,
      citations: 12,
      authors: ['Dra. Ana Martínez']
    },
    {
      id: '3',
      title: 'Análisis de ADN Antiguo en Restos Óseos de Guanaco',
      type: 'Ponencia Congreso',
      status: 'Borrador',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-12',
      wordCount: 4500,
      citations: 28,
      authors: ['Dr. Roberto Silva', 'Dra. Patricia López']
    },
    {
      id: '4',
      title: 'Metodología de Excavación en Sitios Pampeanos',
      type: 'Capítulo de Libro',
      status: 'En Progreso',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-15',
      wordCount: 6800,
      citations: 67,
      authors: ['Dr. María González', 'Dr. Roberto Silva', 'Lic. Carlos Ruiz']
    }
  ];

  const templates: Template[] = [
    {
      id: '1',
      name: 'Artículo Revista Científica',
      type: 'Artículo',
      description: 'Formato estándar para revistas indexadas',
      format: 'Word/PDF'
    },
    {
      id: '2',
      name: 'Ponencia Congreso Nacional',
      type: 'Ponencia',
      description: 'Plantilla para congresos de arqueología',
      format: 'PowerPoint/PDF'
    },
    {
      id: '3',
      name: 'Informe Técnico',
      type: 'Informe',
      description: 'Formato institucional para informes',
      format: 'Word/PDF'
    },
    {
      id: '4',
      name: 'Capítulo de Libro',
      type: 'Capítulo',
      description: 'Formato editorial para libros',
      format: 'Word/LaTeX'
    },
    {
      id: '5',
      name: 'Tesis Doctoral',
      type: 'Tesis',
      description: 'Formato académico para tesis',
      format: 'Word/LaTeX'
    }
  ];

  useEffect(() => {
    setReports(mockReports);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado': return 'bg-green-100 text-green-800';
      case 'En Revisión': return 'bg-yellow-100 text-yellow-800';
      case 'En Progreso': return 'bg-blue-100 text-blue-800';
      case 'Borrador': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Artículo Científico': return '📄';
      case 'Informe Técnico': return '📋';
      case 'Ponencia Congreso': return '🎤';
      case 'Capítulo de Libro': return '📚';
      case 'Tesis': return '🎓';
      default: return '📝';
    }
  };

  const handleExport = (format: string) => {
    console.log(`Exportando en formato ${format}`);
    alert(`Exportación en formato ${format} iniciada`);
  };

  const handleGenerateCitation = () => {
    console.log('Generando citación automática');
    alert('Citación automática generada');
  };

  const handleCreateReport = () => {
    setShowNewReport(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Editor Académico
                </h1>
                <p className="mt-2 text-gray-600">
                  Generador de informes y publicaciones académicas
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  📚 Biblioteca
                </Button>
                <Button variant="outline">
                  📖 Plantillas
                </Button>
                <Button variant="primary" onClick={handleCreateReport}>
                  ➕ Nuevo Informe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📄</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Informes Activos</p>
                  <p className="text-2xl font-semibold text-gray-900">{reports.length}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Palabras Totales</p>
                  <p className="text-2xl font-semibold text-gray-900">23,000</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📚</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Citaciones</p>
                  <p className="text-2xl font-semibold text-gray-900">152</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🎯</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Factor de Impacto</p>
                  <p className="text-2xl font-semibold text-gray-900">2.4</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Reports List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Informes</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xl">{getTypeIcon(report.type)}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-600">{report.type}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {report.wordCount} palabras
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {report.citations} citaciones
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <span>👥 {report.authors.join(', ')}</span>
                          <span className="ml-4">📅 Actualizado: {report.updatedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        👁️ Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        ✏️ Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        📤 Exportar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Plantillas Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id}>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white text-xl">📋</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{template.format}</span>
                    <Button variant="primary" size="sm">
                      Usar Plantilla
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Academic Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Citation Generator */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Generador de Citaciones
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Fuente
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Artículo Científico</option>
                    <option>Libro</option>
                    <option>Capítulo de Libro</option>
                    <option>Tesis</option>
                    <option>Informe Técnico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estilo de Citación
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>APA 7th Edition</option>
                    <option>Chicago</option>
                    <option>MLA</option>
                    <option>Harvard</option>
                  </select>
                </div>
                <Button variant="primary" onClick={handleGenerateCitation} className="w-full">
                  🔗 Generar Citación
                </Button>
              </div>
            </div>
          </Card>

          {/* Export Tools */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Herramientas de Exportación
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => handleExport('Word')}>
                  📄 Exportar a Word
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleExport('PDF')}>
                  📄 Exportar a PDF
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleExport('LaTeX')}>
                  📝 Exportar a LaTeX
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleExport('BibTeX')}>
                  📚 Exportar Bibliografía
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* DOI and Publication */}
        <div className="mt-8">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Control de Publicación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">DOI Assignment</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-600">Asignar DOI automáticamente</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-600">Registrar en repositorio institucional</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-600">Publicar con acceso abierto</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Control de Versiones</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-600">Versionado automático</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-600">Control de cambios</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-600">Backup automático</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <Button variant="primary">
                  🔒 Publicar
                </Button>
                <Button variant="outline">
                  📋 Previsualizar
                </Button>
                <Button variant="outline">
                  🔄 Versionar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; 