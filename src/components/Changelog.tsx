import { useEffect, useState } from 'react';

export interface ChangelogEntry {
  ver: string;
  date: string;
  status: 'dev' | 'alpha' | 'beta' | 'release';
  changes: { type: 'new' | 'fix' | 'upd'; text: string }[];
}

const STORAGE_KEY = 'renault_changelog';

export function getChangelog(): ChangelogEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch { /* empty */ }
  return [];
}

export function saveChangelog(entries: ChangelogEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const typeColors: Record<string, string> = {
  new: 'text-ok/60 bg-ok/5 border-ok/10',
  fix: 'text-warn/60 bg-warn/5 border-warn/10',
  upd: 'text-grav-light/60 bg-grav/5 border-grav/10',
};

const typeLabels: Record<string, string> = {
  new: 'NEW',
  fix: 'FIX',
  upd: 'UPD',
};

const statusColors: Record<string, string> = {
  dev: 'text-warn/70 bg-warn/5 border-warn/15',
  alpha: 'text-singularity/70 bg-singularity/5 border-singularity/15',
  beta: 'text-event-horizon/70 bg-event-horizon/5 border-event-horizon/15',
  release: 'text-ok/70 bg-ok/5 border-ok/15',
};

const statusLabels: Record<string, string> = {
  dev: 'DEV',
  alpha: 'ALPHA',
  beta: 'BETA',
  release: 'RELEASE',
};

export function Changelog() {
  const [versions, setVersions] = useState<ChangelogEntry[]>([]);

  useEffect(() => {
    setVersions(getChangelog());

    const handler = () => setVersions(getChangelog());
    window.addEventListener('changelog-updated', handler);
    return () => window.removeEventListener('changelog-updated', handler);
  }, []);

  const isEmpty = versions.length === 0;

  return (
    <section id="changelog" className="relative py-28">
      <div className="section-divider max-w-6xl mx-auto mb-28" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-[12px] font-mono text-grav-light tracking-[0.2em] uppercase mb-4">
              // Changelog
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white-90 tracking-tight leading-tight">
              История<br />
              <span className="text-white-30">обновлений.</span>
            </h2>
          </div>
        </div>

        {isEmpty ? (
          <div className="rounded-2xl border border-white-8 bg-void-1 p-12 text-center">
            <div className="text-white-8 text-5xl mb-4">∅</div>
            <p className="text-[15px] text-white-30 mb-2">Пока нет опубликованных версий</p>
            <p className="text-[13px] text-white-15">Следите за обновлениями — скоро здесь появится первый релиз</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-4 bottom-4 w-px bg-white-8" />

            <div className="space-y-10">
              {versions.map((v, vi) => (
                <div key={vi} className="relative pl-8 md:pl-10">
                  {/* Timeline dot */}
                  <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 ${
                    vi === 0 ? 'border-grav bg-grav/20' : 'border-white-15 bg-void'
                  }`}>
                    {vi === 0 && <div className="absolute inset-[3px] rounded-full bg-grav animate-pulse" />}
                  </div>

                  {/* Version header */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`font-mono font-medium text-[15px] ${vi === 0 ? 'text-white-90' : 'text-white-50'}`}>
                      {v.ver}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${statusColors[v.status]}`}>
                      {statusLabels[v.status]}
                    </span>
                    {vi === 0 && (
                      <span className="text-[10px] font-mono text-ok/70 px-2 py-0.5 rounded-full bg-ok/10 border border-ok/20">
                        LATEST
                      </span>
                    )}
                    <span className="text-[12px] text-white-15">{v.date}</span>
                  </div>

                  {/* Changes */}
                  <div className="space-y-2">
                    {v.changes.map((c, ci) => (
                      <div key={ci} className="flex items-start gap-3">
                        <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border shrink-0 mt-0.5 ${typeColors[c.type]}`}>
                          {typeLabels[c.type]}
                        </span>
                        <span className="text-[13px] text-white-30 leading-relaxed">{c.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
