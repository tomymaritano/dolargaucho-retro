# 🧪 Guía de Testing - Sistema de Autenticación

Guía paso a paso para configurar y probar el sistema de autenticación completo.

## 📋 Prerrequisitos

- Node.js instalado
- Dependencias instaladas (`npm install`)
- (Opcional) Cuenta en Supabase para modo producción

## 🎯 Opción 1: Testing Rápido (Modo Demo)

### 1. Iniciar el servidor

```bash
npm run dev
```

### 2. Probar el sistema

Abre tu navegador y ve a:

**Página de Testing:**
```
http://localhost:3000/test-auth
```

Esta página te permite:
- ✅ Ver el estado del sistema
- ✅ Verificar si estás en modo demo o producción
- ✅ Probar registro y login
- ✅ Probar la API de leads

**Páginas de Usuario:**
```
http://localhost:3000/login      # Página de login
http://localhost:3000/register   # Página de registro
http://localhost:3000/dashboard  # Dashboard (requiere auth)
```

### 3. Flujo de prueba en modo demo

1. **Ir a registro:** http://localhost:3000/register
2. **Crear cuenta:**
   - Email: `test@dolargaucho.com`
   - Password: `test123456`
   - Nombre: `Test User`
3. **Verificar:**
   - ✅ Deberías ver mensaje de éxito
   - ✅ En modo demo, redirige automáticamente al dashboard
4. **Acceder al dashboard:** http://localhost:3000/dashboard
5. **Cerrar sesión** desde el dashboard
6. **Iniciar sesión nuevamente:** http://localhost:3000/login

### 4. Ejecutar tests automatizados

```bash
npm test -- auth-system.test.tsx
```

Deberías ver:
```
PASS  __tests__/auth/auth-system.test.tsx
  Auth System - Helper Functions
    isValidEmail
      ✓ validates correct email addresses
      ✓ rejects invalid email addresses
    isValidPassword
      ✓ validates passwords with minimum 6 characters
      ✓ rejects passwords shorter than 6 characters
    formatAuthError
      ✓ formats known error messages to Spanish
  Auth System - Integration
    ✓ AuthProvider renders without crashing
    ✓ AuthProvider provides auth context
```

## 🚀 Opción 2: Testing Completo (Modo Producción)

### Paso 1: Configurar Supabase

#### 1.1. Crear proyecto

1. Ve a https://supabase.com
2. Haz clic en "New project"
3. Completa:
   - **Project name:** `dolargaucho` (o el nombre que prefieras)
   - **Database password:** (genera una segura y guárdala)
   - **Region:** Elige la más cercana
4. Haz clic en "Create new project"
5. **Espera 1-2 minutos** mientras se crea el proyecto

#### 1.2. Obtener credenciales

1. En tu proyecto de Supabase, ve a **Settings** (⚙️ abajo a la izquierda)
2. Click en **API**
3. Encontrarás:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...` (una clave larga)

#### 1.3. Configurar variables de entorno

Crea el archivo `.env.local` en la raíz del proyecto:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-aqui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-muy-larga-aqui
```

⚠️ **IMPORTANTE:** Reemplaza con TUS credenciales reales de Supabase.

### Paso 2: Crear las tablas en Supabase

#### 2.1. Abrir SQL Editor

1. En Supabase, ve a **SQL Editor** (icono de base de datos en la barra lateral)
2. Haz clic en **+ New query**

#### 2.2. Ejecutar el script

1. Abre el archivo `supabase/schema.sql` de tu proyecto
2. **Copia TODO el contenido** del archivo
3. **Pégalo** en el SQL Editor de Supabase
4. Haz clic en **Run** (botón verde abajo a la derecha)

Deberías ver:
```
Success. No rows returned
```

#### 2.3. Verificar las tablas

1. Ve a **Table Editor** en Supabase
2. Deberías ver estas tablas:
   - ✅ `leads`
   - ✅ `user_preferences`
   - ✅ `price_alerts` (opcional)
   - ✅ `saved_calculations` (opcional)

### Paso 3: Reiniciar el servidor

```bash
# Detén el servidor (Ctrl+C)
# Reinicia
npm run dev
```

### Paso 4: Verificar que funcione

#### 4.1. Ir a la página de testing

```
http://localhost:3000/test-auth
```

Deberías ver:
- ✅ **Modo de Operación:** 🔐 Producción (Supabase)
- ✅ **Supabase Configurado:** ✅ Sí

#### 4.2. Ejecutar tests de base de datos

1. Haz clic en **"Ejecutar Tests de DB"**
2. Deberías ver:
   - ✅ Conexión con Supabase: **Funciona**
   - ✅ Tabla user_preferences: **Funciona**
   - ✅ Tabla leads: **Funciona**

Si alguno falla:
- ❌ Verifica que ejecutaste el script SQL
- ❌ Verifica las variables de entorno en `.env.local`
- ❌ Reinicia el servidor

#### 4.3. Probar registro de usuario

1. En la página de testing, completa:
   - **Email:** `test@dolargaucho.com`
   - **Password:** `test123456`
   - **Nombre:** `Usuario Test`
2. Haz clic en **"Test Registro"**

Deberías ver:
- ✅ **Email de confirmación enviado** (revisa tu email)
- O si el email ya existe: ✅ Usuario ya existe

