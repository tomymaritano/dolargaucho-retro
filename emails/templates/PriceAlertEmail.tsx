/**
 * Price Alert Email Template
 *
 * Email template for crypto/dolar price alerts using React Email
 */

import {
  Body,
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

interface PriceAlertEmailProps {
  assetName: string;
  assetType: 'crypto' | 'dolar' | 'currency';
  currentPrice: number;
  targetPrice: number;
  priceChange: number;
  priceChangePercent: number;
  currency?: string;
}

export default function PriceAlertEmail({
  assetName = 'Bitcoin',
  assetType = 'crypto',
  currentPrice = 50000,
  targetPrice = 48000,
  priceChange = -2000,
  priceChangePercent = -4.0,
  currency = 'USD',
}: PriceAlertEmailProps) {
  const isPositive = priceChange >= 0;
  const assetTypeLabel =
    assetType === 'crypto' ? 'Criptomoneda' : assetType === 'dolar' ? 'Dólar' : 'Moneda';

  return (
    <Html>
      <Head />
      <Preview>
        {assetName} alcanzó tu precio objetivo de {currency === 'USD' ? '$' : ''}
        {targetPrice.toLocaleString('es-AR')}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://dolargaucho.app/logo.svg"
              width="50"
              height="50"
              alt="DolarGaucho"
              style={logo}
            />
            <Heading style={h1}>DolarGaucho</Heading>
          </Section>

          {/* Alert Banner */}
          <Section style={alertBanner}>
            <Text style={alertText}>🔔 Alerta de Precio</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              {assetName} alcanzó tu objetivo
            </Heading>

            <Text style={paragraph}>
              El precio de <strong>{assetName}</strong> ({assetTypeLabel}) alcanzó tu precio
              objetivo.
            </Text>

            {/* Price Card */}
            <Section style={priceCard}>
              <Text style={label}>Precio Actual</Text>
              <Text style={price}>
                {currency === 'USD' ? '$' : currency === 'ARS' ? '$' : ''}
                {currentPrice.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>

              <Section style={changeSection}>
                <Text style={isPositive ? changePositive : changeNegative}>
                  {isPositive ? '▲' : '▼'}{' '}
                  {currency === 'USD' ? '$' : currency === 'ARS' ? '$' : ''}
                  {Math.abs(priceChange).toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  ({isPositive ? '+' : ''}
                  {priceChangePercent.toFixed(2)}%)
                </Text>
              </Section>

              <Hr style={divider} />

              <Text style={label}>Precio Objetivo</Text>
              <Text style={targetPriceText}>
                {currency === 'USD' ? '$' : currency === 'ARS' ? '$' : ''}
                {targetPrice.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link href="https://dolargaucho.app/dashboard" style={button}>
                Ver en Dashboard
              </Link>
            </Section>

            <Text style={paragraph}>
              Este email fue enviado porque configuraste una alerta de precio para {assetName}.
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} DolarGaucho. Todos los derechos reservados.
            </Text>
            <Text style={footerText}>
              <Link href="https://dolargaucho.app/dashboard/alertas" style={footerLink}>
                Gestionar Alertas
              </Link>
              {' · '}
              <Link href="https://dolargaucho.app/privacidad" style={footerLink}>
                Privacidad
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
  marginBottom: '32px',
};

const logo = {
  margin: '0 auto',
  marginBottom: '16px',
};

const h1 = {
  color: '#FFFFFF',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
  lineHeight: '1.3',
};

const h2 = {
  color: '#FFFFFF',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 16px 0',
  lineHeight: '1.3',
};

const alertBanner = {
  backgroundColor: '#0047FF',
  borderRadius: '12px',
  padding: '16px',
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const alertText = {
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const content = {
  backgroundColor: '#1A1A1A',
  borderRadius: '12px',
  padding: '32px',
};

const paragraph = {
  color: '#A1A1AA',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const priceCard = {
  backgroundColor: '#0A0A0A',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
  border: '1px solid #27272A',
};

const label = {
  color: '#71717A',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px 0',
};

const price = {
  color: '#0047FF',
  fontSize: '36px',
  fontWeight: '700',
  margin: '0 0 12px 0',
};

const changeSection = {
  marginBottom: '16px',
};

const changePositive = {
  color: '#10B981',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const changeNegative = {
  color: '#EF4444',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const targetPriceText = {
  color: '#FFFFFF',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
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
  padding: '14px 32px',
};

const divider = {
  borderColor: '#27272A',
  margin: '24px 0',
};

const footer = {
  textAlign: 'center' as const,
  marginTop: '32px',
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
