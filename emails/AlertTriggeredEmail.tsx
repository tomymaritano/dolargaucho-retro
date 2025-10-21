/**
 * Alert Triggered Email Template
 *
 * Sent when a price alert is triggered
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

interface AlertTriggeredEmailProps {
  name?: string;
  email: string;
  alertName: string;
  alertType: 'dolar' | 'inflacion' | 'riesgo-pais' | 'uva' | 'tasa';
  condition: 'mayor' | 'menor' | 'igual';
  targetValue: number;
  currentValue: number;
  message?: string;
}

export const AlertTriggeredEmail = ({
  name,
  email,
  alertName,
  alertType,
  condition,
  targetValue,
  currentValue,
  message,
}: AlertTriggeredEmailProps) => {
  const displayName = name || email.split('@')[0];

  const conditionText = {
    mayor: 'superó',
    menor: 'bajó de',
    igual: 'alcanzó',
  };

  const alertTypeText = {
    dolar: 'Dólar',
    inflacion: 'Inflación',
    'riesgo-pais': 'Riesgo País',
    uva: 'UVA',
    tasa: 'Tasa',
  };

  return (
    <Html>
      <Head />
      <Preview>{alertName} - Tu alerta se disparó en Dólar Gaucho</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoContainer}>
            <Heading style={title}>Dólar Gaucho</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Section style={alertBadge}>
              <Text style={alertBadgeText}>🔔 ALERTA DISPARADA</Text>
            </Section>

            <Heading style={h1}>{alertName}</Heading>

            <Text style={text}>Hola {displayName},</Text>

            <Text style={text}>
              Tu alerta <strong>{alertName}</strong> se ha disparado.
            </Text>

            <Section style={dataBox}>
              <table style={table}>
                <tr>
                  <td style={tableCell}>
                    <Text style={tableLabel}>Tipo</Text>
                    <Text style={tableValue}>{alertTypeText[alertType]}</Text>
                  </td>
                  <td style={tableCell}>
                    <Text style={tableLabel}>Condición</Text>
                    <Text style={tableValue}>{conditionText[condition]}</Text>
                  </td>
                </tr>
                <tr>
                  <td style={tableCell}>
                    <Text style={tableLabel}>Objetivo</Text>
                    <Text style={tableValue}>${targetValue.toFixed(2)}</Text>
                  </td>
                  <td style={tableCell}>
                    <Text style={tableLabel}>Valor Actual</Text>
                    <Text style={tableValueHighlight}>${currentValue.toFixed(2)}</Text>
                  </td>
                </tr>
              </table>
            </Section>

            {message && (
              <Section style={messageBox}>
                <Text style={messageText}>
                  <strong>Mensaje:</strong> {message}
                </Text>
              </Section>
            )}

            <Section style={buttonContainer}>
              <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/alertas`}>
                Ver mis alertas
              </Button>
            </Section>

            <Text style={text}>
              Podés gestionar tus alertas desde el{' '}
              <Link style={link} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/alertas`}>
                panel de alertas
              </Link>
              .
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
              <Link style={link} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/alertas`}>
                Gestionar alertas
              </Link>
              {' • '}
              <Link style={link} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/perfil`}>
                Configuración
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AlertTriggeredEmail;

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

const alertBadge = {
  backgroundColor: '#f59e0b',
  borderRadius: '8px',
  padding: '8px 16px',
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const alertBadgeText = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '700',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
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

const dataBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const table = {
  width: '100%',
};

const tableCell = {
  padding: '12px 0',
};

const tableLabel = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 4px',
};

const tableValue = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
};

const tableValueHighlight = {
  color: '#00D084',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0',
};

const messageBox = {
  backgroundColor: '#eff6ff',
  border: '1px solid #60a5fa',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const messageText = {
  color: '#1e40af',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
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
