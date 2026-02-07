import { useState } from 'react';

const faqs = [
  {
    q: 'Скрипт действительно бесплатный?',
    a: 'Да. Полностью бесплатен, с открытым исходным кодом. Никаких подписок, скрытых платежей или обязательных донатов.',
  },
  {
    q: 'Есть риск бана?',
    a: 'Встроена система маскировки памяти и обхода античита. Тем не менее, любые модификации — это риск. Используй альтернативный аккаунт.',
  },
  {
    q: 'Какие устройства поддерживаются?',
    a: 'Android 7.0+ с root-доступом (Magisk, KernelSU) или виртуальным пространством (VMOS, Virtual Xposed). iOS не поддерживается.',
  },
  {
    q: 'Безопасен ли скрипт?',
    a: 'Код открыт — проверяй каждую строку. Не собирает данные, не обращается к сторонним серверам, не требует лишних разрешений.',
  },
  {
    q: 'Как часто обновляется?',
    a: 'Оффсеты обновляются в течение 24-48 часов после каждого обновления игры. Обновление оффсетов происходит автоматически.',
  },
  {
    q: 'Скрипт не запускается?',
    a: 'Проверь версию GameGuardian (101.1+), правильный процесс игры и полную загрузку. При проблемах — перезагрузи устройство.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-32">
      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-20">
          <p className="text-[12px] font-mono text-grav-light tracking-[0.2em] uppercase mb-4">
            FAQ
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white-90 tracking-tight">
            Вопросы.
          </h2>
        </div>

        <div className="space-y-px">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="border-b border-white-8 last:border-b-0"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span
                    className={`text-[15px] font-medium transition-colors pr-8 ${
                      isOpen ? 'text-white-90' : 'text-white-50 group-hover:text-white-70'
                    }`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`text-[18px] text-white-30 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-400 ${
                    isOpen ? 'max-h-40 opacity-100 pb-5' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-[13px] leading-relaxed text-white-30 pr-12">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
