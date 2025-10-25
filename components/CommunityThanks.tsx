'use client';

/**
 * Community Thanks - Thank you section for early adopters
 *
 * Features:
 * - Displays recent registered users by nickname
 * - Animated grid layout with Framer Motion
 * - Glassmorphism design
 * - Shows "Join our community" CTA for anonymous users
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useRecentUsers } from '@/hooks/useRecentUsers';
import { GradientText } from '@/components/ui/GradientText';
import { FaUsers, FaHeart, FaSpinner } from 'react-icons/fa';

export function CommunityThanks() {
  const { users, loading, error } = useRecentUsers();

  // Show skeleton loading state
  if (loading) {
    return (
      <section className="w-full bg-background py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-12">
            <FaSpinner className="text-brand text-xl animate-spin" />
            <p className="text-secondary">Cargando comunidad...</p>
          </div>
        </div>
      </section>
    );
  }

  // Don't show section if there was an error or no users
  if (error || users.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-background py-20 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-brand/10 border border-brand/20">
            <FaHeart className="text-brand text-sm" />
            <span className="text-xs uppercase tracking-wider text-brand font-semibold">
              Gracias a nuestra comunidad
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black mb-4">
            Construido con <GradientText className="font-black">amor</GradientText> por nuestra
            comunidad
          </h2>

          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Gracias a todos los que confiaron en Dólar Gaucho desde el principio. Estos son algunos
            de nuestros early adopters:
          </p>
        </motion.div>

        {/* Users Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12"
        >
          {users.map((user, index) => (
            <motion.div
              key={`${user.nickname}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              whileHover={{ scale: 1.05 }}
              className="group bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm
                         border border-white/5 hover:border-brand/30 rounded-xl p-4
                         transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                {/* Avatar placeholder */}
                <div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand-light
                               flex items-center justify-center text-white font-bold text-lg
                               group-hover:scale-110 transition-transform"
                >
                  {user.nickname.charAt(0).toUpperCase()}
                </div>

                {/* Nickname */}
                <p
                  className="text-sm font-semibold text-foreground text-center truncate w-full
                              group-hover:text-brand transition-colors"
                >
                  {user.nickname}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 text-secondary">
            <FaUsers className="text-brand" />
            <p className="text-sm">
              Únete a <span className="font-bold text-brand">{users.length}+ miembros</span> que ya
              confían en Dólar Gaucho
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
