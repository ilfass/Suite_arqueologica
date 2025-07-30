import React from 'react';

interface DevelopmentBannerProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

const DevelopmentBanner: React.FC<DevelopmentBannerProps> = ({ 
  title = "⚠️ Modo Desarrollo Activo",
  children,
  className = ""
}) => {
  // Solo mostrar en modo desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-amber-800">
            {title}
          </h3>
          <div className="mt-2 text-sm text-amber-700">
            {children || (
              <>
                <p className="mb-2">
                  <strong>Recordatorio importante para producción:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Configurar correctamente el servicio de email en Supabase</li>
                  <li>Ajustar los límites de rate limiting según las necesidades</li>
                  <li>Verificar la configuración de autenticación</li>
                  <li>Revisar la configuración de seguridad</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Nota:</strong> Este banner solo aparece en modo desarrollo y no será visible en producción.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentBanner; 