'use client';

/**
 * DashboardPreview - Mockup visual del dashboard sin imágenes
 *
 * Usa componentes reales para mostrar cómo se ve el dashboard
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface DashboardPreviewProps {
  variant?: 'dashboard' | 'politics' | 'calculator';
}

export const DashboardPreview = React.memo(function DashboardPreview({
  variant = 'dashboard',
}: DashboardPreviewProps) {
  if (variant === 'dashboard') {
    return (
      <div className="bg-gradient-to-br from-background via-background to-background-secondary rounded-2xl p-6 border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">Dashboard Principal</h3>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-green-500">En vivo</span>
          </div>
        </div>

        {/* Dólar Cards Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { name: 'Oficial', compra: '$1,024', venta: '$1,064', change: '+1.2%', up: true },
            { name: 'Blue', compra: '$1,185', venta: '$1,205', change: '+0.8%', up: true },
            { name: 'MEP', compra: '$1,156', venta: '$1,161', change: '-0.3%', up: false },
            { name: 'CCL', compra: '$1,172', venta: '$1,178', change: '+0.5%', up: true },
          ].map((dolar, i) => (
            <motion.div
              key={dolar.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-panel border border-white/5 rounded-xl p-3"
            >
              <div className="text-xs text-secondary mb-1">{dolar.name}</div>
              <div className="text-lg font-bold text-foreground mb-1">{dolar.venta}</div>
              <div
                className={`text-xs font-medium flex items-center gap-1 ${
                  dolar.up ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {dolar.up ? <FaArrowUp /> : <FaArrowDown />}
                {dolar.change}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini Chart */}
        <div className="bg-panel border border-white/5 rounded-xl p-4">
          <div className="text-xs text-secondary mb-3">Evolución - Últimos 7 días</div>
          <div className="h-20 flex items-end justify-between gap-1">
            {[65, 72, 68, 78, 85, 82, 90].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="flex-1 bg-gradient-to-t from-brand to-brand-light rounded-t opacity-80"
              ></motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'politics') {
    return (
      <div className="bg-gradient-to-br from-background via-background to-background-secondary rounded-2xl p-6 border border-white/10">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-2">Análisis Político</h3>
          <p className="text-sm text-secondary">Actas del Congreso - Datos oficiales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Sesiones', value: '42' },
            { label: 'Votaciones', value: '128' },
            { label: 'Asistencia', value: '87%' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-panel border border-white/5 rounded-lg p-3 text-center"
            >
              <div className="text-2xl font-bold text-brand mb-1">{stat.value}</div>
              <div className="text-xs text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Table Preview */}
        <div className="bg-panel border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-2 text-secondary font-medium">Bloque</th>
                <th className="text-right p-2 text-secondary font-medium">Votos</th>
              </tr>
            </thead>
            <tbody>
              {[
                { bloque: 'UCR', votos: 45 },
                { bloque: 'PRO', votos: 38 },
                { bloque: 'FDT', votos: 32 },
              ].map((row, i) => (
                <motion.tr
                  key={row.bloque}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-t border-white/5"
                >
                  <td className="p-2 text-foreground">{row.bloque}</td>
                  <td className="p-2 text-right text-foreground font-medium">{row.votos}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Calculator variant
  return (
    <div className="bg-gradient-to-br from-background via-background to-background-secondary rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-2">Calculadora de Plazo Fijo</h3>
        <p className="text-sm text-secondary">Proyección con datos reales</p>
      </div>

      {/* Inputs */}
      <div className="space-y-3 mb-6">
        <div className="bg-panel border border-white/5 rounded-lg p-3">
          <div className="text-xs text-secondary mb-1">Capital inicial</div>
          <div className="text-lg font-bold text-foreground">$100,000</div>
        </div>
        <div className="bg-panel border border-white/5 rounded-lg p-3">
          <div className="text-xs text-secondary mb-1">Plazo</div>
          <div className="text-lg font-bold text-foreground">30 días</div>
        </div>
      </div>

      {/* Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-brand/10 to-brand-light/10 border border-brand/20 rounded-xl p-4"
      >
        <div className="text-xs text-brand font-semibold mb-2">TOTAL A RECIBIR</div>
        <div className="text-3xl font-bold text-foreground mb-1">$107,250</div>
        <div className="text-sm text-secondary">
          Ganancia: <span className="text-green-500 font-medium">+$7,250</span>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '72.5%' }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-full bg-gradient-to-r from-brand to-brand-light"
          ></motion.div>
        </div>
        <div className="text-xs text-secondary mt-2">Rendimiento: 72.5% TNA</div>
      </div>
    </div>
  );
});
