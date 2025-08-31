# 🚀 Guía de Despliegue - TimeCapsule

## Despliegue en Vercel (Recomendado)

### 1. Preparación del Repositorio

1. **Crea un repositorio en GitHub:**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit: TimeCapsule app"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/timecapsule-app.git
   git push -u origin main
   \`\`\`

2. **Configura el repositorio:**
   - Ve a [GitHub](https://github.com) y crea un nuevo repositorio
   - Sube tu código usando los comandos anteriores

### 2. Despliegue en Vercel

1. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta de GitHub
   - Haz clic en "New Project"
   - Importa tu repositorio de TimeCapsule

2. **Configuración del proyecto:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (por defecto)
   - **Build Command:** `pnpm build` (se detecta automáticamente)
   - **Output Directory:** `.next` (por defecto)
   - **Install Command:** `pnpm install` (se detecta automáticamente)

3. **Variables de entorno (opcional):**
   \`\`\`
   NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
   \`\`\`

4. **Haz clic en "Deploy"**

### 3. Configuración Post-Despliegue

1. **Dominio personalizado (opcional):**
   - En el dashboard de Vercel, ve a "Settings" > "Domains"
   - Agrega tu dominio personalizado
   - Configura los registros DNS según las instrucciones

2. **Configuración de SEO:**
   - Actualiza el `metadataBase` en `app/layout.tsx` con tu URL real
   - Actualiza el sitemap en `app/sitemap.ts` con tu URL real

## 🌐 Otros Proveedores de Hosting

### Netlify
1. Conecta tu repositorio de GitHub
2. Configuración:
   - Build command: `pnpm build`
   - Publish directory: `.next`
   - Node version: 18

### Railway
1. Conecta tu repositorio
2. Configuración automática para Next.js

### DigitalOcean App Platform
1. Conecta tu repositorio
2. Selecciona Next.js como framework

## 📱 Configuración PWA

### 1. Generar Iconos Reales

Usa [Favicon Generator](https://realfavicongenerator.net/) para crear:

- `public/favicon.ico` (16x16, 32x32, 48x48)
- `public/icon-192x192.png`
- `public/icon-512x512.png`
- `public/apple-touch-icon.png`
- `public/og-image.png` (1200x630)

### 2. Actualizar Manifest

Verifica que `public/manifest.json` tenga las rutas correctas a tus iconos.

## 🔍 SEO y Analytics

### 1. Google Analytics
1. Crea una cuenta en [Google Analytics](https://analytics.google.com)
2. Obtén tu ID de medición
3. Agrega el script en `app/layout.tsx`

### 2. Google Search Console
1. Verifica tu propiedad en [Search Console](https://search.google.com/search-console)
2. Actualiza el código de verificación en `app/layout.tsx`

### 3. Sitemap
El sitemap se genera automáticamente en `/sitemap.xml`

## 🛡️ Seguridad

### 1. Headers de Seguridad
Ya configurados en `vercel.json`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### 2. HTTPS
Vercel proporciona HTTPS automáticamente

## 📊 Monitoreo

### 1. Vercel Analytics
Ya configurado en `app/layout.tsx`

### 2. Logs
- Ve a tu dashboard de Vercel
- Sección "Functions" para ver logs de API
- Sección "Analytics" para métricas

## 🔄 Actualizaciones

### 1. Despliegue Automático
- Cada push a `main` despliega automáticamente
- Pull requests crean preview deployments

### 2. Rollback
- En el dashboard de Vercel, ve a "Deployments"
- Haz clic en "Revert" para volver a una versión anterior

## 📞 Soporte

Si tienes problemas:

1. **Logs de build:** Revisa los logs en Vercel
2. **Errores locales:** Ejecuta `pnpm build` localmente
3. **Documentación:** [Next.js](https://nextjs.org/docs) y [Vercel](https://vercel.com/docs)

## 🎉 ¡Listo!

Tu aplicación TimeCapsule estará disponible en:
- **URL de Vercel:** `https://tu-proyecto.vercel.app`
- **URL personalizada:** `https://tu-dominio.com` (si configuraste dominio)

¡Comparte la URL con tus amigos para que prueben la aplicación!
