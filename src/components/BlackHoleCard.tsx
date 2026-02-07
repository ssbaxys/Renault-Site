import { useEffect, useRef } from 'react';

export function BlackHoleCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let W = 0, H = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const CX = () => W / 2;
    const CY = () => H / 2;

    interface Particle {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      opacity: number;
      hue: number;
      drift: number;
      baseRadius: number;
    }

    const PARTICLE_COUNT = 90;
    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseRadius = 30 + Math.random() * 120;
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: baseRadius,
        baseRadius,
        speed: 0.002 + Math.random() * 0.012,
        size: 0.4 + Math.random() * 1.8,
        opacity: 0.15 + Math.random() * 0.7,
        hue: Math.random() > 0.6 ? 260 + Math.random() * 20 : 0,
        drift: -0.08 - Math.random() * 0.25,
      });
    }

    let time = 0;

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, W, H);

      const cx = CX();
      const cy = CY();

      // Outer glow halo
      const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140);
      outerGlow.addColorStop(0, 'rgba(124, 110, 245, 0)');
      outerGlow.addColorStop(0.3, 'rgba(124, 110, 245, 0)');
      outerGlow.addColorStop(0.55, 'rgba(124, 110, 245, 0.03)');
      outerGlow.addColorStop(0.75, 'rgba(99, 102, 241, 0.015)');
      outerGlow.addColorStop(1, 'rgba(124, 110, 245, 0)');
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, W, H);

      // Accretion disk — тонкое эллиптическое кольцо
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.35);
      for (let r = 28; r < 80; r += 1) {
        const alpha = Math.max(0, 0.06 - (r - 28) * 0.001) * (0.7 + 0.3 * Math.sin(time * 0.5 + r * 0.1));
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = r < 45
          ? `rgba(167, 139, 250, ${alpha})`
          : `rgba(124, 110, 245, ${alpha * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

      // Event horizon — core shadow
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26);
      coreGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      coreGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.95)');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright ring
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(167, 139, 250, ${0.12 + 0.05 * Math.sin(time * 1.5)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Gravitational lensing ring (photon sphere)
      ctx.beginPath();
      ctx.arc(cx, cy, 25, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(199, 180, 255, ${0.06 + 0.03 * Math.sin(time * 2)})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Particles
      for (const p of particles) {
        p.angle += p.speed;
        p.radius += p.drift * 0.15;

        // Reset when sucked in
        if (p.radius < 4) {
          p.radius = p.baseRadius;
          p.angle = Math.random() * Math.PI * 2;
          p.opacity = 0.15 + Math.random() * 0.7;
          p.speed = 0.002 + Math.random() * 0.012;
        }

        // Speed up as they get closer (gravitational acceleration)
        const distFactor = Math.max(0.1, p.radius / p.baseRadius);
        p.speed = (0.002 + Math.random() * 0.001) / (distFactor * distFactor) * 0.3;
        p.drift = -0.08 - (1 - distFactor) * 0.6;

        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * p.radius * 0.35; // Elliptical orbit

        // Fade out when close to center
        const fadeAlpha = Math.min(1, (p.radius - 4) / 30);
        const alpha = p.opacity * fadeAlpha * (0.6 + 0.4 * Math.sin(time * 2 + p.angle));

        if (p.hue > 0) {
          ctx.fillStyle = `hsla(${p.hue}, 70%, 75%, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(px, py, p.size * fadeAlpha, 0, Math.PI * 2);
        ctx.fill();

        // Tiny trail
        if (p.radius < p.baseRadius * 0.6 && p.radius > 8) {
          const trailAngle = p.angle - p.speed * 8;
          const trailR = p.radius + 2;
          const tx = cx + Math.cos(trailAngle) * trailR;
          const ty = cy + Math.sin(trailAngle) * trailR * 0.35;
          ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(tx, ty, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-60 h-60 shrink-0 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
}
