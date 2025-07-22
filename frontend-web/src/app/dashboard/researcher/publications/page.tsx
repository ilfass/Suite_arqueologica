'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Publication {
  id: string;
  title: string;
  type: 'report' | 'paper' | 'poster' | 'gallery';
  author: string;
  date: string;
  status: 'draft' | 'review' | 'published';
  description: string;
  fileUrl?: string;
}

const PublicationsPage: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [showAddPublication, setShowAddPublication] = useState(false);
  const [newPublication, setNewPublication] = useState({
    title: '',
    type: 'report' as const,
    author: '',
    description: ''
  });

  // Datos simulados
  useEffect(() => {
    setPublications([
      {
        id: '1',
        title: 'Informe de Excavación Sitio A1',
        type: 'report',
        author: 'Dr. Pérez',
        date: '2025-07-22',
        status: 'published',
        description: 'Informe técnico completo de la excavación en el sitio A1'
      },
      {
        id: '2',
        title: 'Análisis de Cerámica Prehispánica',
        type: 'paper',
        author: 'Dr. Pérez',
        date: '2025-07-20',
        status: 'review',
        description: 'Paper sobre análisis de cerámica encontrada en el sitio'
      },
      {
        id: '3',
        title: 'Galería de Hallazgos',
        type: 'gallery',
        author: 'Dr. Pérez',
        date: '2025-07-18',
        status: 'published',
        description: 'Galería visual de los principales hallazgos'
      }
    ]);
  }, []);

  const handleAddPublication = () => {
    const publication: Publication = {
      id: Date.now().toString(),
      title: newPublication.title,
      type: newPublication.type,
      author: newPublication.author,
      description: newPublication.description,
      date: new Date().toISOString().split('T')[0],
      status: 'draft'
    };
    setPublications([...publications, publication]);
    setNewPublication({ title: '', type: 'report', author: '', description: '' });
    setShowAddPublication(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'report': return '📋';
      case 'paper': return '📄';
      case 'poster': return '📊';
      case 'gallery': return '🖼️';
      default: return '📄';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">📑 Publicaciones y Difusión</h1>
        <Button onClick={() => setShowAddPublication(true)}>
          ➕ Nueva Publicación
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{publications.length}</div>
            <div className="text-sm text-gray-600">Total Publicaciones</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {publications.filter(p => p.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600">Borradores</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {publications.filter(p => p.status === 'review').length}
            </div>
            <div className="text-sm text-gray-600">En Revisión</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {publications.filter(p => p.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600">Publicadas</div>
          </div>
        </Card>
      </div>

      {/* Lista de Publicaciones */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">📚 Gestión de Publicaciones</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
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
                {publications.map((publication) => (
                  <tr key={publication.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-2xl">{getTypeIcon(publication.type)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{publication.title}</div>
                      <div className="text-sm text-gray-500">{publication.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{publication.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(publication.status)}`}>
                        {publication.status === 'draft' ? 'Borrador' : 
                         publication.status === 'review' ? 'En Revisión' : 'Publicado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {publication.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedPublication(publication)}>
                          👁️ Ver
                        </Button>
                        <Button size="sm" variant="outline">
                          📤 Compartir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Modal para agregar publicación */}
      {showAddPublication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">➕ Nueva Publicación</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <Input
                  value={newPublication.title}
                  onChange={(e) => setNewPublication({...newPublication, title: e.target.value})}
                  placeholder="Título de la publicación"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  value={newPublication.type}
                  onChange={(e) => setNewPublication({...newPublication, type: e.target.value as any})}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="report">📋 Informe Técnico</option>
                  <option value="paper">📄 Paper</option>
                  <option value="poster">📊 Poster</option>
                  <option value="gallery">🖼️ Galería</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Autor</label>
                <Input
                  value={newPublication.author}
                  onChange={(e) => setNewPublication({...newPublication, author: e.target.value})}
                  placeholder="Nombre del autor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={newPublication.description}
                  onChange={(e) => setNewPublication({...newPublication, description: e.target.value})}
                  placeholder="Descripción de la publicación"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddPublication(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddPublication}>
                Crear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver publicación */}
      {selectedPublication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">📑 Detalles de la Publicación</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getTypeIcon(selectedPublication.type)}</span>
                  <span className="text-sm text-gray-900">
                    {selectedPublication.type === 'report' ? 'Informe Técnico' :
                     selectedPublication.type === 'paper' ? 'Paper' :
                     selectedPublication.type === 'poster' ? 'Poster' : 'Galería'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <p className="text-sm text-gray-900">{selectedPublication.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Autor</label>
                <p className="text-sm text-gray-900">{selectedPublication.author}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <p className="text-sm text-gray-900">{selectedPublication.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedPublication.status)}`}>
                  {selectedPublication.status === 'draft' ? 'Borrador' : 
                   selectedPublication.status === 'review' ? 'En Revisión' : 'Publicado'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                <p className="text-sm text-gray-900">{selectedPublication.date}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline">
                📤 Compartir
              </Button>
              <Button variant="outline" onClick={() => setSelectedPublication(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationsPage; 