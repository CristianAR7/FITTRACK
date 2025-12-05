# 🎯 PROYECTO: Integración de Supabase en FitTrack
## Brief Completo para Claude Code

---

## 📋 RESUMEN EJECUTIVO

**Proyecto:** FitTrack - App de gestión de gimnasios
**Objetivo:** Reemplazar datos mock por integración real con Supabase
**Cliente:** Cristian (sin conocimientos de programación)
**Prioridad:** Alta - Necesita solución funcionando sin intervención manual

---

## 🎯 OBJETIVO PRINCIPAL

Integrar Supabase como backend de la aplicación React Native/Expo existente, reemplazando completamente el sistema de datos mock por consultas reales a la base de datos.

### Resultados Esperados:
1. ✅ Autenticación real funcionando con Supabase Auth
2. ✅ Datos del gimnasio cargados desde Supabase
3. ✅ Lista de clientes desde base de datos real
4. ✅ Dashboard con estadísticas reales
5. ✅ Login funcional con credenciales de prueba

---

## 📊 ESTADO ACTUAL

### ✅ COMPLETADO:
- Base de datos Supabase configurada con 14 tablas
- Row Level Security (RLS) implementado
- Usuarios de prueba creados:
  * Master: master@test.com / password123
  * Gym: gym@test.com / password123
  * Cliente: cliente@test.com / password123
- Schema SQL ejecutado exitosamente
- Proyecto React Native/Expo existente con estructura completa

### ⏳ PENDIENTE:
- Instalar dependencias de Supabase
- Crear archivos de configuración
- Actualizar contexts (Auth y GymData)
- Actualizar pantallas para usar datos reales
- Testear integración completa

---

## 🗂️ ESTRUCTURA DEL PROYECTO ACTUAL

```
FitTrack/
├── app/
│   ├── (auth)/
│   │   └── login.tsx                    ← ACTUALIZAR
│   ├── (tabs)/
│   │   ├── (home)/
│   │   │   └── index.tsx                ← ACTUALIZAR
│   │   ├── clients/
│   │   │   └── index.tsx                ← ACTUALIZAR
│   │   ├── routines/
│   │   │   └── index.tsx
│   │   ├── diets/
│   │   │   └── index.tsx
│   │   └── _layout.tsx
│   └── _layout.tsx
├── hooks/
│   ├── auth-context.tsx                 ← ACTUALIZAR
│   └── gym-data-context.tsx             ← ACTUALIZAR
├── components/
├── lib/                                 ← CREAR CARPETA
│   ├── supabase.ts                      ← CREAR
│   └── database.types.ts                ← CREAR
├── .env                                 ← CREAR
├── package.json
└── app.json
```

---

## 🔐 CREDENCIALES DE SUPABASE

### URL del Proyecto:
```
https://snkadrnzgvelmncuxhqq.supabase.co
```

### Anon Key:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNua2Fkcm56Z3ZlbG1uY3V4aHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyOTYwODAsImV4cCI6MjA3ODg3MjA4MH0.gaXDpidEVJkxCsaVY9LFIKFTL88IYgB9T2mqx--ebBw
```

### Credenciales de Prueba:
- **Gym:** gym@test.com / password123
- **Cliente:** cliente@test.com / password123
- **Master:** master@test.com / password123

---

## 📝 ESQUEMA DE BASE DE DATOS

### Tablas Principales:
1. **profiles** - Perfiles de usuario (con role: master/gym/client)
2. **gyms** - Información de gimnasios
3. **clients** - Clientes asociados a gimnasios
4. **exercises** - Catálogo de ejercicios
5. **routines** - Rutinas de entrenamiento
6. **routine_days** - Días de la rutina
7. **routine_exercises** - Ejercicios por día
8. **diets** - Planes nutricionales
9. **diet_meals** - Comidas del plan
10. **progress_logs** - Registro de progreso físico
11. **workout_logs** - Registro de entrenamientos

### Relaciones Clave:
- profiles.gym_id → gyms.id
- clients.gym_id → gyms.id
- clients.profile_id → profiles.id
- routines.gym_id → gyms.id
- routines.client_id → clients.id

---

## 🛠️ TECNOLOGÍAS DEL PROYECTO

### Stack Principal:
- **Framework:** React Native / Expo
- **Router:** Expo Router (file-based routing)
- **Lenguaje:** TypeScript
- **Estilos:** NativeWind (Tailwind para RN)
- **Estado:** Zustand (state management)
- **Backend:** Supabase (PostgreSQL)

### Dependencias a Instalar:
```json
{
  "@supabase/supabase-js": "^2.39.0",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "react-native-url-polyfill": "^2.0.0"
}
```

---

## 📦 ARCHIVOS A CREAR/MODIFICAR

### NUEVOS ARCHIVOS (Crear):

#### 1. `.env` (en raíz)
```env
EXPO_PUBLIC_SUPABASE_URL=https://snkadrnzgvelmncuxhqq.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNua2Fkcm56Z3ZlbG1uY3V4aHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyOTYwODAsImV4cCI6MjA3ODg3MjA4MH0.gaXDpidEVJkxCsaVY9LFIKFTL88IYgB9T2mqx--ebBw
```

#### 2. `lib/supabase.ts`
Ver archivo adjunto: supabase.ts

#### 3. `lib/database.types.ts`
Ver archivo adjunto: database.types.ts

### ARCHIVOS A ACTUALIZAR:

#### 4. `hooks/auth-context.tsx`
Ver archivo adjunto: auth-context.tsx

#### 5. `hooks/gym-data-context.tsx`
Ver archivo adjunto: gym-data-context.tsx

#### 6. `app/(auth)/login.tsx`
Ver archivo adjunto: login.tsx

#### 7. `app/(tabs)/(home)/index.tsx`
Ver archivo adjunto: home-index.tsx

#### 8. `app/(tabs)/clients/index.tsx`
Ver archivo adjunto: clients-index.tsx

---

## 🎬 PASOS DE EJECUCIÓN PARA CLAUDE CODE

### FASE 1: Preparación (5 min)
```bash
# 1. Verificar estructura del proyecto
# 2. Crear backup de archivos a modificar
# 3. Instalar dependencias
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

