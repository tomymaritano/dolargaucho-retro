/**
 * Welcome Email Template
 *
 * Email template for new user welcome using React Email
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  username?: string;
  dashboardUrl?: string;
}

export default function WelcomeEmail({
  username = 'Usuario',
  dashboardUrl = 'https://dolargaucho.app/dashboard',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenido a DolarGaucho - Tu plataforma de cotizaciones en tiempo real</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://dolargaucho.app/logo.svg"
              width="64"
              height="64"
              alt="DolarGaucho"
              style={logo}
            />
            <Heading style={h1}>¡Bienvenido a DolarGaucho!</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hola {username},</Text>

            <Text style={paragraph}>
              Gracias por unirte a <strong>DolarGaucho</strong>, tu plataforma completa para seguir
              cotizaciones del dólar, criptomonedas, y mercados internacionales en tiempo real.
            </Text>

            {/* Feature Cards */}
            <Section style={featuresSection}>
              <Text style={featuresTitle}>¿Qué puedes hacer en DolarGaucho?</Text>

              <Section style={featureCard}>
                <Text style={featureIcon}>💵</Text>
                <Text style={featureTitle}>Cotizaciones en Tiempo Real</Text>
                <Text style={featureText}>
                  Seguí todas las cotizaciones del dólar (oficial, blue, MEP, CCL), monedas
                  internacionales y criptomonedas actualizadas cada minuto.
                </Text>
              </Section>

              <Section style={featureCard}>
                <Text style={featureIcon}>📊</Text>
                <Text style={featureTitle}>Gráficos y Análisis</Text>
                <Text style={featureText}>
                  Visualizá tendencias históricas con sparklines, compará precios, y tomá mejores
                  decisiones financieras con datos precisos.
                </Text>
              </Section>

              <Section style={featureCard}>
                <Text style={featureIcon}>🔔</Text>
                <Text style={featureTitle}>Alertas Personalizadas</Text>
                <Text style={featureText}>
                  Configurá alertas de precio para recibir notificaciones cuando un activo alcance
                  tu valor objetivo. Nunca te pierdas una oportunidad.
                </Text>
              </Section>

              <Section style={featureCard}>
                <Text style={featureIcon}>⭐</Text>
                <Text style={featureTitle}>Favoritos</Text>
                <Text style={featureText}>
                  Guardá tus cotizaciones favoritas para acceder rápidamente a la información que
                  más te interesa.
                </Text>
              </Section>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button href={dashboardUrl} style={button}>
                Ir al Dashboard
              </Button>
            </Section>

            {/* Tips Section */}
            <Section style={tipsSection}>
              <Text style={tipsTitle}>💡 Consejos para empezar</Text>
              <Text style={tipText}>
                • Agregá tus cotizaciones favoritas haciendo clic en la estrella ⭐
              </Text>
              <Text style={tipText}>
                • Configurá alertas de precio desde el panel de Alertas 🔔
              </Text>
              <Text style={tipText}>• Usá las calculadoras para simular inversiones 🧮</Text>
              <Text style={tipText}>• Explorá los gráficos para ver tendencias históricas 📈</Text>
            </Section>

            <Hr style={divider} />

            <Text style={paragraph}>
              Si tenés alguna pregunta o necesitás ayuda, no dudes en contactarnos. ¡Estamos para
              ayudarte!
            </Text>

            <Text style={signature}>
              Saludos,
              <br />
              El equipo de DolarGaucho
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} DolarGaucho. Todos los derechos reservados.
            </Text>
            <Text style={footerText}>
              <Link href="https://dolargaucho.app/help" style={footerLink}>
                Centro de Ayuda
              </Link>
              {' · '}
              <Link href="https://dolargaucho.app/privacidad" style={footerLink}>
                Privacidad
              </Link>
              {' · '}
              <Link href="https://dolargaucho.app/terminos" style={footerLink}>
                Términos
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#0A0A0A',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '40px',
};

const logo = {
  margin: '0 auto',
  marginBottom: '24px',
};

const h1 = {
  color: '#FFFFFF',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
  lineHeight: '1.3',
};

const content = {
  backgroundColor: '#1A1A1A',
  borderRadius: '12px',
  padding: '40px',
};

const greeting = {
  color: '#FFFFFF',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 24px 0',
};

const paragraph = {
  color: '#A1A1AA',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px 0',
};

const featuresSection = {
  margin: '32px 0',
};

const featuresTitle = {
  color: '#FFFFFF',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 24px 0',
};

const featureCard = {
  backgroundColor: '#0A0A0A',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 16px 0',
  border: '1px solid #27272A',
};

const featureIcon = {
  fontSize: '32px',
  margin: '0 0 12px 0',
};

const featureTitle = {
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const featureText = {
  color: '#A1A1AA',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '40px 0',
};

const button = {
  backgroundColor: '#0047FF',
  borderRadius: '8px',
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
};

const tipsSection = {
  backgroundColor: '#0A0A0A',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
  border: '1px solid #27272A',
};

const tipsTitle = {
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 16px 0',
};

const tipText = {
  color: '#A1A1AA',
  fontSize: '14px',
  lineHeight: '1.8',
  margin: '0 0 8px 0',
};

const signature = {
  color: '#A1A1AA',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '32px 0 0 0',
};

const divider = {
  borderColor: '#27272A',
  margin: '32px 0',
};

const footer = {
  textAlign: 'center' as const,
  marginTop: '40px',
};

const footerText = {
  color: '#71717A',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '8px 0',
};

const footerLink = {
  color: '#0047FF',
  textDecoration: 'none',
};