#### 4.4. Confirmar email (importante)

1. Revisa tu bandeja de entrada (y spam)
2. Busca email de **noreply@mail.app.supabase.co**
3. Haz clic en **"Confirm your mail"**
4. Serás redirigido a tu app

#### 4.5. Probar login

1. Ve a http://localhost:3000/login
2. Ingresa:
   - Email: `test@dolargaucho.com`
   - Password: `test123456`
3. Haz clic en **"Iniciar sesión"**

Deberías:
- ✅ Ser redirigido a `/dashboard`
- ✅ Ver tu email en el dashboard

#### 4.6. Verificar en Supabase

1. Ve a **Authentication** → **Users** en Supabase
2. Deberías ver tu usuario creado
3. Ve a **Table Editor** → **user_preferences**
4. Deberías ver una fila con tus preferencias

### Paso 5: Probar API de Leads

#### 5.1. Desde la página de testing

1. Ve a http://localhost:3000/test-auth
2. Scroll hasta **"Test API de Leads"**
3. Haz clic en **"Probar Captura de Lead"**

Deberías ver:
- ✅ API de leads funciona correctamente

#### 5.2. Verificar en Supabase

1. Ve a **Table Editor** → **leads** en Supabase
2. Deberías ver el lead capturado con:
   - Email generado automáticamente
   - source: `cta`
   - status: `pending`

#### 5.3. Probar formulario de suscripción

Puedes crear una página de prueba:

```typescript
// pages/test-form.tsx
import { LeadCaptureForm } from '@/components/LeadCaptureForm';

export default function TestFormPage() {
  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Test Formulario de Leads
        </h1>
        <LeadCaptureForm
          source="homepage"
          variant="card"
          title="Suscríbete"
          description="Recibe actualizaciones"
        />
      </div>
    </div>
  );
}
```

Luego ve a: http://localhost:3000/test-form

### Paso 6: Ejecutar todos los tests

```bash
npm test
```

Todos los tests deberían pasar:
```
Test Suites: 22 passed, 22 total
Tests:       83+ passed, 83+ total
```

## ✅ Checklist de Verificación

### Modo Demo
- [ ] Servidor corriendo en http://localhost:3000
- [ ] Página de testing muestra "Modo Demo"
- [ ] Puedo registrar usuario
- [ ] Puedo iniciar sesión
- [ ] Dashboard está accesible
- [ ] Puedo cerrar sesión
- [ ] Tests de Jest pasan

### Modo Producción
- [ ] Proyecto creado en Supabase
- [ ] Variables en `.env.local` configuradas
- [ ] Servidor reiniciado
- [ ] Script SQL ejecutado en Supabase
- [ ] Tablas visibles en Table Editor
- [ ] Página de testing muestra "Modo Producción"
- [ ] Tests de DB pasan (todos ✅)
- [ ] Puedo registrar usuario
- [ ] Recibo email de confirmación
- [ ] Puedo confirmar email
- [ ] Puedo iniciar sesión
- [ ] Dashboard está accesible
- [ ] Usuario visible en Supabase Auth
- [ ] Preferencias creadas en DB
- [ ] API de leads funciona
- [ ] Leads guardados en DB
- [ ] Tests de Jest pasan

## 🐛 Troubleshooting

### Problema: "Supabase Configurado: ❌ No"

**Solución:**
```bash
# 1. Verifica que el archivo .env.local exista
ls -la .env.local

# 2. Verifica el contenido
cat .env.local

# 3. Debe contener (con tus credenciales reales):
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# 4. Reinicia el servidor
npm run dev
```

### Problema: "Tabla user_preferences: ❌ Error"

**Solución:**
1. Ve a Supabase → SQL Editor
2. Ejecuta:
   ```sql
   SELECT * FROM public.user_preferences LIMIT 1;
   ```
3. Si da error "relation does not exist":
   - Ejecuta el script completo de `supabase/schema.sql`
4. Reinicia el servidor

### Problema: "Invalid login credentials"

**Solución:**
1. Verifica que confirmaste tu email
2. Revisa tu bandeja de spam
3. En Supabase → Auth → Users, verifica que el usuario esté "confirmed"
4. Si no está confirmado, haz clic en los 3 puntos → "Send confirmation email"

### Problema: "Too many re-renders" o "Infinite loop"

**Solución:**
Esto es normal si las preferencias están habilitadas pero la tabla no existe.
Las preferencias están deshabilitadas por defecto (líneas 139-145 de auth-context.tsx).

### Problema: Tests fallan con "Cannot find module"

**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Ejecutar tests
npm test
```

## 📞 Soporte

Si sigues teniendo problemas:
1. Revisa la consola del navegador (F12 → Console)
2. Revisa la consola del servidor (donde corre `npm run dev`)
3. Verifica los logs en Supabase → Logs
4. Consulta [AUTH_SETUP.md](./AUTH_SETUP.md) para más detalles

## 🎉 ¡Listo!

Si llegaste aquí y todos los checks están ✅, tu sistema de autenticación está **100% funcional**.

Próximos pasos:
- Personalizar emails en Supabase
- Configurar OAuth con Google/GitHub
- Agregar LeadCaptureForm al homepage
- Crear dashboard de admin para leads
