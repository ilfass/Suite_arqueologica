import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

const mockSubscriptions = [
  {
    userId: '1',
    userName: 'Dr. María González',
    plan: 'premium',
    status: 'active',
    startDate: '2023-12-01',
    endDate: '2024-12-01',
    amount: 180,
    currency: 'USD',
    autoRenewal: true,
    paymentMethod: 'Tarjeta de crédito',
    features: ['Acceso completo', 'Soporte prioritario', 'Backup automático']
  },
  {
    userId: '2',
    userName: 'Lic. Carlos Pérez',
    plan: 'basic',
    status: 'active',
    startDate: '2023-11-15',
    endDate: '2024-11-15',
    amount: 120,
    currency: 'USD',
    autoRenewal: false,
    paymentMethod: 'Transferencia bancaria',
    features: ['Acceso básico', 'Soporte por email']
  }
];

const UserSubscriptionPage: React.FC = () => {
  const router = useRouter();
  // @ts-ignore
  const params = useParams();
  const userId = params?.userId || '1';
  const subscription = mockSubscriptions.find(s => s.userId === userId);

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card title="Suscripción">
          <p>No se encontró información de suscripción para este usuario.</p>
          <Button onClick={() => router.push('/dashboard/admin/users')}>Volver</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card title={`Suscripción de ${subscription.userName}`}>
        <div className="mb-4">
          <strong>Plan:</strong> {subscription.plan === 'premium' ? 'Premium' : 'Básico'}<br />
          <strong>Estado:</strong> {subscription.status === 'active' ? 'Activa' : 'Expirada'}<br />
          <strong>Inicio:</strong> {subscription.startDate}<br />
          <strong>Fin:</strong> {subscription.endDate}<br />
          <strong>Monto:</strong> ${subscription.amount} {subscription.currency}<br />
          <strong>Renovación automática:</strong> {subscription.autoRenewal ? 'Sí' : 'No'}<br />
          <strong>Método de pago:</strong> {subscription.paymentMethod}<br />
          <strong>Características:</strong>
          <ul className="list-disc ml-6">
            {subscription.features.map(f => <li key={f}>{f}</li>)}
          </ul>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => alert('Función de renovar suscripción (demo)')}>Renovar</Button>
          <Button variant="outline" onClick={() => alert('Función de cancelar suscripción (demo)')}>Cancelar</Button>
          <Button variant="outline" onClick={() => alert('Función de cambiar plan (demo)')}>Cambiar plan</Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/admin/users')}>Volver</Button>
        </div>
      </Card>
    </div>
  );
};

export default UserSubscriptionPage; 