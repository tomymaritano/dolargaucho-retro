import React from 'react';
import Link from 'next/link';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/tomymaritano', label: 'GitHub' },
    { icon: FaTwitter, href: 'https://twitter.com/tomymaritano', label: 'Twitter' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/tomymaritano', label: 'LinkedIn' },
  ];

  return (
    <footer className="relative w-full bg-panel text-foreground py-10 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright text */}
          <div className="text-center md:text-left">
            <p className="text-secondary text-sm flex items-center gap-2 flex-wrap justify-center md:justify-start">
              © {currentYear}
              <span className="font-semibold text-foreground">Dólar Gaucho Pro</span>
              <span className="hidden md:inline">•</span>
              <span>Todos los derechos reservados</span>
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg glass hover:bg-accent-emerald/10 text-secondary hover:text-accent-emerald transition-all hover:scale-110"
                aria-label={social.label}
              >
                <social.icon />
              </a>
            ))}
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-6 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-secondary text-center md:text-left">
            <span className="inline-flex items-center gap-1">
              <div className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse"></div>
              Datos en tiempo real
            </span>
            <span className="mx-2 hidden md:inline">•</span>
            <span>Open Source</span>
          </div>
          <div className="flex gap-4 text-xs text-secondary">
            <Link href="/help" className="hover:text-accent-emerald transition-colors font-medium">
              Help Center
            </Link>
            <a href="#" className="hover:text-accent-emerald transition-colors">
              Términos
            </a>
            <a href="#" className="hover:text-accent-emerald transition-colors">
              Privacidad
            </a>
            <a href="#contacto" className="hover:text-accent-emerald transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
