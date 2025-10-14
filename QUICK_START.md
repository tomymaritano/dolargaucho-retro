# 🚀 Quick Start - Sistema de Autenticación

## ⚡ Setup en 5 minutos

Tu sistema de autenticación custom ya está implementado. Solo falta configurar la base de datos.

---

## 📋 Estado Actual

✅ JWT Secret configurado
✅ API routes creadas
✅ Frontend actualizado
✅ Middleware protegiendo rutas
❌ **Base de datos PostgreSQL** (falta configurar)

---

## 🗄️ Opción 1: Vercel Postgres (Recomendado - GRATIS)

### **Paso 1: Crear Database**

1. Ir a: https://vercel.com/dashboard
2. Click en tu proyecto `dolargaucho-retro`
3. **Storage** → **Create Database**
4. Seleccionar **Postgres** → **Continue**
5. Configurar:
   - Name: `dolargaucho-dev`
   - Region: `us-east-1` (o la más cercana)
6. Click **Create**

### **Paso 2: Obtener Connection String**

1. En la página de tu database → **Settings**
2. Copiar el valor de `POSTGRES_URL`

### **Paso 3: Agregar a .env.local**

```bash
# En .env.local, descomenta y agrega:
POSTGRES_URL=postgresql://default:...@...vercel-storage.com/verceldb
```

### **Paso 4: Ejecutar Schema SQL**

1. En Vercel → Storage → Tu database → **Query**
2. Abrir el archivo: `/schema.sql` de tu proyecto
3. Copiar TODO el contenido
4. Pegar en el Query Editor de Vercel
5. Click **Run** ▶️

Deberías ver: `Success. No rows returned`

### **Paso 5: Verificar Tablas**

En el Query Editor, ejecutar:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

Debe mostrar:
- ✅ `users`
- ✅ `user_preferences`
- ✅ `leads`

### **Paso 6: Reiniciar Dev Server**

```bash
# Ctrl+C para detener
npm run dev
```

---

## 🗄️ Opción 2: Neon (Alternativa GRATIS)

### **Paso 1: Crear cuenta**

1. Ir a: https://neon.tech
2. Sign up (gratis)
3. **Create Project**
4. Name: `dolargaucho`
5. Region: Elegir la más cercana
6. Click **Create**

### **Paso 2: Obtener Connection String**

1. En la página del proyecto → **Connection Details**
2. Copiar el **Connection string**
3. Se verá así: `postgresql://user:pass@ep-xxx.neon.tech/dbname`

### **Paso 3: Agregar a .env.local**

```bash
# En .env.local:
POSTGRES_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
```

### **Paso 4: Ejecutar Schema SQL**

1. En Neon → **SQL Editor**
2. Abrir el archivo `/schema.sql` de tu proyecto
3. Copiar TODO el contenido
4. Pegar en SQL Editor
5. Click **Run** ▶️

### **Paso 5: Verificar Tablas**

En SQL Editor, ejecutar:
```sql
SELECT * FROM information_schema.tables WHERE table_schema = 'public';
```

### **Paso 6: Reiniciar Dev Server**

```bash
# Ctrl+C para detener
npm run dev
```

---

## 🗄️ Opción 3: PostgreSQL Local (Para desarrollo)

### **Paso 1: Instalar PostgreSQL**

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Descargar de: https://www.postgresql.org/download/windows/

### **Paso 2: Crear Database**

```bash
# Crear base de datos
createdb dolargaucho

# O usando psql:
psql postgres
CREATE DATABASE dolargaucho;
\q
```

### **Paso 3: Agregar a .env.local**

```bash
# En .env.local:
POSTGRES_URL=postgresql://localhost:5432/dolargaucho
```

Si tienes usuario/password:
```bash
POSTGRES_URL=postgresql://usuario:password@localhost:5432/dolargaucho
```

### **Paso 4: Ejecutar Schema SQL**

```bash
psql dolargaucho < schema.sql
```

### **Paso 5: Verificar**

```bash
psql dolargaucho
\dt
# Debe mostrar: users, user_preferences, leads
```

