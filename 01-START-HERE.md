# ▶️ START HERE - EMPIEZA AQUÍ

## 🎯 Para Claude Code

---

## ✅ LO QUE TIENES QUE HACER (RESUMEN ULTRA-SIMPLE)

### 1️⃣ LEE ESTOS 3 ARCHIVOS (EN ORDEN):
```
1. 02-README.md          ← Visión general
2. 03-BRIEF-COMPLETO.md  ← Contexto completo
3. 04-INSTRUCCIONES.md   ← Pasos exactos
```

### 2️⃣ EJECUTA ESTO:
```bash
cd /ruta/al/proyecto/FitTrack
chmod +x 07-install.sh
./07-install.sh
```

### 3️⃣ COPIA ESTOS ARCHIVOS:

**NUEVOS (Crear):**
```
08-env.txt           → .env (en raíz del proyecto)
09-supabase.txt      → lib/supabase.ts
10-database-types.txt → lib/database.types.ts
```

**ACTUALIZAR (Reemplazar):**
```
11-auth-context.txt     → hooks/auth-context.tsx
12-gym-data-context.txt → hooks/gym-data-context.tsx
13-login.txt            → app/(auth)/login.tsx
14-home-index.txt       → app/(tabs)/(home)/index.tsx
15-clients-index.txt    → app/(tabs)/clients/index.tsx
```

### 4️⃣ PRUEBA:
```bash
npx expo start --clear

# Login con:
# gym@test.com / password123
```

---

## 🎯 OBJETIVO

Integrar Supabase en FitTrack - Todo debe funcionar automáticamente sin intervención del usuario.

---

## ⏱️ TIEMPO ESTIMADO

35 minutos total

---

## 📋 CHECKLIST RÁPIDO

- [ ] Leer documentación (10 min)
- [ ] Ejecutar install.sh (5 min)
- [ ] Copiar archivos (10 min)
- [ ] Probar app (10 min)

---

## ✅ ÉXITO = 

- App inicia sin errores
- Login funciona
- Dashboard muestra datos reales
- Clientes muestra lista desde BD

---

**¿Dudas? → Lee 04-INSTRUCCIONES.md**

**¡Adelante! 🚀**
