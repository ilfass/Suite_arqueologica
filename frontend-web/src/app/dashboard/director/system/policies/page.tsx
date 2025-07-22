'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';

const PoliciesPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Políticas de Seguridad</h1>
              <p className="text-gray-600">Gestionar políticas y configuraciones de seguridad</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/dashboard/director')}>
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="Políticas Disponibles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">🔐 Contraseñas</h3>
              <p className="text-sm text-gray-600 mb-4">Políticas de contraseñas y autenticación</p>
              <Button size="sm" variant="outline" className="w-full">Configurar</Button>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">👥 Acceso de Usuarios</h3>
              <p className="text-sm text-gray-600 mb-4">Políticas de acceso y permisos</p>
              <Button size="sm" variant="outline" className="w-full">Configurar</Button>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Datos</h3>
              <p className="text-sm text-gray-600 mb-4">Políticas de manejo y protección de datos</p>
              <Button size="sm" variant="outline" className="w-full">Configurar</Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PoliciesPage; 