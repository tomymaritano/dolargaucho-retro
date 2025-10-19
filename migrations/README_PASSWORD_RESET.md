# Password Reset System - Migration Guide

## Overview

Sistema completo de recuperación de contraseña con tokens seguros y expiración automática.

## Database Migration

### 1. Apply Migration

Ejecuta el siguiente comando para crear la tabla `password_reset_tokens`:

```bash
# Si usas Vercel Postgres
npx vercel env pull .env.local
psql $POSTGRES_URL -f migrations/004_password_reset_tokens.sql

# O manualmente en tu cliente SQL favorito
# Ejecuta el contenido de: migrations/004_password_reset_tokens.sql
```

### 2. Verify Migration

```sql
-- Verifica que la tabla se creó correctamente
\dt password_reset_tokens

-- Debería mostrar:
-- user_id      | uuid
-- token        | varchar(255)
-- expires_at   | timestamp with time zone
-- created_at   | timestamp with time zone
```

## Email Configuration

### Development (Default)

Por defecto, los emails se logean en la consola:

```
📧 PASSWORD RESET EMAIL
================================================================================
To: user@example.com
Name: Usuario
Reset URL: http://localhost:3000/reset-password?token=abc123...
================================================================================
```

### Production (Recommended: Resend)

1. **Instala Resend**:

```bash
npm install resend
```

2. **Configura variables de entorno** (`.env.local`):

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

3. **Descomenta el código en** `lib/email/password-reset.ts`:

```typescript
// Líneas 23-43 del archivo
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Dólar Gaucho <noreply@dolargaucho.com>',
  to: email,
  subject: 'Restablecer tu contraseña',
  html: `...`,
});
```

### Alternative Email Services

Puedes usar otros servicios como:

- **SendGrid**: `npm install @sendgrid/mail`
- **Nodemailer**: `npm install nodemailer`
- **AWS SES**: `npm install @aws-sdk/client-ses`

## Features Implemented

### ✅ Security

- Tokens de 64 caracteres (hex)
- Expiración automática (1 hora)
- Un token por usuario (no acumulación)
- Mensajes genéricos para prevenir email enumeration
- Tokens eliminados después de uso

### ✅ API Endpoints

- `POST /api/auth/forgot-password` - Solicita reset de contraseña
- `POST /api/auth/reset-password` - Actualiza contraseña con token

### ✅ Pages

- `/forgot-password` - Formulario de solicitud
- `/reset-password?token=xxx` - Formulario de nueva contraseña

### ✅ UX

- Validación de contraseñas (min 8 caracteres)
- Estados de loading
- Mensajes de éxito/error claros
- Redirección automática al login
- Link en página de login

## Testing

### 1. Test Forgot Password Flow

```bash
# Inicia sesión con un usuario de prueba
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verifica la consola del servidor para ver el token
# Copia el token y úsalo en el siguiente paso
```

### 2. Test Reset Password Flow

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"<TOKEN_FROM_CONSOLE>",
    "password":"nueva_contraseña_segura"
  }'
```

### 3. Test UI Flow

1. Navega a `http://localhost:3000/login`
2. Click en "¿Olvidaste tu contraseña?"
3. Ingresa tu email
4. Copia el token de la consola del servidor
5. Navega a `http://localhost:3000/reset-password?token=<TOKEN>`
6. Ingresa nueva contraseña
7. Deberías ser redirigido al login

## Maintenance

### Cleanup Expired Tokens (Optional)

Puedes crear un cron job para limpiar tokens expirados:

```typescript
// pages/api/cron/cleanup-tokens.ts
import { cleanupExpiredTokens } from '@/lib/auth/password-reset';

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await cleanupExpiredTokens();
  return res.status(200).json({ success: true });
}
```

Y configuralo en Vercel:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-tokens",
      "schedule": "0 * * * *"
    }
  ]
}
```

## Troubleshooting

### Error: "relation 'password_reset_tokens' does not exist"

- Asegúrate de ejecutar la migración: `migrations/004_password_reset_tokens.sql`

### Emails no se envían

- **Development**: Verifica la consola del servidor
- **Production**: Verifica `RESEND_API_KEY` y descomenta código en `lib/email/password-reset.ts`

### Token inválido o expirado

- Los tokens expiran en 1 hora
- Solo se puede usar un token por usuario
- El token se elimina después de uso exitoso

## Next Steps

1. ✅ Ejecutar migración de base de datos
2. ⚠️ Configurar servicio de emails para producción
3. ✅ Testear el flujo completo
4. ⚠️ (Opcional) Configurar cron job de limpieza
5. ⚠️ (Opcional) Agregar rate limiting a forgot-password endpoint

## Support

Si encuentras problemas, verifica:

- Logs del servidor
- Estado de la base de datos
- Variables de entorno
