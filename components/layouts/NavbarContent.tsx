/**
 * NavbarContent Component
 *
 * Single Responsibility: Render main navbar content (logo + actions)
 * Extracted from UnifiedNavbar.tsx (363 → 80 lines)
 *
 * Professional hover improvements:
 * - Logo glow effect on hover
 * - Button scale animations (1.10x)
 * - Color transitions on icons
 */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaBars, FaTimes, FaUser, FaChevronDown } from 'react-icons/fa';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { RiesgoPaisBadge } from '@/components/ui/RiesgoPaisBadge/RiesgoPaisBadge';
import { useDolarTypeStore } from '@/lib/store/dolarType';
import type { DolarType } from '@/types/api/dolar';

interface NavbarContentProps {
  menuOpen: boolean;
  searchOpen: boolean;
  userName?: string;
  onMenuToggle: () => void;
  onSearchToggle: () => void;
}

const dolarTypeConfig = {
  blue: { label: 'Blue' },
  oficial: { label: 'Oficial' },
  cripto: { label: 'Cripto' },
};

export function NavbarContent({
  menuOpen,
  searchOpen,
  userName,
  onMenuToggle,
  onSearchToggle,
}: NavbarContentProps) {
  const { selectedType, setDolarType } = useDolarTypeStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectType = (type: DolarType) => {
    setDolarType(type);
    setDropdownOpen(false);
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group z-50">
          <Image
            src="/logo.svg"
            width={40}
            height={40}
            alt="Dolar Gaucho"
            className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-200 group-hover:scale-105"
          />
          <div className="hidden sm:block">
            <div className="font-display font-bold text-lg text-foreground group-hover:text-brand transition-colors duration-200">
              Dólar Gaucho
            </div>
            <div className="text-[10px] text-secondary uppercase tracking-wider">Pro</div>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSearchToggle}
            className="p-3 rounded-full hover:bg-background-secondary/50 transition-all duration-200"
            aria-label="Buscar"
          >
            <FaSearch className="text-base text-foreground/70" />
          </button>

          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <Link
            href="/dashboard/perfil"
            className="hidden md:flex p-3 rounded-full hover:bg-background-secondary/50 transition-all duration-200 group"
            aria-label="Mi perfil"
            title={userName || 'Mi perfil'}
          >
            <FaUser className="text-base text-foreground/70 group-hover:text-brand transition-colors" />
          </Link>

          <button
            onClick={onMenuToggle}
            className="p-3 rounded-full hover:bg-background-secondary/50 transition-all duration-200 z-50"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? (
              <FaTimes className="text-base text-foreground/70" />
            ) : (
              <FaBars className="text-base text-foreground/70" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
