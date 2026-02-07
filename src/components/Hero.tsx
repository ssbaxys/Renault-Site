import { StarField } from './StarField';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Star field */}
      <StarField />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.012]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Title */}
        <h1 className="animate-fade-in-up stagger-1 font-display font-bold text-[clamp(3rem,9vw,6rem)] leading-[0.92] tracking-tight">
          <span className="text-white-pure">Renault</span>
        </h1>

        <p className="animate-fade-in-up stagger-2 mt-5 font-display text-[clamp(1rem,2.5vw,1.4rem)] text-white-30 font-light tracking-wide">
          Скрипт для Hypper Sandbox
        </p>

        {/* Tech badges */}
        <div className="animate-fade-in-up stagger-3 mt-6 flex flex-wrap items-center justify-center gap-2">
          {['GameGuardian', 'Lua 5.3', 'Memory Injection', 'Anti-Detect'].map((tag) => (
            <span key={tag} className="px-3 py-1 text-[11px] font-mono text-white-30 rounded-full border border-white-8 bg-white-2">
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="animate-fade-in-up stagger-4 mt-8 text-[15px] leading-relaxed text-white-50 max-w-xl mx-auto">
          Полностью бесплатный скрипт с открытым исходным кодом. 
          AimBot, WallHack, Speed Hack, God Mode — полный контроль через инъекцию в память процесса.
        </p>

        {/* CTA */}
        <div className="animate-fade-in-up stagger-5 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#download"
            className="group relative px-8 py-3.5 rounded-full bg-white-pure text-void text-[14px] font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,110,245,0.25)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4" />
              </svg>
              Скачать бесплатно
            </span>
          </a>
          <a
            href="#code"
            className="px-8 py-3.5 rounded-full border border-white-15 text-white-70 text-[14px] font-medium hover:border-white-30 hover:text-white-90 transition-all duration-300"
          >
            Смотреть код
          </a>
        </div>

        {/* Stats row */}
        <div className="animate-fade-in-up stagger-6 mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl mx-auto">
          {[
            { val: '15K+', label: 'Скачиваний' },
            { val: 'Бесплатно', label: 'Навсегда' },
            { val: '6', label: 'Функций' },
            { val: '24ч', label: 'Обновления' },
          ].map((s) => (
            <div key={s.label} className="text-center py-3 rounded-xl border border-white-4 bg-white-2">
              <div className="font-display font-bold text-xl text-white-90">{s.val}</div>
              <div className="mt-1 text-[11px] text-white-30 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in stagger-7">
        <span className="text-[10px] font-mono text-white-15 tracking-widest uppercase">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white-15 to-transparent" />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-void to-transparent" />
    </section>
  );
}
