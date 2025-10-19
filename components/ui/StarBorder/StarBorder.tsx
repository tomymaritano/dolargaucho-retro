/**
 * StarBorder - Simple SVG Stars
 *
 * Animated stars twinkling around the border
 * Perfect for highlighting special CTAs
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface StarBorderProps {
  children: React.ReactNode;
  starCount?: number;
  starColor?: string;
  animationSpeed?: number;
  className?: string;
  showStars?: boolean;
}

interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export function StarBorder({
  children,
  starCount = 8,
  starColor = '#0047FF',
  animationSpeed = 2,
  className = '',
  showStars = true,
}: StarBorderProps) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate stars positioned around the border
    const generatedStars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2;
      const radius = 50; // percentage from center

      // Convert polar to cartesian
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);

      generatedStars.push({
        id: `star-${i}`,
        x,
        y,
        size: Math.random() * 3 + 2, // 2-5px
        delay: Math.random() * animationSpeed,
      });
    }

    setStars(generatedStars);
  }, [starCount, animationSpeed]);

  return (
    <div className={`relative ${className}`}>
      {/* Stars Layer */}
      <AnimatePresence>
        {showStars &&
          stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute pointer-events-none"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: animationSpeed,
                repeat: Infinity,
                delay: star.delay,
                ease: 'easeInOut',
              }}
            >
              {/* Star Shape */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 0L5.5 4.5L10 5L5.5 5.5L5 10L4.5 5.5L0 5L4.5 4.5L5 0Z"
                  fill={starColor}
                />
              </svg>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Content */}
      {children}
    </div>
  );
}
