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
    { label: 'Код', href: '#code' },
    { label: 'Установка', href: '#install' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-void/80 backdrop-blur-xl border-b border-white-8'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full bg-grav/20 group-hover:bg-grav/30 transition-colors" />
            <div className="absolute inset-[6px] rounded-full bg-grav/40 group-hover:bg-grav/60 transition-colors" />
            <div className="absolute inset-[10px] rounded-full bg-void" />
          </div>
          <span className="font-display font-semibold text-[15px] tracking-wide text-white-90">
            RENAULT
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-[13px] text-white-50 hover:text-white-90 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#download"
            className="ml-4 px-5 py-2 text-[13px] font-medium text-void bg-white-90 hover:bg-white-pure rounded-full transition-colors"
          >
            Скачать
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`w-5 h-px bg-white-70 transition-all ${mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`w-5 h-px bg-white-70 transition-all ${mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-void-1/95 backdrop-blur-xl border-t border-white-8 px-6 py-6 space-y-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block py-3 text-[15px] text-white-50 hover:text-white-90 transition-colors"
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
            Скачать
          </a>
        </div>
      )}
    </nav>
  );
}
