# JLTOOLS2

Página web moderna con diseño Liquid Glass de Apple para gestionar y mostrar aplicaciones.

## Características

- 🎨 Diseño Liquid Glass (estilo Apple)
- 🌙 Modo oscuro/claro
- ⏰ Reloj en tiempo real
- 📱 Responsive (PC y Android TV)
- ⚡ Optimizado para navegadores básicos/lentos
- 🗄️ Integración con Supabase
- ➕ Subir nuevas apps
- ✏️ Editar apps existentes
- ☑️ Selección múltiple para eliminar
- 🔗 Cards clickeables que llevan al link de descarga

## Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto

### 2. Crear tabla "apps"

En el dashboard de Supabase, ve a SQL Editor y ejecuta:

```sql
CREATE TABLE apps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Crear bucket de almacenamiento para imágenes

1. Ve a Storage en el dashboard de Supabase
2. Crea un nuevo bucket llamado "app-images"
3. Configura el bucket como público
4. Agrega una política de bucket:

```sql
-- Habilitar acceso público
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-images', 'app-images', true);

-- Política para subir archivos
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'app-images');

-- Política para ver archivos
CREATE POLICY "Public View"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'app-images');
```

### 4. Habilitar RLS (Row Level Security)

```sql
-- Habilitar RLS
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

-- Política para leer apps
CREATE POLICY "Public Read"
ON apps FOR SELECT
TO anon
USING (true);

-- Política para insertar apps
CREATE POLICY "Public Insert"
ON apps FOR INSERT
TO anon
WITH CHECK (true);

-- Política para actualizar apps
CREATE POLICY "Public Update"
ON apps FOR UPDATE
TO anon
USING (true);

-- Política para eliminar apps
CREATE POLICY "Public Delete"
ON apps FOR DELETE
TO anon
USING (true);
```

### 5. Obtener credenciales

1. Ve a Settings > API en tu proyecto Supabase
2. Copia tu `Project URL` y `anon public key`

### 6. Configurar el proyecto

Abre `script.js` y reemplaza:

```javascript
const SUPABASE_URL = 'TU_SUPABASE_URL';
const SUPABASE_KEY = 'TU_SUPABASE_ANON_KEY';
```

Con tus credenciales reales:

```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_KEY = 'tu-anon-key-aqui';
```

## Uso

### Local

1. Abre `index.html` en tu navegador
2. O usa un servidor local como:
   ```bash
   python -m http.server 8000
   # o
   npx serve
   ```

### Despliegue

Puedes desplegar en:
- GitHub Pages
- Netlify
- Vercel
- Cualquier hosting estático

## Colores

- Negro: `#000000`
- Rojo: `#ff0000`
- Azul: `#0000ff`

## Optimizaciones

- CSS minimalista para carga rápida
- Sin frameworks pesados
- Backdrop-filter con fallback para navegadores básicos
- Imágenes cargadas bajo demanda
- Código JavaScript optimizado

## Licencia

MIT
