'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';

const AuditPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Auditoría del Sistema</h1>
              <p className="text-gray-600">Registros de auditoría y cumplimiento</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/dashboard/director')}>
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="Registros de Auditoría">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Actividad Reciente</h3>
              <Button size="sm" variant="outline">Exportar Auditoría</Button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Función en desarrollo - Aquí se mostrarían los registros de auditoría del sistema</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AuditPage; 