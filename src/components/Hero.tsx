import { BlackHole } from './BlackHole';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Black hole canvas */}
      <BlackHole />

      {/* Radial void gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#000_70%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Version tag */}
        <div className="animate-fade-in-up stagger-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white-8 bg-white-2 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
          <span className="text-[11px] font-mono text-white-50 tracking-wider">
            v3.2 · ACTIVE
          </span>
        </div>

        {/* Title */}
        <h1 className="animate-fade-in-up stagger-2 font-display font-bold text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] tracking-tight">
          <span className="text-white-pure">Renault</span>
        </h1>

        <p className="animate-fade-in-up stagger-3 mt-4 font-display text-[clamp(1rem,2.5vw,1.35rem)] text-white-30 font-light tracking-wide">
          Hypper Sandbox · GameGuardian · Lua
        </p>

        {/* Description */}
        <p className="animate-fade-in-up stagger-4 mt-8 text-[15px] leading-relaxed text-white-50 max-w-lg mx-auto">
          Бесплатный скрипт с открытым исходным кодом. 
          Полный контроль над игрой через инъекцию в память.
        </p>

        {/* CTA */}
        <div className="animate-fade-in-up stagger-5 mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#download"
            className="group relative px-8 py-3.5 rounded-full bg-white-pure text-void text-[14px] font-semibold transition-all hover:shadow-[0_0_40px_rgba(124,110,245,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Скачать скрипт
          </a>
          <a
            href="#code"
            className="px-8 py-3.5 rounded-full border border-white-15 text-white-70 text-[14px] font-medium hover:border-white-30 hover:text-white-90 transition-all"
          >
            Исходный код
          </a>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up stagger-6 mt-20 flex items-center justify-center gap-12">
          {[
            { val: '15K+', label: 'скачиваний' },
            { val: '0 ₽', label: 'навсегда' },
            { val: '24ч', label: 'поддержка' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-semibold text-xl text-white-90">{s.val}</div>
              <div className="mt-1 text-[11px] text-white-30 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-void to-transparent" />
    </section>
  );
}
