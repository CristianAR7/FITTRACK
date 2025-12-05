# 🤖 INSTRUCCIONES PARA CLAUDE CODE

## 🎯 MISIÓN
Integrar Supabase en la aplicación FitTrack de React Native/Expo, reemplazando datos mock por datos reales de base de datos PostgreSQL.

---

## 📦 ARCHIVOS INCLUIDOS EN ESTE PAQUETE

1. **CLAUDE_CODE_BRIEF.md** - Contexto completo del proyecto
2. **install.sh** - Script de preparación automática
3. **env.txt** - Archivo .env listo para copiar
4. **supabase.ts** - Cliente de Supabase
5. **database.types.ts** - Tipos TypeScript de la BD
6. **auth-context.tsx** - Context de autenticación actualizado
7. **gym-data-context.tsx** - Context de datos actualizado
8. **login.tsx** - Pantalla de login actualizada
9. **home-index.tsx** - Dashboard actualizado
10. **clients-index.tsx** - Pantalla de clientes actualizada
11. **INSTALACION.md** - Guía para el usuario
12. **Este archivo** - Instrucciones para ti

---

## 🚀 PROCESO DE EJECUCIÓN

### FASE 1: RECONOCIMIENTO (2 min)
```bash
# 1. Verificar que estás en el proyecto FitTrack
ls -la package.json

# 2. Verificar estructura del proyecto
ls -la app/ hooks/ components/

# 3. Revisar package.json actual
cat package.json
```

### FASE 2: PREPARACIÓN (5 min)
```bash
# 1. Ejecutar script de instalación
chmod +x install.sh
./install.sh

# 2. Verificar que dependencias se instalaron
npm list @supabase/supabase-js
npm list @react-native-async-storage/async-storage
npm list react-native-url-polyfill
```

### FASE 3: COPIAR ARCHIVOS NUEVOS (3 min)
```bash
# 1. Copiar .env a raíz
cp env.txt .env

# 2. Crear y copiar archivos en lib/
cp supabase.ts lib/supabase.ts
cp database.types.ts lib/database.types.ts
```

### FASE 4: ACTUALIZAR ARCHIVOS EXISTENTES (10 min)
```bash
# IMPORTANTE: Los archivos originales ya tienen backup en .backups/

# 1. Actualizar auth context
cp auth-context.tsx hooks/auth-context.tsx

# 2. Actualizar gym data context
cp gym-data-context.tsx hooks/gym-data-context.tsx

# 3. Actualizar login
cp login.tsx app/\(auth\)/login.tsx

# 4. Actualizar dashboard
cp home-index.tsx app/\(tabs\)/\(home\)/index.tsx

# 5. Actualizar clientes
cp clients-index.tsx app/\(tabs\)/clients/index.tsx
```

### FASE 5: VERIFICACIÓN (5 min)
```bash
# 1. Verificar que todos los archivos existen
test -f .env && echo "✅ .env existe"
test -f lib/supabase.ts && echo "✅ supabase.ts existe"
test -f lib/database.types.ts && echo "✅ database.types.ts existe"

# 2. Verificar imports (buscar errores)
npx tsc --noEmit

# 3. Limpiar caché
npx expo start --clear
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de dar por completado el trabajo, verificar:

### Archivos Creados:
- [ ] `.env` existe en raíz con credenciales correctas
- [ ] `lib/supabase.ts` existe y tiene configuración correcta
- [ ] `lib/database.types.ts` existe con todos los tipos

### Archivos Actualizados:
- [ ] `hooks/auth-context.tsx` usa supabase en lugar de mock
- [ ] `hooks/gym-data-context.tsx` usa supabase en lugar de mock
- [ ] `app/(auth)/login.tsx` tiene formulario de login funcional
- [ ] `app/(tabs)/(home)/index.tsx` muestra datos reales
- [ ] `app/(tabs)/clients/index.tsx` muestra clientes reales

### Dependencias:
- [ ] `@supabase/supabase-js` instalado
- [ ] `@react-native-async-storage/async-storage` instalado
- [ ] `react-native-url-polyfill` instalado

### Backups:
- [ ] Archivos originales respaldados en `.backups/`

---

## 🧪 TESTING

### Test Básico:
```bash
# 1. Iniciar app
npx expo start --clear

# 2. Verificar que no hay errores de compilación
# 3. Verificar que no hay errores en consola
```

### Test de Login:
```
1. Abrir app en simulador/dispositivo
2. Ingresar: gym@test.com
3. Password: password123
4. Presionar "Iniciar Sesión"
5. ✅ Debe redirigir a dashboard
6. ✅ Dashboard debe mostrar nombre del usuario
7. ✅ Dashboard debe mostrar estadísticas (números reales)
```

### Test de Navegación:
```
1. Ir a tab "Clientes"
2. ✅ Debe mostrar lista de clientes
3. ✅ Clientes deben tener nombre, email y status
4. Pull to refresh
5. ✅ Debe actualizar datos
```

### Test de Logout:
```
1. Click en botón "Salir"
2. ✅ Debe volver a pantalla de login
3. ✅ Datos del usuario no deben persistir
```

---

## 🐛 RESOLUCIÓN DE PROBLEMAS

### Problema: "Cannot find module '@supabase/supabase-js'"
```bash
# Solución:
npm install @supabase/supabase-js --save
npx expo start --clear
```

### Problema: ".env no carga las variables"
```bash
# Solución:
# 1. Verificar que .env está en raíz (mismo nivel que package.json)
# 2. Reiniciar servidor completamente
npx expo start --clear
```

### Problema: "Error de autenticación"
```bash
# Solución:
# 1. Verificar credenciales en .env
# 2. Verificar que usuarios existen en Supabase
# 3. Probar login directamente en Supabase Dashboard
```

### Problema: "No se cargan datos"
```bash
# Solución:
# 1. Verificar consola para ver errores específicos
# 2. Revisar que gym_id existe en profile del usuario
# 3. Verificar RLS policies en Supabase
```

---

## 📊 CRITERIOS DE ÉXITO

La integración es exitosa si:

1. ✅ App inicia sin errores de compilación
2. ✅ Login funciona con gym@test.com / password123
3. ✅ Dashboard muestra datos reales desde Supabase
4. ✅ Pantalla de clientes muestra lista desde BD
5. ✅ No hay errores en consola de React Native
6. ✅ Pull-to-refresh actualiza datos correctamente
7. ✅ Logout funciona y limpia sesión

---

## 📝 REPORTE FINAL

Al completar el trabajo, genera un reporte con:

### Resumen:
- Archivos creados
- Archivos modificados
- Dependencias instaladas
- Problemas encontrados y solucionados

### Estado Final:
- ✅ Integración completada
- ✅ Tests pasados
- ✅ Sin errores en consola
- ✅ App funcional

### Próximos Pasos para el Cliente:
1. Abrir proyecto
2. Ejecutar `npx expo start`
3. Probar login
4. Explorar funcionalidades

---

## 🎯 ENFOQUE

**Recuerda:**
- Prioridad = Funcionalidad
- Cliente no tiene conocimientos técnicos
- Debe funcionar "out of the box"
- Código limpio y comentado en español
- Manejo de errores user-friendly

---

## 🆘 SI ALGO FALLA

1. Revisar CLAUDE_CODE_BRIEF.md para contexto completo
2. Verificar logs en consola
3. Revisar que credenciales son correctas
4. Verificar estructura del proyecto coincide con esperado
5. Hacer rollback con archivos en .backups/ si es necesario

---

**¡Buena suerte! 🚀**

El cliente confía en que esto funcionará sin su intervención.
