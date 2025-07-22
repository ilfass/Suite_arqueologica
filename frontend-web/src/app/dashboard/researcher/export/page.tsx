'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface ExportJob {
  id: string;
  name: string;
  type: string;
  status: string;
  progress: number;
  createdAt: string;
  size: string;
  format: string;
}

interface Repository {
  id: string;
  name: string;
  type: string;
  url: string;
  status: string;
  lastSync: string;
}

interface Backup {
  id: string;
  name: string;
  type: string;
  size: string;
  createdAt: string;
  status: string;
}

const ExportPage: React.FC = () => {
  const { user } = useAuth();
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('json');

  // Datos simulados
  const mockExportJobs: ExportJob[] = [
    {
      id: '1',
      name: 'Proyecto Cazadores Recolectores - Completo',
      type: 'Proyecto Completo',
      status: 'Completado',
      progress: 100,
      createdAt: '2024-01-20 14:30',
      size: '2.4 GB',
      format: 'ZIP'
    },
    {
      id: '2',
      name: 'Datos SIG - Sitio La Laguna',
      type: 'Datos Geográficos',
      status: 'En Progreso',
      progress: 65,
      createdAt: '2024-01-20 13:15',
      size: '856 MB',
      format: 'Shapefile'
    },
    {
      id: '3',
      name: 'Informe Final - Análisis de ADN',
      type: 'Documento',
      status: 'Pendiente',
      progress: 0,
      createdAt: '2024-01-20 12:00',
      size: '45 MB',
      format: 'PDF'
    },
    {
      id: '4',
      name: 'Base de Datos - Artefactos',
      type: 'Base de Datos',
      status: 'Completado',
      progress: 100,
      createdAt: '2024-01-19 16:45',
      size: '1.2 GB',
      format: 'SQL'
    }
  ];

  const mockRepositories: Repository[] = [
    {
      id: '1',
      name: 'Repositorio Institucional CONICET',
      type: 'Institucional',
      url: 'https://ri.conicet.gov.ar',
      status: 'Conectado',
      lastSync: '2024-01-20 14:30'
    },
    {
      id: '2',
      name: 'Digital Archaeological Record (tDAR)',
      type: 'Internacional',
      url: 'https://core.tdar.org',
      status: 'Conectado',
      lastSync: '2024-01-20 12:15'
    },
    {
      id: '3',
      name: 'Open Context',
      type: 'Internacional',
      url: 'https://opencontext.org',
      status: 'Pendiente',
      lastSync: '2024-01-19 09:30'
    },
    {
      id: '4',
      name: 'Repositorio Universidad Nacional',
      type: 'Institucional',
      url: 'https://repositorio.unlp.edu.ar',
      status: 'Error',
      lastSync: '2024-01-18 15:20'
    }
  ];

  const mockBackups: Backup[] = [
    {
      id: '1',
      name: 'Backup Automático - Proyecto La Laguna',
      type: 'Automático',
      size: '2.1 GB',
      createdAt: '2024-01-20 06:00',
      status: 'Completado'
    },
    {
      id: '2',
      name: 'Backup Manual - Datos SIG',
      type: 'Manual',
      size: '856 MB',
      createdAt: '2024-01-19 18:30',
      status: 'Completado'
    },
    {
      id: '3',
      name: 'Backup Automático - Base de Datos',
      type: 'Automático',
      size: '1.5 GB',
      createdAt: '2024-01-19 06:00',
      status: 'Completado'
    },
    {
      id: '4',
      name: 'Backup Manual - Documentos',
      type: 'Manual',
      size: '234 MB',
      createdAt: '2024-01-18 16:45',
      status: 'Completado'
    }
  ];

  useEffect(() => {
    setExportJobs(mockExportJobs);
    setRepositories(mockRepositories);
    setBackups(mockBackups);
  }, []);

  const handleExport = () => {
    console.log('Iniciando exportación...');
    alert('Exportación iniciada. Se notificará cuando esté completa.');
  };

  const handleBackup = () => {
    console.log('Iniciando backup...');
    alert('Backup iniciado. Se notificará cuando esté completo.');
  };

  const handleSyncRepository = (repositoryId: string) => {
    console.log(`Sincronizando repositorio ${repositoryId}`);
    alert('Sincronización iniciada');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado': return 'bg-green-100 text-green-800';
      case 'En Progreso': return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente': return 'bg-gray-100 text-gray-800';
      case 'Error': return 'bg-red-100 text-red-800';
      case 'Conectado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress > 50) return 'bg-yellow-500';
    return 'bg-blue-500';
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
                  Exportación y Repositorio
                </h1>
                <p className="mt-2 text-gray-600">
                  Backups automáticos y exportación estructurada
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  📊 Estadísticas
                </Button>
                <Button variant="outline">
                  ⚙️ Configuración
                </Button>
                <Button variant="primary" onClick={handleBackup}>
                  💾 Crear Backup
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
                    <span className="text-white text-sm font-medium">📤</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Exportaciones</p>
                  <p className="text-2xl font-semibold text-gray-900">{exportJobs.length}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">💾</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Backups</p>
                  <p className="text-2xl font-semibold text-gray-900">{backups.length}</p>
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
                  <p className="text-sm font-medium text-gray-500">Repositorios</p>
                  <p className="text-2xl font-semibold text-gray-900">{repositories.length}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">💿</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Espacio Usado</p>
                  <p className="text-2xl font-semibold text-gray-900">4.6 GB</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Export Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Export Settings */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración de Exportación
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proyecto a Exportar
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                  >
                    <option value="all">Todos los Proyectos</option>
                    <option value="proj-001">Cazadores Recolectores Pampa</option>
                    <option value="proj-002">Análisis ADN Antiguo</option>
                    <option value="proj-003">Metodología Excavación</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato de Exportación
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                  >
                    <option value="json">JSON (Completo)</option>
                    <option value="csv">CSV (Tabular)</option>
                    <option value="xml">XML (Estructurado)</option>
                    <option value="zip">ZIP (Comprimido)</option>
                    <option value="shapefile">Shapefile (GIS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incluir Datos
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" defaultChecked />
                      <span className="text-sm">Metadatos del proyecto</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" defaultChecked />
                      <span className="text-sm">Datos de artefactos</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" defaultChecked />
                      <span className="text-sm">Información geográfica</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" />
                      <span className="text-sm">Documentos adjuntos</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" />
                      <span className="text-sm">Historial de cambios</span>
                    </label>
                  </div>
                </div>

                <Button variant="primary" onClick={handleExport} className="w-full">
                  📤 Iniciar Exportación
                </Button>
              </div>
            </div>
          </Card>

          {/* Access Control */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Control de Acceso
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel de Acceso
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Público (Acceso Abierto)</option>
                    <option>Institucional (Miembros)</option>
                    <option>Restringido (Investigadores)</option>
                    <option>Privado (Solo Equipo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Licencia de Uso
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Creative Commons BY 4.0</option>
                    <option>Creative Commons BY-SA 4.0</option>
                    <option>Creative Commons BY-NC 4.0</option>
                    <option>Licencia Institucional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Embargo Temporal
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Fecha de liberación"
                    />
                    <Button variant="outline" size="sm">
                      🚫 Aplicar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" defaultChecked />
                    <span className="text-sm">Requerir atribución</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" />
                    <span className="text-sm">Permitir uso comercial</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" defaultChecked />
                    <span className="text-sm">Notificar descargas</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Export Jobs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Trabajos de Exportación</h2>
          <div className="space-y-4">
            {exportJobs.map((job) => (
              <Card key={job.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{job.name}</h3>
                      <p className="text-sm text-gray-600">{job.type} • {job.format}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        <span className="text-sm text-gray-500">{job.size}</span>
                        <span className="text-sm text-gray-500">{job.createdAt}</span>
                      </div>
                      {job.status === 'En Progreso' && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progreso</span>
                            <span>{job.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(job.progress)}`}
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        📥 Descargar
                      </Button>
                      <Button variant="outline" size="sm">
                        🗑️ Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Repositories and Backups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Repositories */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Repositorios Institucionales
              </h3>
              <div className="space-y-3">
                {repositories.map((repo) => (
                  <div key={repo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{repo.name}</h4>
                      <p className="text-xs text-gray-500">{repo.type} • {repo.url}</p>
                      <p className="text-xs text-gray-400">Última sincronización: {repo.lastSync}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(repo.status)}`}>
                        {repo.status}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => handleSyncRepository(repo.id)}>
                        🔄 Sincronizar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Backups */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Backups Automáticos
              </h3>
              <div className="space-y-3">
                {backups.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{backup.name}</h4>
                      <p className="text-xs text-gray-500">{backup.type} • {backup.size}</p>
                      <p className="text-xs text-gray-400">Creado: {backup.createdAt}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                        {backup.status}
                      </span>
                      <Button variant="outline" size="sm">
                        📥 Restaurar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExportPage; 