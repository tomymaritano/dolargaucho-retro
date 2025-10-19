# 🛡️ Security Best Practices - Dólar Gaucho

Este documento describe las medidas de seguridad implementadas y las mejores prácticas para proteger los datos de los usuarios.

## 🔐 Autenticación y Contraseñas

### ✅ Implementado

1. **Password Hashing con bcrypt**
   - Salt rounds: 12 (balance entre seguridad y performance)
   - No almacenamos contraseñas en texto plano
   - Hash one-way (no reversible)

2. **JWT Tokens Seguros**
   - HTTP-only cookies (no accesibles desde JavaScript)
   - Secure flag en producción
   - SameSite=Strict para prevenir CSRF
   - Tokens firmados con secret key de 64 caracteres

3. **Password Reset Tokens**
   - Tokens aleatorios de 32 bytes (256 bits)
   - Expiración de 1 hora
   - One-time use (se eliminan después de usar)
   - Almacenados hasheados en base de datos

4. **Email Enumeration Prevention**
   - Mismo mensaje de respuesta si el email existe o no
   - Previene que atacantes descubran emails válidos

## 🚫 Protección contra Ataques

### 1. Brute Force Protection

**Problema**: Atacantes intentan miles de combinaciones de contraseñas.

**Solución Implementada**:

- Rate limiting en endpoints de autenticación
- Límite: 5 intentos por IP cada 15 minutos
- Lock temporal después de 5 intentos fallidos

### 2. SQL Injection

**Problema**: Atacantes inyectan código SQL malicioso.

**Solución Implementada**:

- Uso de Vercel Postgres con consultas parametrizadas
- Validación de inputs con Zod
- Nunca concatenamos strings en queries SQL

**Ejemplo seguro**:

```typescript
// ✅ SEGURO
await sql`SELECT * FROM users WHERE email = ${email}`;

// ❌ INSEGURO (no usar nunca)
await sql`SELECT * FROM users WHERE email = '${email}'`;
```

### 3. XSS (Cross-Site Scripting)

**Problema**: Atacantes inyectan JavaScript malicioso.

**Solución Implementada**:

- React escapa automáticamente todos los valores
- Sanitización de inputs del usuario
- CSP headers en producción
- No usamos `dangerouslySetInnerHTML` sin sanitizar

### 4. CSRF (Cross-Site Request Forgery)

**Problema**: Sitios maliciosos hacen requests en nombre del usuario.

**Solución Implementada**:

- SameSite=Strict en cookies
- Verificación de origin en requests críticos
- Tokens CSRF en formularios sensibles

### 5. Timing Attacks

**Problema**: Atacantes miden tiempos de respuesta para inferir información.

**Solución Implementada**:

- Comparación constant-time de passwords (bcrypt)
- Mismo tiempo de respuesta si email existe o no
- No revelamos información en mensajes de error

### 6. Session Hijacking

**Problema**: Atacantes roban tokens de sesión.

**Solución Implementada**:

- HTTP-only cookies (no accesibles desde JS)
- Secure flag en producción (solo HTTPS)
- Token rotation en operaciones sensibles
- Logout invalida tokens del lado del servidor

## 📊 Rate Limiting

### Endpoints Protegidos

| Endpoint                    | Límite      | Ventana |
| --------------------------- | ----------- | ------- |
| `/api/auth/login`           | 5 intentos  | 15 min  |
| `/api/auth/register`        | 3 registros | 1 hora  |
| `/api/auth/forgot-password` | 3 intentos  | 1 hora  |
| `/api/auth/reset-password`  | 3 intentos  | 1 hora  |

### Implementación

```typescript
// Usando Vercel KV para rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
});
```

## 🔑 Gestión de Secrets

### ❌ NUNCA hacer esto:

```javascript
// ❌ NO commitear secrets
const API_KEY = 'sk_live_123456789';

// ❌ NO hardcodear secrets
const JWT_SECRET = 'my-secret-key';

// ❌ NO compartir secrets en chat/email
// ❌ NO exponer secrets en logs
console.log('API Key:', process.env.API_KEY);
```

### ✅ SIEMPRE hacer esto:

```javascript
// ✅ Usar variables de entorno
const API_KEY = process.env.RESEND_API_KEY;

// ✅ Verificar que existan en runtime
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

// ✅ Usar .env.local (en .gitignore)
// ✅ Rotar secrets regularmente
// ✅ Usar diferentes secrets por ambiente
```

## 🌐 Variables de Entorno

