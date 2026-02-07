import React, { useState, useEffect, useRef } from 'react';
import { getScript, getChangelog, incrementDownloads, type ChangelogEntry } from '../firebase';
import { BlackHoleCard } from './BlackHoleCard';

const DEFAULT_CODE = `-- RENAULT Script\ngg.setVisible(false)`;
const DEFAULT_FILENAME = 'renault.lua';

export function Download() {
  const [versions, setVersions] = useState<ChangelogEntry[]>([]);
  const [globalCode, setGlobalCode] = useState(DEFAULT_CODE);
  const [globalFileName, setGlobalFileName] = useState(DEFAULT_FILENAME);
  const [selectedVersion, setSelectedVersion] = useState('latest');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [ripple, setRipple] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function getDownloadableVersions(): ChangelogEntry[] {
    return versions.filter(v => v.status !== 'announce' && v.code && v.code.trim().length > 0);
  }

  function resolveDownload(): { code: string; fileName: string } {
    const downloadable = getDownloadableVersions();

    if (selectedVersion !== 'latest') {
      const found = downloadable.find(v => v.ver === selectedVersion);
      if (found && found.code) {
        const name = (found.fileName && found.fileName.trim() !== '')
          ? found.fileName
          : `renault_${found.ver.replace(/\s/g, '_')}.lua`;
        return { code: found.code, fileName: name };
      }
    }

    if (downloadable.length > 0) {
      const latest = downloadable[0];
      const name = (latest.fileName && latest.fileName.trim() !== '')
        ? latest.fileName
        : `renault_${latest.ver.replace(/\s/g, '_')}.lua`;
      return { code: latest.code!, fileName: name };
    }

    return { code: globalCode, fileName: globalFileName };
  }

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
    const { code, fileName } = resolveDownload();

    setIsShaking(true);
    setRipple(true);

    setTimeout(async () => {
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

  const selectVersion = (ver: string) => {
    setSelectedVersion(ver);
    setDropdownOpen(false);
  };

  const downloadable = getDownloadableVersions();
  const currentInfo = resolveDownload();
  const fileSize = (new Blob([currentInfo.code]).size / 1024).toFixed(1);

  // Get label for selected version
  const getSelectedLabel = () => {
    if (selectedVersion === 'latest') return 'Последняя версия';
    const found = downloadable.find(v => v.ver === selectedVersion);
    if (found) return `${found.ver} — ${found.status.toUpperCase()} — ${found.date}`;
    return 'Последняя версия';
  };

  const statusColor: Record<string, string> = {
    dev: 'text-orange-400',
    alpha: 'text-red-400',
    beta: 'text-amber-400',
    release: 'text-emerald-400',
    announce: 'text-sky-400',
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-300 ${
          isShaking ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at center, rgba(124,110,245,0.06) 0%, transparent 70%)',
        }}
      />

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

                <BlackHoleCard />

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

                  {/* Custom dropdown */}
                  {downloadable.length > 0 && (
                    <div className="mb-6 relative" ref={dropdownRef}>
                      <label className="block text-[11px] font-mono text-white-15 mb-2">Версия</label>
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full max-w-xs px-4 py-2.5 rounded-xl bg-void-2 border border-white-8 text-[13px] text-white-70 font-mono outline-none hover:border-grav/40 transition-colors cursor-pointer text-left flex items-center justify-between gap-2"
                      >
                        <span className="truncate">{getSelectedLabel()}</span>
                        <svg
                          className={`w-4 h-4 text-white-30 transition-transform flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full max-w-xs bg-void-2 border border-white-8 rounded-xl overflow-hidden z-50 shadow-2xl shadow-black/50">
                          <button
                            type="button"
                            onClick={() => selectVersion('latest')}
                            className={`w-full px-4 py-3 text-left text-[13px] font-mono transition-colors hover:bg-white/5 flex items-center gap-2 ${
                              selectedVersion === 'latest' ? 'text-grav bg-grav/5' : 'text-white-70'
                            }`}
                          >
                            {selectedVersion === 'latest' && <span className="w-1.5 h-1.5 rounded-full bg-grav flex-shrink-0" />}
                            Последняя версия
                          </button>
                          {downloadable.map((v, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => selectVersion(v.ver)}
                              className={`w-full px-4 py-3 text-left text-[13px] font-mono transition-colors hover:bg-white/5 border-t border-white-5 flex items-center gap-2 ${
                                selectedVersion === v.ver ? 'text-grav bg-grav/5' : 'text-white-70'
                              }`}
                            >
                              {selectedVersion === v.ver && <span className="w-1.5 h-1.5 rounded-full bg-grav flex-shrink-0" />}
                              <span>{v.ver}</span>
                              <span className={`text-[10px] uppercase ${statusColor[v.status] || 'text-white-30'}`}>
                                {v.status}
                              </span>
                              <span className="text-white-15 ml-auto text-[11px]">{v.date}</span>
                            </button>
                          ))}
                        </div>
                      )}
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
