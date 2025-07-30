'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ContextBanner from '@/components/ui/ContextBanner';
import useInvestigatorContext from '@/hooks/useInvestigatorContext';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
  }[];
}

const VisualizationPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { context, hasContext, isLoading } = useInvestigatorContext();
  
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedSite, setSelectedSite] = useState('all');
  const [chartType, setChartType] = useState('artifacts');
  const [viewMode, setViewMode] = useState<'charts' | '3d' | 'maps'>('charts');

  // Datos simulados para visualizaciones
  const artifactTypesData = {
    labels: ['Puntas de Proyectil', 'Raspadores', 'Cerámica', 'Molinos', 'Bifaces', 'Perforadores'],
    data: [45, 32, 28, 15, 12, 8]
  };

  const materialDistributionData = {
    labels: ['Sílex', 'Cuarzo', 'Obsidiana', 'Granito', 'Arcilla', 'Otros'],
    data: [38, 25, 18, 12, 15, 8]
  };

  const temporalData = {
    labels: ['Holoceno Temprano', 'Holoceno Medio', 'Holoceno Tardío', 'Histórico'],
    data: [5, 28, 52, 15]
  };

  const siteActivityData = {
    labels: ['La Laguna', 'Arroyo Seco', 'Mar Chiquita', 'Tandil', 'Laguna de los Padres'],
    data: [25, 18, 15, 12, 10]
  };

  const excavationProgressData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Unidades Excavadas',
        data: [12, 19, 25, 32, 38, 45],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      },
      {
        label: 'Artefactos Encontrados',
        data: [8, 15, 23, 31, 42, 58],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      }
    ]
  };

  const getChartData = (type: string) => {
    switch (type) {
      case 'artifacts':
        return {
          labels: artifactTypesData.labels,
          datasets: [{
            label: 'Cantidad de Artefactos',
            data: artifactTypesData.data,
            backgroundColor: [
              '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'
            ],
            borderColor: [
              '#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0891B2'
            ]
          }]
        };
      case 'materials':
        return {
          labels: materialDistributionData.labels,
          datasets: [{
            label: 'Distribución por Material',
            data: materialDistributionData.data,
            backgroundColor: [
              '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#3B82F6', '#06B6D4'
            ],
            borderColor: [
              '#D97706', '#059669', '#7C3AED', '#DC2626', '#2563EB', '#0891B2'
            ]
          }]
        };
      case 'temporal':
        return {
          labels: temporalData.labels,
          datasets: [{
            label: 'Distribución Temporal',
            data: temporalData.data,
            backgroundColor: [
              '#EF4444', '#F59E0B', '#10B981', '#3B82F6'
            ],
            borderColor: [
              '#DC2626', '#D97706', '#059669', '#2563EB'
            ]
          }]
        };
      case 'sites':
        return {
          labels: siteActivityData.labels,
          datasets: [{
            label: 'Actividad por Sitio',
            data: siteActivityData.data,
            backgroundColor: [
              '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
            ],
            borderColor: [
              '#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED'
            ]
          }]
        };
      default:
        return {
          labels: [],
          datasets: []
        };
    }
  };

  const renderChart = (type: string) => {
    const data = getChartData(type);
    const total = data.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          {type === 'artifacts' && 'Tipos de Artefactos'}
          {type === 'materials' && 'Distribución por Material'}
          {type === 'temporal' && 'Distribución Temporal'}
          {type === 'sites' && 'Actividad por Sitio'}
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-2xl font-bold text-gray-700 mb-2">{total}</div>
            <div className="text-sm text-gray-600">Total registros</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {data.labels.map((label, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded mr-2"
                    style={{ backgroundColor: data.datasets[0]?.backgroundColor[index] }}
                  ></div>
                  <span className="truncate">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const render3DVisualization = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">🌐 Visualización 3D del Sitio</h3>
      <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">Visualización 3D</h4>
          <p className="text-gray-600 mb-4">Modelo tridimensional del sitio arqueológico</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded shadow">
              <div className="font-semibold">Estratos</div>
              <div className="text-gray-600">5 niveles</div>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <div className="font-semibold">Hallazgos</div>
              <div className="text-gray-600">247 objetos</div>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <div className="font-semibold">Profundidad</div>
              <div className="text-gray-600">2.5m</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">🗺️ Mapa de Distribución</h3>
      <div className="h-96 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📍</div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">Mapa Interactivo</h4>
          <p className="text-gray-600 mb-4">Distribución espacial de hallazgos</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded shadow">
              <div className="font-semibold">Sitios Activos</div>
              <div className="text-gray-600">12 ubicaciones</div>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <div className="font-semibold">Área Total</div>
              <div className="text-gray-600">150 km²</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">📅 Cronología del Proyecto</h3>
      <div className="space-y-4">
        {excavationProgressData.labels.map((month, index) => (
          <div key={month} className="flex items-center">
            <div className="w-16 text-sm font-medium text-gray-600">{month}</div>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(excavationProgressData.datasets[0].data[index] / 45) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="w-20 text-sm text-gray-600">
              {excavationProgressData.datasets[0].data[index]} unidades
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando visualizaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de contexto */}
      {hasContext && (
        <ContextBanner />
        )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => router.push('/dashboard/researcher')}
            className="hover:text-blue-600 hover:underline"
          >
            Dashboard
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Visualización de Datos</span>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 Visualización de Datos</h1>
            <p className="mt-2 text-gray-600">Análisis gráfico y visualización de datos arqueológicos</p>
          </div>
        </div>

        {/* Controles de Visualización */}
        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            <Button
              variant={viewMode === 'charts' ? 'primary' : 'outline'}
              onClick={() => setViewMode('charts')}
            >
              📊 Gráficos
            </Button>
            <Button
              variant={viewMode === '3d' ? 'primary' : 'outline'}
              onClick={() => setViewMode('3d')}
            >
              🌐 Visualización 3D
            </Button>
            <Button
              variant={viewMode === 'maps' ? 'primary' : 'outline'}
              onClick={() => setViewMode('maps')}
            >
              🗺️ Mapas
            </Button>
          </div>

          {viewMode === 'charts' && (
            <div className="flex space-x-2">
              <Button
                variant={chartType === 'artifacts' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setChartType('artifacts')}
              >
                Artefactos
              </Button>
              <Button
                variant={chartType === 'materials' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setChartType('materials')}
              >
                Materiales
              </Button>
              <Button
                variant={chartType === 'temporal' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setChartType('temporal')}
              >
                Temporal
              </Button>
              <Button
                variant={chartType === 'sites' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setChartType('sites')}
              >
                Sitios
              </Button>
            </div>
          )}
        </div>

        {/* Contenido de Visualización */}
        <div className="space-y-6">
          {viewMode === 'charts' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderChart(chartType)}
              {renderTimeline()}
            </div>
          )}

          {viewMode === '3d' && (
            <div className="grid grid-cols-1 gap-6">
              {render3DVisualization()}
            </div>
          )}

          {viewMode === 'maps' && (
            <div className="grid grid-cols-1 gap-6">
              {renderMap()}
            </div>
          )}
        </div>

        {/* Estadísticas Rápidas */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">📈 Estadísticas Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">247</div>
                <div className="text-sm text-gray-600">Total Artefactos</div>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Sitios Activos</div>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">89</div>
                <div className="text-sm text-gray-600">Muestras en Análisis</div>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">45</div>
                <div className="text-sm text-gray-600">Unidades Excavadas</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage; 