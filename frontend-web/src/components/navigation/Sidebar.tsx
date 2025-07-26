'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface MenuItem {
  href: string;
  label: string;
  icon: string;
  roles?: string[];
}

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/sites', label: 'Sitios', icon: '🏛️' },
    { href: '/objects', label: 'Objetos', icon: '🏺' },
    { href: '/excavations', label: 'Excavaciones', icon: '⛏️' },
    { href: '/profile', label: 'Mi Perfil', icon: '👤' },
    { href: '/settings', label: 'Configuración', icon: '⚙️' },
    { 
      href: '/researchers', 
      label: 'Investigadores', 
      icon: '👨‍🔬',
      roles: ['ADMIN']
    },
    { 
      href: '/dashboard/admin', 
      label: 'Panel Admin', 
      icon: '🔧',
      roles: ['ADMIN']
    },
    { 
      href: '/dashboard/researcher', 
      label: 'Panel Investigador', 
      icon: '📊',
      roles: ['RESEARCHER']
    },
    { 
      href: '/dashboard/researcher/chronology', 
      label: 'Cronologías', 
      icon: '⏳',
      roles: ['RESEARCHER']
    },
    { 
      href: '/dashboard/researcher/laboratory', 
      label: 'Laboratorio', 
      icon: '🔬',
      roles: ['RESEARCHER']
    },
    { 
      href: '/dashboard/director', 
      label: 'Panel Director', 
      icon: '📋',
      roles: ['DIRECTOR']
    },
    { 
      href: '/dashboard/student', 
      label: 'Panel Estudiante', 
      icon: '📚',
      roles: ['STUDENT']
    },
    { 
      href: '/dashboard/institution', 
      label: 'Panel Institución', 
      icon: '🏢',
      roles: ['INSTITUTION']
    },
    { 
      href: '/dashboard/guest', 
      label: 'Panel Invitado', 
      icon: '👁️',
      roles: ['GUEST']
    }
  ];

  // Filtrar elementos del menú según el rol del usuario
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true; // Elementos sin restricción de rol
    return item.roles.includes(user?.role || '');
  });

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`} data-testid="sidebar">
      <div className="flex flex-col h-full">
        {/* Toggle button */}
        <div className="flex justify-end p-4 border-b border-gray-200">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
            title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"}
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1" data-testid="sidebar-nav">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`nav-${item.href.replace(/\//g, '-').replace(/^-/, '')}`}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User info */}
        {!isCollapsed && user && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
} 