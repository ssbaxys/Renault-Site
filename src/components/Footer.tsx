import { useState } from 'react';
import { AdminPanel } from './AdminPanel';

export function Footer() {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <>
      <footer className="relative border-t border-white-8 z-[1]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Logo + tagline */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 rounded-full border border-grav/20" />
                  <div className="absolute inset-[4px] rounded-full bg-grav/15" />
                  <div className="absolute inset-[7px] rounded-full bg-void" />
                </div>
                <span className="font-display font-semibold text-[14px] tracking-[0.15em] text-white-50">
                  RENAULT
                </span>
              </div>
              <p className="text-[12px] text-white-15 max-w-xs leading-relaxed">
                Бесплатный скрипт для Hypper Sandbox. GameGuardian Lua injection. 
                Открытый исходный код.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {[
                { label: 'Функции', href: '#features' },
                { label: 'Совместимость', href: '#compat' },
                { label: 'Код', href: '#code' },
                { label: 'Установка', href: '#install' },
                { label: 'Changelog', href: '#changelog' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Скачать', href: '#download' },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[13px] text-white-15 hover:text-white-50 transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-10 pt-6 border-t border-white-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-[11px] text-white-8">
                © 2025 Renault Script · MIT License · Только для развлекательных целей
              </p>
              <button
                onClick={() => setAdminOpen(true)}
                className="text-[11px] text-white-8 hover:text-white-30 transition-colors cursor-pointer"
              >
                Админ панель
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[11px] text-white-8">
                <span className="w-1.5 h-1.5 rounded-full bg-ok/40 animate-pulse" />
                active
              </span>
            </div>
          </div>
        </div>
      </footer>

      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  );
}
