# TimeCapsule - Tu Legado Digital

Una aplicación web moderna para crear y preservar tu legado digital a través de videos anuales. TimeCapsule te permite grabar videos de un minuto cada año, creando una cápsula del tiempo digital que se enviará a tus seres queridos cuando llegue el momento apropiado.

## 🌟 Características Principales

- **Grabación Anual**: Graba un video de un minuto cada año para documentar tu crecimiento
- **Sistema de Legado**: Configura contactos de confianza para activar el envío cuando sea necesario
- **Check-in Anual**: Sistema de verificación para confirmar que estás bien
- **Códigos QR**: Genera códigos QR para lápidas que conecten con tu legado
- **Seguridad Máxima**: Encriptación de extremo a extremo y almacenamiento seguro
- **Compilación Automática**: Videos se compilan automáticamente en un recuerdo final
- **PWA**: Instalable como aplicación móvil
- **Diseño Responsive**: Funciona perfectamente en móviles, tablets y desktop

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Iconos**: Lucide React
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

## 📱 Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+ 
- pnpm (recomendado) o npm

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/timecapsule-app.git
cd timecapsule-app
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Ejecuta el servidor de desarrollo:
```bash
pnpm dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Scripts Disponibles

- `pnpm dev` - Ejecuta el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm start` - Ejecuta la aplicación en modo producción
- `pnpm lint` - Ejecuta el linter

## 🌐 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno si es necesario
3. ¡Listo! Tu aplicación se desplegará automáticamente

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

## 📁 Estructura del Proyecto

```
timecapsule-app/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   ├── privacy/           # Política de privacidad
│   ├── terms/             # Términos y condiciones
│   └── about/             # Página Acerca de
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI (shadcn/ui)
│   └── video-recorder.tsx # Componente de grabación
├── lib/                  # Utilidades y configuraciones
├── public/               # Archivos estáticos
│   ├── manifest.json     # PWA manifest
│   ├── robots.txt        # SEO
│   └── favicon.ico       # Icono de la aplicación
└── styles/               # Estilos globales
```

## 🔒 Seguridad y Privacidad

- **Encriptación**: Todos los videos se encriptan de extremo a extremo
- **Almacenamiento Seguro**: Utilizamos servicios de almacenamiento seguros
- **Privacidad**: Tu contenido nunca se comparte sin tu autorización
- **GDPR**: Cumplimos con las regulaciones de protección de datos

## 📄 Páginas Legales

- [Política de Privacidad](/privacy)
- [Términos y Condiciones](/terms)
- [Acerca de](/about)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

- **Email**: support@timecapsule-app.com
- **Documentación**: [docs.timecapsule-app.com](https://docs.timecapsule-app.com)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/timecapsule-app/issues)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) por los componentes de UI
- [Vercel](https://vercel.com/) por el hosting y deployment
- [Next.js](https://nextjs.org/) por el framework
- [Tailwind CSS](https://tailwindcss.com/) por los estilos

---

**TimeCapsule** - Preservando legados digitales para las futuras generaciones ❤️

Commit directly to the main branch
