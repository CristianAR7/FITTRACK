#!/bin/bash

# 🚀 Script de Instalación Automática - FitTrack + Supabase
# Para ser ejecutado por Claude Code

set -e  # Salir si hay error

echo "🎯 Iniciando integración de Supabase en FitTrack..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json"
    echo "Por favor ejecuta este script desde la raíz del proyecto FitTrack"
    exit 1
fi

echo "✅ Directorio verificado"
echo ""

# PASO 1: Instalar dependencias
echo "📦 PASO 1: Instalando dependencias de Supabase..."
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
echo "✅ Dependencias instaladas"
echo ""

# PASO 2: Crear carpeta lib si no existe
echo "📁 PASO 2: Creando estructura de carpetas..."
mkdir -p lib
echo "✅ Carpeta lib/ creada"
echo ""

# PASO 3: Crear backups de archivos a modificar
echo "💾 PASO 3: Creando backups..."
mkdir -p .backups
cp hooks/auth-context.tsx .backups/auth-context.tsx.backup 2>/dev/null || true
cp hooks/gym-data-context.tsx .backups/gym-data-context.tsx.backup 2>/dev/null || true
cp app/\(auth\)/login.tsx .backups/login.tsx.backup 2>/dev/null || true
echo "✅ Backups creados en .backups/"
echo ""

# PASO 4: Informar sobre archivos a copiar
echo "📝 PASO 4: Archivos que deben ser copiados:"
echo ""
echo "   NUEVOS ARCHIVOS:"
echo "   - .env → raíz del proyecto"
echo "   - lib/supabase.ts"
echo "   - lib/database.types.ts"
echo ""
echo "   ARCHIVOS A REEMPLAZAR:"
echo "   - hooks/auth-context.tsx"
echo "   - hooks/gym-data-context.tsx"
echo "   - app/(auth)/login.tsx"
echo "   - app/(tabs)/(home)/index.tsx"
echo "   - app/(tabs)/clients/index.tsx"
echo ""

# PASO 5: Verificación final
echo "🔍 PASO 5: Verificación..."
echo ""

if [ -d "lib" ]; then
    echo "✅ Carpeta lib/ existe"
else
    echo "❌ Carpeta lib/ NO existe"
fi

if [ -d "hooks" ]; then
    echo "✅ Carpeta hooks/ existe"
else
    echo "❌ Carpeta hooks/ NO existe"
fi

if [ -d "app/(tabs)" ]; then
    echo "✅ Estructura de tabs existe"
else
    echo "❌ Estructura de tabs NO existe"
fi

echo ""
echo "🎉 Preparación completada!"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "   1. Copiar todos los archivos proporcionados"
echo "   2. Verificar que .env existe en raíz"
echo "   3. Ejecutar: npx expo start --clear"
echo "   4. Probar login con gym@test.com / password123"
echo ""
echo "💡 Si hay errores, revisar el archivo CLAUDE_CODE_BRIEF.md"
echo ""
