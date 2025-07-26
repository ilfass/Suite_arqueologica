import React from 'react';
import ContextBanner from '../../../components/ui/ContextBanner';

export default function ResearcherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de Contexto Global */}
      <ContextBanner />
      
      {/* Contenido de la página */}
      {children}
    </div>
  );
} 