# FAQ - Dólar Gaucho

Preguntas frecuentes y guías técnicas consolidadas para desarrolladores.

## Tabla de Contenidos

1. [Setup Inicial](#setup-inicial)
2. [Autenticación](#autenticación)
3. [Base de Datos](#base-de-datos)
4. [APIs Externas](#apis-externas)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Setup Inicial

### ¿Cómo inicio el proyecto localmente?

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/dolargaucho-retro.git
cd dolargaucho-retro

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Ejecutar migraciones de base de datos
psql "$POSTGRES_URL" -f schema.sql
psql "$POSTGRES_URL" -f migrations/001_add_nickname.sql

# 5. Iniciar servidor de desarrollo
npm run dev
```

### ¿Qué variables de entorno necesito?

**Mínimo requerido:**

```bash
# JWT para autenticación
JWT_SECRET=tu-secret-aqui-32-caracteres-minimo

# Base de datos Neon Postgres
POSTGRES_URL=postgresql://user:pass@host/db?sslmode=require
```

**Opcional (features avanzadas):**

```bash
# FRED API para datos económicos USA
NEXT_PUBLIC_FRED_API_KEY=tu-fred-api-key

# URLs del sitio
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Autenticación

### ¿Qué sistema de autenticación usa Dólar Gaucho?

**Actualmente:** Custom JWT Authentication con Neon Postgres

**Anteriormente:** Supabase (deprecado)

**Arquitectura actual:**

- Base de datos: Neon Postgres (serverless PostgreSQL)
- Autenticación: JWT tokens con bcrypt para passwords
- Sesiones: HTTP-only cookies (no localStorage por seguridad)
- Cliente DB: `@vercel/postgres` con template literals

### ¿Cómo funciona el flujo de autenticación?

```typescript
// 1. Usuario se registra
POST /api/auth/register
{
  email: "user@example.com",
  password: "secure-password",
  name: "John Doe",
  nickname: "johndoe"  // opcional
}

// 2. Password se hashea con bcrypt
const hash = await bcrypt.hash(password, 10);

// 3. Usuario se guarda en Postgres
INSERT INTO users (email, password_hash, name, nickname)

// 4. Se genera JWT token
const token = jwt.sign({ userId, email }, JWT_SECRET);

// 5. Token se guarda en HTTP-only cookie
res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Lax`);

// 6. Para requests autenticadas
GET /api/auth/me
Cookie: token=eyJhbGc...

// 7. Middleware valida el token
const decoded = jwt.verify(token, JWT_SECRET);
```

### ¿Cómo protejo una página del dashboard?

```typescript
// pages/dashboard/mi-pagina.tsx
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

export default function MiPagina() {
  return (
    <DashboardLayout>
      {/* DashboardLayout ya incluye protección de auth */}
      <h1>Contenido protegido</h1>
    </DashboardLayout>
  );
}
```

El `DashboardLayout` automáticamente:

- Verifica si el usuario está autenticado
- Redirecciona a `/auth` si no lo está
- Muestra el contenido solo si está autenticado

### ¿Cómo uso el contexto de autenticación?

```typescript
import { useAuth } from '@/lib/contexts/AuthContext';

function MiComponente() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>No autenticado</p>;

  return (
    <div>
      <p>Hola {user.name}!</p>
      <button onClick={signOut}>Cerrar Sesión</button>
    </div>
  );
}
```

---

## Base de Datos

### ¿Qué base de datos usa el proyecto?

**Neon Postgres** - Serverless PostgreSQL

**¿Por qué Neon?**

- ✅ Gratuito para proyectos pequeños
- ✅ Serverless (escala automáticamente)
- ✅ Compatible con Postgres estándar
- ✅ Branching para desarrollo
- ✅ Integración con Vercel

**Setup:**

1. Crear cuenta en https://neon.tech
2. Crear proyecto
3. Copiar connection string
4. Agregar a `.env.local` como `POSTGRES_URL`

### ¿Cómo ejecuto migraciones?

```bash
# Migración inicial (crea todas las tablas)
psql "$POSTGRES_URL" -f schema.sql

# Migraciones adicionales
psql "$POSTGRES_URL" -f migrations/001_add_nickname.sql

# Rollback (si es necesario)
psql "$POSTGRES_URL" -f migrations/001_add_nickname_rollback.sql
```

### ¿Cómo hago queries a la base de datos?

```typescript
import { sql } from '@vercel/postgres';

// SELECT simple
const users = await sql`
  SELECT id, email, name, nickname
  FROM users
  WHERE email = ${email}
  LIMIT 1
`;

// INSERT con RETURNING
const newUser = await sql`
  INSERT INTO users (email, password_hash, name, nickname)
  VALUES (${email}, ${hash}, ${name}, ${nickname})
  RETURNING id, email, name, nickname, created_at
`;

// UPDATE
await sql`
  UPDATE users
  SET name = ${newName}, nickname = ${newNickname}
  WHERE id = ${userId}
`;

// DELETE
await sql`
  DELETE FROM users WHERE id = ${userId}
`;
```

**Importante:** Siempre usa template literals ` `` ` para prevenir SQL injection.

### ¿Cuál es el schema de la base de datos?

```sql
-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  nickname VARCHAR(50),  -- Opcional, único
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Preferencias de usuario
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'dark',
  currency VARCHAR(10) DEFAULT 'ARS',
  notifications_enabled BOOLEAN DEFAULT true,
  favorite_dolares TEXT[],
  favorite_currencies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alertas de precios
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dolar_type VARCHAR(50) NOT NULL,
  threshold_type VARCHAR(10) CHECK (threshold_type IN ('above', 'below')),
  threshold_value DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## APIs Externas

### ¿Qué APIs externas usa el proyecto?

1. **DolarAPI** - Cotizaciones de dólar en Argentina (GRATIS)
   - URL: https://dolarapi.com
   - No requiere API key
   - Rate limit: Generoso

2. **FRED API** - Datos económicos USA (GRATIS)
   - URL: https://fred.stlouisfed.org
   - Requiere API key (gratis)
   - Uso: Tasas FED, inflación USA, desempleo

3. **ECB API** - Tipos de cambio EUR (GRATIS)
   - URL: https://api.exchangerate.host
   - No requiere API key
   - Datos oficiales del Banco Central Europeo

4. **CoinGecko** - Precios de criptomonedas (GRATIS)
   - URL: https://api.coingecko.com/api/v3
   - No requiere API key en tier gratis
   - Rate limit: 10-50 calls/min

### ¿Cómo configuro FRED API?

```bash
# 1. Registrarse en https://fred.stlouisfed.org

# 2. Ir a tu perfil → API Keys → Request API Key

# 3. Completar formulario:
#    - Application Name: "DolarGaucho"
#    - Application URL: https://dolargaucho.com
#    - Description: "Financial data for Argentine users"

# 4. Copiar API key

# 5. Agregar a .env.local
NEXT_PUBLIC_FRED_API_KEY=tu-api-key-aqui

# 6. Reiniciar servidor
npm run dev
```

**Rate limits:**

- 120 requests/minuto
- Ilimitadas por día

**Fallback:** Si no configuras FRED, se usan datos estimados locales (suficiente para desarrollo).

### ¿Cómo funciona el sistema de fallback?

```typescript
// hooks/useFredData.ts
export function useFredData(series: string) {
  const [data, setData] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_FRED_API_KEY;

  useEffect(() => {
    if (apiKey) {
      // Intentar con FRED API
      fetchFromFRED(series)
        .then(setData)
        .catch(() => {
          // Si falla, usar fallback
          setData(getFallbackData(series));
        });
    } else {
      // Sin API key, usar fallback directamente
      setData(getFallbackData(series));
    }
  }, [series, apiKey]);

  return { data, loading: !data };
}
```

---

## Testing

### ¿Cómo ejecuto los tests?

```bash
# Tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch

# Tests E2E (Playwright - si está configurado)
npm run test:e2e
```

### ¿Cómo creo un test para un componente?

```typescript
// __tests__/components/MiComponente.test.tsx
import { render, screen } from '@testing-library/react';
import MiComponente from '@/components/MiComponente';

describe('MiComponente', () => {
  it('renderiza correctamente', () => {
    render(<MiComponente />);
    expect(screen.getByText('Hola')).toBeInTheDocument();
  });
});
```

---

## Deployment

### ¿Cómo despliego a Vercel?

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy a preview
vercel

# 4. Deploy a producción
vercel --prod
```

**Variables de entorno en Vercel:**

1. Dashboard de Vercel → Tu Proyecto → Settings → Environment Variables
2. Agregar todas las variables de `.env.local`
3. Importante: marcar como "secret" las API keys

### ¿Qué checks hacer antes de deploy?

```bash
# 1. Build local exitoso
npm run build

# 2. Tests pasando
npm test

# 3. Linter sin errores
npm run lint

# 4. TypeScript sin errores
npm run type-check  # Si existe

# 5. Verificar .env.production (si aplica)
```

---

## Troubleshooting

### Error: "ECONNREFUSED" al conectar a Postgres

**Causa:** Connection string incorrecta o base de datos no accesible

**Solución:**

```bash
# 1. Verificar POSTGRES_URL en .env.local
echo $POSTGRES_URL

# 2. Testear conexión manual
psql "$POSTGRES_URL" -c "SELECT 1"

# 3. Verificar que Neon esté activo (no suspendido)
# Dashboard de Neon → Tu proyecto → debe estar "Active"
```

### Error: "JsonWebTokenError: invalid signature"

**Causa:** JWT_SECRET cambió o no coincide

**Solución:**

```bash
# 1. Generar nuevo JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Actualizar .env.local
JWT_SECRET=nuevo-secret-aqui

# 3. Reiniciar servidor
# Los usuarios existentes deberán loguearse de nuevo
```

### Error: "nickname already exists"

**Causa:** Intento de registro con nickname ya usado

**Solución (usuario):**

- Elegir otro nickname

**Solución (dev - limpiar DB):**

```sql
-- Ver nicknames existentes
SELECT id, email, nickname FROM users WHERE nickname IS NOT NULL;

-- Remover nickname duplicado (solo en desarrollo!)
UPDATE users SET nickname = NULL WHERE email = 'usuario@example.com';
```

### La página se refresca constantemente

**Causa:** Re-renders innecesarios en formularios

**Solución:**

```typescript
// ❌ MAL - causa re-renders
const handleChange = (value: string) => {
  setState(value);
};

// ✅ BIEN - memoizado con useCallback
const handleChange = React.useCallback((value: string) => {
  setState(value);
}, []);
```

### Fuzzy search no encuentra resultados

**Causa:** Threshold muy estricto o typo en query

**Solución:**

```typescript
// Ajustar threshold en NavbarSearch.tsx
const fuse = new Fuse(SEARCH_INDEX, {
  keys: ['title', 'category', 'description'],
  threshold: 0.3, // Aumentar a 0.4 o 0.5 para ser más permisivo
  minMatchCharLength: 2,
});
```

---

## Recursos

### Documentación Oficial

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Neon Postgres**: https://neon.tech/docs
- **Vercel**: https://vercel.com/docs
- **FRED API**: https://fred.stlouisfed.org/docs/api/

### Docs Internas

- **Arquitectura 2025**: `docs/AUDIT_ARCHITECTURE_2025.md`
- **UX Guidelines**: `docs/AUDIT_UX_2025.md`
- **Design System**: `docs/DESIGN_SYSTEM_2025.md`
- **Roadmap**: `docs/ROADMAP_Q1_Q2_2025.md`

### Contacto

- **Email**: tomymaritano@gmail.com
- **GitHub Issues**: https://github.com/tu-usuario/dolargaucho-retro/issues

---

_Última actualización: 20 de octubre, 2025_
