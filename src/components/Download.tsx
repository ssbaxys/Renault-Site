import React, { useState, useEffect } from 'react';
import { getChangelog, incrementDownloads, type ChangelogEntry } from '../firebase';
import { BlackHoleCard } from './BlackHoleCard';

export function Download() {
  const [allVersions, setAllVersions] = useState<ChangelogEntry[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [ripple, setRipple] = useState(false);

  async function loadVersions() {
    const data = await getChangelog();
    setAllVersions(data || []);
    setSelectedIdx(0);
  }

  useEffect(() => {
    loadVersions();
    const handler = () => loadVersions();
    window.addEventListener('changelog-updated', handler);
    return () => window.removeEventListener('changelog-updated', handler);
  }, []);

  // Версии с кодом, не анонсы
  const downloadable = allVersions.filter(
    v => v.status !== 'announce' && v.code && v.code.trim().length > 0
  );

  // Текущая выбранная версия
  const current: ChangelogEntry | null = downloadable[selectedIdx] || null;

  // Имя файла для текущей версии
  function getCurrentFileName(): string {
    if (!current) return 'renault.lua';
    if (current.fileName && current.fileName.trim().length > 0) {
      return current.fileName;
    }
    return `renault_${current.ver.replace(/\s/g, '_')}.lua`;
  }

  // Код для текущей версии
  function getCurrentCode(): string {
    if (!current) return '';
    return current.code || '';
  }

  // Размер файла
  const currentCode = getCurrentCode();
  const currentFileName = getCurrentFileName();
  const fileSize = currentCode.length > 0
    ? (new Blob([currentCode]).size / 1024).toFixed(1)
    : '0';

  // Скачивание
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!current) return;

    // Захватываем значения ДО любых async операций
    const codeToDownload = getCurrentCode();
    const nameToDownload = getCurrentFileName();

    setIsShaking(true);
    setRipple(true);

    setTimeout(async () => {
      // Создаём и скачиваем файл
      const blob = new Blob([codeToDownload], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nameToDownload;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Обновляем счётчик
      try {
        await incrementDownloads();
        window.dispatchEvent(new Event('download-count-updated'));
      } catch (err) {
        console.error(err);
      }

      setDownloaded(true);
      setTimeout(() => { setIsShaking(false); setRipple(false); }, 400);
      setTimeout(() => setDownloaded(false), 3000);
    }, 600);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-300 ${isShaking ? 'opacity-100' : 'opacity-0'
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
        <div className="section-divider max-w-6xl mx-auto mb-16 md:mb-28" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl border border-white-8 bg-void-1 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(124,110,245,0.05),transparent_70%)]" />

            <div className="relative p-6 sm:p-10 md:p-16">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

                <BlackHoleCard />

                <div className="flex-1 w-full text-center lg:text-left flex flex-col items-center lg:items-start">
                  <p className="text-[11px] sm:text-[12px] font-mono text-grav-light tracking-[0.2em] uppercase mb-4">
                    // Скачать
                  </p>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-white-90 tracking-tight mb-4 leading-tight">
                    Готов к загрузке.
                  </h2>
                  <p className="text-[14px] sm:text-[15px] text-white-30 max-w-md mb-6 sm:mb-8 leading-relaxed px-4 lg:px-0">
                    Бесплатно. Без регистрации. Без рекламы. Без ожидания.
                    Один клик — файл на устройстве.
                  </p>

                  {/* Выбор версии — простой нативный select */}
                  {downloadable.length > 1 && (
                    <div className="mb-6 w-full flex flex-col items-center lg:items-start">
                      <label className="block text-[11px] font-mono text-white-15 mb-2">Версия</label>
                      <select
                        value={selectedIdx}
                        onChange={(e) => setSelectedIdx(Number(e.target.value))}
                        className="w-full max-w-[260px] sm:max-w-xs px-4 py-3 sm:py-2.5 rounded-xl bg-void-2 border border-white-8 text-[13px] text-white-70 font-mono outline-none hover:border-grav/40 transition-colors cursor-pointer appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%23666' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 12px center',
                        }}
                      >
                        {downloadable.map((v, i) => (
                          <option key={i} value={i}>
                            {v.ver} — {v.status.toUpperCase()} — {v.date}
                            {i === 0 ? ' (последняя)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Кнопка скачать */}
                  <button
                    onClick={handleDownload}
                    disabled={isShaking || !current}
                    className={`w-full max-w-[260px] sm:max-w-none sm:w-auto flex justify-center group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full text-[15px] font-semibold transition-all duration-300 ${!current
                        ? 'bg-white-15 text-white-30 cursor-not-allowed'
                        : downloaded
                          ? 'bg-ok/90 text-void shadow-[0_0_40px_rgba(74,222,128,0.2)]'
                          : isShaking
                            ? 'bg-grav text-white-pure shadow-[0_0_60px_rgba(124,110,245,0.4)] scale-95'
                            : 'bg-white-pure text-void hover:shadow-[0_0_60px_rgba(124,110,245,0.25)] hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                  >
                    {!current ? (
                      <>Нет доступных версий</>
                    ) : downloaded ? (
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

                  {/* Мета-информация */}
                  {current && (
                    <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-[12px] text-white-15">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-white-15" />
                        {currentFileName}
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
