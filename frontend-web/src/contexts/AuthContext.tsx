'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, apiClient } from '../lib/api';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: User['role'], institution?: string, specialization?: string, is_public_researcher?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = apiClient.getToken();
        if (token) {
          const currentUser = await apiClient.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Solo limpiar el token si hay un error específico de autenticación
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 400)) {
          console.log('Clearing token due to auth error');
          apiClient.clearToken();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Función para refrescar el usuario
  const refreshUser = async () => {
    try {
      const token = apiClient.getToken();
      if (token) {
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        apiClient.clearToken();
        setUser(null);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: loggedInUser, token } = await apiClient.login({ email, password });
      apiClient.setToken(token);
      // Normalizar el campo role a mayúsculas y ajustar campos del backend
      const normalizedUser = { 
        ...loggedInUser, 
        role: loggedInUser.role?.toUpperCase?.() as User['role'],
        full_name: loggedInUser.first_name && loggedInUser.last_name 
          ? `${loggedInUser.first_name} ${loggedInUser.last_name}`
          : loggedInUser.full_name || loggedInUser.first_name || loggedInUser.last_name || ''
      };
      console.log('Usuario recibido tras login:', normalizedUser);
      setUser(normalizedUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string, role: User['role'], institution?: string, specialization?: string, is_public_researcher?: boolean) => {
    try {
      setLoading(true);
      const { user: newUser, token } = await apiClient.register({ 
        email, 
        password, 
        fullName, 
        role,
        institution,
        specialization,
        is_public_researcher
      });
      apiClient.setToken(token);
      setUser(newUser);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      apiClient.clearToken();
      // Redirigir a la página principal
      window.location.href = '/';
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      const updatedUser = await apiClient.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 