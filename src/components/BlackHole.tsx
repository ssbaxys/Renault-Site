import { useEffect, useRef } from 'react';

export function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let time = 0;

    const particles: Array<{
      angle: number;
      radius: number;
      speed: number;
      size: number;
      opacity: number;
      decay: number;
      hue: number;
    }> = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles in orbital paths
    for (let i = 0; i < 200; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 60 + Math.random() * 240,
        speed: (0.002 + Math.random() * 0.008) * (Math.random() > 0.5 ? 1 : -1),
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.5,
        decay: 0.997 + Math.random() * 0.003,
        hue: 250 + Math.random() * 40,
      });
    }

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      time += 0.005;

      // Accretion disk glow
      const diskGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 200);
      diskGrad.addColorStop(0, 'rgba(124, 110, 245, 0.0)');
      diskGrad.addColorStop(0.3, 'rgba(124, 110, 245, 0.03)');
      diskGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.02)');
      diskGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = diskGrad;
      ctx.fillRect(0, 0, w, h);

      // Event horizon - dark center
      const bhGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
      bhGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      bhGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.8)');
      bhGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bhGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.fill();

      // Gravitational lensing ring
      ctx.strokeStyle = `rgba(124, 110, 245, ${0.08 + Math.sin(time * 2) * 0.03})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 50 + Math.sin(time) * 3, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(167, 139, 250, ${0.05 + Math.sin(time * 3) * 0.02})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 65 + Math.cos(time * 1.5) * 4, 0, Math.PI * 2);
      ctx.stroke();

      // Draw particles spiraling
      particles.forEach((p) => {
        p.angle += p.speed * (100 / Math.max(p.radius, 30));
        p.radius *= p.decay;

        // Reset particle if too close to center
        if (p.radius < 15) {
          p.radius = 80 + Math.random() * 220;
          p.angle = Math.random() * Math.PI * 2;
          p.opacity = 0.1 + Math.random() * 0.5;
        }

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius * 0.4; // Flatten for disk perspective
        const distortion = 1 - (p.radius / 300);
        const alpha = p.opacity * (1 - distortion * 0.5);

        ctx.beginPath();
        ctx.arc(x, y, p.size * (1 - distortion * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${alpha})`;
        ctx.fill();
      });

      // Subtle outer glow
      const outerGlow = ctx.createRadialGradient(cx, cy, 100, cx, cy, 300);
      outerGlow.addColorStop(0, 'rgba(124, 110, 245, 0.01)');
      outerGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.005)');
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  );
}
