export function Download() {
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const script = `-- Renault Script v3.2 | Hypper Sandbox
-- GameGuardian Lua Injection

gg.setVisible(false)
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
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'renault_v3.2.lua';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="download" className="relative py-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative rounded-3xl border border-white-8 bg-void-1 overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(124,110,245,0.08),transparent_70%)]" />

          <div className="relative p-10 md:p-16 text-center">
            {/* Orbital decoration */}
            <div className="relative w-20 h-20 mx-auto mb-10">
              <div className="absolute inset-0 rounded-full border border-white-8 animate-orbit" />
              <div className="absolute inset-2 rounded-full border border-grav/20 animate-orbit-reverse" />
              <div className="absolute inset-[18px] rounded-full bg-grav/10" />
              <div className="absolute inset-[22px] rounded-full bg-void" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-grav-light/60" />
            </div>

            <h2 className="font-display font-bold text-3xl md:text-4xl text-white-90 tracking-tight mb-4">
              Скачать Renault
            </h2>
            <p className="text-[15px] text-white-30 max-w-md mx-auto mb-10">
              Бесплатно. Без регистрации. Без ограничений.
            </p>

            <button
              onClick={handleDownload}
              className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white-pure text-void text-[15px] font-semibold transition-all hover:shadow-[0_0_60px_rgba(124,110,245,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16" />
              </svg>
              renault_v3.2.lua
            </button>

            {/* File details */}
            <div className="mt-12 flex items-center justify-center gap-8 text-[12px] text-white-30">
              <span>Lua 5.3</span>
              <span className="w-px h-3 bg-white-15" />
              <span>12 KB</span>
              <span className="w-px h-3 bg-white-15" />
              <span>Открытый код</span>
              <span className="w-px h-3 bg-white-15" />
              <span>Без вирусов</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
