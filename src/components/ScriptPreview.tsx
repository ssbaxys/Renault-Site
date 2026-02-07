import React, { useState, useEffect, useCallback } from 'react';
import { getScript, getChangelog, type ScriptData, type ChangelogEntry } from '../firebase';

const DEFAULT_CODE = `-- ═══════════════════════════════════════════
-- RENAULT Script v3.2.0
-- Target: Hypper Sandbox (com.hypper.sandbox)
-- Engine: GameGuardian Lua Injection
-- License: Free & Open Source
-- ═══════════════════════════════════════════

gg.setVisible(false)
gg.clearResults()

local VER = "3.2.0"
local PKG = "com.hypper.sandbox"
local TAG = "[Renault]"

-- ── Проверка целевого процесса ──
function checkTarget()
  local info = gg.getTargetInfo()
  if info == nil then
    gg.alert("⚠ Процесс не выбран.\\nОткрой игру и выбери процесс в GG.")
    os.exit()
  end
  if info.packageName ~= PKG then
    gg.alert("⚠ Выберите Hypper Sandbox\\nТекущий: "..info.packageName)
    os.exit()
  end
  gg.toast(TAG.." Процесс найден: "..info.packageName)
end

-- ── Основные функции ──
function toggleAimbot()
  local fov = gg.prompt({"FOV (1-360):", "Сглаживание (1-100):"},
    {"90", "15"}, {"number", "number"})
  if fov == nil then return end
  
  gg.searchNumber("42.0;120.0", gg.TYPE_FLOAT, false, gg.SIGN_EQUAL, 0, -1)
  local results = gg.getResults(100)
  for i, v in ipairs(results) do
    v.value = tonumber(fov[1])
    v.freeze = true
  end
  gg.setValues(results)
  gg.toast(TAG.." AimBot ON — FOV: "..fov[1])
end

function toggleESP()
  gg.searchNumber("0.0;1.0;0.0", gg.TYPE_FLOAT)
  local r = gg.getResults(200)
  for i, v in ipairs(r) do
    v.value = 1.0
    v.freeze = true
  end
  gg.setValues(r)
  gg.toast(TAG.." WallHack ESP активирован")
end

function speedHack()
  local s = gg.prompt({"Множитель скорости (0.5-10):"},
    {"2.0"}, {"number"})
  if s == nil then return end
  gg.setSpeed(tonumber(s[1]))
  gg.toast(TAG.." Speed: x"..s[1])
end

function godMode()
  gg.searchNumber("100;100", gg.TYPE_DWORD)
  local r = gg.getResults(50)
  for i, v in ipairs(r) do
    v.value = 999999
    v.freeze = true
  end
  gg.setValues(r)
  gg.toast(TAG.." God Mode ON")
end

function spawnObjects()
  local items = gg.choice({
    "AK-47", "M4A1", "AWP", "RPG",
    "Physics Gun", "Tool Gun",
    "Транспорт", "Вертолёт"
  }, nil, TAG.." Спавн объектов")
  if items == nil then return end
  gg.toast(TAG.." Объект заспавнен")
end

function updateOffsets()
  gg.toast(TAG.." Обновление оффсетов...")
  gg.sleep(1500)
  gg.toast(TAG.." Оффсеты актуальны ✓")
end

-- ── Главное меню ──
function showMenu()
  local m = gg.choice({
    "◎  AimBot ON/OFF",
    "◈  WallHack ESP",
    "⟐  Speed Hack",
    "⬡  God Mode",
    "⊞  Спавн объектов",
    "↻  Обновить оффсеты",
    "✕  Выход"
  }, nil, "RENAULT v"..VER)

  if m == 1 then toggleAimbot()
  elseif m == 2 then toggleESP()
  elseif m == 3 then speedHack()
  elseif m == 4 then godMode()
  elseif m == 5 then spawnObjects()
  elseif m == 6 then updateOffsets()
  elseif m == 7 then
    gg.setSpeed(1)
    gg.clearResults()
    gg.toast(TAG.." Выход. До встречи!")
    os.exit()
  end
end

-- ── Инициализация ──
checkTarget()
gg.toast(TAG.." Загружен. v"..VER)

while true do
  if gg.isVisible(true) then
    gg.setVisible(false)
    showMenu()
  end
  gg.sleep(100)
end`;

const DEFAULT_NAME = 'renault_v3.2.lua';

