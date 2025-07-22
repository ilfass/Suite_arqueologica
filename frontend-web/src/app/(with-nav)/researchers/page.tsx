'use client';

import React, { useEffect, useState } from 'react';
import { apiClient, User } from '../../../lib/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const ResearchersPage: React.FC = () => {
  const [researchers, setResearchers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        // En el modo demo, simulamos investigadores públicos
        const demoResearchers: User[] = [
          {
            id: '1',
            email: 'dr.garcia@unam.mx',
            full_name: 'Dr. María García',
            role: 'RESEARCHER',
            subscription_plan: 'PROFESSIONAL',
            institution: 'Universidad Nacional Autónoma de México',
            specialization: 'Arqueología Maya',
            is_public_researcher: true,
            bio: 'Especialista en arquitectura maya y epigrafía. Más de 20 años de experiencia en excavaciones en Yucatán.',
            created_at: '2024-01-15T00:00:00Z',
            updated_at: '2024-01-15T00:00:00Z',
          },
          {
            id: '2',
            email: 'prof.rodriguez@inah.gob.mx',
            full_name: 'Prof. Carlos Rodríguez',
            role: 'RESEARCHER',
            subscription_plan: 'INSTITUTIONAL',
            institution: 'Instituto Nacional de Antropología e Historia',
            specialization: 'Arqueología Azteca',
            is_public_researcher: true,
            bio: 'Investigador del INAH especializado en la cultura azteca y el Templo Mayor.',
            created_at: '2024-01-10T00:00:00Z',
            updated_at: '2024-01-10T00:00:00Z',
          },
          {
            id: '3',
            email: 'dra.martinez@colmex.mx',
            full_name: 'Dra. Ana Martínez',
            role: 'RESEARCHER',
            subscription_plan: 'PROFESSIONAL',
            institution: 'El Colegio de México',
            specialization: 'Antropología Cultural',
            is_public_researcher: true,
            bio: 'Antropóloga cultural con enfoque en rituales prehispánicos y continuidades culturales.',
            created_at: '2024-01-05T00:00:00Z',
            updated_at: '2024-01-05T00:00:00Z',
          },
        ];
        setResearchers(demoResearchers);
      } catch (err: any) {
        setError('Error al cargar investigadores');
        console.error('Error fetching researchers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando investigadores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Investigadores Públicos
            </h1>
            <p className="mt-2 text-gray-600">
              Conoce a los investigadores que utilizan Suite Arqueológica
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchers.map((researcher) => (
            <Card key={researcher.id}>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {researcher.full_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {researcher.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">{researcher.institution}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Especialización</span>
                    <p className="text-sm text-gray-900">{researcher.specialization}</p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">Biografía</span>
                    <p className="text-sm text-gray-700 mt-1">{researcher.bio}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {researcher.subscription_plan}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`mailto:${researcher.email}`, '_blank')}
                    >
                      Contactar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ¿Eres investigador?{' '}
            <Button variant="ghost" onClick={() => window.location.href = '/register'}>
              Únete a nuestra comunidad
            </Button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ResearchersPage; 