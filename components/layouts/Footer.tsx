/**
 * Footer Component - Dashboard Version
 * Professional fintech-style footer focused on user needs
 *
 * Features:
 * - Clear navigation by category
 * - Legal information and disclaimer
 * - Contact & social links
 * - Data sources transparency
 * - No tech stack (internal info, not user-relevant)
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaChartLine, FaTools, FaInfoCircle, FaUniversity, FaShieldAlt } from 'react-icons/fa';
import { GradientText } from '@/components/ui/GradientText';
import { SocialLinks } from '@/components/ui/SocialLinks';

const footerSections = [
  {
    title: 'Navegación',
    icon: FaChartLine,
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Mercados', href: '/dashboard/mercados' },
      { label: 'Economía', href: '/dashboard/economia' },
      { label: 'Herramientas', href: '/dashboard/herramientas' },
      { label: 'Política', href: '/dashboard/politica' },
    ],
  },
  {
    title: 'Herramientas',
    icon: FaTools,
    links: [
      { label: 'Calculadoras', href: '/dashboard/calculadoras' },
      { label: 'Alertas', href: '/dashboard/alertas' },
      { label: 'Calendario', href: '/dashboard/calendario' },
      { label: 'Favoritos', href: '/dashboard' },
    ],
  },
  {
    title: 'Recursos',
    icon: FaInfoCircle,
    links: [
      { label: 'Ayuda', href: '/help' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'API Docs', href: '/dashboard', isComingSoon: true },
      { label: 'Blog', href: '/dashboard', isComingSoon: true },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-panel mt-12 border-t border-white/5 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent pointer-events-none" />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Link href="/dashboard" className="inline-flex items-center gap-3 mb-4 group">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring' }}>
                <Image
                  src="/logo.svg"
                  width={40}
                  height={40}
                  alt="Dolar Gaucho"
                  className="w-10 h-10"
                />
              </motion.div>
              <div>
                <div className="font-display font-bold text-xl">
                  <GradientText className="font-black">Dólar Gaucho</GradientText>
                </div>
                <div className="text-xs text-secondary uppercase tracking-wider">
                  Dashboard Profesional
                </div>
              </div>
            </Link>
            <p className="text-sm text-secondary leading-relaxed mb-6 max-w-md">
              Cotizaciones en tiempo real, calculadoras financieras, y análisis económico. Todo en
              un solo lugar, 100% gratuito.
            </p>

            {/* Social Links - Enhanced */}
            <SocialLinks size="md" />
          </motion.div>

          {/* Navigation Sections */}
          {footerSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              >
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon className="text-brand" />
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={linkIndex}
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {link.isComingSoon ? (
                        <span className="text-sm text-secondary/50 cursor-not-allowed flex items-center gap-2">
                          {link.label}
                          <span className="text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded uppercase font-bold">
                            Pronto
                          </span>
                        </span>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-secondary hover:text-brand transition-colors inline-block"
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Data Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 mb-8 border-t border-white/5"
        >
          <h3 className="text-xs font-semibold text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
            <FaUniversity className="text-brand" />
            Fuentes de Datos Oficiales
          </h3>
          <p className="text-xs text-secondary">
            DolarAPI • ArgentinaDatos (BCRA/INDEC) • CoinGecko • FRED • ECB • Congreso Argentino
          </p>
        </motion.div>

        {/* Disclaimer - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-8"
        >
          <div className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-brand/5 border border-brand/20">
            <FaShieldAlt className="text-brand text-lg flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Aviso Legal Importante</h4>
              <p className="text-xs text-secondary leading-relaxed">
                La información proporcionada en este sitio web es solo para fines informativos y
                educativos. No constituye asesoramiento financiero, legal o de inversión. Las
                cotizaciones mostradas son referenciales y pueden variar según la fuente. Consulte
                con un profesional antes de tomar decisiones financieras. No nos hacemos
                responsables por pérdidas o daños derivados del uso de esta información.
              </p>
            </div>
          </div>

          {/* Copyright & Legal Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary pt-6 border-t border-white/5">
            <p className="text-center sm:text-left">
              © {currentYear} <span className="font-semibold text-foreground">Dólar Gaucho</span>.
              Información solo para fines educativos. No constituye asesoramiento financiero.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="hover:text-brand transition-colors">
                Términos de Uso
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
}
