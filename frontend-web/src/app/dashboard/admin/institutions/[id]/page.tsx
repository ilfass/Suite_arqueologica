'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';

interface Institution {
  id: string;
  name: string;
  type: 'university' | 'museum' | 'research_center' | 'government' | 'private';
  email: string;
  phone: string;
  address: string;
  country: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  subscription_plan: string;
  subscription_expires: string;
  total_users: number;
  max_users: number;
  storage_used: string;
  storage_limit: string;
  projects_count: number;
  contact_person: string;
  contact_email: string;
  created_at: string;
  last_activity: string;
  description: string;
  website?: string;
  budget?: number;
}

const InstitutionDetailsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const institutionId = params?.id as string;
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInstitution({
        id: institutionId,
        name: 'Universidad Nacional Autónoma de México',
        type: 'university',
        email: 'admin@unam.mx',
        phone: '+52 55 5622 0000',
        address: 'Ciudad Universitaria, Coyoacán, CDMX',
        country: 'México',
        status: 'active',
        subscription_plan: 'enterprise',
        subscription_expires: '2024-12-31T23:59:59Z',
        total_users: 45,
        max_users: 100,
        storage_used: '45.2 GB',
        storage_limit: '100 GB',
        projects_count: 12,
        contact_person: 'Dr. Ana Rodríguez',
        contact_email: 'ana.rodriguez@unam.mx',
        created_at: '2023-01-01T10:00:00Z',
        last_activity: '2024-01-15T16:45:00Z',
        description: 'La Universidad Nacional Autónoma de México es la institución de educación superior más importante de México. Cuenta con un departamento de arqueología reconocido internacionalmente.',
        website: 'https://www.unam.mx',
        budget: 5000000
      });
      setLoading(false);
    }, 1000);
  }, [institutionId]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'university': return '🎓';
      case 'museum': return '🏛️';
      case 'research_center': return '🔬';
      case 'government': return '🏛️';
      case 'private': return '🏢';
      default: return '🏢';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'university': return 'Universidad';
      case 'museum': return 'Museo';
      case 'research_center': return 'Centro de Investigación';
      case 'government': return 'Gobierno';
      case 'private': return 'Privada';
      default: return 'Institución';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles de la institución...</p>
        </div>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card title="Institución no encontrada">
          <p>No se encontró la institución solicitada.</p>
          <Button onClick={() => router.push('/dashboard/admin/institutions')}>Volver</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{institution.name}</h1>
              <p className="text-gray-600">Detalles de la Institución</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/admin/institutions')}>
                Volver a Instituciones
              </Button>
              <Button onClick={() => router.push(`/dashboard/admin/institutions/${institutionId}/users`)}>
                👥 Ver Usuarios
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Información General">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getTypeIcon(institution.type)}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{getTypeLabel(institution.type)}</h3>
                    <p className="text-sm text-gray-500">Tipo de institución</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-700">{institution.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <span className="ml-2 text-sm">{institution.email}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Teléfono:</span>
                    <span className="ml-2 text-sm">{institution.phone}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">País:</span>
                    <span className="ml-2 text-sm">{institution.country}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Estado:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      institution.status === 'active' ? 'bg-green-100 text-green-800' :
                      institution.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      institution.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {institution.status === 'active' ? 'Activa' : 
                       institution.status === 'pending' ? 'Pendiente' : 
                       institution.status === 'suspended' ? 'Suspendida' : 'Inactiva'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">Dirección:</span>
                  <span className="ml-2 text-sm">{institution.address}</span>
                </div>

                {institution.website && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Sitio web:</span>
                    <a href={institution.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-blue-600 hover:underline">
                      {institution.website}
                    </a>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Información de Contacto">
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Persona de contacto:</span>
                  <span className="ml-2 text-sm font-medium">{institution.contact_person}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email de contacto:</span>
                  <span className="ml-2 text-sm">{institution.contact_email}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title="Suscripción">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{institution.subscription_plan}</div>
                  <div className="text-sm text-gray-600">Plan de Suscripción</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {new Date(institution.subscription_expires).toLocaleDateString('es-ES')}
                  </div>
                  <div className="text-sm text-gray-600">Expira</div>
                </div>
                {institution.budget && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      ${institution.budget.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Presupuesto Anual</div>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Estadísticas">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{institution.total_users}</div>
                  <div className="text-sm text-gray-600">Usuarios Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{institution.projects_count}</div>
                  <div className="text-sm text-gray-600">Proyectos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{institution.storage_used}</div>
                  <div className="text-sm text-gray-600">Almacenamiento Usado</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{institution.max_users}</div>
                  <div className="text-sm text-gray-600">Límite de Usuarios</div>
                </div>
              </div>
            </Card>

            <Card title="Acciones Rápidas">
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  👥 Gestionar Usuarios
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  📊 Ver Reportes
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  ⚙️ Configuración
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  💰 Facturación
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstitutionDetailsPage; 