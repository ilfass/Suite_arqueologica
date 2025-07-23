'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';

interface ContextBannerProps {
  project: string;
  area: string;
  site: string;
  projectName?: string;
  areaName?: string;
  siteName?: string;
  showBackButton?: boolean;
  showChangeButton?: boolean;
}

const ContextBanner: React.FC<ContextBannerProps> = ({
  project,
  area,
  site,
  projectName,
  areaName,
  siteName,
  showBackButton = true,
  showChangeButton = true
}) => {
  const router = useRouter();

  if (!project || !area || !site) {
    return null;
  }

  return (
    <div className="sticky top-0 z-30 w-full bg-blue-50 border-b border-blue-200 py-2 px-4 flex items-center justify-between shadow-sm mb-4">
      <div className="flex items-center space-x-4">
        <span className="text-blue-700 font-semibold">Trabajando en:</span>
        <span className="text-blue-900 font-bold">{projectName || `Proyecto ${project}`}</span>
        <span className="text-blue-700">|</span>
        <span className="text-blue-900 font-bold">{areaName || `Área ${area}`}</span>
        <span className="text-blue-700">|</span>
        <span className="text-blue-900 font-bold">{siteName || `Sitio ${site}`}</span>
      </div>
      <div className="flex items-center space-x-2">
        {showBackButton && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => router.push('/dashboard/researcher')}
          >
            🏠 Volver al Dashboard
          </Button>
        )}
        {showChangeButton && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => router.push('/dashboard/researcher')}
          >
            🔄 Cambiar Contexto
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContextBanner; 