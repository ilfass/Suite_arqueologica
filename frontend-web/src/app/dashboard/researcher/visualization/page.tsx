'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

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
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedSite, setSelectedSite] = useState('all');
  const [chartType, setChartType] = useState('artifacts');

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
              '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'
            ],
            borderColor: [
              '#2563EB', '#059669', '#D97706', '#7C3AED', '#DC2626'
            ]
          }]
        };
      default:
        return excavationProgressData;
    }
  };

  const renderChart = (type: string) => {
    const data = getChartData(type);
    
    return (
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl mb-2 block">📊</span>
          <p className="text-gray-600">Gráfico de {type}</p>
          <p className="text-sm text-gray-500">Integración con Chart.js/D3.js</p>
        </div>
      </div>
    );
  };

  const renderMap = () => (
    <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <span className="text-6xl mb-4 block">🗺️</span>
        <p className="text-gray-600">Mapa de distribución de hallazgos</p>
        <p className="text-sm text-gray-500">Integración con Leaflet/Mapbox</p>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <span className="text-4xl mb-2 block">📅</span>
        <p className="text-gray-600">Línea de tiempo arqueológica</p>
        <p className="text-sm text-gray-500">Secuencia temporal de hallazgos</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Visualización de Datos
                </h1>
                <p className="mt-2 text-gray-600">
                  Dashboard analítico y visualización arqueológica
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  📊 Exportar Reporte
                </Button>
                <Button variant="outline">
                  🖼️ Capturar Pantalla
                </Button>
                <Button variant="primary">
                  🔄 Actualizar Datos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="all">Todos los períodos</option>
              <option value="holoceno_temprano">Holoceno Temprano</option>
              <option value="holoceno_medio">Holoceno Medio</option>
              <option value="holoceno_tardio">Holoceno Tardío</option>
              <option value="historico">Histórico</option>
            </select>
            
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
            >
              <option value="all">Todos los sitios</option>
              <option value="la_laguna">La Laguna</option>
              <option value="arroyo_seco">Arroyo Seco</option>
              <option value="mar_chiquita">Mar Chiquita</option>
              <option value="tandil">Tandil</option>
              <option value="laguna_padres">Laguna de los Padres</option>
            </select>
            
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="artifacts">Tipos de Artefactos</option>
              <option value="materials">Materiales</option>
              <option value="temporal">Distribución Temporal</option>
              <option value="sites">Actividad por Sitio</option>
              <option value="progress">Progreso de Excavación</option>
            </select>
            
            <Button variant="outline">
              🔄 Aplicar Filtros
            </Button>
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
                    <span className="text-white text-sm font-medium">🏺</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Artefactos</p>
                  <p className="text-2xl font-semibold text-gray-900">1,247</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🗺️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Sitios Activos</p>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📏</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Área Excavada</p>
                  <p className="text-2xl font-semibold text-gray-900">2.4 km²</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Muestras Analizadas</p>
                  <p className="text-2xl font-semibold text-gray-900">89</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Main Chart */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {chartType === 'artifacts' && 'Distribución de Tipos de Artefactos'}
                {chartType === 'materials' && 'Distribución por Materiales'}
                {chartType === 'temporal' && 'Distribución Temporal'}
                {chartType === 'sites' && 'Actividad por Sitio'}
                {chartType === 'progress' && 'Progreso de Excavación'}
              </h3>
              {renderChart(chartType)}
            </div>
          </Card>

          {/* Map */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mapa de Distribución
              </h3>
              {renderMap()}
            </div>
          </Card>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Línea de Tiempo
              </h3>
              {renderTimeline()}
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Progreso Mensual
              </h3>
              {renderChart('progress')}
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Análisis de Materiales
              </h3>
              {renderChart('materials')}
            </div>
          </Card>
        </div>

        {/* 3D Visualization */}
        <Card className="mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Visualización 3D
            </h3>
            <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl mb-4 block">🎯</span>
                <p className="text-gray-600">Reconstrucción 3D del sitio</p>
                <p className="text-sm text-gray-500">Integración con Three.js/WebGL</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistical Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Análisis Estadístico
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Correlación Material-Período</span>
                  <span className="text-sm font-medium text-green-600">0.87</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Densidad de Hallazgos</span>
                  <span className="text-sm font-medium text-blue-600">2.4/km²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Índice de Diversidad</span>
                  <span className="text-sm font-medium text-purple-600">0.73</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tasa de Preservación</span>
                  <span className="text-sm font-medium text-yellow-600">78%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Métricas de Campo
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tiempo Promedio de Documentación</span>
                  <span className="text-sm font-medium text-green-600">15 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Precisión GPS</span>
                  <span className="text-sm font-medium text-blue-600">±2m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tasa de Error de Medición</span>
                  <span className="text-sm font-medium text-purple-600">0.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Eficiencia de Catalogación</span>
                  <span className="text-sm font-medium text-yellow-600">92%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage; 