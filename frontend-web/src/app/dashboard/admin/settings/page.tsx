'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface SystemSettings {
  general: {
    site_name: string;
    site_description: string;
    contact_email: string;
    support_email: string;
    maintenance_mode: boolean;
    max_file_size: number;
    allowed_file_types: string[];
  };
  security: {
    password_min_length: number;
    require_strong_password: boolean;
    session_timeout: number;
    max_login_attempts: number;
    enable_2fa: boolean;
    ip_whitelist: string[];
  };
  subscription: {
    trial_days: number;
    max_users_free: number;
    max_storage_free: number;
    enable_auto_renewal: boolean;
    grace_period_days: number;
  };
  notifications: {
    email_notifications: boolean;
    system_alerts: boolean;
    user_registration_notify: boolean;
    subscription_expiry_notify: boolean;
  };
}

const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      site_name: 'Suite Arqueológica',
      site_description: 'Plataforma integral para la gestión arqueológica',
      contact_email: 'contacto@suitearqueologica.com',
      support_email: 'soporte@suitearqueologica.com',
      maintenance_mode: false,
      max_file_size: 50,
      allowed_file_types: ['jpg', 'png', 'pdf', 'docx', 'xlsx']
    },
    security: {
      password_min_length: 8,
      require_strong_password: true,
      session_timeout: 24,
      max_login_attempts: 5,
      enable_2fa: true,
      ip_whitelist: []
    },
    subscription: {
      trial_days: 30,
      max_users_free: 1,
      max_storage_free: 1,
      enable_auto_renewal: true,
      grace_period_days: 7
    },
    notifications: {
      email_notifications: true,
      system_alerts: true,
      user_registration_notify: true,
      subscription_expiry_notify: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    // Simular carga de configuración
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Configuración guardada:', settings);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto?')) {
      // Aquí se restaurarían los valores por defecto
      alert('Configuración restaurada por defecto');
    }
  };

  const handleBackupSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'system-settings-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
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
                Configuración del Sistema
              </h1>
              <p className="text-gray-600">
                Administrador: {user?.full_name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard/admin')}>
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'general', name: 'General', icon: '⚙️' },
              { id: 'security', name: 'Seguridad', icon: '🔒' },
              { id: 'subscription', name: 'Suscripciones', icon: '💳' },
              { id: 'notifications', name: 'Notificaciones', icon: '🔔' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <Card title="Configuración General">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Sitio
                  </label>
                  <Input
                    type="text"
                    value={settings.general.site_name}
                    onChange={(e) => handleInputChange('general', 'site_name', e.target.value)}
                    placeholder="Suite Arqueológica"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Contacto
                  </label>
                  <Input
                    type="email"
                    value={settings.general.contact_email}
                    onChange={(e) => handleInputChange('general', 'contact_email', e.target.value)}
                    placeholder="contacto@suitearqueologica.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Sitio
                </label>
                <textarea
                  value={settings.general.site_description}
                  onChange={(e) => handleInputChange('general', 'site_description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción de la plataforma..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Soporte
                  </label>
                  <Input
                    type="email"
                    value={settings.general.support_email}
                    onChange={(e) => handleInputChange('general', 'support_email', e.target.value)}
                    placeholder="soporte@suitearqueologica.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño Máximo de Archivo (MB)
                  </label>
                  <Input
                    type="number"
                    value={settings.general.max_file_size}
                    onChange={(e) => handleInputChange('general', 'max_file_size', parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipos de Archivo Permitidos
                </label>
                <Input
                  type="text"
                  value={settings.general.allowed_file_types.join(', ')}
                  onChange={(e) => handleInputChange('general', 'allowed_file_types', e.target.value.split(', '))}
                  placeholder="jpg, png, pdf, docx, xlsx"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenance_mode"
                  checked={settings.general.maintenance_mode}
                  onChange={(e) => handleInputChange('general', 'maintenance_mode', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="maintenance_mode" className="ml-2 block text-sm text-gray-900">
                  Modo de Mantenimiento
                </label>
              </div>
            </div>
          </Card>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <Card title="Configuración de Seguridad">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitud Mínima de Contraseña
                  </label>
                  <Input
                    type="number"
                    value={settings.security.password_min_length}
                    onChange={(e) => handleInputChange('security', 'password_min_length', parseInt(e.target.value))}
                    min="6"
                    max="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo de Sesión (horas)
                  </label>
                  <Input
                    type="number"
                    value={settings.security.session_timeout}
                    onChange={(e) => handleInputChange('security', 'session_timeout', parseInt(e.target.value))}
                    min="1"
                    max="168"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intentos Máximos de Login
                  </label>
                  <Input
                    type="number"
                    value={settings.security.max_login_attempts}
                    onChange={(e) => handleInputChange('security', 'max_login_attempts', parseInt(e.target.value))}
                    min="3"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IPs Permitidas (una por línea)
                  </label>
                  <textarea
                    value={settings.security.ip_whitelist.join('\n')}
                    onChange={(e) => handleInputChange('security', 'ip_whitelist', e.target.value.split('\n').filter(ip => ip.trim()))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="192.168.1.1&#10;10.0.0.1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="require_strong_password"
                    checked={settings.security.require_strong_password}
                    onChange={(e) => handleInputChange('security', 'require_strong_password', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="require_strong_password" className="ml-2 block text-sm text-gray-900">
                    Requerir Contraseña Fuerte
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enable_2fa"
                    checked={settings.security.enable_2fa}
                    onChange={(e) => handleInputChange('security', 'enable_2fa', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable_2fa" className="ml-2 block text-sm text-gray-900">
                    Habilitar Autenticación de Dos Factores
                  </label>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Subscription Settings */}
        {activeTab === 'subscription' && (
          <Card title="Configuración de Suscripciones">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Días de Prueba Gratuita
                  </label>
                  <Input
                    type="number"
                    value={settings.subscription.trial_days}
                    onChange={(e) => handleInputChange('subscription', 'trial_days', parseInt(e.target.value))}
                    min="0"
                    max="90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuarios Máximos (Plan Gratuito)
                  </label>
                  <Input
                    type="number"
                    value={settings.subscription.max_users_free}
                    onChange={(e) => handleInputChange('subscription', 'max_users_free', parseInt(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Almacenamiento Máximo (GB) - Plan Gratuito
                  </label>
                  <Input
                    type="number"
                    value={settings.subscription.max_storage_free}
                    onChange={(e) => handleInputChange('subscription', 'max_storage_free', parseInt(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Período de Gracia (días)
                  </label>
                  <Input
                    type="number"
                    value={settings.subscription.grace_period_days}
                    onChange={(e) => handleInputChange('subscription', 'grace_period_days', parseInt(e.target.value))}
                    min="0"
                    max="30"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enable_auto_renewal"
                  checked={settings.subscription.enable_auto_renewal}
                  onChange={(e) => handleInputChange('subscription', 'enable_auto_renewal', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enable_auto_renewal" className="ml-2 block text-sm text-gray-900">
                  Habilitar Renovación Automática
                </label>
              </div>
            </div>
          </Card>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <Card title="Configuración de Notificaciones">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email_notifications"
                  checked={settings.notifications.email_notifications}
                  onChange={(e) => handleInputChange('notifications', 'email_notifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="email_notifications" className="ml-2 block text-sm text-gray-900">
                  Notificaciones por Email
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="system_alerts"
                  checked={settings.notifications.system_alerts}
                  onChange={(e) => handleInputChange('notifications', 'system_alerts', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="system_alerts" className="ml-2 block text-sm text-gray-900">
                  Alertas del Sistema
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="user_registration_notify"
                  checked={settings.notifications.user_registration_notify}
                  onChange={(e) => handleInputChange('notifications', 'user_registration_notify', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="user_registration_notify" className="ml-2 block text-sm text-gray-900">
                  Notificar Nuevos Registros de Usuario
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="subscription_expiry_notify"
                  checked={settings.notifications.subscription_expiry_notify}
                  onChange={(e) => handleInputChange('notifications', 'subscription_expiry_notify', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="subscription_expiry_notify" className="ml-2 block text-sm text-gray-900">
                  Notificar Vencimiento de Suscripciones
                </label>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={handleBackupSettings}
            >
              💾 Respaldar Configuración
            </Button>
            <Button
              variant="outline"
              onClick={handleResetSettings}
              className="text-red-600 border-red-300"
            >
              🔄 Restaurar por Defecto
            </Button>
          </div>
          
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/admin')}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              className="min-w-[120px]"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                '💾 Guardar Cambios'
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettingsPage; 