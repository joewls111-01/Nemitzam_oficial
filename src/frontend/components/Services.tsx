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
              className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <service.icon className="w-12 h-12 text-gray-900 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
