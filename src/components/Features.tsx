const features = [
  {
    title: 'AimBot',
    desc: 'Автоматическое наведение на Nextbot\'ов и других игроков. Настраиваемый FOV, сглаживание и приоритет целей.',
    icon: '◎',
    tags: ['FOV Control', 'Smoothing', 'Target Priority'],
  },
  {
    title: 'WallHack ESP',
    desc: 'Отображение игроков и Nextbot\'ов сквозь стены — дистанция, никнеймы, направление движения в реальном времени.',
    icon: '◈',
    tags: ['Box ESP', 'Nametags', 'Distance'],
  },
  {
    title: 'Speed Hack',
    desc: 'Управление скоростью перемещения персонажа и транспорта. Множитель от x0.5 до x10 для полного контроля.',
    icon: '⟐',
    tags: ['Movement', 'Vehicle Speed', 'Multiplier'],
  },
  {
    title: 'God Mode',
    desc: 'Бессмертие — бесконечное здоровье при столкновениях, взрывах и атаках Nextbot\'ов. Полная неуязвимость.',
    icon: '⬡',
    tags: ['Immortality', 'No Damage', 'Inf Health'],
  },
  {
    title: 'Спавн объектов',
    desc: 'Генерация оружия, транспорта, пропсов и инструментов прямо на карте. Все объекты из каталога игры.',
    icon: '⊞',
    tags: ['Weapons', 'Vehicles', 'Props'],
  },
  {
    title: 'Физика и гравитация',
    desc: 'Управление параметрами физического движка — гравитация, масса объектов, сила Physics Gun и скорость вертолётов.',
    icon: '⊘',
    tags: ['Gravity', 'Mass Edit', 'Physics'],
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-28 z-[1]">
      {/* Separator */}
      <div className="section-divider max-w-6xl mx-auto mb-28" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div>
            <p className="text-[12px] font-mono text-grav-light tracking-[0.2em] uppercase mb-4">
              // Возможности
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white-90 tracking-tight leading-tight">
              Всё необходимое.<br />
              <span className="text-white-30">Ничего лишнего.</span>
            </h2>
          </div>
          <p className="text-[14px] text-white-30 max-w-sm leading-relaxed">
            Каждая функция тестируется на актуальной версии и обновляется при выходе патча.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="glow-card group relative p-5 sm:p-7 rounded-2xl border border-white-8 bg-void-1 hover:bg-void-2 hover:border-white-15 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(124,110,245,0.04),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl text-grav/40 group-hover:text-grav-light transition-colors duration-500">
                    {f.icon}
                  </span>
                  <h3 className="font-display font-semibold text-[16px] text-white-90">
                    {f.title}
                  </h3>
                </div>

                <p className="text-[13px] leading-relaxed text-white-30 group-hover:text-white-50 transition-colors duration-500 mb-5">
                  {f.desc}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono text-white-15 group-hover:text-white-30 px-2 py-0.5 rounded-md border border-white-4 group-hover:border-white-8 transition-all duration-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary bar */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-5 rounded-2xl border border-white-8 bg-void-1 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-ok animate-pulse shrink-0" />
            <span className="text-[12px] sm:text-[13px] text-white-50">
              Все функции работают на <span className="text-white-70 font-medium whitespace-nowrap">Hypper Sandbox 0.5.0.2</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-white-15">
            VobbyGames
          </span>
        </div>
      </div>
    </section>
  );
}
