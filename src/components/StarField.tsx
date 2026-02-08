import { useMemo } from 'react';

interface StarStyle {
  left: string;
  top: string;
  width: string;
  height: string;
  opacity: number;
  background: string;
  boxShadow: string;
}

export default function StarField() {
  const stars = useMemo(() => {
    const result: StarStyle[] = [];
    for (let i = 0; i < 120; i++) {
      const size = Math.random() * 2 + 0.5;
      const opacity = Math.random() * 0.6 + 0.2;
      result.push({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        background: 'rgba(255,255,255,0.9)',
        boxShadow: size > 1.5 ? `0 0 ${size * 2}px rgba(255,255,255,0.3)` : 'none',
      });
    }
    return result;
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={s}
        />
      ))}
    </div>
  );
}
