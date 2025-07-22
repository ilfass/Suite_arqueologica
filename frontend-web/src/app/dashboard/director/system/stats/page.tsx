'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';

const StatsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Estadísticas de Uso</h1>
              <p className="text-gray-600">Métricas y análisis del sistema</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/dashboard/director')}>
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="Métricas del Sistema">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">Usuarios Activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">89</div>
              <div className="text-sm text-gray-600">Proyectos Activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">1,247</div>
                              <div className="text-sm text-gray-600">Objetos Catalogados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">67</div>
              <div className="text-sm text-gray-600">Excavaciones</div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default StatsPage; 