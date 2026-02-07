export function BlackHoleLogo({ size = 32 }: { size?: number }) {
  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Outer glow ring */}
      <div 
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(124,110,245,0.3) 0%, transparent 70%)',
        }}
      />
      
      {/* Accretion disk - outer */}
      <div 
        className="absolute rounded-full animate-spin"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          border: '1px solid rgba(124,110,245,0.4)',
          animationDuration: '8s',
        }}
      />
      
      {/* Accretion disk - middle */}
      <div 
        className="absolute rounded-full animate-spin"
        style={{
          width: size * 0.7,
          height: size * 0.7,
          border: '1px solid rgba(124,110,245,0.6)',
          animationDuration: '5s',
          animationDirection: 'reverse',
        }}
      />
      
      {/* Accretion disk - inner glow */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          background: 'radial-gradient(circle, rgba(124,110,245,0.2) 0%, transparent 70%)',
        }}
      />
      
      {/* Event horizon (black center) */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size * 0.35,
          height: size * 0.35,
          background: 'radial-gradient(circle, #000 60%, rgba(124,110,245,0.3) 100%)',
          boxShadow: '0 0 10px rgba(0,0,0,0.8), inset 0 0 5px rgba(124,110,245,0.3)',
        }}
      />
      
      {/* Photon ring */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size * 0.38,
          height: size * 0.38,
          border: '1px solid rgba(168,155,255,0.5)',
          boxShadow: '0 0 4px rgba(124,110,245,0.4)',
        }}
      />
      
      {/* Orbiting particle 1 */}
      <div 
        className="absolute animate-spin"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          animationDuration: '3s',
        }}
      >
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-white"
          style={{
            width: size * 0.06,
            height: size * 0.06,
            boxShadow: '0 0 4px rgba(255,255,255,0.8)',
          }}
        />
      </div>
      
      {/* Orbiting particle 2 */}
      <div 
        className="absolute animate-spin"
        style={{
          width: size * 0.65,
          height: size * 0.65,
          animationDuration: '2s',
          animationDirection: 'reverse',
        }}
      >
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-accent"
          style={{
            width: size * 0.05,
            height: size * 0.05,
            boxShadow: '0 0 4px rgba(124,110,245,0.8)',
          }}
        />
      </div>
    </div>
  );
}