### **Paso 6: Reiniciar Dev Server**

```bash
npm run dev
```

---

## ✅ Verificar que Funciona

### **1. Abrir la app**

```
http://localhost:3000
```

### **2. Ir a Register**

```
http://localhost:3000/register
```

### **3. Crear una cuenta de prueba**

- Email: `test@dolargaucho.com`
- Password: `test1234` (min 8 caracteres)
- Nombre: `Test User`

### **4. Click "Crear cuenta"**

Debe:
- ✅ Crear el usuario
- ✅ Logearte automáticamente
- ✅ Redirigir a `/dashboard`

### **5. Verificar sesión**

1. Abrir DevTools (F12)
2. **Application** → **Cookies** → `http://localhost:3000`
3. Debe haber una cookie: `dg_auth_token`

### **6. Probar Logout**

1. En el dashboard, buscar botón de logout
2. Click logout
3. Debe redirigir a `/`
4. Intentar acceder a `/dashboard` → debe redirigir a `/login`

---

## 🐛 Troubleshooting

### **Error: "JWT_SECRET is not set"**

✅ Ya está configurado en `.env.local`

Si sigue el error, reinicia el dev server:
```bash
# Ctrl+C
npm run dev
```

---

### **Error: "Error connecting to database"**

**Causa:** `POSTGRES_URL` no está configurado o es inválido

**Solución:**
1. Verificar que agregaste `POSTGRES_URL` en `.env.local`
2. Verificar que la base de datos existe
3. Verificar el connection string (copiar de Vercel/Neon)
4. Reiniciar dev server

---

### **Error: "relation 'users' does not exist"**

**Causa:** No ejecutaste el `schema.sql`

**Solución:**
1. Ir a Vercel/Neon → SQL Editor / Query
2. Copiar TODO el contenido de `/schema.sql`
3. Ejecutar
4. Verificar que se crearon las tablas

---

### **Error 500 en /api/auth/register o /api/auth/login**

**Causas posibles:**
1. Base de datos no conectada
2. Schema SQL no ejecutado
3. Variables de entorno incorrectas

**Solución:**
1. Ver logs del servidor en la terminal donde corre `npm run dev`
2. El error exacto aparecerá ahí
3. Seguir las instrucciones según el error

---

### **Login funciona pero no persiste al recargar**

**Causa:** Problemas con cookies

**Solución:**
1. Verificar en DevTools → Application → Cookies
2. Debe existir `dg_auth_token`
3. Si no está, puede ser un bloqueador de cookies
4. Probar en modo incógnito

---

## 📝 Resumen de Variables Requeridas

En `.env.local`:

```bash
# ✅ YA CONFIGURADO
JWT_SECRET=fc4766f47e7e1c422459bdf3719d85b348e6354063b647eec02d49b62ab87c5b

# ❌ FALTA CONFIGURAR (elige una opción de arriba)
POSTGRES_URL=postgresql://...
```

---

## 🎯 Next Steps

Una vez que funcione localmente:

1. **Deploy a Vercel:**
   - Push a GitHub
   - Vercel auto-deploya
   - Configurar environment variables en Vercel dashboard

2. **Documentación completa:**
   - Ver: `docs/CUSTOM_AUTH_DEPLOYMENT.md`
   - Guía completa de producción

---

## 💡 Tips

- **Vercel Postgres** es la opción más fácil (1 click)
- **Neon** tiene free tier más generoso (3GB vs 256MB)
- **PostgreSQL local** es mejor para desarrollo intensivo
- Puedes usar Supabase **solo para la base de datos** (no su auth)

---

## 🆘 ¿Necesitas Ayuda?

1. Ver logs del servidor (`npm run dev` output)
2. Ver `docs/CUSTOM_AUTH_DEPLOYMENT.md` para más detalles
3. Verificar que todas las variables de entorno están configuradas
4. Probar en modo incógnito (elimina problemas de cookies)

---

**¡Estás a 1 paso de tener tu sistema funcionando!** 🚀

Solo falta configurar la base de datos usando una de las 3 opciones arriba.
