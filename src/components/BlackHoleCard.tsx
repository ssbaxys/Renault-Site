import { useEffect, useRef } from 'react';

export function BlackHoleCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    
    let w = 0, h = 0, cx = 0, cy = 0;
    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      cx = w / 2;
      cy = h / 2;
    };
    window.addEventListener('resize', resize);
    resize();

    // Create a robust particle system for the accretion disk
    const particles: any[] = [];
    const particleCount = 450;
    
    for(let i = 0; i < particleCount; i++) {
        particles.push(createParticle(true));
    }

    function createParticle(init = false) {
        // Distribute particles logarithmically so more are closer to the center,
        // but extend far out to form a wide, beautiful disk.
        const radius = init ? 25 + Math.pow(Math.random(), 2) * 160 : 180 + Math.random() * 40;
        const angle = Math.random() * Math.PI * 2;
        return {
            r: radius,
            a: angle,
            s: (0.003 + Math.random() * 0.015), // Base orbit speed
            z: (Math.random() - 0.5) * (Math.random() < 0.1 ? 40 : 10), // Disk thickness (Z variance)
            size: 0.5 + Math.random() * 1.8,
            h: Math.random() > 0.3 ? 240 + Math.random() * 40 : 280 + Math.random() * 30, // Purple to Pink/Violet
            drift: Math.random() * 0.4 + 0.1, // Inward drift speed
            opacityToggle: Math.random()
        };
    }

    const draw = () => {
        time += 0.015;
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, w, h);
        
        // --- 1. Distant Background Glow ---
        const bgGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
        bgGlow.addColorStop(0, 'rgba(80, 40, 240, 0.12)');
        bgGlow.addColorStop(0.3, 'rgba(40, 20, 160, 0.06)');
        bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bgGlow;
        ctx.fillRect(0, 0, w, h);

        ctx.globalCompositeOperation = 'lighter';

        // --- 2. Render Accretion Disk (Particles) ---
        particles.forEach(p => {
            // Mechanics
            const orbitVelocity = p.s + (40 / Math.max(p.r, 1)) * 0.008; 
            p.a += orbitVelocity; // Closer = faster
            p.r -= p.drift + (30 / Math.max(p.r, 1)) * 0.1; // Pull towards event horizon
            
            // Warp Z lightly over time for fluid feel
            p.z += Math.sin(time * 2 + p.a) * 0.2;

            // Recycle if swallowed
            if (p.r < 19) {
                Object.assign(p, createParticle(false));
            }

            // 3D Tilt Projection (Interstellar style)
            const tilt = 0.28; // Tilt factor (0.0 flat line, 1.0 perfect circle above)
            
            // Lensing faux-effect: particles behind the black hole get warped up
            const isBehind = Math.sin(p.a) < 0; 
            let lensingZ = p.z;
            if (isBehind && p.r < 60) {
                // Intense curving over the top poles
                lensingZ += (60 - p.r) * 1.2 * Math.abs(Math.cos(p.a)); 
            } else if (!isBehind && p.r < 40) {
                // Curving under the bottom poles
                lensingZ -= (40 - p.r) * 0.5 * Math.abs(Math.cos(p.a));
            }

            const x = cx + p.r * Math.cos(p.a);
            const y = cy + (p.r * Math.sin(p.a) + lensingZ) * tilt;
            
            // Doppler Effect (brighter & bluer when moving towards viewer (left), dimmer & redder moving away (right))
            const dirX = -Math.sin(p.a);
            const doppler = Math.max(0.05, 0.6 + dirX * 0.6);
            
            // Fade near horizon and scale size
            const horizonFade = Math.min(1, (p.r - 18) / 15);
            let alpha = doppler * horizonFade * 0.9;

            // Twinkle effect for some stars
            if (p.opacityToggle > 0.8) {
               alpha *= (0.5 + 0.5 * Math.sin(time * 10 + p.r));
            }
            
            ctx.beginPath();
            ctx.arc(x, y, p.size * (0.5 + doppler * 0.5) * horizonFade, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.h - dirX * 15}, 85%, ${60 + doppler * 20}%, ${alpha})`;
            ctx.fill();
        });

        // --- 3. Event Horizon (Black Core) ---
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath();
        ctx.arc(cx, cy, 23, 0, Math.PI * 2);
        const coreGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
        coreGradient.addColorStop(0, '#000000');
        coreGradient.addColorStop(0.7, 'rgba(0,0,0,0.95)');
        coreGradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = coreGradient;
        ctx.fill();

        // --- 4. Photon Sphere (Intense Glowing Ring exactly on edge) ---
        ctx.globalCompositeOperation = 'lighter';
        for(let i=0; i<4; i++) {
            ctx.beginPath();
            const ringOffset = 21 + i*1.2;
            ctx.arc(cx, cy, ringOffset, 0, Math.PI * 2);
            // Pulsing opacity
            const ringAlpha = (0.12 - i*0.02) * (1 + 0.3 * Math.sin(time * 4 - i));
            ctx.strokeStyle = `rgba(180, 150, 255, ${ringAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
        
        // --- 5. Gravitational Lensing Edge (Outer faint distortion ring) ---
        ctx.beginPath();
        ctx.ellipse(cx, cy, 40, 40, 0, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(130, 110, 255, ${0.04 + Math.sin(time*2)*0.015})`;
        ctx.lineWidth = 12;
        ctx.stroke();

        animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square shrink-0 mx-auto flex items-center justify-center pointer-events-none drop-shadow-[0_0_40px_rgba(124,110,245,0.2)]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen" />
    </div>
  );
}
