'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

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
}

const AdminInstitutionsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simular carga de instituciones
    setTimeout(() => {
      setInstitutions([
        {
          id: '1',
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
          last_activity: '2024-01-15T16:45:00Z'
        },
        {
          id: '2',
          name: 'Instituto Nacional de Antropología e Historia',
          type: 'government',
          email: 'contacto@inah.gob.mx',
          phone: '+52 55 4040 4300',
          address: 'Av. San Jerónimo 880, San Ángel, CDMX',
          country: 'México',
          status: 'active',
          subscription_plan: 'enterprise',
          subscription_expires: '2024-06-30T23:59:59Z',
          total_users: 23,
          max_users: 50,
          storage_used: '28.7 GB',
          storage_limit: '50 GB',
          projects_count: 8,
          contact_person: 'Lic. Carlos Méndez',
          contact_email: 'carlos.mendez@inah.gob.mx',
          created_at: '2023-03-15T10:00:00Z',
          last_activity: '2024-01-14T14:30:00Z'
        },
        {
          id: '3',
          name: 'Museo Nacional de Antropología',
          type: 'museum',
          email: 'info@mna.inah.gob.mx',
          phone: '+52 55 5553 6266',
          address: 'Av. Paseo de la Reforma s/n, Chapultepec, CDMX',
          country: 'México',
          status: 'active',
          subscription_plan: 'premium',
          subscription_expires: '2024-09-15T23:59:59Z',
          total_users: 8,
          max_users: 10,
          storage_used: '12.3 GB',
          storage_limit: '20 GB',
          projects_count: 3,
          contact_person: 'Dra. María López',
          contact_email: 'maria.lopez@mna.inah.gob.mx',
          created_at: '2023-06-20T10:00:00Z',
          last_activity: '2024-01-13T11:20:00Z'
        },
        {
          id: '4',
          name: 'Universidad de Guadalajara',
          type: 'university',
          email: 'arqueologia@udg.mx',
          phone: '+52 33 3134 2222',
          address: 'Av. Juárez 976, Guadalajara, Jalisco',
          country: 'México',
          status: 'pending',
          subscription_plan: 'enterprise',
          subscription_expires: '2024-12-31T23:59:59Z',
          total_users: 0,
          max_users: 25,
          storage_used: '0 GB',
          storage_limit: '50 GB',
          projects_count: 0,
          contact_person: 'Dr. Roberto Silva',
          contact_email: 'roberto.silva@udg.mx',
          created_at: '2024-01-10T10:00:00Z',
          last_activity: '2024-01-10T10:00:00Z'
        },
        {
          id: '5',
          name: 'Centro de Investigaciones Arqueológicas del Norte',
          type: 'research_center',
          email: 'info@cian.org.mx',
          phone: '+52 81 8345 1234',
          address: 'Av. Universidad 123, Monterrey, NL',
          country: 'México',
          status: 'suspended',
          subscription_plan: 'premium',
          subscription_expires: '2023-12-31T23:59:59Z',
          total_users: 5,
          max_users: 10,
          storage_used: '8.9 GB',
          storage_limit: '20 GB',
          projects_count: 2,
          contact_person: 'Lic. Patricia Torres',
          contact_email: 'patricia.torres@cian.org.mx',
          created_at: '2023-08-15T10:00:00Z',
          last_activity: '2023-12-20T09:15:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEditInstitution = (institutionId: string) => {
    router.push(`/dashboard/admin/institutions/${institutionId}/edit`);
  };

  const handleViewDetails = (institutionId: string) => {
    router.push(`/dashboard/admin/institutions/${institutionId}`);
  };

  const handleApproveInstitution = (institutionId: string) => {
    setInstitutions(prev => prev.map(inst => 
      inst.id === institutionId ? { ...inst, status: 'active' as const } : inst
    ));
  };

  const handleSuspendInstitution = (institutionId: string) => {
    if (confirm('¿Estás seguro de que quieres suspender esta institución?')) {
      setInstitutions(prev => prev.map(inst => 
        inst.id === institutionId ? { ...inst, status: 'suspended' as const } : inst
      ));
    }
  };

  const handleManageUsers = (institutionId: string) => {
    router.push(`/dashboard/admin/institutions/${institutionId}/users`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      university: 'bg-blue-100 text-blue-800',
      museum: 'bg-purple-100 text-purple-800',
      research_center: 'bg-green-100 text-green-800',
      government: 'bg-orange-100 text-orange-800',
      private: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      university: '🎓',
      museum: '🏛️',
      research_center: '🔬',
      government: '🏛️',
      private: '🏢'
    };
    return icons[type as keyof typeof icons] || '🏢';
  };

  const filteredInstitutions = institutions.filter(institution => {
    const matchesType = selectedType === 'all' || institution.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || institution.status === selectedStatus;
    const matchesSearch = institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.country.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando instituciones...</p>
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
                Gestión de Instituciones
              </h1>
              <p className="text-gray-600">
                Administrador: {user?.full_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/admin')}>
                Volver al Dashboard
              </Button>
              <Button onClick={() => router.push('/dashboard/admin/institutions/new')}>
                🏛️ Nueva Institución
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <Card title="Filtros y Búsqueda">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, contacto o país..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los tipos</option>
                <option value="university">Universidad</option>
                <option value="museum">Museo</option>
                <option value="research_center">Centro de Investigación</option>
                <option value="government">Gobierno</option>
                <option value="private">Privado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activa</option>
                <option value="pending">Pendiente</option>
                <option value="suspended">Suspendida</option>
                <option value="inactive">Inactiva</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                🔄 Actualizar
              </Button>
            </div>
          </div>
        </Card>

        {/* Estadísticas */}
        <div className="mt-8">
          <Card title="Estadísticas de Instituciones">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{institutions.length}</div>
                <div className="text-sm text-gray-600">Total de Instituciones</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {institutions.filter(i => i.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Instituciones Activas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {institutions.filter(i => i.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pendientes de Aprobación</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {institutions.reduce((sum, i) => sum + i.total_users, 0)}
                </div>
                <div className="text-sm text-gray-600">Usuarios Totales</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {institutions.reduce((sum, i) => sum + i.projects_count, 0)}
                </div>
                <div className="text-sm text-gray-600">Proyectos Activos</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de instituciones */}
        <div className="mt-8">
          <Card title={`Instituciones (${filteredInstitutions.length})`}>
            <div className="space-y-6">
              {filteredInstitutions.map((institution) => (
                <div key={institution.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{getTypeIcon(institution.type)}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{institution.name}</h3>
                        <p className="text-gray-600">{institution.address}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>📧 {institution.email}</span>
                          <span>📞 {institution.phone}</span>
                          <span>🌍 {institution.country}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(institution.type)}`}>
                          {institution.type === 'university' ? 'Universidad' : 
                           institution.type === 'museum' ? 'Museo' : 
                           institution.type === 'research_center' ? 'Centro de Investigación' : 
                           institution.type === 'government' ? 'Gobierno' : 'Privado'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(institution.status)}`}>
                          {institution.status === 'active' ? 'Activa' : 
                           institution.status === 'pending' ? 'Pendiente' : 
                           institution.status === 'suspended' ? 'Suspendida' : 'Inactiva'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Creada: {new Date(institution.created_at).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-900">Contacto</div>
                      <div className="text-sm text-blue-700">{institution.contact_person}</div>
                      <div className="text-xs text-blue-600">{institution.contact_email}</div>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-green-900">Suscripción</div>
                      <div className="text-sm text-green-700">
                        {institution.subscription_plan === 'enterprise' ? 'Empresarial' : 
                         institution.subscription_plan === 'premium' ? 'Premium' : 'Básico'}
                      </div>
                      <div className="text-xs text-green-600">
                        Expira: {new Date(institution.subscription_expires).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-purple-900">Usuarios</div>
                      <div className="text-sm text-purple-700">
                        {institution.total_users} / {institution.max_users}
                      </div>
                      <div className="text-xs text-purple-600">
                        {institution.projects_count} proyectos
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-orange-900">Almacenamiento</div>
                      <div className="text-sm text-orange-700">
                        {institution.storage_used} / {institution.storage_limit}
                      </div>
                      <div className="text-xs text-orange-600">
                        Última actividad: {new Date(institution.last_activity).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDetails(institution.id)}
                      >
                        Ver Detalles
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditInstitution(institution.id)}
                      >
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleManageUsers(institution.id)}
                      >
                        Gestionar Usuarios
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      {institution.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveInstitution(institution.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          ✅ Aprobar
                        </Button>
                      )}
                      {institution.status === 'active' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSuspendInstitution(institution.id)}
                          className="text-red-600 border-red-300"
                        >
                          ⏸️ Suspender
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 border-red-300"
                      >
                        🗑️ Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredInstitutions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏛️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron instituciones</h3>
                <p className="text-gray-600 mb-6">Ajusta los filtros o crea una nueva institución</p>
                <Button onClick={() => router.push('/dashboard/admin/institutions/new')}>
                  Crear Nueva Institución
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminInstitutionsPage; 