'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  const { login, user } = useAuth();
  const router = useRouter();

  // Manejar redirección después del login exitoso
  useEffect(() => {
    console.log('useEffect de redirección - loginSuccess:', loginSuccess, 'user:', user);
    if (loginSuccess && user) {
      console.log('Intentando redirección para rol:', user.role);
      if (user.role === 'ADMIN') {
        console.log('Redirigiendo a /dashboard/admin');
        router.push('/dashboard/admin');
      } else if (user.role === 'RESEARCHER') {
        console.log('Redirigiendo a /dashboard/researcher');
        router.push('/dashboard/researcher');
      } else if (user.role === 'STUDENT') {
        console.log('Redirigiendo a /dashboard/student');
        router.push('/dashboard/student');
      } else if (user.role === 'DIRECTOR') {
        console.log('Redirigiendo a /dashboard/director');
        router.push('/dashboard/director');
      } else if (user.role === 'INSTITUTION') {
        console.log('Redirigiendo a /dashboard/institution');
        router.push('/dashboard/institution');
      } else if (user.role === 'GUEST') {
        console.log('Redirigiendo a /');
        router.push('/');
      } else {
        console.log('Redirigiendo a /dashboard (rol no reconocido)');
        router.push('/dashboard');
      }
    }
  }, [loginSuccess, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Iniciando login para:', email);

    try {
      await login(email, password);
      console.log('Login exitoso, estableciendo loginSuccess = true');
      setLoginSuccess(true);
    } catch (err: any) {
      console.log('Error en login:', err);
      setError(err.response?.data?.message || 'Error al iniciar sesión');
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
            Inicia sesión en tu cuenta
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
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="usuario@example.com"
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Iniciar sesión
            </Button>

            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 