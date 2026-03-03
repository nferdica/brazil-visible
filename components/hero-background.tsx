'use client';

import { MeshGradient } from '@paper-design/shaders-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const lightColors = ['#d4f0e0', '#fef9d9', '#dce6f2', '#ffffff', '#ffffff'];
const darkColors = ['#0d2818', '#1a1a08', '#0d1520', '#0a0a0a', '#0a0a0a'];

export function HeroBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const colors = mounted && resolvedTheme === 'dark' ? darkColors : lightColors;

  return (
    <div className="absolute inset-0 z-0">
      <MeshGradient
        width="100%"
        height="100%"
        colors={colors}
        speed={reducedMotion ? 0 : 0.15}
        distortion={0.3}
        swirl={0.05}
        grainMixer={0}
        grainOverlay={0}
        style={{ width: '100%', height: '100%' }}
      />
      {/* Bottom fade for smooth section transition */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-dark-bg to-transparent" />
    </div>
  );
}
