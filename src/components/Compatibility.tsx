export function Compatibility() {
  const requirements = [
    {
      category: 'Операционная система',
      items: [
        { name: 'Android 7.0+', status: 'ok' as const, note: 'Nougat и выше' },
        { name: 'Android 14', status: 'ok' as const, note: 'Полная поддержка' },
        { name: 'iOS / iPadOS', status: 'no' as const, note: 'Не поддерживается' },
      ]
    },
    {
      category: 'Root-доступ',
      items: [
        { name: 'Magisk', status: 'ok' as const, note: 'Рекомендуется' },
        { name: 'KernelSU', status: 'ok' as const, note: 'Полная поддержка' },
        { name: 'VMOS / Virtual Space', status: 'warn' as const, note: 'Ограничения' },
      ]
    },
    {
      category: 'Инструменты',
      items: [
        { name: 'GameGuardian 101.1+', status: 'ok' as const, note: 'Обязательно' },
        { name: 'Hypper Sandbox 2.x', status: 'ok' as const, note: 'Актуальная версия' },
        { name: 'RAM 2GB+', status: 'ok' as const, note: 'Минимум' },
      ]
    },
  ];

  const statusIcon = (s: 'ok' | 'warn' | 'no') => {
    if (s === 'ok') return <span className="w-2 h-2 rounded-full bg-ok/80" />;
    if (s === 'warn') return <span className="w-2 h-2 rounded-full bg-warn/80" />;
    return <span className="w-2 h-2 rounded-full bg-err/60" />;
  };

  return (
    <section id="compat" className="relative py-28">
      <div className="section-divider max-w-6xl mx-auto mb-28" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-[12px] font-mono text-grav-light tracking-[0.2em] uppercase mb-4">
              // Совместимость
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white-90 tracking-tight leading-tight">
              Системные<br />
              <span className="text-white-30">требования.</span>
            </h2>
          </div>
          <p className="text-[14px] text-white-30 max-w-sm leading-relaxed">
            Скрипт оптимизирован для работы на широком спектре Android-устройств с минимальными требованиями.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {requirements.map((group, gi) => (
            <div key={gi} className="rounded-2xl border border-white-8 bg-void-1 overflow-hidden">
              {/* Category header */}
              <div className="px-6 py-4 border-b border-white-8 bg-void-2">
                <span className="text-[13px] font-display font-semibold text-white-70">{group.category}</span>
              </div>
              {/* Items */}
              <div className="p-4 space-y-1">
                {group.items.map((item, ii) => (
                  <div key={ii} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white-2 transition-colors group">
                    {statusIcon(item.status)}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-white-70 group-hover:text-white-90 transition-colors">{item.name}</div>
                      <div className="text-[11px] text-white-15 mt-0.5">{item.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Performance note */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 p-5 rounded-2xl border border-white-8 bg-void-1">
            <div className="text-[12px] font-mono text-grav-light/50 mb-2">Производительность</div>
            <div className="text-[14px] text-white-50 leading-relaxed">
              Скрипт потребляет <span className="text-white-70">менее 5MB RAM</span> и не влияет на FPS. Все операции выполняются в отдельном потоке через GameGuardian.
            </div>
          </div>
          <div className="flex-1 p-5 rounded-2xl border border-white-8 bg-void-1">
            <div className="text-[12px] font-mono text-grav-light/50 mb-2">Безопасность</div>
            <div className="text-[14px] text-white-50 leading-relaxed">
              Не обращается к серверам, <span className="text-white-70">не собирает данные</span>, не требует интернет-подключения. Весь код — локально на устройстве.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
