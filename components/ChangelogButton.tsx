'use client';

/**
 * Changelog Button
 *
 * Bell icon with notification badge for unseen changelog entries
 * Integrates with WhatsNew modal via ChangelogContext
 */

import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { useChangelog } from './WhatsNew';
import { getUnseenCount } from '@/lib/changelog';

const STORAGE_KEY = 'dg_last_seen_version';

export function ChangelogButton() {
  const { openChangelog } = useChangelog();
  const [unseenCount, setUnseenCount] = useState(0);

  useEffect(() => {
    // Calculate unseen count on mount and when storage changes
    const updateCount = () => {
      const lastSeenVersion = localStorage.getItem(STORAGE_KEY);
      const count = getUnseenCount(lastSeenVersion);
      setUnseenCount(count);
    };

    updateCount();

    // Listen for storage changes (when modal is closed)
    window.addEventListener('storage', updateCount);

    // Custom event for when changelog is viewed
    window.addEventListener('changelog-viewed', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('changelog-viewed', updateCount);
    };
  }, []);

  return (
    <button
      onClick={openChangelog}
      className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95"
      aria-label="Ver novedades"
    >
      <FaBell className="text-foreground text-lg" />

      {unseenCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-background">
          {unseenCount > 9 ? '9+' : unseenCount}
        </span>
      )}
    </button>
  );
}
