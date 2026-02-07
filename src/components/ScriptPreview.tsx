import { useState, useEffect } from 'react';
import { getChangelog, getScript, type ChangelogEntry } from '../firebase';

const DEFAULT_CODE = `-- RENAULT Script\n-- Код будет добавлен в ближайшем обновлении`;

function highlightLua(code: string): string {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(--[^\n]*)/g, '<span class="text-white-15 italic">$1</span>')
    .replace(/\b(local|function|end|if|then|else|elseif|return|while|do|for|in|true|false|nil|not|and|or|repeat|until|break)\b/g,
      '<span class="text-grav-light">$1</span>')
    .replace(/\b(gg\.\w+)/g, '<span class="text-grav">$1</span>')
    .replace(/"([^"]*)"/g, '<span class="text-ok/60">"$1"</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-warn/60">$1</span>');
}

export function ScriptPreview() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [fileName, setFileName] = useState('renault.lua');
  const [copied, setCopied] = useState(false);

  const loadLatestCode = async () => {
    try {
      // First try to get code from latest changelog version
      const changelog = await getChangelog();
      if (changelog && changelog.length > 0) {
        // Find latest non-announce version with code
        const withCode = changelog.find(
          (v: ChangelogEntry) => v.status !== 'announce' && v.code && v.code.trim().length > 0
        );
        if (withCode) {
          setCode(withCode.code!);
          if (withCode.fileName && withCode.fileName.trim() !== '') {
            setFileName(withCode.fileName);
          } else {
            setFileName(`renault_${withCode.ver.replace(/\s/g, '_')}.lua`);
          }
          return;
        }
      }

      // Fallback to global script
      const script = await getScript();
      if (script) {
        if (script.code) setCode(script.code);
        if (script.name) setFileName(script.name);
      }
    } catch (e) {
      console.error('ScriptPreview load error:', e);
    }
  };

  useEffect(() => {
    loadLatestCode();
    const handler = () => loadLatestCode();
    window.addEventListener('changelog-updated', handler);
    window.addEventListener('script-updated', handler);
    return () => {
      window.removeEventListener('changelog-updated', handler);
      window.removeEventListener('script-updated', handler);
    };
  }, []);

  const lines = code.split('\n');
  const lineCount = lines.length;
  const sizeKB = (new Blob([code]).size / 1024).toFixed(1);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="code" className="relative py-28 z-[1]">
      <div className="section-divider max-w-6xl mx-auto mb-28" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="text-[12px] font-mono text-grav-light tracking-[0.2em] uppercase mb-4">
            // Исходный код
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white-90 tracking-tight mb-4 leading-tight">
            Полностью открытый.<br />
            <span className="text-white-30">Без обфускации.</span>
          </h2>
          <p className="text-[15px] text-white-30 max-w-xl leading-relaxed">
            Каждая строка доступна для проверки. Никакого вредоносного кода,
            скрытых обращений или сбора данных.
          </p>
        </div>

        {/* Code editor */}
        <div className="rounded-2xl border border-white-8 bg-void-1 overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white-8">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-err/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-warn/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-ok/40" />
              </div>
              <span className="text-[12px] font-mono text-white-30">{fileName}</span>
              <span className="text-[10px] font-mono text-white-8 px-1.5 py-0.5 rounded bg-white-4">Lua 5.3</span>
            </div>
            <button
              onClick={handleCopy}
              className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border transition-all ${
                copied
                  ? 'text-ok/70 border-ok/20 bg-ok/5'
                  : 'text-white-30 border-white-8 hover:text-white-50 hover:border-white-15'
              }`}
            >
              {copied ? 'скопировано ✓' : 'копировать'}
            </button>
          </div>

          {/* Code body */}
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i} className="hover:bg-white-4/50 transition-colors">
                    <td className="py-0 px-4 text-right select-none w-[1%] whitespace-nowrap">
                      <span className="text-[12px] font-mono text-white-8">{i + 1}</span>
                    </td>
                    <td className="py-0 px-4">
                      <pre className="text-[12px] font-mono leading-[22px]"
                        dangerouslySetInnerHTML={{ __html: highlightLua(line) || '&nbsp;' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-white-8 text-[11px] font-mono text-white-15">
            <div className="flex items-center gap-4">
              <span>{lineCount} строк</span>
              <span>·</span>
              <span>UTF-8</span>
            </div>
            <span>~{sizeKB} KB</span>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[
            { label: 'Лицензия', value: 'MIT — свободное использование' },
            { label: 'Зависимости', value: 'GameGuardian 101.1+' },
            { label: 'Совместимость', value: 'Hypper Sandbox 0.5.0.2' },
          ].map((card, i) => (
            <div key={i} className="rounded-xl border border-white-8 bg-void-1 p-4">
              <p className="text-[10px] font-mono text-white-15 mb-1">{card.label}</p>
              <p className="text-[13px] text-white-50">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
