'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

interface Plan {
  id: string;
  name: string;
  description: string;
  price_usd: number;
  price_ars: number;
  features: string[];
  popular?: boolean;
  trial_days?: number;
  button_text: string;
  button_variant: 'primary' | 'outline';
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price_usd: number;
  price_ars: number;
  unit: string;
}

const PlansPage: React.FC = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'individual',
      name: 'Investigador Individual',
      description: 'Perfecto para arqueólogos independientes y estudiantes de posgrado',
      price_usd: 180,
      price_ars: 165000,
      trial_days: 30,
      features: [
        '✅ Acceso completo a todas las herramientas arqueológicas',
        '✅ Gestión ilimitada de sitios arqueológicos',
        '✅ Catálogo completo de objetos',
        '✅ Herramientas de excavación y documentación',
        '✅ Reportes PDF personalizados',
        '✅ Exportación de datos en múltiples formatos',
        '✅ Soporte por email',
        '✅ Backup automático de datos',
        '✅ Acceso desde cualquier dispositivo',
        '✅ Actualizaciones gratuitas'
      ],
      button_text: 'Comenzar Prueba Gratuita',
      button_variant: 'primary'
    },
    {
      id: 'professional',
      name: 'Equipo Profesional',
      description: 'Ideal para equipos de investigación y proyectos arqueológicos',
      price_usd: 550,
      price_ars: 500000,
      popular: true,
      features: [
        '✅ Todo lo del plan Individual',
        '✅ Hasta 5 usuarios por cuenta',
        '✅ Modelos 3D y fotos de alta resolución',
        '✅ Exportación avanzada de datos',
        '✅ Herramientas de comparación avanzadas',
        '✅ Reportes personalizados',
        '✅ Análisis estadístico completo',
        '✅ Colaboración en tiempo real',
        '✅ Gestión de permisos por usuario',
        '✅ Soporte prioritario',
        '✅ Capacitación incluida'
      ],
      button_text: 'Solicitar Acceso',
      button_variant: 'primary'
    },
    {
      id: 'institution',
      name: 'Institución',
      description: 'Solución completa para universidades, museos y organizaciones',
      price_usd: 1500,
      price_ars: 1350000,
      features: [
        '✅ Todo lo del plan Profesional',
        '✅ Usuarios ilimitados',
        '✅ Reportes institucionales avanzados',
        '✅ Backups automáticos y redundantes',
        '✅ Soporte prioritario 24/7',
        '✅ API personalizada',
        '✅ Integración con sistemas existentes',
        '✅ Capacitación personalizada',
        '✅ Gestión centralizada de usuarios',
        '✅ Auditoría completa de actividades',
        '✅ SLA garantizado',
        '✅ Migración de datos incluida'
      ],
      button_text: 'Contactar Ventas',
      button_variant: 'outline'
    }
  ];

  const addOns: AddOn[] = [
    {
      id: 'storage',
      name: 'Almacenamiento Adicional',
      description: 'Espacio extra para archivos, fotos y modelos 3D',
      price_usd: 50,
      price_ars: 45000,
      unit: 'por cada 50 GB'
    },
    {
      id: 'consulting',
      name: 'Asesoría Técnica',
      description: 'Consultoría especializada en arqueología digital',
      price_usd: 100,
      price_ars: 90000,
      unit: 'por hora'
    },
    {
      id: 'training',
      name: 'Capacitación Virtual',
      description: 'Sesiones de capacitación personalizadas para tu equipo',
      price_usd: 300,
      price_ars: 270000,
      unit: 'por sesión'
    }
  ];

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    // Aquí se puede agregar lógica para redirigir al registro o contacto
    if (planId === 'institution') {
      router.push('/contact');
    } else {
      router.push('/register');
    }
  };

  const handleAddOnSelection = (addOnId: string) => {
    router.push('/contact?addon=' + addOnId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Suite Arqueológica
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/login')}>
                Iniciar sesión
              </Button>
              <Button onClick={() => router.push('/register')}>
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Planes y Suscripciones
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Nuestra plataforma funciona mediante suscripciones anuales diseñadas específicamente 
            para arqueólogos, investigadores e instituciones. Ofrecemos una prueba gratuita de 
            30 días para investigadores individuales, sin compromiso y con acceso completo a todas las herramientas.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => router.push('/register')}>
              Comenzar Prueba Gratuita
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push('/contact')}>
              Hablar con un Experto
            </Button>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Elige el Plan Perfecto para tu Proyecto
            </h2>
            <p className="text-lg text-gray-600">
              Desde investigadores individuales hasta grandes instituciones, tenemos una solución para ti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'ring-2 ring-blue-500 bg-white' 
                    : 'bg-white hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gray-900">
                        ${plan.price_usd}
                        <span className="text-lg font-normal text-gray-500">/año</span>
                      </div>
                      <div className="text-lg text-gray-600">
                        ARS ${plan.price_ars.toLocaleString()}
                      </div>
                      {plan.trial_days && (
                        <div className="text-sm text-green-600 font-medium mt-2">
                          {plan.trial_days} días de prueba gratuita
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">{feature}</p>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handlePlanSelection(plan.id)}
                    variant={plan.button_variant}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : ''
                    }`}
                    size="lg"
                  >
                    {plan.button_text}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Servicios Adicionales
            </h2>
            <p className="text-lg text-gray-600">
              Complementa tu suscripción con servicios especializados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {addOns.map((addOn) => (
              <Card key={addOn.id} className="text-center hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{addOn.name}</h3>
                  <p className="text-gray-600 mb-4">{addOn.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-gray-900">
                      ${addOn.price_usd}
                    </div>
                    <div className="text-lg text-gray-600">
                      ARS ${addOn.price_ars.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {addOn.unit}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handleAddOnSelection(addOn.id)}
                    className="w-full"
                  >
                    Solicitar Cotización
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Puedo cambiar de plan en cualquier momento?
                </h3>
                <p className="text-gray-600">
                  Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se aplicarán 
                  en el próximo ciclo de facturación.
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Qué incluye la prueba gratuita?
                </h3>
                <p className="text-gray-600">
                  La prueba gratuita incluye acceso completo a todas las funcionalidades del plan 
                  Investigador Individual durante 30 días, sin compromiso.
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Ofrecen descuentos para instituciones educativas?
                </h3>
                <p className="text-gray-600">
                  Sí, ofrecemos descuentos especiales para universidades, museos y organizaciones 
                  educativas. Contáctanos para más información.
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Cómo funciona el soporte técnico?
                </h3>
                <p className="text-gray-600">
                  El soporte incluye email, chat en vivo y documentación completa. Los planes 
                  Profesional e Institución incluyen soporte prioritario.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para Comenzar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a cientos de arqueólogos que ya confían en nuestra plataforma
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              onClick={() => router.push('/register')}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Comenzar Ahora
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => router.push('/contact')}
              className="border-white text-white hover:bg-blue-700"
            >
              Hablar con un Experto
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Suite Arqueológica</h3>
              <p className="text-gray-400">
                Plataforma integral para la gestión arqueológica moderna.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Características</a></li>
                <li><a href="#" className="hover:text-white">Precios</a></li>
                <li><a href="#" className="hover:text-white">Documentación</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
                <li><a href="#" className="hover:text-white">Estado del Sistema</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Acerca de</a></li>
                <li><a href="#" className="hover:text-white">Privacidad</a></li>
                <li><a href="#" className="hover:text-white">Términos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 Suite Arqueológica. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlansPage; 