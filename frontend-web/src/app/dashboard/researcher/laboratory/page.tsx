'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

interface Sample {
  id: string;
  name: string;
  type: string;
  origin: string;
  analysis: string;
  results: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
}

const LaboratoryPage: React.FC = () => {
  const router = useRouter();
  // Contexto de trabajo
  const [context, setContext] = useState<{ project: string; area: string; site: string }>({ project: '', area: '', site: '' });
  const [siteName, setSiteName] = useState('');

  const [samples, setSamples] = useState<Sample[]>([]);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [showAddSample, setShowAddSample] = useState(false);
  const [newSample, setNewSample] = useState({
    name: '',
    type: '',
    origin: '',
    analysis: '',
    results: ''
  });

  // Arrays simulados de proyectos y áreas (igual que en el dashboard)
  const projects = [
    { id: '1', name: 'Proyecto Cazadores Recolectores - La Laguna' },
    { id: '2', name: 'Estudio de Poblamiento Pampeano' },
    { id: '3', name: 'Arqueología de la Llanura Bonaerense' }
  ];
  const areas = [
    { id: '1', name: 'Laguna La Brava', projectId: '1' },
    { id: '2', name: 'Arroyo Seco', projectId: '1' },
    { id: '3', name: 'Monte Hermoso', projectId: '2' }
  ];

  // Datos simulados
  useEffect(() => {
    setSamples([
      {
        id: '1',
        name: 'Muestra C-14',
        type: 'Carbono 14',
        origin: 'Excavación A1',
        analysis: 'Dating',
        results: 'Pendiente',
        date: '2025-07-22',
        status: 'pending'
      },
      {
        id: '2',
        name: 'Muestra Cerámica',
        type: 'Cerámica',
        origin: 'Excavación B2',
        analysis: 'Petrography',
        results: 'Completado',
        date: '2025-07-20',
        status: 'completed'
      }
    ]);
  }, []);

  useEffect(() => {
    // Leer contexto de localStorage
    const saved = localStorage.getItem('investigator-context');
    if (saved) {
      const ctx = JSON.parse(saved);
      setContext({ project: ctx.project || '', area: ctx.area || '', site: ctx.site || '' });
    }
  }, []);

  // Sincronizar contexto al recibir foco o volver a la pestaña
  useEffect(() => {
    const syncContext = () => {
      const saved = localStorage.getItem('investigator-context');
      if (saved) {
        const ctx = JSON.parse(saved);
        setContext({ project: ctx.project || '', area: ctx.area || '', site: ctx.site || '' });
      }
    };
    window.addEventListener('focus', syncContext);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') syncContext();
    });
    return () => {
      window.removeEventListener('focus', syncContext);
      window.removeEventListener('visibilitychange', syncContext);
    };
  }, []);

  useEffect(() => {
    // Simular obtención del nombre del sitio activo
    const sitios = [
      { id: '1', name: 'Sitio Laguna La Brava Norte' },
      { id: '2', name: 'Excavación Arroyo Seco 2' },
      { id: '3', name: 'Monte Hermoso Playa' }
    ];
    const found = sitios.find(s => s.id === context.site);
    setSiteName(found ? found.name : context.site);
  }, [context]);

  // Filtrar muestras por sitio activo (cuando corresponda)
  const filteredSamples = context.site
    ? samples // Aquí deberías filtrar por siteName o context.site si los datos lo tuvieran
    : [];

  // Banner de contexto activo
  const renderContextBanner = () => (
    context.project && context.area && context.site ? (
      <div className="sticky top-0 z-30 w-full bg-blue-50 border-b border-blue-200 py-2 px-4 flex items-center justify-between shadow-sm mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-blue-700 font-semibold">Trabajando en:</span>
          <span className="text-blue-900 font-bold">{projects.find(p => p.id === context.project)?.name || `Proyecto ${context.project}`}</span>
          <span className="text-blue-700">|</span>
          <span className="text-blue-900 font-bold">{areas.find(a => a.id === context.area)?.name || `Área ${context.area}`}</span>
          <span className="text-blue-700">|</span>
          <span className="text-blue-900 font-bold">{siteName || context.site}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => router.push('/dashboard/researcher')}>Cambiar Contexto</Button>
        </div>
      </div>
    ) : null
  );

  // Si no hay contexto, mostrar mensaje y botón para ir al dashboard
  if (!context.project || !context.area || !context.site) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona tu contexto de trabajo</h3>
          <p className="text-gray-600 mb-4">Para acceder al laboratorio, primero debes seleccionar un proyecto, área y sitio.</p>
          <Button variant="primary" onClick={() => router.push('/dashboard/researcher')}>Ir al Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleAddSample = (sample: Omit<Sample, 'id' | 'date' | 'status'>) => {
    setSamples(prev => [
      ...prev,
      {
        ...sample,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      }
    ]);
    setNewSample({ name: '', type: '', origin: '', analysis: '', results: '' });
    setShowAddSample(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {renderContextBanner()}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">🔬 Laboratorio</h1>
        <Button onClick={() => setShowAddSample(true)}>
          ➕ Agregar Muestra
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredSamples.length}</div>
            <div className="text-sm text-gray-600">Total Muestras</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredSamples.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredSamples.filter(s => s.status === 'in_progress').length}
            </div>
            <div className="text-sm text-gray-600">En Proceso</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredSamples.filter(s => s.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completadas</div>
          </div>
        </Card>
      </div>

      {/* Lista de Muestras */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">📋 Gestión de Muestras</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Muestra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Análisis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSamples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sample.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sample.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sample.origin}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sample.analysis}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sample.status)}`}>
                        {sample.status === 'pending' ? 'Pendiente' : 
                         sample.status === 'in_progress' ? 'En Proceso' : 'Completado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sample.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button size="sm" variant="outline" onClick={() => setSelectedSample(sample)}>
                        👁️ Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Modal para agregar muestra */}
      {showAddSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">➕ Agregar Nueva Muestra</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <Input
                  value={newSample.name}
                  onChange={(e) => setNewSample({...newSample, name: e.target.value})}
                  placeholder="Nombre de la muestra"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <Input
                  value={newSample.type}
                  onChange={(e) => setNewSample({...newSample, type: e.target.value})}
                  placeholder="Tipo de muestra"
                />
              </div>
              {/* Campo origen autocompletado y oculto */}
              <input type="hidden" value={siteName} />
              {/* <div>
                <label className="block text-sm font-medium text-gray-700">Origen</label>
                <Input
                  value={newSample.origin}
                  onChange={(e) => setNewSample({...newSample, origin: e.target.value})}
                  placeholder="Procedencia"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Análisis</label>
                <Input
                  value={newSample.analysis}
                  onChange={(e) => setNewSample({...newSample, analysis: e.target.value})}
                  placeholder="Tipo de análisis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Resultados</label>
                <Input
                  value={newSample.results}
                  onChange={(e) => setNewSample({...newSample, results: e.target.value})}
                  placeholder="Resultados iniciales"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddSample(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                // Al guardar, autocompletar el origen con el contexto
                handleAddSample({ ...newSample, origin: siteName });
              }}>
                Agregar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver muestra */}
      {selectedSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">🔬 Detalles de la Muestra</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <p className="text-sm text-gray-900">{selectedSample.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <p className="text-sm text-gray-900">{selectedSample.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Origen</label>
                <p className="text-sm text-gray-900">{selectedSample.origin}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Análisis</label>
                <p className="text-sm text-gray-900">{selectedSample.analysis}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Resultados</label>
                <p className="text-sm text-gray-900">{selectedSample.results}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedSample.status)}`}>
                  {selectedSample.status === 'pending' ? 'Pendiente' : 
                   selectedSample.status === 'in_progress' ? 'En Proceso' : 'Completado'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                <p className="text-sm text-gray-900">{selectedSample.date}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setSelectedSample(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaboratoryPage; 