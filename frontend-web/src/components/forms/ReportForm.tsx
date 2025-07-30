'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

export interface ReportFormData {
  title: string;
  type: 'excavation' | 'laboratory' | 'prospection' | 'analysis' | 'survey' | 'conservation' | 'publication';
  date: string;
  author: string;
  abstract: string;
  methodology: string;
  results: string;
  conclusions: string;
  recommendations: string;
  keywords: string[];
  references: string[];
  attachments: string[];
  status: 'draft' | 'in_progress' | 'completed' | 'reviewed' | 'published';
  confidentiality: 'public' | 'internal' | 'confidential';
  projectId?: string;
  areaId?: string;
  siteId?: string;
  fieldworkSessionId?: string;
}

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReportFormData) => void;
  initialData?: Partial<ReportFormData>;
  context?: {
    project_id?: string;
    project_name?: string;
    area_id?: string;
    area_name?: string;
    site_id?: string;
    site_name?: string;
  };
}

const ReportForm: React.FC<ReportFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  context
}) => {
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    type: 'excavation',
    date: new Date().toISOString().split('T')[0],
    author: '',
    abstract: '',
    methodology: '',
    results: '',
    conclusions: '',
    recommendations: '',
    keywords: [],
    references: [],
    attachments: [],
    status: 'draft',
    confidentiality: 'internal',
    projectId: context?.project_id,
    areaId: context?.area_id,
    siteId: context?.site_id,
    ...initialData
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newReference, setNewReference] = useState('');
  const [newAttachment, setNewAttachment] = useState('');

  useEffect(() => {
    if (isOpen && context) {
      setFormData(prev => ({
        ...prev,
        projectId: context.project_id,
        areaId: context.area_id,
        siteId: context.site_id
      }));
    }
  }, [isOpen, context]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addReference = () => {
    if (newReference.trim() && !formData.references.includes(newReference.trim())) {
      setFormData(prev => ({
        ...prev,
        references: [...prev.references, newReference.trim()]
      }));
      setNewReference('');
    }
  };

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const addAttachment = () => {
    if (newAttachment.trim() && !formData.attachments.includes(newAttachment.trim())) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment.trim()]
      }));
      setNewAttachment('');
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '1rem'
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxWidth: '64rem',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📋 Nuevo Informe Arqueológico</h2>
            <Button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Informe *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Informe de Excavación - Sitio Arqueológico La Laguna"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Informe *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="excavation">Excavación</option>
                  <option value="laboratory">Laboratorio</option>
                  <option value="prospection">Prospección</option>
                  <option value="analysis">Análisis</option>
                  <option value="survey">Reconocimiento</option>
                  <option value="conservation">Conservación</option>
                  <option value="publication">Publicación</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autor *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del investigador"
                />
              </div>
            </div>

            {/* Contexto Arqueológico */}
            {context && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">🎯 Contexto Arqueológico</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-700">Proyecto:</span>
                    <p className="text-blue-600">{context.project_name || 'No seleccionado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Área:</span>
                    <p className="text-blue-600">{context.area_name || 'No seleccionado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Sitio:</span>
                    <p className="text-blue-600">{context.site_name || 'No seleccionado'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resumen Ejecutivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumen Ejecutivo *
              </label>
              <textarea
                required
                rows={4}
                value={formData.abstract}
                onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Breve descripción de los objetivos, metodología y resultados principales del informe..."
              />
            </div>

            {/* Metodología */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metodología *
              </label>
              <textarea
                required
                rows={4}
                value={formData.methodology}
                onChange={(e) => setFormData(prev => ({ ...prev, methodology: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción detallada de los métodos y técnicas utilizadas..."
              />
            </div>

            {/* Resultados */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultados *
              </label>
              <textarea
                required
                rows={4}
                value={formData.results}
                onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Presentación de los hallazgos y datos obtenidos..."
              />
            </div>

            {/* Conclusiones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conclusiones
              </label>
              <textarea
                rows={3}
                value={formData.conclusions}
                onChange={(e) => setFormData(prev => ({ ...prev, conclusions: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Interpretación de los resultados y conclusiones principales..."
              />
            </div>

            {/* Recomendaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recomendaciones
              </label>
              <textarea
                rows={3}
                value={formData.recommendations}
                onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sugerencias para futuras investigaciones o acciones..."
              />
            </div>

            {/* Palabras Clave */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palabras Clave
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Agregar palabra clave"
                />
                <Button
                  type="button"
                  onClick={addKeyword}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  +
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Referencias */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referencias Bibliográficas
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newReference}
                  onChange={(e) => setNewReference(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addReference())}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Agregar referencia bibliográfica"
                />
                <Button
                  type="button"
                  onClick={addReference}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  +
                </Button>
              </div>
              <div className="space-y-2">
                {formData.references.map((reference, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-2 rounded flex items-center justify-between"
                  >
                    <span className="text-sm">{reference}</span>
                    <button
                      type="button"
                      onClick={() => removeReference(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Informe
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Borrador</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="completed">Completado</option>
                  <option value="reviewed">Revisado</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidencialidad
                </label>
                <select
                  value={formData.confidentiality}
                  onChange={(e) => setFormData(prev => ({ ...prev, confidentiality: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Público</option>
                  <option value="internal">Interno</option>
                  <option value="confidential">Confidencial</option>
                </select>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar Informe
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportForm; 