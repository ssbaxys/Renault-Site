import { useState, useEffect } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Функции', href: '#features' },
    { label: 'Совместимость', href: '#compat' },
    { label: 'Код', href: '#code' },
    { label: 'Установка', href: '#install' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-void/80 backdrop-blur-2xl border-b border-white-8'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rounded-full border border-grav/30 group-hover:border-grav/50 transition-colors animate-orbit" style={{ animationDuration: '12s' }} />
            <div className="absolute inset-[5px] rounded-full bg-grav/20 group-hover:bg-grav/40 transition-colors" />
            <div className="absolute inset-[8px] rounded-full bg-void" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-grav-light/80" />
          </div>
          <span className="font-display font-semibold text-[14px] tracking-[0.15em] text-white-90">
            RENAULT
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 text-[13px] text-white-30 hover:text-white-90 transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#download"
            className="ml-4 px-5 py-2 text-[13px] font-medium text-void bg-white-90 hover:bg-white-pure rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,110,245,0.2)]"
          >
            Скачать
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`w-5 h-px bg-white-70 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`w-5 h-px bg-white-70 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-400 ${mobileOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-void-1/98 backdrop-blur-2xl border-t border-white-8 px-6 py-4 space-y-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block py-3 text-[15px] text-white-50 hover:text-white-90 transition-colors border-b border-white-4 last:border-0"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#download"
            className="block mt-4 text-center py-3 text-[15px] font-medium text-void bg-white-90 rounded-xl"
            onClick={() => setMobileOpen(false)}
          >
            Скачать бесплатно
          </a>
        </div>
      </div>
    </nav>
  );
}
