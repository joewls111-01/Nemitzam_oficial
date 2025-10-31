# Panel de Administración - LaserArt React

## Acceso al Panel Admin

### Combinación de Teclas
```
Ctrl + Shift + A
```
(En Mac: `Cmd + Shift + A`)

### Contraseña
```
12345678
```

## Funcionalidades del Panel

### 1. Gestión de Proyectos
- Agregar nuevos proyectos
- Editar proyectos existentes
- Eliminar proyectos
- Organizar por orden
- Asignar categorías

### 2. Configuración del Sitio
- **Nombre del Sitio**: Cambia "LaserArt" por tu marca
- **Icono/Emoji**: Personaliza el logo (⚡ por defecto)
- **Redes Sociales**:
  - Facebook
  - Instagram
  - Twitter/X
  - WhatsApp
  - Email

### 3. Gestión de Categorías
- Crear nuevas categorías de proyectos
- Editar categorías existentes
- Eliminar categorías
- Ordenar categorías

## Características

✅ **Autenticación con Contraseña**: Protección con contraseña fija
✅ **Acceso Oculto**: No hay botón visible, solo teclado secreto
✅ **Base de Datos**: Configuración guardada en Supabase
✅ **Actualización en Tiempo Real**: Los cambios se reflejan inmediatamente
✅ **Redes Sociales**: Iconos en el footer cuando se configuran
✅ **Categorías Dinámicas**: Crea tus propias categorías

## Cómo Usar

### Acceder al Panel
1. En cualquier página del sitio, presiona `Ctrl + Shift + A`
2. Ingresa la contraseña: `12345678`
3. Click en "Ingresar"

### Cambiar Nombre e Icono
1. Ve a la pestaña "Configuración"
2. Cambia el nombre del sitio
3. Cambia el emoji/icono
4. Click en "Guardar Configuración"
5. Los cambios se aplican inmediatamente en:
   - Título de la página (pestaña)
   - Header
   - Footer

### Agregar Redes Sociales
1. Ve a la pestaña "Configuración"
2. Llena los campos de redes sociales
3. Click en "Guardar Configuración"
4. Los iconos aparecerán automáticamente en el footer

### Agregar Proyecto
1. Ve a la pestaña "Proyectos"
2. Click en "Nuevo Proyecto"
3. Completa título, descripción, URL de imagen
4. Selecciona categoría y orden
5. Click en "Guardar"

### Crear Categoría
1. Ve a la pestaña "Categorías"
2. Click en "Nueva Categoría"
3. Llena nombre, slug y orden
4. Click en "Guardar"

## Datos Guardados en Supabase

### Tabla: `site_config`
- Configuración del sitio (nombre, icono, redes sociales)
- Se actualiza desde el panel admin

### Tabla: `projects`
- Todos los proyectos de la galería
- Incluye título, descripción, imagen, categoría, orden

### Tabla: `project_categories`
- Categorías personalizadas
- Nombre, slug, orden de visualización

## Seguridad

### Nivel de Protección
- ✅ Contraseña requerida para acceso
- ✅ Sin botón visible en la interfaz
- ✅ Combinación de teclas secreta
- ⚠️ Contraseña fija en el código (no ideal para producción)

### Para Mayor Seguridad
Si necesitas más seguridad, considera:
1. Usar Supabase Auth para autenticación real
2. Implementar roles de usuario
3. Hashear la contraseña
4. Agregar límite de intentos fallidos

## Cambiar la Contraseña

Para cambiar la contraseña por defecto:

1. Abre `/src/frontend/components/Admin.tsx`
2. En la línea 22, cambia:
```typescript
const ADMIN_PASSWORD = '12345678';
```
3. Guarda y ejecuta `npm run build`

## Solución de Problemas

### No puedo acceder con Ctrl+Shift+A
- Verifica que estés en el sitio correcto
- Intenta recargar la página (F5)
- Prueba en modo normal (no incógnito)
- En Mac, usa Cmd en lugar de Ctrl

### La contraseña no funciona
- Verifica que sea: `12345678` (8 números)
- Sin espacios al inicio o final
- Mayúsculas/minúsculas no importan (solo números)

### Los cambios no se guardan
- Verifica la conexión a Supabase
- Revisa la consola del navegador (F12)
- Verifica que las variables de entorno estén configuradas

### Las redes sociales no aparecen
- Verifica que hayas guardado la configuración
- Los iconos solo aparecen si hay al menos una URL configurada
- Recarga la página después de guardar

## Ejemplos de Configuración

### Ejemplo 1: Empresa de Grabado
```
Nombre: CustomLaser Pro
Icono: 🎨
Facebook: https://facebook.com/customlaser
Instagram: https://instagram.com/customlaser
WhatsApp: +521234567890
Email: contacto@customlaser.com
```

### Ejemplo 2: Taller Artesanal
```
Nombre: Arte y Madera
Icono: 🪵
Instagram: https://instagram.com/arteymadera
Email: info@arteymadera.com
```

### Ejemplo 3: Tienda Industrial
```
Nombre: IndustrialCut
Icono: ⚙️
Twitter: https://twitter.com/industrialcut
Email: ventas@industrialcut.com
WhatsApp: +5219876543210
```

## Ventajas vs Versión Vanilla

### Versión React (Esta)
✅ Base de datos real (Supabase)
✅ Datos sincronizados entre dispositivos
✅ Respaldo en la nube
✅ Múltiples usuarios pueden ver los mismos datos
✅ Gestión de categorías dinámicas
❌ Requiere conexión a internet
❌ Configuración más compleja

### Versión Vanilla
✅ Funciona sin internet
✅ No requiere backend
✅ Más simple de desplegar
✅ Ideal para Raspberry Pi local
❌ Datos solo en el navegador
❌ Sin sincronización
❌ Categorías fijas

## Deployment

### Firebase Hosting
La versión React requiere variables de entorno:
```bash
# Configura las variables
VITE_SUPABASE_URL=tu-url
VITE_SUPABASE_ANON_KEY=tu-key

# Build
npm run build

# Deploy
firebase deploy
```

### Vercel/Netlify
1. Conecta tu repositorio
2. Agrega variables de entorno en el dashboard
3. Deploy automático

---

**¡Panel de Administración Completo con Contraseña y Acceso Secreto!**

Presiona `Ctrl + Shift + A` y usa la contraseña `12345678` para acceder.
