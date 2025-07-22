'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../../contexts/AuthContext';
import Card from '../../../../../../components/ui/Card';
import Button from '../../../../../../components/ui/Button';
import Input from '../../../../../../components/ui/Input';

const RejectRequestPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const approvalId = params?.id as string;
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('Por favor, selecciona una razón para el rechazo.');
      return;
    }
    
    setLoading(true);
    // Simular proceso de rechazo
    setTimeout(() => {
      setLoading(false);
      alert('Solicitud rechazada exitosamente');
      router.push(`/dashboard/director/approvals/${approvalId}`);
    }, 2000);
  };

  const handleCancel = () => {
    router.push(`/dashboard/director/approvals/${approvalId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card title="Rechazar Solicitud" className="max-w-md w-full">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Rechazar Solicitud #{approvalId}
            </h2>
            <p className="text-gray-600">
              ¿Estás seguro de que deseas rechazar esta solicitud? Esta acción no se puede deshacer.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razón del rechazo *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar razón...</option>
              <option value="incomplete">Información incompleta</option>
              <option value="budget">Presupuesto insuficiente</option>
              <option value="timeline">Cronograma no viable</option>
              <option value="resources">Recursos no disponibles</option>
              <option value="policy">No cumple con políticas</option>
              <option value="other">Otra razón</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentarios adicionales
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Explicar en detalle las razones del rechazo..."
            />
          </div>

          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleReject}
              disabled={loading || !reason}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Rechazando...' : 'Rechazar Solicitud'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RejectRequestPage; 