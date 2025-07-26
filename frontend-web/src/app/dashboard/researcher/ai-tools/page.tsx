'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface AIAnalysis {
  id: string;
  type: string;
  artifactId: string;
  artifactName: string;
  confidence: number;
  results: any;
  status: string;
  createdAt: string;
}

interface ClassificationResult {
  category: string;
  confidence: number;
  description: string;
  similarArtifacts: string[];
}

const AIToolsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Datos simulados
  const mockAnalyses: AIAnalysis[] = [
    {
      id: '1',
      type: 'Clasificación de Fragmentos',
      artifactId: 'ART-001',
      artifactName: 'Fragmento de Cerámica',
      confidence: 94.2,
      results: {
        category: 'Cerámica Decorada',
        period: 'Holoceno Tardío',
        technique: 'Incisa',
        similarArtifacts: ['ART-015', 'ART-023', 'ART-031']
      },
      status: 'Completado',
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      type: 'Análisis de Similitud',
      artifactId: 'ART-002',
      artifactName: 'Punta de Proyectil',
      confidence: 87.5,
      results: {
        similarityScore: 0.87,
        matches: ['ART-008', 'ART-012', 'ART-019'],
        materialMatch: 'Sílex',
        techniqueMatch: 'Bifacial'
      },
      status: 'Completado',
      createdAt: '2024-01-19'
    },
    {
      id: '3',
      type: 'Reconstrucción 3D',
      artifactId: 'ART-003',
      artifactName: 'Vasija Fragmentada',
      confidence: 76.8,
      results: {
        originalForm: 'Vasija Globular',
        estimatedHeight: '25cm',
        estimatedDiameter: '18cm',
        decoration: 'Geométrica'
      },
      status: 'En Progreso',
      createdAt: '2024-01-18'
    },
    {
      id: '4',
      type: 'Análisis de Correlación',
      artifactId: 'ART-004',
      artifactName: 'Conjunto Lítico',
      confidence: 91.3,
      results: {
        correlationMatrix: {
          'Material-Período': 0.87,
          'Técnica-Sitio': 0.73,
          'Tamaño-Función': 0.65
        },
        patterns: ['Concentración temporal', 'Variabilidad técnica']
      },
      status: 'Completado',
      createdAt: '2024-01-17'
    }
  ];

  useEffect(() => {
    setAnalyses(mockAnalyses);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClassification = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('Clasificación automática completada');
    }, 3000);
  };

  const handleSimilarityAnalysis = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('Análisis de similitud completado');
    }, 2500);
  };

  const handle3DReconstruction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('Reconstrucción 3D completada');
    }, 5000);
  };

  const handleCorrelationAnalysis = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('Análisis de correlación completado');
    }, 4000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado': return 'bg-green-100 text-green-800';
      case 'En Progreso': return 'bg-yellow-100 text-yellow-800';
      case 'Error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Clasificación de Fragmentos': return '🔍';
      case 'Análisis de Similitud': return '🔗';
      case 'Reconstrucción 3D': return '🎯';
      case 'Análisis de Correlación': return '📊';
      default: return '🤖';
    }
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
                  Herramientas de IA
                </h1>
                <p className="mt-2 text-gray-600">
                  Análisis automático y reconstrucción predictiva
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  📊 Historial
                </Button>
                <Button variant="outline">
                  ⚙️ Configuración
                </Button>
                <Button variant="primary">
                  🆕 Nuevo Análisis
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
                    <span className="text-white text-sm font-medium">🔍</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Clasificaciones</p>
                  <p className="text-2xl font-semibold text-gray-900">156</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🎯</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Precisión Promedio</p>
                  <p className="text-2xl font-semibold text-gray-900">87.4%</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🔗</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Similitudes Encontradas</p>
                  <p className="text-2xl font-semibold text-gray-900">89</p>
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
                  <p className="text-sm font-medium text-gray-500">Patrones Detectados</p>
                  <p className="text-2xl font-semibold text-gray-900">23</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Image Upload and Classification */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Clasificación Automática de Fragmentos
              </h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="Uploaded" className="w-full h-32 object-cover rounded" />
                    ) : (
                      <div>
                        <span className="text-4xl block mb-2">📷</span>
                        <p className="text-gray-600">Subir imagen del fragmento</p>
                        <p className="text-sm text-gray-500">JPG, PNG, hasta 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={handleClassification}
                  disabled={isProcessing}
                >
                  {isProcessing ? '🔍 Analizando...' : '🔍 Clasificar Automáticamente'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Similarity Analysis */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Análisis de Similitud
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artefacto de Referencia
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Punta de Proyectil - ART-002</option>
                    <option>Fragmento de Cerámica - ART-001</option>
                    <option>Raspador de Cuarzo - ART-005</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Criterios de Similitud
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" defaultChecked />
                      <span className="text-sm">Material</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" defaultChecked />
                      <span className="text-sm">Técnica de Manufactura</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" defaultChecked />
                      <span className="text-sm">Período Temporal</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" />
                      <span className="text-sm">Procedencia</span>
                    </label>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={handleSimilarityAnalysis}
                  disabled={isProcessing}
                >
                  {isProcessing ? '🔗 Analizando...' : '🔗 Buscar Similitudes'}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* 3D Reconstruction and Correlation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 3D Reconstruction */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reconstrucción 3D Predictiva
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Artefacto
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Vasija Cerámica</option>
                    <option>Herramienta Lítica</option>
                    <option>Arma de Caza</option>
                    <option>Ornamento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fragmentos Disponibles
                  </label>
                  <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Fragmento 1 (25%)</span>
                      <span className="text-xs text-green-600">✓</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Fragmento 2 (18%)</span>
                      <span className="text-xs text-green-600">✓</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fragmento 3 (12%)</span>
                      <span className="text-xs text-yellow-600">⚠</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={handle3DReconstruction}
                  disabled={isProcessing}
                >
                  {isProcessing ? '🎯 Reconstruyendo...' : '🎯 Reconstruir 3D'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Correlation Analysis */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Análisis de Correlación Estadística
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variables a Analizar
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" defaultChecked />
                      <span className="text-sm">Material vs Período</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" defaultChecked />
                      <span className="text-sm">Técnica vs Sitio</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" defaultChecked />
                      <span className="text-sm">Tamaño vs Función</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" />
                      <span className="text-sm">Decoración vs Contexto</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método Estadístico
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Correlación de Pearson</option>
                    <option>Análisis de Clusters</option>
                    <option>Análisis de Componentes Principales</option>
                    <option>Regresión Múltiple</option>
                  </select>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={handleCorrelationAnalysis}
                  disabled={isProcessing}
                >
                  {isProcessing ? '📊 Analizando...' : '📊 Analizar Correlaciones'}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Analyses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Análisis Recientes</h2>
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <Card key={analysis.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xl">{getTypeIcon(analysis.type)}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{analysis.type}</h3>
                        <p className="text-sm text-gray-600">{analysis.artifactName} ({analysis.artifactId})</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                            {analysis.status}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {analysis.confidence}% confianza
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {analysis.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        👁️ Ver Resultados
                      </Button>
                      <Button variant="outline" size="sm">
                        📊 Exportar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Insights de IA
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🎯 Patrón Detectado</h4>
                  <p className="text-sm text-blue-700">
                    Alta correlación entre puntas de proyectil bifaciales y sitios de caza mayor
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">🔍 Anomalía Encontrada</h4>
                  <p className="text-sm text-green-700">
                    Fragmento de obsidiana en contexto pampeano sugiere intercambio a larga distancia
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">📊 Tendencia Temporal</h4>
                  <p className="text-sm text-yellow-700">
                    Incremento en complejidad técnica durante Holoceno Tardío
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración de IA
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Umbral de Confianza
                  </label>
                  <input type="range" min="0" max="100" defaultValue="75" className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo de IA
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>ArcheoNet v2.1 (Recomendado)</option>
                    <option>ArcheoNet v2.0</option>
                    <option>ArcheoNet v1.5</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-700">Aprendizaje continuo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-700">Validación cruzada</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIToolsPage; 