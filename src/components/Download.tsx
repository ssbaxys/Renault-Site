import React, { useState, useEffect } from 'react';
import { getScript, getChangelog, incrementDownloads, type ChangelogEntry } from '../firebase';
import { BlackHoleCard } from './BlackHoleCard';

const DEFAULT_CODE = `-- RENAULT Script\ngg.setVisible(false)`;
const DEFAULT_FILENAME = 'renault.lua';

export function Download() {
  const [versions, setVersions] = useState<ChangelogEntry[]>([]);
  const [globalCode, setGlobalCode] = useState(DEFAULT_CODE);
  const [globalFileName, setGlobalFileName] = useState(DEFAULT_FILENAME);
  const [selectedVersion, setSelectedVersion] = useState('latest');
  const [isShaking, setIsShaking] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [ripple, setRipple] = useState(false);

  const loadData = async () => {
    try {
      const [scriptData, changelogData] = await Promise.all([
        getScript(),
        getChangelog(),
      ]);
      if (scriptData) {
        if (scriptData.code) setGlobalCode(scriptData.code);
        if (scriptData.name) setGlobalFileName(scriptData.name);
      }
      if (changelogData) {
        setVersions(changelogData);
      }
    } catch (e) {
      console.error('Load error:', e);
    }
  };

  useEffect(() => {
    loadData();
    const handler = () => loadData();
    window.addEventListener('script-updated', handler);
    window.addEventListener('changelog-updated', handler);
    return () => {
      window.removeEventListener('script-updated', handler);
      window.removeEventListener('changelog-updated', handler);
    };
  }, []);

  // Simple function: get all versions that have code and are not announcements
  function getDownloadableVersions(): ChangelogEntry[] {
    return versions.filter(v => v.status !== 'announce' && v.code && v.code.trim().length > 0);
  }

  // Simple function: resolve what to download RIGHT NOW
  function resolveDownload(): { code: string; fileName: string } {
    const downloadable = getDownloadableVersions();

    if (selectedVersion !== 'latest') {
      // Find specific version
      const found = downloadable.find(v => v.ver === selectedVersion);
      if (found) {
        return {
          code: found.code!,
          fileName: found.fileName && found.fileName.trim() !== ''
            ? found.fileName
            : `renault_${found.ver.replace(/\s/g, '_')}.lua`,
        };
      }
    }

    // Latest version (first downloadable)
    if (downloadable.length > 0) {
      const latest = downloadable[0];
      return {
        code: latest.code!,
        fileName: latest.fileName && latest.fileName.trim() !== ''
          ? latest.fileName
          : `renault_${latest.ver.replace(/\s/g, '_')}.lua`,
      };
    }

    // Fallback to global script
    return { code: globalCode, fileName: globalFileName };
  }

  // Direct download function - no wrappers
  function triggerDownload(code: string, fileName: string) {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Resolve what to download RIGHT HERE, RIGHT NOW
    const { code, fileName } = resolveDownload();

    // Log for debugging
    console.log('[Download] fileName:', fileName, '| codeLength:', code.length, '| selectedVersion:', selectedVersion);

    setIsShaking(true);
    setRipple(true);

    setTimeout(async () => {
      // Actually download with the resolved values
      triggerDownload(code, fileName);

      try {
        await incrementDownloads();
        window.dispatchEvent(new Event('download-count-updated'));
      } catch (err) {
        console.error('Increment error:', err);
      }

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

  // Current display info
  const currentInfo = resolveDownload();
  const fileSize = (new Blob([currentInfo.code]).size / 1024).toFixed(1);
  const downloadable = getDownloadableVersions();

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
                  {downloadable.length > 0 && (
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
                        {downloadable.map((v, i) => (
                          <option key={i} value={v.ver}>
                            {v.ver} — {v.status.toUpperCase()} — {v.date}
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
                      {currentInfo.fileName}
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
