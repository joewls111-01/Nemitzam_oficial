import { Heart, Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../backend/database/supabase';

interface SiteConfig {
  site_name: string;
  site_icon: string;
  site_logo_url: string;
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  social_whatsapp: string;
  social_email: string;
}

export function Footer() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    site_name: 'Nemitzam',
    site_icon: '�',
    site_logo_url: '',
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    social_whatsapp: '',
    social_email: '',
  });

  useEffect(() => {
    loadSiteConfig();

    const handleConfigUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setSiteConfig(customEvent.detail);
      }
    };

    window.addEventListener('siteConfigUpdated', handleConfigUpdate);
    return () => window.removeEventListener('siteConfigUpdated', handleConfigUpdate);
  }, []);

  async function loadSiteConfig() {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*');

      if (error) throw error;

      const config: SiteConfig = {
        site_name: 'Nemitzam',
        site_icon: '�',
        social_facebook: '',
        social_instagram: '',
        social_twitter: '',
        social_whatsapp: '',
        social_email: '',
      };

      data?.forEach((item) => {
        if (item.key === 'site_logo_url') config.site_logo_url = item.value;
        if (item.key in config) {
          config[item.key as keyof SiteConfig] = item.value;
        }
      });

      setSiteConfig(config);
    } catch (error) {
      console.error('Error loading site config:', error);
    }
  }

  const socialLinks = [
    { url: siteConfig.social_facebook, icon: Facebook, label: 'Facebook' },
    { url: siteConfig.social_instagram, icon: Instagram, label: 'Instagram' },
    { url: siteConfig.social_twitter, icon: Twitter, label: 'Twitter' },
    { url: siteConfig.social_email, icon: Mail, label: 'Email', isEmail: true },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <img
              src={siteConfig.site_logo_url}
              alt={`${siteConfig.site_name} logo`}
              className="w-8 h-8"
            />
            <span className="text-lg font-semibold text-gray-900">{siteConfig.site_name}</span>
          </div>

          {(siteConfig.social_facebook || siteConfig.social_instagram || siteConfig.social_twitter || siteConfig.social_whatsapp || siteConfig.social_email) && (
            <div className="flex items-center gap-4">
              {socialLinks.map((social) =>
                social.url ? (
                  <a
                    key={social.label}
                    href={social.isEmail ? `mailto:${social.url}` : social.url}
                    target={social.isEmail ? undefined : '_blank'}
                    rel={social.isEmail ? undefined : 'noopener noreferrer'}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ) : null
              )}
              {siteConfig.social_whatsapp && (
                <a
                  href={`https://wa.me/${siteConfig.social_whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Hecho con</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span> 2024 {siteConfig.site_name}. Todos los derechos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
