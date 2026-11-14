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

✅ **¡Ya configurado automáticamente!**

El proyecto ya está conectado a Supabase con:
- Proyecto: JLTOOLS2
- Tabla: apps (con RLS habilitado)
- Storage: app-images (bucket público)
- Políticas: CRUD completo habilitado para acceso público

No necesitas configurar nada adicional. Simplemente abre la página y empieza a usarla.

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
