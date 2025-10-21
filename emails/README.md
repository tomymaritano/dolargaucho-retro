# Email Templates - React Email

Este directorio contiene los templates de email estructurados con **React Email**, una biblioteca moderna para crear emails usando React y TypeScript.

## 📦 Instalación

Los paquetes necesarios ya están instalados:

```bash
npm install @react-email/components @react-email/render -E
```

## 📧 Templates Disponibles

### 1. PriceAlertEmail (`templates/PriceAlertEmail.tsx`)

Email de alerta de precio cuando un activo (crypto/dólar/moneda) alcanza el valor objetivo configurado por el usuario.

**Props:**

```typescript
{
  assetName: string;          // Nombre del activo (ej: "Bitcoin")
  assetType: 'crypto' | 'dolar' | 'currency';
  currentPrice: number;       // Precio actual
  targetPrice: number;        // Precio objetivo alcanzado
  priceChange: number;        // Cambio de precio absoluto
  priceChangePercent: number; // Cambio de precio en porcentaje
  currency?: string;          // Moneda (USD/ARS)
}
```

**Uso:**

```tsx
import PriceAlertEmail from '@/emails/templates/PriceAlertEmail';
import { renderEmail } from '@/lib/email/render';

const html = await renderEmail(
  <PriceAlertEmail
    assetName="Bitcoin"
    assetType="crypto"
    currentPrice={50000}
    targetPrice={48000}
    priceChange={-2000}
    priceChangePercent={-4.0}
    currency="USD"
  />
);

// Enviar con tu servicio de email (Resend, SendGrid, etc.)
await sendEmail({
  to: 'user@example.com',
  subject: 'Bitcoin alcanzó tu precio objetivo',
  html,
});
```

### 2. WelcomeEmail (`templates/WelcomeEmail.tsx`)

Email de bienvenida para nuevos usuarios con introducción a las funcionalidades de DolarGaucho.

**Props:**

```typescript
{
  username?: string;      // Nombre del usuario
  dashboardUrl?: string;  // URL al dashboard
}
```

**Uso:**

```tsx
import WelcomeEmail from '@/emails/templates/WelcomeEmail';
import { renderEmail } from '@/lib/email/render';

const html = await renderEmail(
  <WelcomeEmail username="Juan Pérez" dashboardUrl="https://dolargaucho.app/dashboard" />
);
```

## 🎨 Diseño

Todos los templates siguen el design system de DolarGaucho:

- **Color primario:** `#0047FF` (BingX Blue)
- **Background oscuro:** `#0A0A0A`
- **Cards:** `#1A1A1A`
- **Borders:** `#27272A`
- **Tipografía:** System fonts (SF Pro, Segoe UI, Roboto)

## 🛠️ Utilities

### `lib/email/render.ts`

Funciones helper para renderizar emails:

```typescript
import { renderEmail, renderEmailText } from '@/lib/email/render';

// Renderizar a HTML
const html = await renderEmail(<YourEmailComponent />);

// Renderizar a texto plano
const text = await renderEmailText(<YourEmailComponent />);
```

## 📝 Crear Nuevos Templates

1. Crea un nuevo archivo en `emails/templates/`:

```tsx
// emails/templates/YourEmail.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface YourEmailProps {
  // tus props
}

export default function YourEmail({} /* props */ : YourEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your preview text</Preview>
      <Body style={main}>
        <Container style={container}>{/* Tu contenido */}</Container>
      </Body>
    </Html>
  );
}

// Estilos inline
const main = {
  backgroundColor: '#0A0A0A',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};
```

2. Importa y usa en tu código:

```tsx
import YourEmail from '@/emails/templates/YourEmail';
import { renderEmail } from '@/lib/email/render';

const html = await renderEmail(<YourEmail {...props} />);
```

## 🔗 Recursos

- [React Email Documentation](https://react.email/docs/introduction)
- [Components Reference](https://react.email/docs/components)
- [Examples Gallery](https://react.email/examples)

## 📧 Integración con Email Services

### Resend (Recomendado)

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'DolarGaucho <noreply@dolargaucho.app>',
  to: 'user@example.com',
  subject: 'Subject',
  html: await renderEmail(<YourEmail />),
});
```

### SendGrid

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: 'user@example.com',
  from: 'noreply@dolargaucho.app',
  subject: 'Subject',
  html: await renderEmail(<YourEmail />),
});
```

## ✅ Testing

Para previsualizar emails durante desarrollo:

1. Ejecuta el dev server de React Email (opcional):

```bash
npx react-email dev
```

2. O simplemente importa y renderiza en tu código para inspeccionar el HTML.

## 🎯 Best Practices

- ✅ Usa estilos inline (React Email los maneja automáticamente)
- ✅ Mantén layouts simples (tables son más confiables que flexbox/grid)
- ✅ Testea en múltiples clientes (Gmail, Outlook, Apple Mail)
- ✅ Incluye siempre un Preview text
- ✅ Usa imágenes alojadas (URLs absolutas)
- ✅ Mantén ancho máximo de 600px
- ✅ Evita JavaScript (no funciona en emails)
