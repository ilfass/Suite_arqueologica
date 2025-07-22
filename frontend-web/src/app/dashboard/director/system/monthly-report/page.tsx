'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';

const MonthlyReportPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reporte Mensual</h1>
              <p className="text-gray-600">Generar y gestionar reportes mensuales</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/dashboard/director')}>
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="Generar Reporte Mensual">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Enero 2024</option>
                  <option>Febrero 2024</option>
                  <option>Marzo 2024</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Reporte Completo</option>
                  <option>Resumen Ejecutivo</option>
                  <option>Estadísticas</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button>📊 Generar Reporte</Button>
              <Button variant="outline">📥 Descargar PDF</Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default MonthlyReportPage; 