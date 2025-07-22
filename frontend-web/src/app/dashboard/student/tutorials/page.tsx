'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface Tutorial {
  id: string;
  title: string;
  category: 'field' | 'laboratory' | 'documentation' | 'analysis' | 'safety';
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  video_url?: string;
  pdf_url?: string;
  completed: boolean;
  progress: number;
  rating: number;
  reviews_count: number;
  tags: string[];
}

const TutorialsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    // Simular carga de tutoriales
    setTimeout(() => {
      setTutorials([
        {
          id: '1',
          title: 'Técnicas Básicas de Excavación',
          category: 'field',
          description: 'Aprende las técnicas fundamentales de excavación arqueológica, incluyendo el uso correcto de herramientas y métodos de registro.',
          duration: '2 horas',
          difficulty: 'beginner',
          instructor: 'Dr. María González',
          video_url: 'https://example.com/video1',
          pdf_url: 'https://example.com/pdf1',
          completed: true,
          progress: 100,
          rating: 4.8,
          reviews_count: 45,
          tags: ['excavación', 'herramientas', 'registro']
        },
        {
          id: '2',
          title: 'Documentación Fotográfica en Campo',
          category: 'documentation',
          description: 'Guía completa para la documentación fotográfica de hallazgos arqueológicos y estructuras.',
          duration: '1.5 horas',
          difficulty: 'beginner',
          instructor: 'Lic. Carlos Pérez',
          video_url: 'https://example.com/video2',
          pdf_url: 'https://example.com/pdf2',
          completed: false,
          progress: 60,
          rating: 4.6,
          reviews_count: 32,
          tags: ['fotografía', 'documentación', 'campo']
        },
        {
          id: '3',
          title: 'Análisis de Cerámica en Laboratorio',
          category: 'laboratory',
          description: 'Métodos de análisis y clasificación de cerámica arqueológica en el laboratorio.',
          duration: '3 horas',
          difficulty: 'intermediate',
          instructor: 'Dr. Ana López',
          video_url: 'https://example.com/video3',
          pdf_url: 'https://example.com/pdf3',
          completed: false,
          progress: 0,
          rating: 4.9,
          reviews_count: 28,
          tags: ['cerámica', 'laboratorio', 'análisis']
        },
        {
          id: '4',
          title: 'Protocolos de Seguridad en Campo',
          category: 'safety',
          description: 'Protocolos esenciales de seguridad para trabajar en sitios arqueológicos.',
          duration: '1 hora',
          difficulty: 'beginner',
          instructor: 'Ing. Roberto Silva',
          video_url: 'https://example.com/video4',
          pdf_url: 'https://example.com/pdf4',
          completed: true,
          progress: 100,
          rating: 4.7,
          reviews_count: 67,
          tags: ['seguridad', 'protocolos', 'campo']
        },
        {
          id: '5',
          title: 'Mapeo y Topografía Arqueológica',
          category: 'field',
          description: 'Técnicas de mapeo y levantamiento topográfico para sitios arqueológicos.',
          duration: '2.5 horas',
          difficulty: 'intermediate',
          instructor: 'Dr. Pedro Ramírez',
          video_url: 'https://example.com/video5',
          pdf_url: 'https://example.com/pdf5',
          completed: false,
          progress: 30,
          rating: 4.5,
          reviews_count: 23,
          tags: ['mapeo', 'topografía', 'levantamiento']
        },
        {
          id: '6',
          title: 'Análisis Estadístico de Datos Arqueológicos',
          category: 'analysis',
          description: 'Introducción al análisis estadístico aplicado a datos arqueológicos.',
          duration: '4 horas',
          difficulty: 'advanced',
          instructor: 'Dr. Carmen Vega',
          video_url: 'https://example.com/video6',
          pdf_url: 'https://example.com/pdf6',
          completed: false,
          progress: 0,
          rating: 4.4,
          reviews_count: 19,
          tags: ['estadística', 'análisis', 'datos']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStartTutorial = (tutorialId: string) => {
    router.push(`/dashboard/student/tutorials/${tutorialId}`);
  };

  const handleContinueTutorial = (tutorialId: string) => {
    router.push(`/dashboard/student/tutorials/${tutorialId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      field: 'bg-blue-100 text-blue-800',
      laboratory: 'bg-purple-100 text-purple-800',
      documentation: 'bg-green-100 text-green-800',
      analysis: 'bg-orange-100 text-orange-800',
      safety: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      field: '⛏️',
      laboratory: '🔬',
      documentation: '📸',
      analysis: '📊',
      safety: '🛡️'
    };
    return icons[category as keyof typeof icons] || '📚';
  };

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tutoriales...</p>
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
                Tutoriales de Aprendizaje
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
        {/* Filtros */}
        <Card title="Filtros">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="field">Trabajo de Campo</option>
                <option value="laboratory">Laboratorio</option>
                <option value="documentation">Documentación</option>
                <option value="analysis">Análisis</option>
                <option value="safety">Seguridad</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dificultad
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las dificultades</option>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                🔄 Actualizar
              </Button>
            </div>
          </div>
        </Card>

        {/* Progreso general */}
        <div className="mt-8">
          <Card title="Mi Progreso">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{tutorials.length}</div>
                <div className="text-sm text-gray-600">Total de Tutoriales</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {tutorials.filter(t => t.completed).length}
                </div>
                <div className="text-sm text-gray-600">Completados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {tutorials.filter(t => !t.completed && t.progress > 0).length}
                </div>
                <div className="text-sm text-gray-600">En Progreso</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round(tutorials.reduce((sum, t) => sum + t.progress, 0) / tutorials.length)}%
                </div>
                <div className="text-sm text-gray-600">Progreso General</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de tutoriales */}
        <div className="mt-8">
          <Card title={`Tutoriales Disponibles (${filteredTutorials.length})`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map((tutorial) => (
                <div key={tutorial.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">{getCategoryIcon(tutorial.category)}</div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tutorial.category)}`}>
                        {tutorial.category === 'field' ? 'Campo' : 
                         tutorial.category === 'laboratory' ? 'Laboratorio' : 
                         tutorial.category === 'documentation' ? 'Documentación' : 
                         tutorial.category === 'analysis' ? 'Análisis' : 'Seguridad'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                        {tutorial.difficulty === 'beginner' ? 'Principiante' : 
                         tutorial.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{tutorial.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>⏱️ {tutorial.duration}</span>
                      <span>👨‍🏫 {tutorial.instructor}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>⭐ {tutorial.rating} ({tutorial.reviews_count} reseñas)</span>
                      <span>📚 {tutorial.tags.length} temas</span>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progreso</span>
                      <span>{tutorial.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${tutorial.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tutorial.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Botones */}
                  <div className="flex space-x-2">
                    {tutorial.completed ? (
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                        ✅ Completado
                      </Button>
                    ) : tutorial.progress > 0 ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleContinueTutorial(tutorial.id)}
                        className="w-full"
                      >
                        🔄 Continuar
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleStartTutorial(tutorial.id)}
                        className="w-full"
                      >
                        ▶️ Comenzar
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      📖 Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredTutorials.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron tutoriales</h3>
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
                <div className="text-3xl mb-2">⛏️</div>
                <h3 className="font-medium text-gray-900">Campo</h3>
                <p className="text-sm text-gray-600">{tutorials.filter(t => t.category === 'field').length} tutoriales</p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">🔬</div>
                <h3 className="font-medium text-gray-900">Laboratorio</h3>
                <p className="text-sm text-gray-600">{tutorials.filter(t => t.category === 'laboratory').length} tutoriales</p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">📸</div>
                <h3 className="font-medium text-gray-900">Documentación</h3>
                <p className="text-sm text-gray-600">{tutorials.filter(t => t.category === 'documentation').length} tutoriales</p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-medium text-gray-900">Análisis</h3>
                <p className="text-sm text-gray-600">{tutorials.filter(t => t.category === 'analysis').length} tutoriales</p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-medium text-gray-900">Seguridad</h3>
                <p className="text-sm text-gray-600">{tutorials.filter(t => t.category === 'safety').length} tutoriales</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TutorialsPage; 