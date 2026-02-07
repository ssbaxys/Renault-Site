import React, { useState, useEffect, useCallback } from 'react';
import { getScript } from '../firebase';
import { BlackHoleCard } from './BlackHoleCard';

const DEFAULT_SCRIPT = `-- RENAULT Script v3.2.0\ngg.setVisible(false)`;
const DEFAULT_NAME = 'renault_v3.2.lua';

export function Download() {
  const [scriptCode, setScriptCode] = useState(DEFAULT_SCRIPT);
  const [scriptName, setScriptName] = useState(DEFAULT_NAME);
  const [isShaking, setIsShaking] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [ripple, setRipple] = useState(false);

  const load = useCallback(async () => {
    const data = await getScript();
    if (data && data.code) {
      setScriptCode(data.code);
      setScriptName(data.name);
    }
  }, []);

  useEffect(() => {
    load();
    const handler = () => { load(); };
    window.addEventListener('script-updated', handler);
    return () => window.removeEventListener('script-updated', handler);
  }, [load]);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();

    // Start shake
    setIsShaking(true);
    setRipple(true);

    // After shake, download file
    setTimeout(() => {
      const blob = new Blob([scriptCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = scriptName;
      a.click();
      URL.revokeObjectURL(url);

      setDownloaded(true);
      
      // Stop shake smoothly
      setTimeout(() => {
        setIsShaking(false);
        setRipple(false);
      }, 400);

      // Reset downloaded state
      setTimeout(() => {
        setDownloaded(false);
      }, 3000);
    }, 600);
  };

  const fileSize = (new Blob([scriptCode]).size / 1024).toFixed(1);

  return (
    <>
      {/* Screen shake overlay */}
      <div
        className={`fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-300 ${
          isShaking ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at center, rgba(124,110,245,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Ripple flash */}
      {ripple && (
        <div className="fixed inset-0 z-[9998] pointer-events-none flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-grav/30 animate-download-ripple" />
        </div>
      )}

      <section id="download" className={`relative py-28 z-[1] ${isShaking ? 'animate-screen-shake' : ''}`}>
        <div className="section-divider max-w-6xl mx-auto mb-28" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="relative rounded-3xl border border-white-8 bg-void-1 overflow-hidden">
            {/* Subtle top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(124,110,245,0.05),transparent_70%)]" />

            <div className="relative p-10 md:p-16">
              <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                {/* Black Hole visual */}
                <BlackHoleCard />

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <p className="text-[12px] font-mono text-grav-light tracking-[0.2em] uppercase mb-4">
                    // Скачать
                  </p>
                  <h2 className="font-display font-bold text-3xl md:text-4xl text-white-90 tracking-tight mb-4 leading-tight">
                    Готов к загрузке.
                  </h2>
                  <p className="text-[15px] text-white-30 max-w-md mb-8 leading-relaxed">
                    Бесплатно. Без регистрации. Без рекламы. Без ожидания.
                    Один клик — файл на устройстве.
                  </p>

                  <button
                    onClick={handleDownload}
                    disabled={isShaking}
                    className={`group relative inline-flex items-center gap-3 px-10 py-4 rounded-full text-[15px] font-semibold transition-all duration-300 ${
                      downloaded
                        ? 'bg-ok/90 text-void shadow-[0_0_40px_rgba(74,222,128,0.2)]'
                        : isShaking
                        ? 'bg-grav text-white-pure shadow-[0_0_60px_rgba(124,110,245,0.4)] scale-95'
                        : 'bg-white-pure text-void hover:shadow-[0_0_60px_rgba(124,110,245,0.25)] hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {downloaded ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Скачано
                      </>
                    ) : isShaking ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Загрузка...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16" />
                        </svg>
                        {scriptName}
                      </>
                    )}
                  </button>

                  <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-[12px] text-white-15">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-white-15" />
                      Lua 5.3
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-white-15" />
                      ~{fileSize} KB
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-ok/50" />
                      Открытый код
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