function highlightLua(line: string): React.JSX.Element {
  if (line.trimStart().startsWith('--')) {
    return <span className="text-white-15 italic">{line}</span>;
  }

  const parts: React.JSX.Element[] = [];
  const tokens = line.split(/(\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*'|\b\d+\.?\d*\b|\b(?:local|function|if|then|elseif|else|end|while|do|return|true|false|nil|for|in|ipairs|not|and|or)\b|\bgg\b|\.\.|[(){}[\],.;=+\-*/<>~#]|\s+)/g);

  let key = 0;
  tokens.forEach((token) => {
    if (!token) return;

    if (/^(local|function|if|then|elseif|else|end|while|do|return|for|in|not|and|or)$/.test(token)) {
      parts.push(<span key={key++} className="text-grav-light">{token}</span>);
    } else if (/^(true|false|nil)$/.test(token)) {
      parts.push(<span key={key++} className="text-singularity">{token}</span>);
    } else if (token === 'gg') {
      parts.push(<span key={key++} className="text-singularity">{token}</span>);
    } else if (token === 'ipairs') {
      parts.push(<span key={key++} className="text-grav">{token}</span>);
    } else if (/^["']/.test(token)) {
      parts.push(<span key={key++} className="text-ok/60">{token}</span>);
    } else if (/^\d/.test(token)) {
      parts.push(<span key={key++} className="text-warn/60">{token}</span>);
    } else {
      parts.push(<span key={key++} className="text-white-50">{token}</span>);
    }
  });

  return <>{parts}</>;
}

function calcSize(text: string): string {
  const bytes = new Blob([text]).size;
  if (bytes < 1024) return `${bytes} B`;
  return `~${(bytes / 1024).toFixed(1)} KB`;
}

export function ScriptPreview() {
  const [copied, setCopied] = useState(false);
  const [scriptData, setScriptData] = useState<ScriptData>({ name: DEFAULT_NAME, code: DEFAULT_CODE });

  const loadScript = useCallback(async () => {
    // First try to get code from latest changelog version
    const changelog = await getChangelog();
    if (changelog && changelog.length > 0) {
      const latestWithCode = changelog.find((v: ChangelogEntry) => v.status !== 'announce' && v.code);
      if (latestWithCode && latestWithCode.code) {
        setScriptData({
          name: `renault_${latestWithCode.ver.replace(/\s/g, '_')}.lua`,
          code: latestWithCode.code,
        });
        return;
      }
    }

    // Fallback to global script
    const data = await getScript();
    if (data && data.code) {
      setScriptData(data);
    }
  }, []);

  useEffect(() => {
    loadScript();
    const h1 = () => { loadScript(); };
    const h2 = () => { loadScript(); };
    window.addEventListener('script-updated', h1);
    window.addEventListener('changelog-updated', h2);
    return () => {
      window.removeEventListener('script-updated', h1);
      window.removeEventListener('changelog-updated', h2);
    };
  }, [loadScript]);

  const lines = scriptData.code.split('\n');
  const fileSize = calcSize(scriptData.code);

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="code" className="relative py-28 z-[1]">
      <div className="section-divider max-w-6xl mx-auto mb-28" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-[12px] font-mono text-grav-light tracking-[0.2em] uppercase mb-4">
              // Исходный код
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white-90 tracking-tight leading-tight">
              Полностью открытый.<br />
              <span className="text-white-30">Без обфускации.</span>
            </h2>
          </div>
          <p className="text-[14px] text-white-30 max-w-sm leading-relaxed">
            Каждая строка доступна для проверки. Никакого вредоносного кода, скрытых обращений или сбора данных.
          </p>
        </div>

        {/* Code window */}
        <div className="rounded-2xl border border-white-8 overflow-hidden bg-void-1 animate-glow-pulse">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 h-12 border-b border-white-8 bg-void-2">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-err/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-warn/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-ok/30" />
              </div>
              <span className="text-[12px] font-mono text-white-30">
                {scriptData.name}
              </span>
              <span className="text-[10px] font-mono text-white-15 px-2 py-0.5 rounded bg-white-4">
                Lua 5.3
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`text-[12px] font-mono px-3 py-1 rounded-md transition-all duration-300 ${
                copied
                  ? 'text-ok/70 bg-ok/10'
                  : 'text-white-30 hover:text-white-70 hover:bg-white-4'
              }`}
            >
              {copied ? '✓ скопировано' : 'копировать'}
            </button>
          </div>

          {/* Code body */}
          <div className="p-5 overflow-x-auto max-h-[520px] overflow-y-auto">
            <pre className="font-mono text-[12.5px] leading-[1.75]">
              {lines.map((line, i) => (
                <div key={i} className="flex hover:bg-white-2 -mx-2 px-2 rounded group">
                  <span className="w-8 text-right mr-5 text-white-8 group-hover:text-white-15 select-none shrink-0 tabular-nums text-[11px] transition-colors">
                    {i + 1}
                  </span>
                  <span>{highlightLua(line)}</span>
                </div>
              ))}
            </pre>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-5 h-9 border-t border-white-8 bg-void-2">
            <span className="text-[11px] font-mono text-white-15">
              {lines.length} строк · UTF-8
            </span>
            <span className="text-[11px] font-mono text-white-15">
              {fileSize}
            </span>
          </div>
        </div>

        {/* Code info cards */}
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white-8 bg-void-1">
            <div className="text-[11px] font-mono text-grav-light/50 mb-1">Язык</div>
            <div className="text-[14px] text-white-70">Lua 5.3 — стандарт GameGuardian</div>
          </div>
          <div className="p-4 rounded-xl border border-white-8 bg-void-1">
            <div className="text-[11px] font-mono text-grav-light/50 mb-1">Лицензия</div>
            <div className="text-[14px] text-white-70">MIT — свободное использование</div>
          </div>
          <div className="p-4 rounded-xl border border-white-8 bg-void-1">
            <div className="text-[11px] font-mono text-grav-light/50 mb-1">Обновление</div>
            <div className="text-[14px] text-white-70">Автоматически при запуске</div>
          </div>
        </div>
      </div>
    </section>
  );
}
