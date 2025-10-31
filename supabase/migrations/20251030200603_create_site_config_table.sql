/*
  # Crear tabla de configuración del sitio

  1. Nueva Tabla
    - `site_config`
      - `id` (uuid, primary key) - ID único
      - `key` (text, unique) - Clave de configuración (ej: 'site_name', 'site_icon')
      - `value` (text) - Valor de la configuración
      - `created_at` (timestamptz) - Fecha de creación
      - `updated_at` (timestamptz) - Fecha de última actualización

  2. Configuración Inicial
    - Inserta valores por defecto para el sitio

  3. Seguridad
    - Enable RLS en la tabla
    - Policy de lectura pública (cualquiera puede leer)
    - Policy de escritura solo para usuarios autenticados
*/

-- Crear tabla de configuración
CREATE TABLE IF NOT EXISTS site_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insertar configuración por defecto
INSERT INTO site_config (key, value) VALUES
  ('site_name', 'LaserArt'),
  ('site_icon', '⚡'),
  ('social_facebook', ''),
  ('social_instagram', ''),
  ('social_twitter', ''),
  ('social_whatsapp', ''),
  ('social_email', '')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Policy: Todos pueden leer la configuración
CREATE POLICY "Anyone can read site config"
  ON site_config
  FOR SELECT
  TO public
  USING (true);

-- Policy: Solo usuarios autenticados pueden actualizar
CREATE POLICY "Authenticated users can update site config"
  ON site_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Crear índice para búsquedas rápidas por key
CREATE INDEX IF NOT EXISTS idx_site_config_key ON site_config(key);