'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ContextBanner from '@/components/ui/ContextBanner';
import useInvestigatorContext from '@/hooks/useInvestigatorContext';

interface Artifact {
  id: string;
  name: string;
  type: string;
  material: string;
  period: string;
  location: string;
  coordinates: { lat: number; lng: number };
  dimensions: { length: number; width: number; height: number };
  weight: number;
  condition: string;
  description: string;
  photos: string[];
  relatedArtifacts: string[];
  excavationUnit: string;
  stratigraphicUnit: string;
  dateFound: string;
  foundBy: string;
  status: string;
  projectId: string;
  areaId: string;
  siteId: string;
}

const NewArtifactPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { context, hasContext, isLoading } = useInvestigatorContext();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    material: '',
    period: '',
    location: '',
    lat: '',
    lng: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    condition: 'Bueno',
    description: '',
    excavationUnit: '',
    stratigraphicUnit: '',
    dateFound: new Date().toISOString().split('T')[0],
    foundBy: '',
    status: 'Documentado',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular guardado
    setTimeout(() => {
      console.log('Artefacto guardado:', formData);
      setLoading(false);
      router.push('/dashboard/researcher/artifacts');
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/dashboard/researcher/artifacts');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!hasContext) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona tu contexto de trabajo</h3>
          <p className="text-gray-600 mb-4">Para registrar un artefacto, primero debes seleccionar un contexto.</p>
          <Button variant="primary" onClick={() => router.push('/dashboard/researcher')}>Ir al Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de contexto */}
      <ContextBanner
        project={context.project}
        area={context.area}
        site={context.site}
        showBackButton={true}
        showChangeButton={false}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => router.push('/dashboard/researcher')}
            className="hover:text-blue-600 hover:underline"
          >
            Dashboard
          </button>
          <span>›</span>
          <button
            onClick={() => router.push('/dashboard/researcher/artifacts')}
            className="hover:text-blue-600 hover:underline"
          >
            Artefactos
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Nuevo Artefacto</span>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏺 Nuevo Artefacto</h1>
            <p className="mt-2 text-gray-600">Registra un nuevo artefacto arqueológico</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Artefacto'}
            </Button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">📋 Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Artefacto *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Punta de proyectil Cola de Pescado"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Herramienta">Herramienta</option>
                    <option value="Arma">Arma</option>
                    <option value="Vasija">Vasija</option>
                    <option value="Adorno">Adorno</option>
                    <option value="Herramienta de Molienda">Herramienta de Molienda</option>
                    <option value="Fragmento">Fragmento</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material *
                  </label>
                  <Input
                    value={formData.material}
                    onChange={(e) => setFormData({...formData, material: e.target.value})}
                    placeholder="Ej: Sílice, Cuarzo, Arcilla"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Período
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({...formData, period: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Seleccionar período</option>
                    <option value="Pleistoceno Tardío">Pleistoceno Tardío</option>
                    <option value="Holoceno Temprano">Holoceno Temprano</option>
                    <option value="Holoceno Medio">Holoceno Medio</option>
                    <option value="Holoceno Tardío">Holoceno Tardío</option>
                    <option value="Período Colonial">Período Colonial</option>
                    <option value="Indefinido">Indefinido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Ej: Cuadrícula A1, Nivel 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Hallazgo *
                  </label>
                  <Input
                    type="date"
                    value={formData.dateFound}
                    onChange={(e) => setFormData({...formData, dateFound: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe detalladamente el artefacto"
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Coordenadas y Dimensiones */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">📍 Coordenadas y Dimensiones</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitud
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({...formData, lat: e.target.value})}
                    placeholder="Ej: -38.1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitud
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => setFormData({...formData, lng: e.target.value})}
                    placeholder="Ej: -61.5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Largo (cm)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.length}
                    onChange={(e) => setFormData({...formData, length: e.target.value})}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ancho (cm)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.width}
                    onChange={(e) => setFormData({...formData, width: e.target.value})}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alto (cm)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (g)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Contexto y Estado */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">🔍 Contexto y Estado</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidad de Excavación
                  </label>
                  <Input
                    value={formData.excavationUnit}
                    onChange={(e) => setFormData({...formData, excavationUnit: e.target.value})}
                    placeholder="Ej: CU-01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidad Estratigráfica
                  </label>
                  <Input
                    value={formData.stratigraphicUnit}
                    onChange={(e) => setFormData({...formData, stratigraphicUnit: e.target.value})}
                    placeholder="Ej: SU-02"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condición
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Regular">Regular</option>
                    <option value="Pobre">Pobre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="Documentado">Documentado</option>
                    <option value="En Análisis">En Análisis</option>
                    <option value="Restaurado">Restaurado</option>
                    <option value="En Conservación">En Conservación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descubierto por
                  </label>
                  <Input
                    value={formData.foundBy}
                    onChange={(e) => setFormData({...formData, foundBy: e.target.value})}
                    placeholder="Nombre del descubridor"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Observaciones adicionales sobre el artefacto"
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default NewArtifactPage; 