### FASE 2: Crear Nuevos Archivos (5 min)
```bash
# 1. Crear carpeta lib/
mkdir -p lib

# 2. Crear .env en raíz
# 3. Crear lib/supabase.ts
# 4. Crear lib/database.types.ts
```

### FASE 3: Actualizar Archivos Existentes (10 min)
```bash
# 1. Reemplazar hooks/auth-context.tsx
# 2. Reemplazar hooks/gym-data-context.tsx
# 3. Reemplazar app/(auth)/login.tsx
# 4. Reemplazar app/(tabs)/(home)/index.tsx
# 5. Reemplazar app/(tabs)/clients/index.tsx
```

### FASE 4: Verificación (5 min)
```bash
# 1. Verificar imports
# 2. Verificar sintaxis TypeScript
# 3. Limpiar caché y reiniciar
npx expo start --clear
```

---

## ✅ CRITERIOS DE ÉXITO

La integración será exitosa cuando:

1. ✅ La app inicia sin errores
2. ✅ Login funciona con gym@test.com / password123
3. ✅ Dashboard muestra nombre del usuario logueado
4. ✅ Dashboard muestra estadísticas reales desde Supabase
5. ✅ Pantalla de clientes muestra lista desde base de datos
6. ✅ No hay errores en consola relacionados con Supabase
7. ✅ Refresh/pull-to-refresh actualiza los datos correctamente

---

## 🚨 POSIBLES PROBLEMAS Y SOLUCIONES

### Problema 1: "Cannot find module '@supabase/supabase-js'"
**Solución:** 
```bash
npm install @supabase/supabase-js --save
```

### Problema 2: "EXPO_PUBLIC_SUPABASE_URL is undefined"
**Solución:**
- Verificar que .env existe en raíz
- Reiniciar servidor: `npx expo start --clear`

### Problema 3: Error de autenticación
**Solución:**
- Verificar credenciales en Supabase Dashboard
- Verificar que RLS policies permiten acceso
- Revisar que usuarios existen en auth.users

### Problema 4: No se cargan datos
**Solución:**
- Verificar queries en Supabase Dashboard
- Revisar que gym_id existe en profiles
- Verificar relaciones entre tablas

---

## 📊 DATOS DE PRUEBA EN SUPABASE

### Usuarios Creados:
1. **Master**
   - ID: Generado automáticamente
   - Email: master@test.com
   - Role: master
   - Password: password123

2. **Gym**
   - ID: Generado automáticamente
   - Email: gym@test.com
   - Role: gym
   - Gym_id: Asociado a gimnasio "Test Gym"
   - Password: password123

3. **Cliente**
   - ID: Generado automáticamente
   - Email: cliente@test.com
   - Role: client
   - Gym_id: Asociado a "Test Gym"
   - Password: password123

### Gimnasio de Prueba:
- Nombre: "Test Gym"
- Descripción: "Gimnasio de prueba para desarrollo"

---

## 🎯 COMPORTAMIENTO ESPERADO POR ROL

### Usuario GYM:
- Ve dashboard con sus estadísticas
- Ve lista de SUS clientes
- Ve SUS rutinas y dietas
- No ve datos de otros gimnasios

