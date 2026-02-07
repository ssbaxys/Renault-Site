const steps = [
  {
    num: '01',
    title: 'Установи GameGuardian',
    desc: 'Скачай GameGuardian версии 101.1 или выше с официального сайта. Необходим root-доступ или виртуальное пространство.',
    details: [
      'Magisk — рекомендуемый способ',
      'KernelSU — альтернатива',
      'VMOS — если нет root',
    ],
    note: 'Root / Virtual Space',
    icon: '⬇',
  },
  {
    num: '02',
    title: 'Запусти Hypper Sandbox',
    desc: 'Открой Hypper Sandbox и дождись полной загрузки. Зайди на сервер или создай одиночный мир.',
    details: [
      'Дождись полной загрузки',
      'Зайди на карту',
      'Не сворачивай игру',
    ],
    note: 'Hypper Sandbox 0.5.0.2',
    icon: '▶',
  },
  {
    num: '03',
    title: 'Загрузи скрипт',
    desc: 'Открой GameGuardian поверх игры → Файл → Выполнить скрипт → Выбери файл .lua из памяти устройства.',
    details: [
      'Нажми иконку GG поверх игры',
      'Перейди в раздел скриптов',
      'Выбери скрипт Renault',
    ],
    note: 'Файл → Скрипт → .lua',
    icon: '⚡',
  },
  {
    num: '04',
    title: 'Пользуйся',
    desc: 'Скрипт загружен! Нажимай на иконку GameGuardian для открытия меню. Выбирай нужные функции.',
    details: [
      'Меню появится автоматически',
      'Нажми GG для управления',
      'Настрой параметры под себя',
    ],
    note: 'GG → Меню → Функции',
    icon: '✓',
  },
];

export function Installation() {
  return (
    <section id="install" className="relative py-28 z-[1]">
      <div className="section-divider max-w-6xl mx-auto mb-28" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-[12px] font-mono text-grav-light tracking-[0.2em] uppercase mb-4">
              // Установка
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white-90 tracking-tight leading-tight">
              Две минуты.<br />
              <span className="text-white-30">Четыре шага.</span>
            </h2>
          </div>
          <p className="text-[14px] text-white-30 max-w-sm leading-relaxed">
            Простая установка без компиляции, дополнительных утилит и технических знаний.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-white-8 bg-void-1 hover:border-white-15 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-grav/0 via-grav/20 to-grav/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10">
                <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-2 shrink-0">
                  <span className="font-display font-bold text-3xl md:text-4xl text-white-4 group-hover:text-white-8 transition-colors duration-500">
                    {step.num}
                  </span>
                  <span className="text-lg text-grav/40 group-hover:text-grav-light/60 transition-colors duration-500">
                    {step.icon}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-[17px] text-white-90 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-white-30 mb-4 max-w-lg">
                    {step.desc}
                  </p>

                  <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                    {step.details.map((d, di) => (
                      <div key={di} className="flex items-center gap-2 text-[12px] text-white-15 group-hover:text-white-30 transition-colors">
                        <span className="w-1 h-1 rounded-full bg-grav/30" />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-start">
                  <span className="text-[11px] font-mono text-grav-light/40 px-3 py-1.5 rounded-lg bg-grav/5 border border-grav/10 whitespace-nowrap">
                    {step.note}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info note */}
        <div className="mt-8 p-5 rounded-2xl border border-grav/10 bg-grav/[0.02]">
          <div className="flex items-start gap-3">
            <span className="text-grav-light/60 text-lg shrink-0 mt-0.5">ℹ</span>
            <div>
              <div className="text-[13px] text-grav-light/60 font-medium mb-1">Примечание</div>
              <div className="text-[13px] text-white-30 leading-relaxed">
                Hypper Sandbox — песочница без античита и системы банов. 
                Скрипт безопасно работает как в одиночной игре, так и в мультиплеере.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
