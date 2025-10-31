/*
  # Crear tabla de categorías de proyectos

  1. Nueva Tabla
    - `project_categories`
      - `id` (uuid, primary key) - ID único
      - `name` (text, unique) - Nombre de la categoría
      - `slug` (text, unique) - Slug para URLs (ej: 'madera', 'acrilico')
      - `created_at` (timestamptz) - Fecha de creación
      - `display_order` (integer) - Orden de visualización

  2. Categorías por Defecto
    - Madera, Acrílico, Cuero, Metal, Vidrio, Otros

  3. Seguridad
    - Enable RLS
    - Policy de lectura pública
    - Policy de escritura para autenticados

  4. Actualizar tabla projects
    - Agregar relación con project_categories
*/

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS project_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Insertar categorías por defecto
INSERT INTO project_categories (name, slug, display_order) VALUES
  ('Madera', 'madera', 1),
  ('Acrílico', 'acrilico', 2),
  ('Cuero', 'cuero', 3),
  ('Metal', 'metal', 4),
  ('Vidrio', 'vidrio', 5),
  ('Otros', 'otros', 6)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Lectura pública
CREATE POLICY "Anyone can read categories"
  ON project_categories
  FOR SELECT
  TO public
  USING (true);

-- Policy: Autenticados pueden insertar
CREATE POLICY "Authenticated users can insert categories"
  ON project_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Autenticados pueden actualizar
CREATE POLICY "Authenticated users can update categories"
  ON project_categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Autenticados pueden eliminar
CREATE POLICY "Authenticated users can delete categories"
  ON project_categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Agregar columna category_id a projects si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE projects ADD COLUMN category_id uuid REFERENCES project_categories(id);
    CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
  END IF;
END $$;