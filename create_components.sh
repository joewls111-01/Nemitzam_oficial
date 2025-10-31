#!/bin/bash

# Services.tsx
cat > /tmp/cc-agent/59366862/project/src/frontend/components/Services.tsx << 'EOF'
import { Zap, Layers, Package, Sparkles } from 'lucide-react';

export function Services() {
  const services = [
    {
      icon: Zap,
      title: 'Grabado Rápido',
      description: 'Tecnología láser de alta velocidad para resultados en tiempo récord'
    },
    {
      icon: Layers,
      title: 'Múltiples Materiales',
      description: 'Trabajamos con madera, acrílico, cuero, metal y más'
    },
    {
      icon: Package,
      title: 'Pedidos Personalizados',
      description: 'Cada proyecto es único, adaptado a tus necesidades'
    },
    {
      icon: Sparkles,
      title: 'Alta Precisión',
      description: 'Detalles perfectos hasta el último milímetro'
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ofrecemos soluciones de grabado láser profesional para todo tipo de proyectos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-xl transition-all duration-300 border border-orange-100"
            >
              <service.icon className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
EOF

# Contact.tsx
cat > /tmp/cc-agent/59366862/project/src/frontend/components/Contact.tsx << 'EOF'
import { Mail, Phone, MapPin } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contáctanos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ¿Tienes un proyecto en mente? Estamos listos para ayudarte
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg">
              <Mail className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">contacto@laserart.com</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg">
              <Phone className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Teléfono</h3>
              <p className="text-gray-600">+52 123 456 7890</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg">
              <MapPin className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ubicación</h3>
              <p className="text-gray-600">Ciudad de México</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
EOF

echo "Components created successfully"
