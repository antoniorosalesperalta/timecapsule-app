#!/bin/bash

# 🚀 Script de Despliegue Rápido - TimeCapsule
# Este script te ayuda a desplegar tu aplicación rápidamente

echo "🚀 Iniciando despliegue de TimeCapsule..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Verificar que pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo "📦 Instalando pnpm..."
    npm install -g pnpm
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install

# Verificar que el build funciona
echo "🔨 Verificando build..."
if pnpm build; then
    echo "✅ Build exitoso!"
else
    echo "❌ Error en el build. Revisa los errores arriba."
    exit 1
fi

# Verificar si git está inicializado
if [ ! -d ".git" ]; then
    echo "📝 Inicializando repositorio Git..."
    git init
    git add .
    git commit -m "Initial commit: TimeCapsule app"
    echo "💡 Recuerda agregar tu repositorio remoto:"
    echo "   git remote add origin https://github.com/tu-usuario/timecapsule-app.git"
    echo "   git push -u origin main"
fi

echo ""
echo "🎉 ¡Preparación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Crea un repositorio en GitHub"
echo "2. Sube tu código: git push -u origin main"
echo "3. Ve a vercel.com y conecta tu repositorio"
echo "4. ¡Tu app estará lista en minutos!"
echo ""
echo "📖 Para más detalles, consulta deploy.md"
echo ""
echo "🌐 URLs importantes:"
echo "- Vercel: https://vercel.com"
echo "- GitHub: https://github.com"
echo "- Favicon Generator: https://realfavicongenerator.net"
