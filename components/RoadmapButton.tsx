'use client';

/**
 * Roadmap Button
 *
 * Rocket icon button that links to the public roadmap page
 * Shows planned features and timeline
 */

import React from 'react';
import Link from 'next/link';
import { FaRocket } from 'react-icons/fa';

export function RoadmapButton() {
  return (
    <Link
      href="/roadmap"
      className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-panel/10 hover:bg-panel/20 border border-border/5 transition-all hover:scale-105 active:scale-95"
      aria-label="Ver roadmap"
    >
      <FaRocket className="text-foreground text-lg" />
    </Link>
  );
}
