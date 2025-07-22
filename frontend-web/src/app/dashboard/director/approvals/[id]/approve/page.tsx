'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../../contexts/AuthContext';
import Card from '../../../../../../components/ui/Card';
import Button from '../../../../../../components/ui/Button';
import Input from '../../../../../../components/ui/Input';

const ApproveRequestPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const approvalId = params?.id as string;
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState('');

  const handleApprove = async () => {
    setLoading(true);
    // Simular proceso de aprobación
    setTimeout(() => {
      setLoading(false);
      alert('Solicitud aprobada exitosamente');
      router.push(`/dashboard/director/approvals/${approvalId}`);
    }, 2000);
  };

  const handleCancel = () => {
    router.push(`/dashboard/director/approvals/${approvalId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card title="Aprobar Solicitud" className="max-w-md w-full">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Aprobar Solicitud #{approvalId}
            </h2>
            <p className="text-gray-600">
              ¿Estás seguro de que deseas aprobar esta solicitud? Esta acción no se puede deshacer.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentarios (opcional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Agregar comentarios sobre la aprobación..."
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
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Aprobando...' : 'Aprobar Solicitud'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApproveRequestPage; 