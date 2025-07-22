'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'RESEARCHER' as const,
    institution: '',
    specialization: '',
    is_public_researcher: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.email, 
        formData.password, 
        formData.fullName, 
        formData.role,
        formData.institution,
        formData.specialization,
        formData.is_public_researcher
      );
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Suite Arqueológica
          </h1>
          <p className="text-gray-600">
            Crea tu cuenta
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Input
              label="Nombre completo"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Juan Pérez"
            />

            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="usuario@example.com"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="RESEARCHER">Investigador</option>
                <option value="STUDENT">Estudiante</option>
                <option value="INSTITUTION">Institución</option>
                <option value="GUEST">Invitado</option>
              </select>
            </div>

            <Input
              label="Institución"
              name="institution"
              type="text"
              value={formData.institution}
              onChange={handleChange}
              placeholder="Universidad Nacional, INAH, etc."
            />

            <Input
              label="Especialidad"
              name="specialization"
              type="text"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Arqueología Maya, Antropología, etc."
            />

            <div className="flex items-center">
              <input
                id="is_public_researcher"
                name="is_public_researcher"
                type="checkbox"
                checked={formData.is_public_researcher}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_public_researcher" className="ml-2 block text-sm text-gray-900">
                Quiero aparecer en la lista pública de investigadores
              </label>
            </div>

            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              helperText="Mínimo 8 caracteres"
            />

            <Input
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Crear cuenta
            </Button>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 