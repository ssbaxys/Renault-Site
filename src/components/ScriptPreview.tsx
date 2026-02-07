import React, { useState } from 'react';

const code = `gg.setVisible(false)
gg.clearResults()

local VER = "3.2.0"
local PKG = "com.hypper.sandbox"

function checkTarget()
  local pkg = gg.getTargetInfo().packageName
  if pkg ~= PKG then
    gg.alert("Выберите Hypper Sandbox")
    os.exit()
  end
end

function showMenu()
  local m = gg.choice({
    "AimBot ON/OFF",
    "WallHack ESP",
    "Speed Hack",
    "God Mode",
    "Спавн предметов",
    "Обновить оффсеты",
    "Выход"
  }, nil, "RENAULT v"..VER)

  if m == 1 then toggleAimbot()
  elseif m == 2 then toggleESP()
  elseif m == 3 then speedHack()
  elseif m == 4 then godMode()
  elseif m == 5 then spawnItems()
  elseif m == 6 then updateOffsets()
  elseif m == 7 then os.exit()
  end
end

checkTarget()
gg.toast("Renault загружен")

while true do
  if gg.isVisible(true) then
    gg.setVisible(false)
    showMenu()
  end
  gg.sleep(100)
end`;

function highlightLua(line: string): React.JSX.Element {
  const parts: React.JSX.Element[] = [];
  let remaining = line;
  let key = 0;

  const rules: Array<{ pattern: RegExp; className: string }> = [
    { pattern: /^(--.*)/,                  className: 'text-white-30 italic' },
    { pattern: /\b(local|function|if|then|elseif|else|end|while|do|return|true|false|nil)\b/, className: 'text-grav-light' },
    { pattern: /\b(gg)\b/,                className: 'text-singularity' },
    { pattern: /"([^"]*)"/,               className: 'text-ok/70' },
    { pattern: /\b(\d+\.?\d*)\b/,         className: 'text-warn/70' },
  ];

  if (remaining.trimStart().startsWith('--')) {
    return <span className="text-white-15 italic">{remaining}</span>;
  }

  // Simple tokenization
  const tokens = remaining.split(/(\s+|"[^"]*"|[(){}[\],.])/g);
  tokens.forEach((token) => {
    let matched = false;
    for (const rule of rules) {
      if (rule.pattern.test(token)) {
        parts.push(<span key={key++} className={rule.className}>{token}</span>);
        matched = true;
        break;
      }
    }
    if (!matched) {
      parts.push(<span key={key++} className="text-white-50">{token}</span>);
    }
  });

  return <>{parts}</>;
}

export function ScriptPreview() {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="code" className="relative py-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-20">
          <p className="text-[12px] font-mono text-grav-light tracking-[0.2em] uppercase mb-4">
            Исходный код
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white-90 tracking-tight">
            Полностью открытый.
          </h2>
          <p className="mt-4 text-[15px] text-white-30 max-w-lg">
            Никакой обфускации. Каждая строка доступна для проверки.
          </p>
        </div>

        {/* Code window */}
        <div className="rounded-2xl border border-white-8 overflow-hidden bg-void-1">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 h-12 border-b border-white-8 bg-void-2">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white-15" />
                <div className="w-2.5 h-2.5 rounded-full bg-white-15" />
                <div className="w-2.5 h-2.5 rounded-full bg-white-15" />
              </div>
              <span className="text-[12px] font-mono text-white-30">
                renault_v3.2.lua
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="text-[12px] font-mono text-white-30 hover:text-white-70 transition-colors px-3 py-1 rounded-md hover:bg-white-4"
            >
              {copied ? '✓ скопировано' : 'копировать'}
            </button>
          </div>

          {/* Code body */}
          <div className="p-5 overflow-x-auto max-h-[480px] overflow-y-auto">
            <pre className="font-mono text-[13px] leading-7">
              {lines.map((line, i) => (
                <div key={i} className="flex hover:bg-white-2 -mx-2 px-2 rounded">
                  <span className="w-8 text-right mr-6 text-white-15 select-none shrink-0 tabular-nums text-[12px]">
                    {i + 1}
                  </span>
                  <span>{highlightLua(line)}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
