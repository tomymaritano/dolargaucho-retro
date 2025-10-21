/**
 * Welcome Email Template
 *
 * Sent when a user registers on Dólar Gaucho
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  name?: string;
  email: string;
}

export const WelcomeEmail = ({ name, email }: WelcomeEmailProps) => {
  const displayName = name || email.split('@')[0];

  return (
    <Html>
      <Head />
      <Preview>Bienvenido a Dólar Gaucho - Tu plataforma de cotizaciones en tiempo real</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoContainer}>
            <Heading style={title}>Dólar Gaucho</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>¡Bienvenido {displayName}!</Heading>

            <Text style={text}>
              Gracias por registrarte en <strong>Dólar Gaucho</strong>, tu plataforma para seguir
              cotizaciones de dólar, crypto y datos económicos en tiempo real.
            </Text>

            <Text style={text}>Con tu cuenta ahora podés:</Text>

            <ul style={list}>
              <li>
                <Text style={listItem}>✅ Guardar tus cotizaciones favoritas</Text>
              </li>
              <li>
                <Text style={listItem}>✅ Configurar alertas de precio personalizadas</Text>
              </li>
              <li>
                <Text style={listItem}>✅ Acceder a calculadoras financieras avanzadas</Text>
              </li>
              <li>
                <Text style={listItem}>✅ Ver gráficos históricos y análisis técnico</Text>
              </li>
            </ul>

            <Section style={buttonContainer}>
              <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
                Ir al Dashboard
              </Button>
            </Section>

            <Text style={text}>
              Si tenés alguna pregunta o sugerencia, no dudes en contactarnos respondiendo este
              email.
            </Text>

            <Text style={text}>
              ¡Gracias por confiar en nosotros!
              <br />
              <strong>El equipo de Dólar Gaucho</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>© 2025 Dólar Gaucho. Todos los derechos reservados.</Text>
            <Text style={footerText}>
              <Link style={link} href={`${process.env.NEXT_PUBLIC_APP_URL}/politica-privacidad`}>
                Política de Privacidad
              </Link>
              {' • '}
              <Link style={link} href={`${process.env.NEXT_PUBLIC_APP_URL}/terminos`}>
                Términos de Servicio
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoContainer = {
  textAlign: 'center' as const,
  padding: '32px 0 24px',
  borderBottom: '1px solid #e5e7eb',
};

const title = {
  margin: '0',
  fontSize: '32px',
  fontWeight: '700',
  color: '#00D084',
  textAlign: 'center' as const,
};

const content = {
  padding: '32px 40px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 24px',
  padding: '0',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const list = {
  paddingLeft: '20px',
  margin: '16px 0',
};

const listItem = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#00D084',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const footer = {
  padding: '0 40px',
  borderTop: '1px solid #e5e7eb',
  paddingTop: '24px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '8px 0',
};

const link = {
  color: '#00D084',
  textDecoration: 'underline',
};
