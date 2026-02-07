const features = [
  {
    title: 'AimBot',
    desc: 'Интеллектуальное наведение с настраиваемым FOV и сглаживанием. Естественное поведение прицела.',
    icon: '◎',
  },
  {
    title: 'WallHack',
    desc: 'ESP-отображение игроков сквозь стены. Дистанция, здоровье, никнеймы в реальном времени.',
    icon: '◈',
  },
  {
    title: 'Speed Hack',
    desc: 'Управление скоростью перемещения и стрельбы. Тонкая настройка множителя.',
    icon: '⟐',
  },
  {
    title: 'God Mode',
    desc: 'Неуязвимость с обходом серверных проверок. Бесконечное здоровье и броня.',
    icon: '⬡',
  },
  {
    title: 'Спавн предметов',
    desc: 'Генерация любых игровых объектов, оружия и ресурсов в инвентарь.',
    icon: '⊞',
  },
  {
    title: 'Анти-детект',
    desc: 'Маскировка памяти, рандомизация сигнатур, многоуровневый обход античита.',
    icon: '⊘',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-32">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-20">
          <p className="text-[12px] font-mono text-grav-light tracking-[0.2em] uppercase mb-4">
            Возможности
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white-90 tracking-tight">
            Всё необходимое.
            <br />
            <span className="text-white-30">Ничего лишнего.</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white-8 rounded-2xl overflow-hidden">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-void-1 p-8 group hover:bg-void-2 transition-colors duration-500 relative"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,110,245,0.04),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <span className="text-2xl text-grav-light/60 group-hover:text-grav-light transition-colors duration-500 block mb-5">
                  {f.icon}
                </span>
                <h3 className="font-display font-semibold text-[17px] text-white-90 mb-2.5">
                  {f.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-white-30 group-hover:text-white-50 transition-colors duration-500">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
