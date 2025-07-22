'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando formatos de reporte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Formatos de Reporte</h1>
              <p className="text-gray-600">Gestionar formatos y plantillas de reportes</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/dashboard/director')}>
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="Formatos Disponibles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Reporte Mensual</h3>
              <p className="text-sm text-gray-600 mb-4">Formato estándar para reportes mensuales de proyectos</p>
              <Button size="sm" variant="outline" className="w-full">Configurar</Button>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">📋 Reporte de Excavación</h3>
              <p className="text-sm text-gray-600 mb-4">Formato para documentar resultados de excavaciones</p>
              <Button size="sm" variant="outline" className="w-full">Configurar</Button>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
                              <h3 className="font-semibold text-gray-900 mb-2">🏺 Catálogo de Objetos</h3>
                <p className="text-sm text-gray-600 mb-4">Formato para catalogar objetos encontrados</p>
              <Button size="sm" variant="outline" className="w-full">Configurar</Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ReportsPage; 