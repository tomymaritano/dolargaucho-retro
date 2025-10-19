/**
 * Footer Component - Landing Page Version
 * Professional fintech-style footer focused on user needs
 *
 * Features:
 * - Clear navigation sections
 * - Legal information
 * - Contact & social
 * - No tech stack (internal info, not user-relevant)
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/GradientText';
import { SocialLinks } from '@/components/ui/SocialLinks';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Producto',
      links: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Cotizaciones', href: '/dashboard' },
        { label: 'Calculadoras', href: '/dashboard/calculadoras' },
        { label: 'Alertas', href: '/dashboard/alertas' },
      ],
    },
    {
      title: 'Recursos',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Roadmap', href: '/roadmap' },
        { label: 'Guías', href: '/help' },
        { label: 'API', href: '/dashboard', badge: 'Pronto' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Términos de Uso', href: '/dashboard' },
        { label: 'Privacidad', href: '/dashboard' },
        { label: 'Disclaimer', href: '#disclaimer' },
      ],
    },
  ];

  return (
    <footer className="relative w-full bg-panel text-foreground border-t border-white/5 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Image src="/logo.svg" width={40} height={40} alt="Dolar Gaucho" />
              </motion.div>
              <div>
                <div className="font-display font-bold text-xl">
                  <GradientText className="font-black">Dólar Gaucho</GradientText>
                </div>
                <div className="text-[10px] text-secondary uppercase tracking-wider">
                  Dashboard Profesional
                </div>
              </div>
            </Link>
            <p className="text-sm text-secondary max-w-sm leading-relaxed mb-6">
              Dashboard profesional con cotizaciones del dólar, criptomonedas, indicadores
              económicos y herramientas financieras. Datos actualizados de fuentes oficiales.
            </p>

            {/* Social Links */}
            <SocialLinks size="md" />
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            >
              <h3 className="text-sm font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm text-secondary hover:text-brand transition-colors inline-flex items-center gap-2"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded uppercase font-bold">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Data Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-6 border-t border-white/5"
        >
          <h3 className="text-xs font-semibold text-secondary mb-3 uppercase tracking-wider">
            Fuentes de Datos Oficiales
          </h3>
          <p className="text-xs text-secondary">
            DolarAPI • ArgentinaDatos (BCRA/INDEC) • CoinGecko • FRED • ECB • Congreso Argentino
          </p>
        </motion.div>

        {/* Copyright & Legal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-6 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary">
            <p className="text-center md:text-left">
              © {currentYear} <span className="font-semibold text-foreground">Dólar Gaucho</span>.
              Información solo para fines educativos. No constituye asesoramiento financiero.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="hover:text-brand transition-colors">
                Términos
              </Link>
              <Link href="/dashboard" className="hover:text-brand transition-colors">
                Privacidad
              </Link>
              <a
                href="mailto:contacto@dolargaucho.com"
                className="hover:text-brand transition-colors"
              >
                Contacto
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
