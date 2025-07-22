'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

interface Subscription {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  plan: string;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  start_date: string;
  end_date: string;
  amount: number;
  currency: string;
  auto_renewal: boolean;
  payment_method: string;
  last_payment: string;
  next_payment: string;
  features: string[];
}

const AdminSubscriptionsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    // Simular carga de suscripciones
    setTimeout(() => {
      setSubscriptions([
        {
          id: '1',
          user_id: 'user1',
          user_name: 'Dr. María González',
          user_email: 'maria.gonzalez@inah.gob.mx',
          plan: 'premium',
          status: 'active',
          start_date: '2023-12-01T00:00:00Z',
          end_date: '2024-12-01T00:00:00Z',
          amount: 180,
          currency: 'USD',
          auto_renewal: true,
          payment_method: 'Tarjeta de crédito',
          last_payment: '2023-12-01T00:00:00Z',
          next_payment: '2024-12-01T00:00:00Z',
          features: ['Acceso completo', 'Soporte prioritario', 'Backup automático']
        },
        {
          id: '2',
          user_id: 'user2',
          user_name: 'Lic. Carlos Pérez',
          user_email: 'carlos.perez@unam.mx',
          plan: 'basic',
          status: 'active',
          start_date: '2023-11-15T00:00:00Z',
          end_date: '2024-11-15T00:00:00Z',
          amount: 120,
          currency: 'USD',
          auto_renewal: false,
          payment_method: 'Transferencia bancaria',
          last_payment: '2023-11-15T00:00:00Z',
          next_payment: '2024-11-15T00:00:00Z',
          features: ['Acceso básico', 'Soporte por email']
        },
        {
          id: '3',
          user_id: 'user3',
          user_name: 'Universidad Nacional Autónoma de México',
          user_email: 'admin@unam.mx',
          plan: 'enterprise',
          status: 'active',
          start_date: '2023-01-01T00:00:00Z',
          end_date: '2024-12-31T00:00:00Z',
          amount: 1500,
          currency: 'USD',
          auto_renewal: true,
          payment_method: 'Facturación institucional',
          last_payment: '2023-12-01T00:00:00Z',
          next_payment: '2024-12-01T00:00:00Z',
          features: ['Usuarios ilimitados', 'Soporte 24/7', 'API personalizada']
        },
        {
          id: '4',
          user_id: 'user4',
          user_name: 'Est. Ana Martínez',
          user_email: 'ana.martinez@udg.mx',
          plan: 'free',
          status: 'trial',
          start_date: '2024-01-10T00:00:00Z',
          end_date: '2024-02-10T00:00:00Z',
          amount: 0,
          currency: 'USD',
          auto_renewal: false,
          payment_method: 'N/A',
          last_payment: 'N/A',
          next_payment: 'N/A',
          features: ['Acceso limitado', '1 GB almacenamiento']
        },
        {
          id: '5',
          user_id: 'user5',
          user_name: 'Dr. Roberto López',
          user_email: 'roberto.lopez@inah.gob.mx',
          plan: 'premium',
          status: 'expired',
          start_date: '2023-03-15T00:00:00Z',
          end_date: '2024-03-15T00:00:00Z',
          amount: 180,
          currency: 'USD',
          auto_renewal: true,
          payment_method: 'Tarjeta de crédito',
          last_payment: '2023-03-15T00:00:00Z',
          next_payment: '2024-03-15T00:00:00Z',
          features: ['Acceso completo', 'Soporte prioritario']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEditSubscription = (subscriptionId: string) => {
    router.push(`/dashboard/admin/subscriptions/${subscriptionId}/edit`);
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta suscripción?')) {
      setSubscriptions(prev => prev.map(sub => 
        sub.id === subscriptionId ? { ...sub, status: 'cancelled' as const } : sub
      ));
    }
  };

  const handleRenewSubscription = (subscriptionId: string) => {
    router.push(`/dashboard/admin/subscriptions/${subscriptionId}/renew`);
  };

  const handleViewDetails = (subscriptionId: string) => {
    router.push(`/dashboard/admin/subscriptions/${subscriptionId}`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      trial: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPlanColor = (plan: string) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-green-100 text-green-800'
    };
    return colors[plan as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesPlan = selectedPlan === 'all' || sub.plan === selectedPlan;
    const matchesStatus = selectedStatus === 'all' || sub.status === selectedStatus;
    return matchesPlan && matchesStatus;
  });

  const totalRevenue = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + sub.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando suscripciones...</p>
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
                Gestión de Suscripciones
              </h1>
              <p className="text-gray-600">
                Administrador: {user?.full_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/admin')}>
                Volver al Dashboard
              </Button>
              <Button onClick={() => router.push('/dashboard/admin/subscriptions/new')}>
                💳 Nueva Suscripción
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <Card title="Filtros">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los planes</option>
                <option value="free">Gratuito</option>
                <option value="basic">Básico</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Empresarial</option>
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
                <option value="expired">Expirada</option>
                <option value="cancelled">Cancelada</option>
                <option value="trial">Prueba</option>
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
          <Card title="Estadísticas de Suscripciones">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{subscriptions.length}</div>
                <div className="text-sm text-gray-600">Total de Suscripciones</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {subscriptions.filter(s => s.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Suscripciones Activas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  ${totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Ingresos Mensuales</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {subscriptions.filter(s => s.status === 'trial').length}
                </div>
                <div className="text-sm text-gray-600">En Prueba Gratuita</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de suscripciones */}
        <div className="mt-8">
          <Card title={`Suscripciones (${filteredSubscriptions.length})`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fechas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{subscription.user_name}</div>
                          <div className="text-sm text-gray-500">{subscription.user_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(subscription.plan)}`}>
                          {subscription.plan === 'free' ? 'Gratuito' : 
                           subscription.plan === 'basic' ? 'Básico' : 
                           subscription.plan === 'premium' ? 'Premium' : 'Empresarial'}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          ${subscription.amount} {subscription.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                          {subscription.status === 'active' ? 'Activa' : 
                           subscription.status === 'expired' ? 'Expirada' : 
                           subscription.status === 'cancelled' ? 'Cancelada' : 'Prueba'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>Inicio: {new Date(subscription.start_date).toLocaleDateString('es-ES')}</div>
                          <div>Fin: {new Date(subscription.end_date).toLocaleDateString('es-ES')}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{subscription.payment_method}</div>
                          <div className="text-xs text-gray-500">
                            {subscription.auto_renewal ? 'Renovación automática' : 'Renovación manual'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewDetails(subscription.id)}
                          >
                            Ver
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditSubscription(subscription.id)}
                          >
                            Editar
                          </Button>
                          {subscription.status === 'active' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleCancelSubscription(subscription.id)}
                              className="text-red-600 border-red-300"
                            >
                              Cancelar
                            </Button>
                          )}
                          {subscription.status === 'expired' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRenewSubscription(subscription.id)}
                              className="text-green-600 border-green-300"
                            >
                              Renovar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSubscriptions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💳</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron suscripciones</h3>
                <p className="text-gray-600 mb-6">Ajusta los filtros para ver más opciones</p>
                <Button onClick={() => router.push('/dashboard/admin/subscriptions/new')}>
                  Crear Nueva Suscripción
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminSubscriptionsPage; 