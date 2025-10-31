import { Mail, Phone, MapPin } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
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
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
              <Mail className="w-12 h-12 text-gray-900 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">contacto@laserart.com</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
              <Phone className="w-12 h-12 text-gray-900 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Teléfono</h3>
              <p className="text-gray-600">+52 123 456 7890</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
              <MapPin className="w-12 h-12 text-gray-900 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ubicación</h3>
              <p className="text-gray-600">Ciudad de México</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
