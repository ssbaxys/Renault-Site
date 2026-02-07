import React, { useState, useEffect, useCallback } from 'react';
import { getScript } from '../firebase';

const DEFAULT_SCRIPT = `-- RENAULT Script v3.2.0
-- Target: Hypper Sandbox (com.hypper.sandbox)
-- Engine: GameGuardian Lua Injection
gg.setVisible(false)
gg.clearResults()
local VER = "3.2.0"
local PKG = "com.hypper.sandbox"
-- Full script at renault site`;

const DEFAULT_NAME = 'renault_v3.2.lua';

export function Download() {
  const [scriptCode, setScriptCode] = useState(DEFAULT_SCRIPT);
  const [scriptName, setScriptName] = useState(DEFAULT_NAME);

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
    const blob = new Blob([scriptCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = scriptName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="download" className="relative py-28 z-[1]">
      <div className="section-divider max-w-6xl mx-auto mb-28" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="relative rounded-3xl border border-white-8 bg-void-1 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(124,110,245,0.06),transparent_60%)]" />

          <div className="relative p-10 md:p-16">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Orbital visual */}
              <div className="relative w-48 h-48 shrink-0">
                <div className="absolute inset-0 rounded-full border border-white-4 animate-orbit" style={{ animationDuration: '20s' }} />
                <div className="absolute inset-4 rounded-full border border-white-8 animate-orbit-reverse" style={{ animationDuration: '15s' }} />
                <div className="absolute inset-10 rounded-full border border-grav/15 animate-orbit" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-16 rounded-full bg-grav/10 animate-pulse" />
                <div className="absolute inset-[70px] rounded-full bg-grav/20" />
                <div className="absolute inset-[78px] rounded-full bg-void" />

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-grav-light/60 animate-orbit" style={{ animationDuration: '8s', transformOrigin: '0 96px' }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-singularity/40 animate-orbit-reverse" style={{ animationDuration: '12s', transformOrigin: '0 -72px' }} />
              </div>

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
                  className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white-pure text-void text-[15px] font-semibold transition-all duration-300 hover:shadow-[0_0_60px_rgba(124,110,245,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16" />
                  </svg>
                  {scriptName}
                </button>

                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-[12px] text-white-15">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-white-15" />
                    Lua 5.3
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-white-15" />
                    ~{(new Blob([scriptCode]).size / 1024).toFixed(1)} KB
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
  );
}
