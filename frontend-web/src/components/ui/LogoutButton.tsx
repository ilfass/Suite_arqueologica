'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';

interface LogoutButtonProps {
  variant?: 'outline' | 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = 'danger', 
  size = 'md', 
  className = '',
  children 
}) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      // El logout ya redirige automáticamente en el AuthContext
    } catch (error) {
      console.error('Error durante el logout:', error);
      // Si hay error, redirigir manualmente
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      loading={loading}
      className={`text-red-600 border-red-300 hover:bg-red-50 ${className}`}
    >
      {children || 'Cerrar Sesión'}
    </Button>
  );
};

export default LogoutButton; 