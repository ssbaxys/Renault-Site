export function Footer() {
  return (
    <footer className="border-t border-white-8 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 rounded-full bg-grav/20" />
              <div className="absolute inset-[4px] rounded-full bg-grav/30" />
              <div className="absolute inset-[7px] rounded-full bg-void" />
            </div>
            <span className="font-display font-semibold text-[14px] text-white-50">
              RENAULT
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-[13px] text-white-30">
            <a href="#features" className="hover:text-white-70 transition-colors">Функции</a>
            <a href="#code" className="hover:text-white-70 transition-colors">Код</a>
            <a href="#install" className="hover:text-white-70 transition-colors">Установка</a>
            <a href="#faq" className="hover:text-white-70 transition-colors">FAQ</a>
          </div>

          {/* Copy */}
          <p className="text-[12px] text-white-15">
            © 2025 · Образовательные цели
          </p>
        </div>
      </div>
    </footer>
  );
}
