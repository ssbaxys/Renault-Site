const features = [
  {
    title: 'AimBot',
    desc: 'Интеллектуальное наведение с настраиваемым FOV, сглаживанием и предсказанием движения. Визуально неотличимо от ручной игры.',
    icon: '◎',
    tags: ['FOV Control', 'Smoothing', 'Prediction'],
  },
  {
    title: 'WallHack ESP',
    desc: 'Отображение всех игроков сквозь стены — дистанция, здоровье, никнеймы, оружие и направление взгляда в реальном времени.',
    icon: '◈',
    tags: ['Box ESP', 'Skeleton', 'Distance'],
  },
  {
    title: 'Speed Hack',
    desc: 'Управление скоростью перемещения, анимаций и стрельбы. Тонкая настройка множителя от x0.5 до x10.',
    icon: '⟐',
    tags: ['Movement', 'Fire Rate', 'Multiplier'],
  },
  {
    title: 'God Mode',
    desc: 'Бессмертие с полным обходом серверных проверок. Бесконечное здоровье, броня и ресурсы.',
    icon: '⬡',
    tags: ['Immortality', 'Inf Ammo', 'No Recoil'],
  },
  {
    title: 'Спавн предметов',
    desc: 'Генерация любых игровых объектов — оружие, ресурсы, транспорт, уникальные предметы. Прямо в инвентарь.',
    icon: '⊞',
    tags: ['Weapons', 'Items', 'Vehicles'],
  },
  {
    title: 'Анти-детект',
    desc: 'Маскировка сигнатур в памяти, рандомизация оффсетов, мимикрия под легитимные процессы. Многоуровневый обход.',
    icon: '⊘',
    tags: ['Signature Mask', 'Randomize', 'Bypass'],
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-28">
      {/* Separator */}
      <div className="section-divider max-w-6xl mx-auto mb-28" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
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
            Каждая функция проходит тестирование на актуальной версии игры и обновляется в течение 24 часов после патча.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="glow-card group relative p-7 rounded-2xl border border-white-8 bg-void-1 hover:bg-void-2 hover:border-white-15 transition-all duration-500"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(124,110,245,0.04),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                {/* Icon + Title row */}
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

                {/* Tags */}
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
        <div className="mt-8 p-5 rounded-2xl border border-white-8 bg-void-1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
            <span className="text-[13px] text-white-50">
              Все функции активны и работают на текущей версии <span className="text-white-70 font-medium">Hypper Sandbox 2.1.4</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-white-15">
            обновлено 12.01.2025
          </span>
        </div>
      </div>
    </section>
  );
}
