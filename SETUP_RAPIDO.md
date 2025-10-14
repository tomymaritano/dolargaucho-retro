# 🚀 Setup Rápido - Sistema de Autenticación

## ⚡ Inicio Rápido (5 minutos)

### 1. Iniciar el servidor

```bash
npm run dev
```

### 2. Probar el sistema (Modo Demo)

Abre tu navegador:

```
http://localhost:3000/test-auth
```

✅ **El sistema ya funciona sin configuración** (usa localStorage)

### 3. Crear una cuenta de prueba

Ve a:
```
http://localhost:3000/register
```

Registra un usuario:
- **Email:** `test@dolargaucho.com`
- **Password:** `test123456`

### 4. Acceder al dashboard

```
http://localhost:3000/dashboard
```

✅ **¡Listo!** El sistema de auth funciona en modo demo.

---

## 🔐 Configuración Producción (15 minutos)

### Paso 1: Crear proyecto en Supabase

1. Ve a: https://supabase.com
2. Crea cuenta / Inicia sesión
3. **New Project** → Completa datos → **Create**
4. Espera 1-2 minutos

### Paso 2: Copiar credenciales

En Supabase:
1. **Settings** ⚙️ → **API**
2. Copia:
   - `Project URL`
   - `anon public key`

### Paso 3: Configurar variables de entorno

Crea `.env.local` en la raíz:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-aqui
```

### Paso 4: Crear tablas en Supabase

1. En Supabase: **SQL Editor** → **+ New query**
2. Abre el archivo: `supabase/schema.sql`
3. **Copia TODO** el contenido
4. **Pega** en SQL Editor
5. Click **Run** ▶️

Deberías ver: `Success. No rows returned`

### Paso 5: Verificar tablas

En Supabase: **Table Editor**

Deberías ver:
- ✅ `leads`
- ✅ `user_preferences`
- ✅ `price_alerts`
- ✅ `saved_calculations`

### Paso 6: Reiniciar servidor

```bash
# Ctrl+C para detener
npm run dev
```

### Paso 7: Probar

Ve a:
```
http://localhost:3000/test-auth
```

Deberías ver:
- ✅ **Modo:** 🔐 Producción (Supabase)
- ✅ **Supabase Configurado:** Sí

Click en **"Ejecutar Tests de DB"**

Todos deben ser ✅:
- ✅ Conexión con Supabase
- ✅ Tabla user_preferences
- ✅ Tabla leads

---

## 📝 Flujo de Prueba Completo

### 1. Registrar usuario

```
http://localhost:3000/register
```

- Email: `tu@email.com`
- Password: `minimo6caracteres`
- Click **"Crear cuenta"**

**En Modo Producción:**
- Recibirás un email de confirmación
- Revisa inbox y spam
- Click en **"Confirm your mail"**

### 2. Iniciar sesión

```
http://localhost:3000/login
```

- Ingresa tu email/password
- Click **"Iniciar sesión"**
- Deberías ser redirigido a `/dashboard`

### 3. Verificar en Supabase (solo producción)

**Authentication → Users:**
- ✅ Tu usuario debe aparecer
- ✅ Status: `confirmed`

**Table Editor → user_preferences:**
- ✅ Debe haber una fila con tu `user_id`
- ✅ `theme`: `dark` (por defecto)

### 4. Probar API de Leads

En: `http://localhost:3000/test-auth`

Click **"Probar Captura de Lead"**

**Table Editor → leads:**
- ✅ Nuevo lead capturado
- ✅ `status`: `pending`

---

## 🧪 Ejecutar Tests

```bash
npm test
```

Deberías ver:
```
Test Suites: 22+ passed
Tests:       83+ passed
```

Test específico de auth:
```bash
npm test -- auth-system.test.tsx
```

---

## 📁 Archivos Importantes

### Configuración
- `.env.local` - Variables de entorno (crear)
- `supabase/schema.sql` - Script SQL completo

### Páginas
- `pages/login.tsx` - Login
- `pages/register.tsx` - Registro
- `pages/test-auth.tsx` - Testing/Debug

### API
- `pages/api/leads.ts` - Captura de leads

### Componentes
- `components/LeadCaptureForm.tsx` - Form de suscripción

### Documentación
- `docs/TESTING_GUIDE.md` - Guía completa
- `docs/AUTH_SETUP.md` - Setup detallado
- `docs/QUICK_START_AUTH.md` - Inicio rápido

---

## ✅ Checklist

### Básico (Modo Demo)
- [ ] `npm run dev` funciona
- [ ] `/test-auth` muestra "Modo Demo"
- [ ] Puedo registrar usuario
- [ ] Puedo iniciar sesión
- [ ] Puedo acceder a `/dashboard`
- [ ] Tests pasan: `npm test`

### Producción (Con Supabase)
- [ ] Proyecto creado en Supabase
- [ ] `.env.local` configurado
- [ ] Script SQL ejecutado
- [ ] Tablas creadas (4 tablas)
- [ ] `/test-auth` muestra "Modo Producción"
- [ ] Tests de DB pasan (todos ✅)
- [ ] Puedo registrar usuario
- [ ] Recibo email de confirmación
- [ ] Puedo iniciar sesión
- [ ] Usuario en Supabase Auth
- [ ] Preferencias en DB
- [ ] API de leads funciona
- [ ] Tests pasan: `npm test`

---

## 🐛 Problemas Comunes

### "Supabase no configurado"
```bash
# Verifica que .env.local existe
cat .env.local

# Debe contener tus credenciales de Supabase
# Reinicia el servidor
```

### "Tabla no existe"
```bash
# Ejecuta el script SQL completo en Supabase
# Archivo: supabase/schema.sql
```

### "Invalid credentials"
```bash
# Verifica que confirmaste tu email (en producción)
# Revisa spam
# En Supabase → Auth → Users → verifica "confirmed"
```

### Tests fallan
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
npm test
```

---

## 🎯 Siguiente Paso

Una vez que todo funcione:

1. **Agregar form de suscripción al homepage:**

```typescript
// pages/index.tsx
import { LeadCaptureForm } from '@/components/LeadCaptureForm';

// Agregar donde quieras capturar leads:
<LeadCaptureForm
  source="homepage"
  variant="card"
  title="Suscríbete"
  redirectOnSuccess={true}
/>
```

2. **Configurar OAuth (opcional):**
   - Ver `docs/AUTH_SETUP.md`
   - Sección: "Configurar Auth Providers"

3. **Personalizar emails:**
   - Supabase → Authentication → Email Templates

---

## 📞 Soporte

- **Guía completa:** `docs/TESTING_GUIDE.md`
- **Setup detallado:** `docs/AUTH_SETUP.md`
- **Página de testing:** http://localhost:3000/test-auth

---

**¿Todo funciona?** 🎉

Ahora tienes:
- ✅ Sistema de autenticación completo
- ✅ Login y registro funcionales
- ✅ Dashboard protegido
- ✅ Sistema de captura de leads
- ✅ Modo demo Y producción
- ✅ Tests automatizados
