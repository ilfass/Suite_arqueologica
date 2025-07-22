'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Template {
  id: string;
  name: string;
  type: 'form' | 'report' | 'checklist' | 'protocol';
  description: string;
  downloads: number;
  lastUpdated: string;
}

interface Test {
  id: string;
  title: string;
  description: string;
  questions: number;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  selfAssessed: boolean;
}

const ToolsPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeTab, setActiveTab] = useState<'templates' | 'tests' | 'skills' | 'training'>('templates');

  // Datos simulados
  useEffect(() => {
    setTemplates([
      {
        id: '1',
        name: 'Ficha de Artefacto Estándar',
        type: 'form',
        description: 'Plantilla para catalogación de artefactos arqueológicos',
        downloads: 45,
        lastUpdated: '2025-07-20'
      },
      {
        id: '2',
        name: 'Informe de Excavación',
        type: 'report',
        description: 'Plantilla para informes técnicos de excavación',
        downloads: 32,
        lastUpdated: '2025-07-18'
      },
      {
        id: '3',
        name: 'Checklist de Seguridad',
        type: 'checklist',
        description: 'Lista de verificación de seguridad en campo',
        downloads: 28,
        lastUpdated: '2025-07-15'
      }
    ]);

    setTests([
      {
        id: '1',
        title: 'Fundamentos de Arqueología',
        description: 'Test básico sobre conceptos fundamentales de arqueología',
        questions: 20,
        duration: '30 min',
        difficulty: 'beginner',
        completed: false
      },
      {
        id: '2',
        title: 'Técnicas de Excavación',
        description: 'Evaluación de conocimientos sobre técnicas de excavación',
        questions: 25,
        duration: '45 min',
        difficulty: 'intermediate',
        completed: true
      },
      {
        id: '3',
        title: 'Análisis de Materiales',
        description: 'Test avanzado sobre análisis de materiales arqueológicos',
        questions: 30,
        duration: '60 min',
        difficulty: 'advanced',
        completed: false
      }
    ]);

    setSkills([
      {
        id: '1',
        name: 'Excavación Arqueológica',
        category: 'Técnicas de Campo',
        level: 'advanced',
        selfAssessed: true
      },
      {
        id: '2',
        name: 'Catalogación de Artefactos',
        category: 'Laboratorio',
        level: 'intermediate',
        selfAssessed: false
      },
      {
        id: '3',
        name: 'Análisis GIS',
        category: 'Tecnología',
        level: 'basic',
        selfAssessed: true
      },
      {
        id: '4',
        name: 'Dibujo Arqueológico',
        category: 'Documentación',
        level: 'expert',
        selfAssessed: true
      }
    ]);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'form': return '📝';
      case 'report': return '📋';
      case 'checklist': return '✅';
      case 'protocol': return '📖';
      default: return '📄';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">🧰 Herramientas Generales</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'templates', name: '📄 Plantillas', icon: '📄' },
            { id: 'tests', name: '🧪 Test y Evaluaciones', icon: '🧪' },
            { id: 'skills', name: '📊 Habilidades', icon: '📊' },
            { id: 'training', name: '📚 Formación', icon: '📚' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de las tabs */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{getTypeIcon(template.type)}</span>
                        <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>📥 {template.downloads} descargas</span>
                        <span>📅 {template.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" className="flex-1">
                      📥 Descargar
                    </Button>
                    <Button size="sm" variant="outline">
                      👁️ Vista Previa
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tests' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <Card key={test.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                    {test.completed && <span className="text-green-500">✅</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{test.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Preguntas:</span>
                      <span className="font-medium">{test.questions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Duración:</span>
                      <span className="font-medium">{test.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Dificultad:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(test.difficulty)}`}>
                        {test.difficulty === 'beginner' ? 'Básico' : 
                         test.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" disabled={test.completed}>
                    {test.completed ? '✅ Completado' : '🚀 Iniciar Test'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">📊 Auto-evaluación de Habilidades</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Habilidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nivel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {skills.map((skill) => (
                      <tr key={skill.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{skill.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(skill.level)}`}>
                            {skill.level === 'basic' ? 'Básico' :
                             skill.level === 'intermediate' ? 'Intermedio' :
                             skill.level === 'advanced' ? 'Avanzado' : 'Experto'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            skill.selfAssessed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {skill.selfAssessed ? 'Evaluado' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button size="sm" variant="outline">
                            ✏️ Evaluar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">📚 Recursos de Formación</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-2xl">📖</span>
                    <div>
                      <h4 className="font-medium">Manual de Excavación</h4>
                      <p className="text-sm text-gray-600">Guía completa de técnicas de excavación</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-2xl">🎥</span>
                    <div>
                      <h4 className="font-medium">Videos Tutoriales</h4>
                      <p className="text-sm text-gray-600">Tutoriales en video de técnicas arqueológicas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <span className="text-2xl">📋</span>
                    <div>
                      <h4 className="font-medium">Protocolos de Laboratorio</h4>
                      <p className="text-sm text-gray-600">Protocolos estándar para análisis de laboratorio</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">🔗 Enlaces Útiles</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <span className="text-2xl">🌐</span>
                    <div>
                      <h4 className="font-medium">INAH - Instituto Nacional de Antropología</h4>
                      <p className="text-sm text-gray-600">Recursos oficiales de arqueología</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <span className="text-2xl">📚</span>
                    <div>
                      <h4 className="font-medium">Biblioteca Digital</h4>
                      <p className="text-sm text-gray-600">Acceso a publicaciones especializadas</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <span className="text-2xl">👥</span>
                    <div>
                      <h4 className="font-medium">Comunidad Arqueológica</h4>
                      <p className="text-sm text-gray-600">Foros y grupos de discusión</p>
                    </div>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsPage; 