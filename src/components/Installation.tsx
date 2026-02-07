const steps = [
  {
    num: '01',
    title: 'GameGuardian',
    desc: 'Установи GameGuardian 101.1+ с официального сайта. Требуется root или виртуальное пространство.',
    note: 'Magisk · KernelSU · VMOS',
  },
  {
    num: '02',
    title: 'Запуск игры',
    desc: 'Открой Hypper Sandbox и дождись полной загрузки. Зайди на сервер или в одиночную игру.',
    note: 'Android 7.0+',
  },
  {
    num: '03',
    title: 'Инъекция',
    desc: 'Открой GameGuardian поверх игры → Выполнить скрипт → Выбери renault_v3.2.lua.',
    note: 'Файл → Скрипт → .lua',
  },
  {
    num: '04',
    title: 'Готово',
    desc: 'Меню появится автоматически. Нажми иконку GG для управления функциями.',
    note: 'Нажми GG → Меню',
  },
];

export function Installation() {
  return (
    <section id="install" className="relative py-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-20">
          <p className="text-[12px] font-mono text-grav-light tracking-[0.2em] uppercase mb-4">
            Установка
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white-90 tracking-tight">
            Две минуты.
            <br />
            <span className="text-white-30">Четыре шага.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative p-7 rounded-2xl border border-white-8 bg-void-1 hover:border-white-15 transition-all duration-500"
            >
              {/* Step number */}
              <span className="absolute top-6 right-7 font-display font-bold text-[4rem] leading-none text-white-4 group-hover:text-white-8 transition-colors duration-500">
                {step.num}
              </span>

              <div className="relative">
                <h3 className="font-display font-semibold text-[17px] text-white-90 mb-3">
                  {step.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-white-30 mb-5 pr-16">
                  {step.desc}
                </p>
                <span className="inline-block text-[11px] font-mono text-grav-light/50 px-2.5 py-1 rounded-md bg-grav/5 border border-grav/10">
                  {step.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
