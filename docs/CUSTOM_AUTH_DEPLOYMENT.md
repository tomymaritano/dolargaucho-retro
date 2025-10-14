# 🔐 Sistema de Autenticación Custom - Guía de Deployment

## 📋 Resumen

Sistema de autenticación profesional sin dependencias de terceros (Supabase, Auth0, etc.), utilizando:
- **JWT** para tokens
- **bcrypt** para passwords
- **HTTP-only cookies** para seguridad
- **PostgreSQL** (Vercel Postgres) para datos
- **100% código propio**

---

## 🎯 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUARIO (Browser)                         │
│                    HTTP-only Cookie (JWT)                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP (Vercel Edge)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Frontend                    API Routes                          │
│  ├─ /login                   ├─ /api/auth/register              │
│  ├─ /register                ├─ /api/auth/login                 │
│  ├─ /dashboard/*             ├─ /api/auth/logout                │
│  └─ Components               └─ /api/auth/me                     │
│                                                                   │
│  Middleware (JWT Verification)                                   │
│  └─ Protege rutas /dashboard/*                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  POSTGRESQL (Vercel Postgres)                    │
├─────────────────────────────────────────────────────────────────┤
│  Tables:                                                          │
│  ├─ users (id, email, password_hash, name)                       │
│  ├─ user_preferences (theme, favorites, etc.)                    │
│  └─ leads (email, source, status)                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment en Vercel (Recomendado)

### **Paso 1: Setup de Base de Datos (5 minutos)**

#### Crear Vercel Postgres

1. Ir a tu proyecto en Vercel: https://vercel.com/tu-usuario/dolargaucho-retro

2. **Storage** → **Create Database**

3. Seleccionar **Postgres** → **Continue**

4. Configurar:
   - **Name**: `dolargaucho-prod`
   - **Region**: Elegir la más cercana (ej: `us-east-1`)
   - **Plan**: Free (hasta 256MB y 60 compute hours/mes)

5. Click **Create**

6. **Conectar a tu proyecto**:
   - Vercel automáticamente agrega estas variables de entorno:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NON_POOLING`

#### Ejecutar Schema SQL

1. En Vercel → **Storage** → Tu database → **Query**

2. Copiar el contenido completo de `/schema.sql`

3. Pegar en el editor de queries

4. Click **Run** ▶️

5. Verificar que las tablas se crearon:
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

   Deberías ver:
   - ✅ `users`
   - ✅ `user_preferences`
   - ✅ `leads`

---

### **Paso 2: Configurar Variables de Entorno (2 minutos)**

1. En Vercel → **Settings** → **Environment Variables**

2. Agregar las siguientes variables:

```bash
# JWT Secret (REQUERIDO)
JWT_SECRET=<generar-con-comando-abajo>

# JWT Expiration (Opcional)
JWT_EXPIRATION=7d

# Node Environment
NODE_ENV=production

# App URL (tu dominio en producción)
NEXT_PUBLIC_APP_URL=https://dolargaucho.com
```

#### Generar JWT_SECRET Seguro

Ejecutar en tu terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiar el resultado y usarlo como `JWT_SECRET`.

**Ejemplo de resultado:**
```
8f7a3c9d2e1b4a6c5f8d7e9a3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0
```

---

### **Paso 3: Deploy Automático (0 minutos)**

1. Push tu código a GitHub:
   ```bash
   git add .
   git commit -m "feat: Implement custom JWT authentication system"
   git push origin main
   ```

2. Vercel detecta automáticamente el push y hace deploy

3. Esperar 2-3 minutos

4. Ver el build en: https://vercel.com/tu-usuario/dolargaucho-retro/deployments

---

### **Paso 4: Verificar Deployment (3 minutos)**

1. Ir a tu app en producción: `https://dolargaucho.com`

2. **Test de Registro:**
   - Ir a `/register`
   - Crear cuenta con email y password
   - Verificar que redirecciona a `/dashboard`

3. **Test de Login:**
   - Logout (si estás logueado)
   - Ir a `/login`
   - Iniciar sesión con las credenciales
   - Verificar que redirecciona a `/dashboard`

4. **Test de Protección de Rutas:**
   - Logout
   - Intentar acceder a `/dashboard` directamente
   - Debe redirigir a `/login?redirect=/dashboard`
   - Login y verificar que vuelve al dashboard

---

## 💻 Setup Local para Desarrollo

### **Paso 1: Clonar y Instalar**

```bash
git clone https://github.com/tu-usuario/dolargaucho-retro.git
cd dolargaucho-retro
npm install
```

---

### **Paso 2: Configurar Variables de Entorno**

1. Copiar el archivo de ejemplo:
   ```bash
   cp .env.example .env.local
   ```

2. Editar `.env.local`:
   ```bash
   # JWT Secret (generar uno único)
   JWT_SECRET=tu-secret-key-minimo-32-caracteres

   # JWT Expiration
   JWT_EXPIRATION=7d

   # PostgreSQL (obtener de Vercel)
   POSTGRES_URL=tu-connection-string

   # Development
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

#### Obtener `POSTGRES_URL` de Vercel

Hay dos opciones:

**Opción A: Usar la base de producción (para testing)**

1. Vercel → Storage → Tu database → **Settings**
2. Copiar `POSTGRES_URL`
3. Pegar en `.env.local`

**Opción B: Crear una base de datos separada para dev**

1. Crear otro proyecto/database en Vercel
2. Llamarlo `dolargaucho-dev`
3. Copiar la `POSTGRES_URL`
4. Ejecutar el mismo `schema.sql`

---

### **Paso 3: Generar JWT Secret**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiar el resultado y pegarlo en `.env.local` como `JWT_SECRET`.

---

### **Paso 4: Ejecutar Localmente**

```bash
npm run dev
```

Abrir: http://localhost:3000

---

### **Paso 5: Verificar Funcionamiento Local**

1. Ir a: http://localhost:3000/register
2. Crear una cuenta de prueba
3. Verificar que redirecciona al dashboard
4. Logout y probar login
5. Verificar protección de rutas

---

## 🗄️ Alternativas a Vercel Postgres

### **Opción 1: Neon (Serverless PostgreSQL)**

1. Crear cuenta en: https://neon.tech
2. Crear proyecto → **Create**
3. Copiar connection string
4. En Vercel → Environment Variables:
   ```bash
   DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
   ```
5. Ejecutar `schema.sql` en Neon SQL Editor

**Ventajas:**
- Free tier generoso (3 GB storage)
- Serverless (sin idle time)
- Backups automáticos

---

### **Opción 2: Railway**

1. Crear cuenta en: https://railway.app
2. **New Project** → **Provision PostgreSQL**
3. Copiar connection string
4. Configurar en Vercel
5. Ejecutar schema

**Precio:** ~$5/mes

---

### **Opción 3: Supabase (Solo Database)**

1. Crear proyecto en: https://supabase.com
2. **SQL Editor** → Ejecutar `schema.sql`
3. **Settings** → **Database** → Connection string
4. Usar connection string en Vercel

**Nota:** Solo usas la base de datos, NO el auth de Supabase

---

## 🔒 Seguridad

### **Medidas Implementadas**

✅ **Passwords:**
- Hasheados con bcrypt (12 rounds)
- Nunca se almacenan en texto plano
- Validación de longitud y complejidad

✅ **JWT Tokens:**
- Firmados con secret de 256 bits
- Expiración configurable (default: 7 días)
- Verificación en cada request

✅ **Cookies:**
- HTTP-only (no accesibles desde JavaScript)
- SameSite=Lax (protección CSRF)
- Secure flag en producción (HTTPS only)

✅ **SQL:**
- Queries parametrizadas (previene SQL injection)
- No hay concatenación de strings en queries

✅ **Input Validation:**
- Email format validation
- Password strength requirements
- Sanitización de inputs con Zod

✅ **Middleware:**
- Protección de rutas `/dashboard/*`
- Verificación de JWT en cada request
- Redirección automática a login

---

## 📊 Monitoreo y Logs

### **En Vercel**

1. **Logs en tiempo real:**
   - Vercel → Tu proyecto → **Logs**
   - Ver requests, errors, y performance

2. **Analytics:**
   - Vercel → Tu proyecto → **Analytics**
   - Ver page views, unique visitors, etc.

3. **Monitoring de Database:**
   - Vercel → Storage → Tu database → **Usage**
   - Ver CPU, storage, connections

---

## 🐛 Troubleshooting

### **Problema: "JWT_SECRET is not set"**

**Causa:** Falta configurar `JWT_SECRET` en environment variables

**Solución:**
1. Generar secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Vercel → Settings → Environment Variables → Agregar `JWT_SECRET`
3. Redeploy: Vercel → Deployments → **Redeploy**

---

### **Problema: "Error connecting to database"**

**Causa:** Connection string inválido o database no creada

**Solución:**
1. Verificar que Vercel Postgres está conectado al proyecto
2. Vercel → Storage → Ver databases
3. Si no hay ninguna, crear una nueva
4. Verificar que `POSTGRES_URL` está en environment variables
5. Redeploy

---

### **Problema: "Table doesn't exist"**

**Causa:** Schema SQL no fue ejecutado

**Solución:**
1. Vercel → Storage → Tu database → **Query**
2. Copiar contenido de `schema.sql`
3. Ejecutar en el query editor
4. Verificar tablas: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`

---

### **Problema: "Invalid credentials" al hacer login**

**Causas posibles:**
1. Usuario no existe (registrarse primero)
2. Password incorrecto
3. Email con mayúsculas/minúsculas diferente

**Solución:**
1. Verificar usuario en database:
   ```sql
   SELECT email FROM users WHERE email = 'tu@email.com';
   ```
2. Si no existe, registrarse primero en `/register`
3. Usar exactamente el mismo email y password

---

### **Problema: Cookie no se guarda / Session no persiste**

**Causa:** Configuración incorrecta de cookies en desarrollo

**Solución:**
1. Verificar que usas HTTP (no HTTPS) en localhost
2. Verificar que no hay bloqueadores de cookies activos
3. Probar en modo incógnito
4. Verificar en DevTools → Application → Cookies

---

## 📝 Mantenimiento

### **Backup de Base de Datos**

#### En Vercel Postgres

Backups automáticos cada 24 horas (incluidos en plan free)

Para backup manual:
1. Vercel → Storage → Tu database → **Backups**
2. Click **Create Backup**

#### Restaurar Backup

1. Vercel → Storage → Tu database → **Backups**
2. Seleccionar backup
3. Click **Restore**

---

### **Migrar a Otra Base de Datos**

Si quieres cambiar de Vercel Postgres a otra:

1. **Exportar datos actuales:**
   ```bash
   pg_dump $POSTGRES_URL > backup.sql
   ```

2. **Crear nueva base de datos** (Neon, Railway, etc.)

3. **Importar datos:**
   ```bash
   psql $NEW_DATABASE_URL < backup.sql
   ```

4. **Actualizar environment variables** en Vercel

5. **Redeploy**

---

## 💰 Costos Estimados

### **Tier Gratuito (Recomendado para empezar)**

- **Vercel Hosting:** $0/mes
  - 100 GB bandwidth
  - Unlimited deployments
  - HTTPS custom domain

- **Vercel Postgres:** $0/mes
  - 256 MB storage
  - 60 compute hours/mes
  - ~10k usuarios activos

**Total: $0/mes**

---

### **Tier Pro (Para escalar)**

- **Vercel Pro:** $20/mes
  - 1 TB bandwidth
  - Analytics avanzados
  - Teams collaboration

- **Vercel Postgres Pro:** ~$10-40/mes (según uso)
  - Storage ilimitado
  - Compute ilimitado
  - Backups diarios

**Total: ~$30-60/mes**

---

### **Alternativas Free por más tiempo**

- **Neon Free:** 3 GB storage (vs 256 MB Vercel)
- **Railway:** $5/mes con más recursos
- **Supabase Free:** 500 MB database, 2 GB bandwidth

---

## 🎓 Recursos Adicionales

### **Documentación**

- **Vercel Postgres:** https://vercel.com/docs/storage/vercel-postgres
- **JWT:** https://jwt.io/introduction
- **bcrypt:** https://github.com/kelektiv/node.bcrypt.js
- **Next.js Middleware:** https://nextjs.org/docs/app/building-your-application/routing/middleware

### **Security Best Practices**

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **JWT Security:** https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html

---

## ✅ Checklist de Deployment

### **Pre-Deployment**

- [ ] Código committeado y pusheado a GitHub
- [ ] Tests locales pasando
- [ ] `.env.local` con todas las variables necesarias
- [ ] Schema SQL probado localmente

### **Vercel Setup**

- [ ] Proyecto conectado a GitHub
- [ ] Vercel Postgres creado
- [ ] Schema SQL ejecutado
- [ ] Environment variables configuradas:
  - [ ] `JWT_SECRET`
  - [ ] `POSTGRES_URL` (auto)
  - [ ] `JWT_EXPIRATION`
  - [ ] `NODE_ENV=production`

### **Testing en Producción**

- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Dashboard es accesible
- [ ] Protección de rutas funciona
- [ ] Logout funciona
- [ ] Session persiste al recargar

### **Post-Deployment**

- [ ] Verificar logs en Vercel
- [ ] Configurar dominio custom (opcional)
- [ ] Agregar SSL (automático en Vercel)
- [ ] Configurar analytics (opcional)

---

## 🎉 ¡Listo!

Tu sistema de autenticación profesional está deployeado y funcionando.

**Features incluidas:**
- ✅ Registro de usuarios
- ✅ Login/Logout
- ✅ Protección de rutas
- ✅ Sessions persistentes
- ✅ Preferencias de usuario
- ✅ Sistema de leads
- ✅ 100% código propio
- ✅ Enterprise-level security
- ✅ Escalable a millones de usuarios

**Next steps recomendados:**
1. Agregar password reset (forgot password)
2. Agregar email verification
3. Agregar OAuth (Google/GitHub) si necesario
4. Implementar rate limiting
5. Agregar 2FA (autenticación de dos factores)

¿Necesitas ayuda? Crea un issue en GitHub o revisa la documentación.
