'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    institution: user?.institution || '',
    specialization: user?.specialization || '',
    bio: user?.bio || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateProfile(formData);
      setMessage('Perfil actualizado exitosamente');
    } catch (error) {
      setMessage('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Debes iniciar sesión para ver tu perfil</p>
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
              Mi Perfil
            </h1>
            <p className="mt-2 text-gray-600">
              Gestiona tu información personal y profesional
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-semibold text-2xl">
                      {user.full_name?.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {user.full_name}
                  </h2>
                  <p className="text-gray-600 mb-1">{user.email}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Institución</span>
                    <p className="text-sm text-gray-900">{user.institution || 'No especificada'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Especialización</span>
                    <p className="text-sm text-gray-900">{user.specialization || 'No especificada'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Plan de Suscripción</span>
                    <p className="text-sm text-gray-900">{user.subscription_plan}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Editar Información
                </h3>

                {message && (
                  <div className={`mb-4 p-3 rounded-md ${
                    message.includes('exitosamente') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Nombre completo"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    required
                  />

                  <Input
                    label="Institución"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                  />

                  <Input
                    label="Especialización"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografía
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Cuéntanos sobre tu experiencia y especialidades..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="submit"
                      loading={loading}
                      disabled={loading}
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage; 