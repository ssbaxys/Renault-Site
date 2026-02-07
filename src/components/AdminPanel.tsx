import { useState, useEffect } from 'react';
import {
  getChangelog,
  saveChangelog,
  type ChangelogEntry,
} from '../firebase';

const ADMIN_PASS = '4321';

interface Props {
  open: boolean;
  onClose: () => void;
}

type VersionStatus = 'dev' | 'alpha' | 'beta' | 'release' | 'announce';

const statusBtnColors: Record<string, string> = {
  dev: 'bg-orange-400/15 border-orange-400/30 text-orange-400',
  alpha: 'bg-err/15 border-err/30 text-err',
  beta: 'bg-amber-300/15 border-amber-300/30 text-amber-300',
  release: 'bg-ok/15 border-ok/30 text-ok',
  announce: 'bg-sky-400/15 border-sky-400/30 text-sky-400',
};

const statusBtnInactive = 'bg-void border-white-8 text-white-30 hover:border-white-15';

export function AdminPanel({ open, onClose }: Props) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passError, setPassError] = useState(false);
  const [saving, setSaving] = useState(false);

  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [ver, setVer] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<VersionStatus>('release');
  const [changes, setChanges] = useState<{ type: 'new' | 'fix' | 'upd'; text: string }[]>([
    { type: 'new', text: '' },
  ]);
  const [versionCode, setVersionCode] = useState('');
  const [versionFileName, setVersionFileName] = useState('');

  useEffect(() => {
    if (open && authenticated) loadData();
  }, [open, authenticated]);

  useEffect(() => {
    if (!open) {
      setAuthenticated(false);
      setPassword('');
      setPassError(false);
      resetForm();
    }
  }, [open]);

  const loadData = async () => {
    const cl = await getChangelog();
    setEntries(cl);
  };

  const resetForm = () => {
    setVer('');
    setDate('');
    setStatus('release');
    setChanges([{ type: 'new', text: '' }]);
    setVersionCode('');
    setVersionFileName('');
    setEditing(null);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASS) {
      setAuthenticated(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const handleAddChange = () => {
    setChanges([...changes, { type: 'new', text: '' }]);
  };

  const handleRemoveChange = (idx: number) => {
    if (changes.length <= 1) return;
    setChanges(changes.filter((_, i) => i !== idx));
  };

  const handleChangeType = (idx: number, type: 'new' | 'fix' | 'upd') => {
    const updated = [...changes];
    updated[idx] = { ...updated[idx], type };
    setChanges(updated);
  };

  const handleChangeText = (idx: number, text: string) => {
    const updated = [...changes];
    updated[idx] = { ...updated[idx], text };
    setChanges(updated);
  };

  const handlePublish = async () => {
    if (!ver.trim() || !date.trim()) return;
    const validChanges = changes.filter(c => c.text.trim());
    if (validChanges.length === 0) return;

    setSaving(true);
    const newEntry: ChangelogEntry = {
      ver: ver.trim(),
      date: date.trim(),
      status,
      changes: validChanges,
    };

    if (versionCode.trim()) {
      newEntry.code = versionCode.trim();
    }

    if (versionFileName.trim()) {
      newEntry.fileName = versionFileName.trim();
    }

    let updated: ChangelogEntry[];
    if (editing !== null) {
      updated = [...entries];
      updated[editing] = newEntry;
    } else {
      updated = [newEntry, ...entries];
    }

    await saveChangelog(updated);
    setEntries(updated);
    resetForm();
    window.dispatchEvent(new Event('changelog-updated'));
    setSaving(false);
  };

  const handleEdit = (idx: number) => {
    const e = entries[idx];
    setVer(e.ver);
    setDate(e.date);
    setStatus(e.status);
    setChanges(e.changes.map(c => ({ ...c })) as { type: 'new' | 'fix' | 'upd'; text: string }[]);
    setVersionCode(e.code || '');
    setVersionFileName(e.fileName || '');
    setEditing(idx);
  };

  const handleDelete = async (idx: number) => {
    setSaving(true);
    const updated = entries.filter((_, i) => i !== idx);
    await saveChangelog(updated);
    setEntries(updated);
    window.dispatchEvent(new Event('changelog-updated'));
    setSaving(false);
  };

  const vCodeLines = versionCode.split('\n').length;
  const vCodeSize = versionCode ? `~${(new Blob([versionCode]).size / 1024).toFixed(1)} KB` : '0 B';

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white-8 bg-void-2 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white-8 bg-void-2/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-grav-light/60 px-2 py-0.5 rounded bg-grav/10 border border-grav/15">
              ADMIN
            </span>
            <span className="text-[14px] font-display font-semibold text-white-70">
              Панель управления
            </span>
            {saving && <span className="text-[11px] text-grav-light/50 animate-pulse">Сохранение...</span>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white-30 hover:text-white-70 hover:bg-white-4 transition-all"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {!authenticated ? (
            <div className="py-12 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-white-8 bg-void-3 flex items-center justify-center mb-6">
                <span className="text-white-30 text-lg">🔒</span>
              </div>
              <p className="text-[15px] text-white-50 mb-6">Введите пароль для доступа</p>
              <div className="w-full max-w-xs">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPassError(false); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Пароль"
                  className={`w-full px-4 py-3 rounded-xl bg-void-3 border text-[14px] text-white-90 placeholder:text-white-15 outline-none transition-all ${
                    passError ? 'border-err/40 focus:border-err/60' : 'border-white-8 focus:border-grav/40'
                  }`}
                  autoFocus
                />
                {passError && <p className="mt-2 text-[12px] text-err/60">Неверный пароль</p>}
                <button
                  onClick={handleLogin}
                  className="mt-4 w-full py-3 rounded-xl bg-white-90 text-void text-[14px] font-semibold hover:bg-white-pure transition-colors"
                >
                  Войти
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* New / Edit version form */}
              <div className="rounded-xl border border-white-8 bg-void-3 p-5 mb-8">
                <p className="text-[13px] font-display font-semibold text-white-70 mb-5">
                  {editing !== null ? `Редактирование ${entries[editing]?.ver}` : 'Новая версия'}
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-[11px] font-mono text-white-15 mb-1.5">Версия</label>
                    <input
                      type="text" value={ver} onChange={(e) => setVer(e.target.value)}
                      placeholder="v3.2.0"
                      className="w-full px-3 py-2.5 rounded-lg bg-void border border-white-8 text-[13px] text-white-90 placeholder:text-white-15 outline-none focus:border-grav/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-white-15 mb-1.5">Дата</label>
                    <input
                      type="text" value={date} onChange={(e) => setDate(e.target.value)}
                      placeholder="12 января 2025"
                      className="w-full px-3 py-2.5 rounded-lg bg-void border border-white-8 text-[13px] text-white-90 placeholder:text-white-15 outline-none focus:border-grav/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[11px] font-mono text-white-15 mb-1.5">Статус</label>
                  <div className="flex gap-1 flex-wrap">
                    {(['dev', 'alpha', 'beta', 'release', 'announce'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`px-3 py-2.5 rounded-lg text-[10px] font-mono font-medium border transition-all ${
                          status === s ? statusBtnColors[s] : statusBtnInactive
                        }`}
                      >
                        {s === 'announce' ? 'АНОНС' : s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block text-[11px] font-mono text-white-15 mb-2">Изменения</label>
                <div className="space-y-2 mb-4">
                  {changes.map((c, ci) => (
                    <div key={ci} className="flex items-center gap-2">
                      <div className="flex gap-0.5 shrink-0">
                        {(['new', 'fix', 'upd'] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => handleChangeType(ci, t)}
                            className={`px-2 py-1.5 rounded text-[9px] font-mono font-medium border transition-all ${
                              c.type === t
                                ? t === 'new' ? 'bg-ok/10 border-ok/20 text-ok/70'
                                : t === 'fix' ? 'bg-warn/10 border-warn/20 text-warn/70'
                                : 'bg-grav/10 border-grav/20 text-grav-light/70'
                                : 'bg-void border-white-4 text-white-15 hover:text-white-30'
                            }`}
                          >
                            {t.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text" value={c.text}
                        onChange={(e) => handleChangeText(ci, e.target.value)}
                        placeholder="Описание изменения..."
                        className="flex-1 px-3 py-2 rounded-lg bg-void border border-white-8 text-[13px] text-white-90 placeholder:text-white-15 outline-none focus:border-grav/40 transition-colors"
                      />
                      <button
                        onClick={() => handleRemoveChange(ci)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-white-15 hover:text-err/60 hover:bg-err/5 transition-all shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* File name */}
                <div className="mb-4">
                  <label className="block text-[11px] font-mono text-white-15 mb-1.5">
                    Название файла при скачивании
                  </label>
                  <input
                    type="text"
                    value={versionFileName}
                    onChange={(e) => setVersionFileName(e.target.value)}
                    placeholder="renault_v3.2.lua"
                    className="w-full px-3 py-2.5 rounded-lg bg-void border border-white-8 text-[13px] text-white-90 font-mono placeholder:text-white-15 outline-none focus:border-grav/40 transition-colors"
                  />
                  <p className="text-[10px] text-white-8 mt-1">Если не указано — сгенерируется из номера версии</p>
                </div>

                {/* Code */}
                <div className="mb-4">
                  <label className="block text-[11px] font-mono text-white-15 mb-1.5">
                    Код скрипта
                  </label>
                  <textarea
                    value={versionCode}
                    onChange={(e) => setVersionCode(e.target.value)}
                    placeholder="-- Вставьте Lua код скрипта..."
                    rows={12}
                    className="w-full px-3 py-2.5 rounded-lg bg-void border border-white-8 text-[12px] text-white-90 font-mono placeholder:text-white-15 outline-none focus:border-grav/40 transition-colors resize-y leading-relaxed"
                    spellCheck={false}
                  />
                  {versionCode.trim() && (
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-white-15">
                      <span>{vCodeLines} строк</span>
                      <span>·</span>
                      <span>{vCodeSize}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={handleAddChange}
                    className="px-4 py-2 rounded-lg border border-white-8 text-[12px] text-white-30 hover:text-white-50 hover:border-white-15 transition-all">
                    + Добавить изменение
                  </button>
                  <div className="flex-1" />
                  {editing !== null && (
                    <button onClick={resetForm}
                      className="px-4 py-2 rounded-lg border border-white-8 text-[12px] text-white-30 hover:text-white-50 transition-all">
                      Отмена
                    </button>
                  )}
                  <button onClick={handlePublish} disabled={saving}
                    className="px-6 py-2 rounded-lg bg-white-90 text-void text-[12px] font-semibold hover:bg-white-pure transition-colors disabled:opacity-50">
                    {editing !== null ? 'Сохранить' : 'Опубликовать'}
                  </button>
                </div>
              </div>

              {/* Existing entries */}
              {entries.length > 0 && (
                <div>
                  <p className="text-[13px] font-display font-semibold text-white-50 mb-4">
                    Опубликованные версии ({entries.length})
                  </p>
                  <div className="space-y-3">
                    {entries.map((e, ei) => (
                      <div key={ei} className="rounded-xl border border-white-8 bg-void-3 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[14px] text-white-70">{e.ver}</span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                              statusBtnColors[e.status] || statusBtnColors.release
                            }`}>
                              {e.status === 'announce' ? 'АНОНС' : e.status.toUpperCase()}
                            </span>
                            {e.code && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-grav/20 text-grav-light/50 bg-grav/5">
                                КОД
                              </span>
                            )}
                            {e.fileName && (
                              <span className="text-[9px] font-mono text-white-15">
                                📄 {e.fileName}
                              </span>
                            )}
                            <span className="text-[11px] text-white-15">{e.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEdit(ei)}
                              className="px-3 py-1.5 rounded-lg text-[11px] text-white-30 hover:text-white-70 hover:bg-white-4 transition-all">
                              ✎
                            </button>
                            <button onClick={() => handleDelete(ei)}
                              className="px-3 py-1.5 rounded-lg text-[11px] text-white-30 hover:text-err/60 hover:bg-err/5 transition-all">
                              ✕
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {e.changes.map((c, ci) => (
                            <div key={ci} className="flex items-center gap-2 text-[12px]">
                              <span className={`font-mono text-[9px] px-1 py-0.5 rounded border ${
                                c.type === 'new' ? 'text-ok/50 bg-ok/5 border-ok/10'
                                : c.type === 'fix' ? 'text-warn/50 bg-warn/5 border-warn/10'
                                : 'text-grav-light/50 bg-grav/5 border-grav/10'
                              }`}>
                                {c.type.toUpperCase()}
                              </span>
                              <span className="text-white-30">{c.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
