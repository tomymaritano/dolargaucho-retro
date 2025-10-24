'use client';

/**
 * UserAvatarsFloat - Floating User Avatars with Subtle Animation
 *
 * Premium design with gentle float animation and hover tooltips
 * Shows recent community users as social proof
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRecentUsers } from '@/hooks/useRecentUsers';
import { Tooltip } from '@/components/ui/Tooltip';

interface UserAvatarsFloatProps {
  maxAvatars?: number;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-10 h-10 text-2xl',
  lg: 'w-12 h-12 text-3xl',
};

// Deterministic emoji assignment based on nickname
// This ensures the same user always gets the same emoji
const getUserEmoji = (nickname: string): string => {
  const emojis = ['👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '🧑‍💻'];
  const hash = nickname.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return emojis[hash % emojis.length];
};

export const UserAvatarsFloat = React.memo(function UserAvatarsFloat({
  maxAvatars = 5,
  size = 'md',
}: UserAvatarsFloatProps) {
  const { users, loading } = useRecentUsers();

  // Memoize display users with emoji assignment
  const displayUsers = useMemo(() => {
    if (loading || users.length === 0) return [];
    return users.slice(0, maxAvatars).map((user) => ({
      ...user,
      emoji: getUserEmoji(user.nickname),
    }));
  }, [users, loading, maxAvatars]);

  // Don't render if loading or no users
  if (displayUsers.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center -space-x-2">
      {displayUsers.map((user, index) => {
        return (
          <motion.div
            key={`${user.nickname}-${index}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -3, 0],
            }}
            transition={{
              opacity: { duration: 0.3, delay: index * 0.1 },
              scale: { duration: 0.3, delay: index * 0.1 },
              y: {
                duration: 4,
                repeat: Infinity,
                delay: index * 0.4,
                ease: 'easeInOut',
              },
            }}
            className="relative"
            style={{ zIndex: displayUsers.length - index }}
          >
            <Tooltip content={`@${user.nickname}`} position="bottom" delay={200}>
              <motion.div
                whileHover={{ scale: 1.15, z: 100 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  ${SIZE_CLASSES[size]}
                  rounded-full
                  bg-gradient-to-br from-brand/80 to-brand-light/80
                  backdrop-blur-sm
                  border-2 border-background
                  shadow-lg shadow-brand/20
                  flex items-center justify-center
                  cursor-pointer
                  transition-shadow duration-300
                  hover:shadow-xl hover:shadow-brand/40
                `}
              >
                {user.emoji}
              </motion.div>
            </Tooltip>
          </motion.div>
        );
      })}
    </div>
  );
});
