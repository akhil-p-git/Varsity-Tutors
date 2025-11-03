'use client';

import { useEffect, useState } from 'react';

const colors = ['#7c3aed', '#14b8a6', '#fbbf24', '#ef4444', '#3b82f6'];

export function Confetti() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!showConfetti) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const rotation = Math.random() * 360;

        return (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: color,
                transform: `rotate(${rotation}deg)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

