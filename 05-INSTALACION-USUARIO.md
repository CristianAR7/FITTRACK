# 🚀 Guía de Instalación - FitTrack con Supabase

Esta guía te llevará paso a paso para conectar tu app a Supabase.

---

## ✅ PRE-REQUISITOS

Antes de empezar, asegúrate de tener:
- ✅ Supabase configurado (con tablas y usuarios de prueba)
- ✅ Tu app React Native/Expo funcionando
- ✅ Node.js instalado

---

## 📦 PASO 1: Instalar Dependencias

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

**¿Qué instalamos?**
- `@supabase/supabase-js`: Cliente de Supabase
- `@react-native-async-storage/async-storage`: Para guardar sesión del usuario
- `react-native-url-polyfill`: Para compatibilidad con React Native

---

## 📁 PASO 2: Crear Archivos Nuevos

### 1️⃣ Crear archivo `.env`

En la **raíz** del proyecto (al mismo nivel que `package.json`), crea un archivo llamado `.env`:

Copia el contenido del archivo **08-env.txt** que descargaste.

**⚠️ IMPORTANTE:** 
- Este archivo contiene tus credenciales
- NO lo subas a GitHub
- Asegúrate de que `.env` esté en tu `.gitignore`

---

### 2️⃣ Crear carpeta `lib` y archivos

Crea la carpeta `lib` en la raíz:

```bash
mkdir lib
```

Luego copia:
- **09-supabase.txt** → `lib/supabase.ts`
- **10-database-types.txt** → `lib/database.types.ts`

---

## 🔄 PASO 3: Reemplazar Archivos Existentes

### 1️⃣ Reemplazar `hooks/auth-context.tsx`

**IMPORTANTE:** Haz backup del archivo original primero.

```bash
# Opcional: crear backup
cp hooks/auth-context.tsx hooks/auth-context.tsx.backup
```

Luego copia **11-auth-context.txt** como `hooks/auth-context.tsx`

---

### 2️⃣ Reemplazar `hooks/gym-data-context.tsx`

```bash
# Opcional: crear backup
cp hooks/gym-data-context.tsx hooks/gym-data-context.tsx.backup
```

Copia **12-gym-data-context.txt** como `hooks/gym-data-context.tsx`

---

### 3️⃣ Reemplazar `app/(auth)/login.tsx`

```bash
# Opcional: crear backup
cp app/(auth)/login.tsx app/(auth)/login.tsx.backup
```

Copia **13-login.txt** como `app/(auth)/login.tsx`

---

### 4️⃣ Reemplazar `app/(tabs)/(home)/index.tsx`

```bash
# Opcional: crear backup
cp app/(tabs)/(home)/index.tsx app/(tabs)/(home)/index.tsx.backup
```

Copia **14-home-index.txt** como `app/(tabs)/(home)/index.tsx`

---

### 5️⃣ Reemplazar `app/(tabs)/clients/index.tsx`

```bash
# Opcional: crear backup
cp app/(tabs)/clients/index.tsx app/(tabs)/clients/index.tsx.backup
```

Copia **15-clients-index.txt** como `app/(tabs)/clients/index.tsx`

---

## 🧪 PASO 4: Probar la App

### 1️⃣ Reiniciar el servidor

```bash
# Para el servidor si está corriendo (Ctrl+C)
# Luego inicia de nuevo:
npx expo start --clear
```

### 2️⃣ Usar credenciales de prueba

En la pantalla de login, usa:

**Para Gym:**
- Email: `gym@test.com`
- Password: `password123`

**Para Cliente:**
- Email: `cliente@test.com`
- Password: `password123`

**Para Master:**
- Email: `master@test.com`
- Password: `password123`

---

## ✅ VERIFICACIÓN

Después de hacer login, deberías ver:

1. ✅ Dashboard con estadísticas reales de Supabase
2. ✅ Tu nombre de usuario en la parte superior
3. ✅ Número real de clientes, rutinas y dietas
4. ✅ Lista de clientes (si hay datos en Supabase)

---

## 🐛 PROBLEMAS COMUNES

### Error: "Cannot find module '@supabase/supabase-js'"
**Solución:** Ejecuta `npm install @supabase/supabase-js`

### Error: "EXPO_PUBLIC_SUPABASE_URL is undefined"
**Solución:** 
1. Verifica que el archivo `.env` esté en la raíz
2. Reinicia el servidor con `npx expo start --clear`

### La app no muestra datos
**Solución:**
1. Verifica que hayas ejecutado el SQL en Supabase
2. Verifica que los usuarios de prueba existan
3. Revisa la consola para errores

### Error de autenticación
**Solución:**
1. Ve a Supabase > Authentication > Users
2. Verifica que los usuarios existan
3. Intenta resetear la contraseña desde Supabase

---

## 📚 SIGUIENTES PASOS

Una vez que todo funcione:

1. ✅ Crear más clientes desde Supabase
2. ✅ Agregar rutinas y dietas
3. ✅ Explorar las diferentes pantallas
4. ✅ Personalizar el diseño según tus necesidades

---

¡Listo! 🎉 Tu app ahora está conectada a Supabase y funcionando con datos reales.
