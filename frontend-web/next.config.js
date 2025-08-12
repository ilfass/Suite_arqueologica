/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para producción
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  
  // Configuración de imágenes
  images: {
    domains: ['avpaiyyjixtdopbciedr.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuración de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Configuración de redirecciones
  async redirects() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    const isAbsolute = apiBase && /^(http|https):\/\//.test(apiBase);
    if (isAbsolute) {
      const base = apiBase.replace(/\/$/, '');
      return [
        {
          source: '/api/:path*',
          destination: `${base}/api/:path*`,
          permanent: false,
        },
      ];
    }
    return [];
  },
  
  // Configuración de variables de entorno
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Configuración de compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Configuración de webpack
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;