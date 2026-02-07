import { useMemo } from 'react';

interface StarStyle {
  left: string;
  top: string;
  width: string;
  height: string;
  opacity: number;
  animationDuration: string;
  animationDelay: string;
  background: string;
  boxShadow: string;
}

export default function StarField() {
  const stars = useMemo(() => {
    const result: StarStyle[] = [];
    for (let i = 0; i < 80; i++) {
      const isPurple = Math.random() < 0.3;
      const size = Math.random() * 2 + 1;
      result.push({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: Math.random() * 0.5 + 0.15,
        animationDuration: `${Math.random() * 4 + 3}s`,
        animationDelay: `${Math.random() * 5}s`,
        background: isPurple ? 'rgba(140,120,255,0.9)' : 'rgba(255,255,255,0.85)',
        boxShadow: isPurple ? '0 0 6px rgba(140,120,255,0.5)' : 'none',
      });
    }
    return result;
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-twinkle"
          style={s}
        />
      ))}
    </div>
  );
}