### Development (.env.local)

```bash
# Database
POSTGRES_URL=postgresql://...

# Auth
JWT_SECRET=<64-character-random-string>

# Email
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (Vercel)

**Configurar en Vercel Dashboard → Settings → Environment Variables**

- `POSTGRES_URL` - Neon database connection string
- `JWT_SECRET` - Same as local (or different for extra security)
- `RESEND_API_KEY` - Production API key (different from dev)
- `NEXT_PUBLIC_APP_URL` - https://tu-dominio.com

## 🔍 Logging y Monitoring

### ✅ Qué loguear:

- Intentos de login fallidos
- Password reset requests
- Cambios de contraseña
- Creación de usuarios
- Errores de autenticación

### ❌ NUNCA loguear:

- Contraseñas (ni siquiera hasheadas)
- Tokens de sesión
- API keys
- Información de tarjetas de crédito
- Datos personales sensibles

### Ejemplo Seguro:

```typescript
// ✅ SEGURO
console.log('[Login] Failed attempt for email:', email);

// ❌ INSEGURO
console.log('[Login] Password:', password);
console.log('[Login] Token:', token);
```

## 🔒 Password Requirements

### Validación de Contraseñas

```typescript
const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(100, 'La contraseña es demasiado larga')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial');
```

**Actual** (básico): Mínimo 6 caracteres
**Recomendado** (fuerte): Mínimo 8, con mayúsculas, números y símbolos

## 📱 HTTPS y Seguridad de Red

### En Producción:

- ✅ Usar HTTPS siempre (Vercel lo provee automáticamente)
- ✅ HSTS headers (HTTP Strict Transport Security)
- ✅ Secure cookies (solo HTTPS)
- ✅ CSP headers (Content Security Policy)

### Headers de Seguridad:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

## 🧪 Testing de Seguridad

### Herramientas Recomendadas:

1. **OWASP ZAP** - Escaneo de vulnerabilidades
2. **npm audit** - Vulnerabilidades en dependencias
3. **Snyk** - Monitoreo continuo de seguridad
4. **Have I Been Pwned API** - Verificar contraseñas comprometidas

### Comandos:

```bash
# Auditar dependencias
npm audit

# Fix automático
npm audit fix

# Reporte detallado
npm audit --json
```

## 📋 Checklist de Seguridad

### Antes de Deploy:

- [ ] Todas las API keys en variables de entorno
- [ ] `.env.local` en `.gitignore`
- [ ] HTTPS habilitado en producción
- [ ] Rate limiting implementado
- [ ] Password hashing con bcrypt
- [ ] JWT tokens con HTTP-only cookies
- [ ] Validación de inputs con Zod
- [ ] Headers de seguridad configurados
- [ ] Secrets rotados regularmente
- [ ] Logs no contienen información sensible
- [ ] Base de datos con conexión segura (SSL)

### Mantenimiento Regular:

- [ ] Rotar JWT_SECRET cada 3-6 meses
- [ ] Actualizar dependencias con `npm update`
- [ ] Revisar `npm audit` semanalmente
- [ ] Revisar logs de seguridad
- [ ] Backup de base de datos
- [ ] Monitorear intentos de login fallidos

## 🆘 Qué Hacer Si Hay Una Brecha

1. **Inmediato** (minutos):
   - Revocar todos los tokens comprometidos
   - Cambiar todas las API keys
   - Rotar JWT_SECRET
   - Invalidar todas las sesiones activas

2. **Corto Plazo** (horas):
   - Investigar el alcance del ataque
   - Notificar a usuarios afectados
   - Aplicar parches de seguridad
   - Documentar el incidente

3. **Largo Plazo** (días/semanas):
   - Auditoría completa de seguridad
   - Implementar medidas adicionales
   - Capacitación del equipo
   - Post-mortem y mejoras

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/security)
- [Vercel Security](https://vercel.com/docs/security)
- [bcrypt Best Practices](https://github.com/kelektiv/node.bcrypt.js#security-issues-and-concerns)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## ⚠️ Reportar Vulnerabilidades

Si encontrás una vulnerabilidad de seguridad:

1. **NO** crear un issue público en GitHub
2. **NO** compartir en redes sociales
3. **SÍ** enviar email a: tomymaritano@gmail.com
4. Incluir: descripción detallada, pasos para reproducir, impacto potencial

---

**Última actualización**: Octubre 2025
**Versión**: 1.0
**Mantenedor**: Dólar Gaucho Team
