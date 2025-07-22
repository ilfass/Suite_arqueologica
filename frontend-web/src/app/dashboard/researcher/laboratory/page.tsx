'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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

  const handleAddSample = () => {
    const sample: Sample = {
      id: Date.now().toString(),
      name: newSample.name,
      type: newSample.type,
      origin: newSample.origin,
      analysis: newSample.analysis,
      results: newSample.results,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setSamples([...samples, sample]);
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
            <div className="text-2xl font-bold text-blue-600">{samples.length}</div>
            <div className="text-sm text-gray-600">Total Muestras</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {samples.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {samples.filter(s => s.status === 'in_progress').length}
            </div>
            <div className="text-sm text-gray-600">En Proceso</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {samples.filter(s => s.status === 'completed').length}
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
                {samples.map((sample) => (
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Origen</label>
                <Input
                  value={newSample.origin}
                  onChange={(e) => setNewSample({...newSample, origin: e.target.value})}
                  placeholder="Procedencia"
                />
              </div>
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
              <Button onClick={handleAddSample}>
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