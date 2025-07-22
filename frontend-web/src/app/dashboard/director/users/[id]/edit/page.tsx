'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../../contexts/AuthContext';
import Card from '../../../../../../components/ui/Card';
import Button from '../../../../../../components/ui/Button';
import Input from '../../../../../../components/ui/Input';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  institution: string;
  phone?: string;
  specialization?: string;
  projects_assigned: number;
}

const EditUserPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Simular carga de datos del usuario
    setTimeout(() => {
      setUserData({
        id: userId,
        full_name: 'Dr. María González',
        email: 'maria.gonzalez@inah.gob.mx',
        role: 'RESEARCHER',
        status: 'active',
        institution: 'INAH',
        phone: '+52 55 1234 5678',
        specialization: 'Arqueología Prehispánica',
        projects_assigned: 2
      });
      setLoading(false);
    }, 1000);
  }, [userId]);

  const handleInputChange = (field: keyof User, value: any) => {
    if (userData) {
      setUserData({ ...userData, [field]: value });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simular guardado
    setTimeout(() => {
      setSaving(false);
      alert('Usuario actualizado exitosamente');
      router.push('/dashboard/director');
    }, 2000);
  };

  const handleCancel = () => {
    router.push('/dashboard/director');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando usuario...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card title="Usuario no encontrado">
          <p>No se encontró el usuario solicitado.</p>
          <Button onClick={() => router.push('/dashboard/director')}>Volver al Dashboard</Button>
        </Card>
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
              <h1 className="text-2xl font-bold text-gray-900">Editar Usuario</h1>
              <p className="text-gray-600">{userData.full_name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="Información del Usuario">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <Input
                  value={userData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <Input
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <select
                  value={userData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="RESEARCHER">Investigador</option>
                  <option value="STUDENT">Estudiante</option>
                  <option value="TECHNICIAN">Técnico</option>
                  <option value="ASSISTANT">Asistente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={userData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institución
                </label>
                <Input
                  value={userData.institution}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  placeholder="Nombre de la institución"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <Input
                  value={userData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+52 55 1234 5678"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especialización
              </label>
              <Input
                value={userData.specialization || ''}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                placeholder="Especialización o área de estudio"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Información del Sistema</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">ID de Usuario:</span>
                  <span className="ml-2 font-mono">{userData.id}</span>
                </div>
                <div>
                  <span className="text-gray-500">Proyectos Asignados:</span>
                  <span className="ml-2">{userData.projects_assigned}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default EditUserPage; 