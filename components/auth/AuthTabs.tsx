/**
 * AuthTabs Component
 *
 * Tab switcher between Login and Signup forms
 * Extracted from pages/auth.tsx
 */

import React from 'react';

export type AuthTab = 'login' | 'signup';

interface AuthTabsProps {
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="flex gap-2 mb-6 p-1 bg-panel/10 rounded-xl border border-white/5">
      <button
        onClick={() => onTabChange('login')}
        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
          activeTab === 'login'
            ? 'bg-brand text-white shadow-sm'
            : 'text-secondary hover:text-foreground hover:bg-panel/10'
        }`}
        type="button"
      >
        Iniciar Sesión
      </button>
      <button
        onClick={() => onTabChange('signup')}
        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
          activeTab === 'signup'
            ? 'bg-brand text-white shadow-sm'
            : 'text-secondary hover:text-foreground hover:bg-panel/10'
        }`}
        type="button"
      >
        Crear Cuenta
      </button>
    </div>
  );
}
