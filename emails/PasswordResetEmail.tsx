/**
 * Password Reset Email Template
 *
 * Sent when a user requests a password reset
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

interface PasswordResetEmailProps {
  name?: string;
  email: string;
  resetLink: string;
}

export const PasswordResetEmail = ({ name, email, resetLink }: PasswordResetEmailProps) => {
  const displayName = name || email.split('@')[0];

  return (
    <Html>
      <Head />
      <Preview>Restablecé tu contraseña de Dólar Gaucho</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoContainer}>
            <Heading style={title}>Dólar Gaucho</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Restablecer contraseña</Heading>

            <Text style={text}>Hola {displayName},</Text>

            <Text style={text}>
              Recibimos una solicitud para restablecer la contraseña de tu cuenta en{' '}
              <strong>Dólar Gaucho</strong>.
            </Text>

            <Text style={text}>
              Hacé click en el botón de abajo para crear una nueva contraseña:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetLink}>
                Restablecer contraseña
              </Button>
            </Section>

            <Text style={text}>
              O copiá y pegá este enlace en tu navegador:
              <br />
              <Link style={link} href={resetLink}>
                {resetLink}
              </Link>
            </Text>

            <Section style={warningBox}>
              <Text style={warningText}>
                <strong>⚠️ Importante:</strong> Este enlace expirará en <strong>1 hora</strong>.
              </Text>
            </Section>

            <Text style={text}>
              Si no solicitaste restablecer tu contraseña, podés ignorar este email de forma segura.
              Tu contraseña actual no será modificada.
            </Text>

            <Text style={text}>
              Saludos,
              <br />
              <strong>El equipo de Dólar Gaucho</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>© 2025 Dólar Gaucho. Todos los derechos reservados.</Text>
            <Text style={footerText}>
              Si tenés problemas con el botón, copiá y pegá el enlace en tu navegador.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;

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

const warningBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fbbf24',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const warningText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
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
  wordBreak: 'break-all' as const,
};
