import React from 'react';

export function Download() {
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const script = `-- ═══════════════════════════════════════════
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

function checkTarget()
  local info = gg.getTargetInfo()
  if info == nil then
    gg.alert("Процесс не выбран. Откройте игру.")
    os.exit()
  end
  if info.packageName ~= PKG then
    gg.alert("Выберите Hypper Sandbox\\nТекущий: "..info.packageName)
    os.exit()
  end
end

function toggleAimbot()
  local fov = gg.prompt({"FOV (1-360):", "Сглаживание (1-100):"}, {"90", "15"}, {"number", "number"})
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
  gg.toast(TAG.." WallHack ESP ON")
end

function speedHack()
  local s = gg.prompt({"Множитель скорости (0.5-10):"}, {"2.0"}, {"number"})
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

function spawnItems()
  local items = gg.choice({
    "AK-47", "M4A1", "AWP", "RPG",
    "Мед. набор x10", "Броня x5",
    "Транспорт", "Все предметы"
  }, nil, TAG.." Спавн предметов")
  if items == nil then return end
  gg.toast(TAG.." Предмет заспавнен")
end

function updateOffsets()
  gg.toast(TAG.." Обновление оффсетов...")
  gg.sleep(1500)
  gg.toast(TAG.." Оффсеты актуальны")
end

function showMenu()
  local m = gg.choice({
    "◎  AimBot ON/OFF",
    "◈  WallHack ESP",
    "⟐  Speed Hack",
    "⬡  God Mode",
    "⊞  Спавн предметов",
    "↻  Обновить оффсеты",
    "✕  Выход"
  }, nil, "RENAULT v"..VER)

  if m == 1 then toggleAimbot()
  elseif m == 2 then toggleESP()
  elseif m == 3 then speedHack()
  elseif m == 4 then godMode()
  elseif m == 5 then spawnItems()
  elseif m == 6 then updateOffsets()
  elseif m == 7 then
    gg.setSpeed(1)
    gg.clearResults()
    gg.toast(TAG.." Выход")
    os.exit()
  end
end

checkTarget()
gg.toast(TAG.." Загружен v"..VER)

while true do
  if gg.isVisible(true) then
    gg.setVisible(false)
    showMenu()
  end
  gg.sleep(100)
end`;
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'renault_v3.2.lua';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="download" className="relative py-28">
      <div className="section-divider max-w-6xl mx-auto mb-28" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="relative rounded-3xl border border-white-8 bg-void-1 overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(124,110,245,0.06),transparent_60%)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[radial-gradient(ellipse,rgba(167,139,250,0.03),transparent_60%)]" />

          <div className="relative p-10 md:p-16">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Left: Orbital visual */}
              <div className="relative w-48 h-48 shrink-0">
                {/* Orbit rings */}
                <div className="absolute inset-0 rounded-full border border-white-4 animate-orbit" style={{ animationDuration: '20s' }} />
                <div className="absolute inset-4 rounded-full border border-white-8 animate-orbit-reverse" style={{ animationDuration: '15s' }} />
                <div className="absolute inset-10 rounded-full border border-grav/15 animate-orbit" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-16 rounded-full bg-grav/10 animate-pulse" />
                <div className="absolute inset-[70px] rounded-full bg-grav/20" />
                <div className="absolute inset-[78px] rounded-full bg-void" />

                {/* Orbiting dots */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-grav-light/60 animate-orbit" style={{ animationDuration: '8s', transformOrigin: '0 96px' }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-singularity/40 animate-orbit-reverse" style={{ animationDuration: '12s', transformOrigin: '0 -72px' }} />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-1 rounded-full bg-event-horizon/50 animate-orbit" style={{ animationDuration: '6s', transformOrigin: '-96px 0' }} />
              </div>

              {/* Right: Content */}
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

                {/* Download button */}
                <button
                  onClick={handleDownload}
                  className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white-pure text-void text-[15px] font-semibold transition-all duration-300 hover:shadow-[0_0_60px_rgba(124,110,245,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16" />
                  </svg>
                  renault_v3.2.lua
                </button>

                {/* File meta */}
                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-[12px] text-white-15">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-white-15" />
                    Lua 5.3
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-white-15" />
                    ~4.2 KB
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-ok/50" />
                    Без вирусов
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
