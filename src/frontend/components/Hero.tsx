import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, type Project } from '../../backend/database/supabase';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [projects.length]);

  async function loadProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true })
        .limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects([{
          id: 'default',
          title: 'Proyecto Ejemplo',
          description: 'Grabado láser en cuero',
          image_url: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=1200',
          category: 'cuero',
          order_index: 0,
          created_at: '',
          updated_at: ''
        }]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([{
        id: 'default',
        title: 'Proyecto Ejemplo',
        description: 'Grabado láser en cuero',
        image_url: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=1200',
        category: 'cuero',
        order_index: 0,
        created_at: '',
        updated_at: ''
      }]);
    }
  }

  function nextSlide() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }

  function prevSlide() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }

  const currentProject = projects[currentIndex];

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Grabado Láser de Precisión
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Transformamos tus ideas en obras de arte personalizadas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => onNavigate('gallery')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-base hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
              >
                Ver Proyectos
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-gray-900 border border-gray-300 rounded-full font-semibold text-base hover:bg-gray-100 transition-all"
              >
                Contactar
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px]">
              {currentProject && (
                <img
                  key={currentIndex}
                  src={currentProject.image_url}
                  alt={currentProject.title}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              )}

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isTransitioning) {
                        setIsTransitioning(true);
                        setCurrentIndex(index);
                        setTimeout(() => setIsTransitioning(false), 500);
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                +{projects.length}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Proyectos Realizados
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
