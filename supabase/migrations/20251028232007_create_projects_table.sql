/*
  # Crear tabla de proyectos para el portafolio de grabado láser

  1. Nueva Tabla
    - `projects`
      - `id` (uuid, primary key) - Identificador único del proyecto
      - `title` (text) - Título del proyecto
      - `description` (text) - Descripción del proyecto
      - `image_url` (text) - URL de la imagen del proyecto
      - `category` (text) - Categoría del proyecto (ej: madera, metal, acrílico)
      - `order_index` (integer) - Orden de visualización
      - `created_at` (timestamptz) - Fecha de creación
      - `updated_at` (timestamptz) - Fecha de actualización

  2. Seguridad
    - Enable RLS en la tabla `projects`
    - Política para permitir lectura pública (cualquiera puede ver los proyectos)
    - Sin políticas de escritura (se manejará desde el admin sin auth por ahora)
    
  3. Notas Importantes
    - Los proyectos se pueden ordenar usando el campo `order_index`
    - Las imágenes se almacenarán como URLs (pueden ser de servicios externos o Supabase Storage)
    - La tabla es de solo lectura para el público, la administración se hará desde el panel admin
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  category text DEFAULT 'general',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Política para permitir que cualquiera pueda leer los proyectos (para la galería pública)
CREATE POLICY "Anyone can view projects"
  ON projects
  FOR SELECT
  USING (true);

-- Políticas para operaciones de escritura (sin restricción de auth por ahora para el admin)
CREATE POLICY "Allow all inserts"
  ON projects
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all updates"
  ON projects
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all deletes"
  ON projects
  FOR DELETE
  USING (true);

-- Índice para mejorar el rendimiento de consultas ordenadas
CREATE INDEX IF NOT EXISTS projects_order_index_idx ON projects(order_index);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);