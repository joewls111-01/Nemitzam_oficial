import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../backend/database/supabase';

interface HeaderProps {
  onNavigate: (section: string) => void;
}

interface SiteConfig {
  site_name: string;
  site_icon: string;
  site_logo_url: string;
}

export function Header({ onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    site_name: 'Nemtzam',
    site_icon: '',
    site_logo_url: '',
  });

  useEffect(() => {
    loadSiteConfig();

    const handleConfigUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setSiteConfig({
          site_name: customEvent.detail.site_name,
          site_icon: customEvent.detail.site_icon,
          site_logo_url: customEvent.detail.site_logo_url || '',
        });
        document.title = `${customEvent.detail.site_name} - Estudio Creativo`;
      }
    };

    window.addEventListener('siteConfigUpdated', handleConfigUpdate);
    return () => window.removeEventListener('siteConfigUpdated', handleConfigUpdate);
  }, []);

  async function loadSiteConfig() {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .in('key', ['site_name', 'site_icon', 'site_logo_url']);

      if (error) throw error;

      const config: SiteConfig = {
        site_name: 'Nemitzam',
        site_icon: '',
        site_logo_url: '',
      };

      data?.forEach((item) => {
        if (item.key === 'site_name') config.site_name = item.value;
        if (item.key === 'site_icon') config.site_icon = item.value;
        if (item.key === 'site_logo_url') config.site_logo_url = item.value;
      });

      setSiteConfig(config);
      document.title = `${config.site_name} - Estudio Creativo`;
    } catch (error) {
      console.error('Error loading site config:', error);
    }
  }

  const menuItems = [
    { label: 'Inicio', section: 'hero' },
    { label: 'Servicios', section: 'services' },
    { label: 'Galería', section: 'gallery' },
    { label: 'Contacto', section: 'contact' },
  ];

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('hero')}>
          {siteConfig.site_logo_url ? (
            siteConfig.site_logo_url.startsWith('http') ? (
              <img
                src={siteConfig.site_logo_url}
                alt={siteConfig.site_name}
                className="h-14 w-auto object-contain"
              />
            ) : (
              <span className="text-2xl">{siteConfig.site_logo_url}</span>
            )
          ) : siteConfig.site_icon ? (
            <span className="text-2xl">{siteConfig.site_icon}</span>
          ) : null}

          {/* Agrupamos el nombre y el subtítulo */}
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-bold text-gray-900">
              {siteConfig.site_name}
            </span>
            <span className="text-sm text-gray-500 font-semibold -mt-1">
            Taller Creativo.
            </span>
          </div>
        </div>

            
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.section)}
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-200/50">
            {menuItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.section)}
                className="block w-full text-left py-3 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
