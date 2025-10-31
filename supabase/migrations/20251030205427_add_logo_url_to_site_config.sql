/*
  # Agregar campo logo_url a site_config

  1. Cambios
    - Agregar nueva fila para logo_url en site_config
    - Permitir almacenar URL de imagen o emoji para el logo
  
  2. Propósito
    - Permitir al admin subir/cambiar el logo del sitio
    - Puede ser URL de imagen o emoji
*/

-- Insertar configuración de logo si no existe
INSERT INTO site_config (key, value, updated_at)
VALUES ('site_logo_url', '', now())
ON CONFLICT (key) DO NOTHING;