### Usuario CLIENTE:
- Ve su propio progreso
- Ve su rutina asignada
- Ve su dieta asignada
- No ve datos de otros clientes

### Usuario MASTER:
- Ve todos los gimnasios
- Ve todos los clientes (de todos los gyms)
- Ve dashboard global
- Acceso completo a todos los datos

---

## 🔒 SEGURIDAD - ROW LEVEL SECURITY (RLS)

Ya implementado en Supabase:

### Policies Activas:
- **profiles:** Los usuarios ven solo su perfil
- **gyms:** Los gym ven solo su gimnasio
- **clients:** Los gym ven solo sus clientes
- **routines:** Los gym ven solo rutinas de sus clientes
- **diets:** Los gym ven solo dietas de sus clientes

### Excepciones:
- **Master role:** Tiene acceso a TODO (bypass RLS)

---

## 📱 TESTING POST-INTEGRACIÓN

### Test 1: Login Gym
1. Abrir app
2. Email: gym@test.com
3. Password: password123
4. ✅ Debe redirigir a dashboard
5. ✅ Debe mostrar "Bienvenido [nombre]"

### Test 2: Ver Estadísticas
1. En dashboard
2. ✅ Debe mostrar Total Clientes > 0
3. ✅ Debe mostrar Clientes Activos
4. ✅ Debe mostrar nombre del gimnasio

### Test 3: Ver Clientes
1. Ir a tab "Clientes"
2. ✅ Debe mostrar lista de clientes
3. ✅ Cada cliente muestra status (Activo/Inactivo)
4. ✅ Muestra email del cliente

### Test 4: Logout
1. Click en "Salir"
2. ✅ Debe volver a pantalla de login
3. ✅ No debe mostrar datos del usuario anterior

---

## 🔄 FLUJO DE AUTENTICACIÓN

```
1. Usuario ingresa email/password
   ↓
2. AuthContext llama supabase.auth.signInWithPassword()
   ↓
3. Si exitoso, Supabase devuelve session
   ↓
4. AuthContext carga profile desde tabla profiles
   ↓
5. GymDataContext detecta profile y carga datos del gym
   ↓
6. Usuario ve dashboard con datos reales
```

---

## 📝 NOTAS IMPORTANTES

### Para Claude Code:
- El proyecto YA EXISTE, no crear nuevo proyecto
- Mantener TODA la estructura existente
- Solo modificar los archivos especificados
- NO cambiar estilos ni componentes UI
- Respetar naming conventions existentes
- Mantener comentarios en español

### Restricciones:
- NO usar estados globales adicionales
- NO agregar librerías no especificadas
- NO modificar navegación existente
- NO cambiar estructura de carpetas base

### Prioridades:
1. 🔥 Funcionalidad PRIMERO
2. 💪 Código limpio y legible
3. 🎨 Mantener estilos existentes
4. 📱 Experiencia de usuario fluida

---

## 🎓 CONTEXTO DEL CLIENTE

**Cristian:**
- Sin conocimientos de programación
- No tiene tiempo para aprender desarrollo
- Necesita solución que "funcione" sin intervención
- Trabaja en oficina durante el día
- Prefiere soluciones completas vs incrementales

**Por lo tanto:**
- Código debe ser robusto y sin errores
- Comentarios claros en español
- Logging mínimo en consola
- Manejo de errores user-friendly
- No asumir conocimiento técnico

---

## 🚀 COMANDO FINAL DE VERIFICACIÓN

Después de completar todo, ejecutar:

```bash
# 1. Limpiar todo
rm -rf node_modules
npm install

# 2. Reinstalar dependencias
npm install

# 3. Limpiar caché de Expo
npx expo start --clear

# 4. Verificar que no hay errores TypeScript
npx tsc --noEmit
```

---

## ✨ RESULTADO FINAL ESPERADO

Al completar esta integración, el cliente podrá:
1. ✅ Abrir la app
2. ✅ Hacer login con credenciales de prueba
3. ✅ Ver su dashboard personalizado
4. ✅ Ver lista real de clientes desde Supabase
5. ✅ Navegar entre pantallas sin errores
6. ✅ Hacer logout correctamente

**TODO esto sin tener que tocar código manualmente.**

---

## 📞 CONTACTO

Si hay dudas o problemas durante la integración:
- Revisar logs en consola
- Verificar Supabase Dashboard
- Consultar documentación de Supabase
- Preguntar a Cristian sobre comportamiento esperado

---

**Fecha de creación:** Diciembre 2024
**Versión:** 1.0
**Estado:** Listo para ejecución por Claude Code

---

FIN DEL BRIEF
