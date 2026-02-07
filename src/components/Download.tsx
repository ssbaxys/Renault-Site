import React, { useState, useEffect, useCallback } from 'react';
import { getScript, getChangelog, incrementDownloads, type ChangelogEntry } from '../firebase';
import { BlackHoleCard } from './BlackHoleCard';

const DEFAULT_SCRIPT = `-- RENAULT Script v3.2.0\ngg.setVisible(false)`;
const DEFAULT_NAME = 'renault_v3.2.lua';

export function Download() {
  const [globalCode, setGlobalCode] = useState(DEFAULT_SCRIPT);
  const [globalName, setGlobalName] = useState(DEFAULT_NAME);
  const [versions, setVersions] = useState<ChangelogEntry[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('latest');
  const [isShaking, setIsShaking] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [ripple, setRipple] = useState(false);

  const load = useCallback(async () => {
    const [scriptData, changelogData] = await Promise.all([
      getScript(),
      getChangelog(),
    ]);
    if (scriptData && scriptData.code) {
      setGlobalCode(scriptData.code);
      setGlobalName(scriptData.name);
    }
    if (changelogData) {
      setVersions(changelogData);
    }
  }, []);

  useEffect(() => {
    load();
    const h1 = () => { load(); };
    const h2 = () => { load(); };
    window.addEventListener('script-updated', h1);
    window.addEventListener('changelog-updated', h2);
    return () => {
      window.removeEventListener('script-updated', h1);
      window.removeEventListener('changelog-updated', h2);
    };
  }, [load]);

  // Get downloadable versions (non-announce, with code)
  const downloadableVersions = versions.filter(v => v.status !== 'announce' && v.code);

  // Determine what code/name to download
  const getDownloadData = (): { code: string; name: string } => {
    if (selectedVersion === 'latest') {
      // Find first non-announce version with code
      const latest = downloadableVersions[0];
      if (latest && latest.code) {
        return {
          code: latest.code,
          name: `renault_${latest.ver.replace(/\s/g, '_')}.lua`,
        };
      }
      // Fallback to global script
      return { code: globalCode, name: globalName };
    }

    // Find specific version
    const found = versions.find(v => v.ver === selectedVersion);
    if (found && found.code) {
      return {
        code: found.code,
        name: `renault_${found.ver.replace(/\s/g, '_')}.lua`,
      };
    }

    return { code: globalCode, name: globalName };
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();

    setIsShaking(true);
    setRipple(true);

    setTimeout(async () => {
      const { code, name } = getDownloadData();
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);

      await incrementDownloads();
      window.dispatchEvent(new Event('download-count-updated'));

      setDownloaded(true);

      setTimeout(() => {
        setIsShaking(false);
        setRipple(false);
      }, 400);

      setTimeout(() => {
        setDownloaded(false);
      }, 3000);
    }, 600);
  };

  const currentDownload = getDownloadData();
  const selectedCode = currentDownload.code;
  const fileSize = (new Blob([selectedCode]).size / 1024).toFixed(1);

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
                  <p className="text-[15px] text-white-30 max-w-md mb-6 leading-relaxed">
                    Бесплатно. Без регистрации. Без рекламы. Без ожидания.
                    Один клик — файл на устройстве.
                  </p>

                  {/* Version selector */}
                  {downloadableVersions.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-[11px] font-mono text-white-15 mb-2">Версия</label>
                      <select
                        value={selectedVersion}
                        onChange={(e) => setSelectedVersion(e.target.value)}
                        className="w-full max-w-xs px-4 py-2.5 rounded-xl bg-void-2 border border-white-8 text-[13px] text-white-70 font-mono outline-none focus:border-grav/40 transition-colors cursor-pointer appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 12px center',
                        }}
                      >
                        <option value="latest">Последняя версия</option>
                        {downloadableVersions.map((v, i) => (
                          <option key={i} value={v.ver}>
                            {v.ver} — {v.status === 'announce' ? 'АНОНС' : v.status.toUpperCase()} — {v.date}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

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
                        Скачать
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
