import { useState } from 'react';

const faqs = [
  {
    q: 'Скрипт действительно бесплатный?',
    a: 'Да, полностью бесплатен с открытым исходным кодом. Никаких подписок, скрытых платежей, обязательных донатов или рекламы. Навсегда.',
  },
  {
    q: 'Могут ли забанить за использование?',
    a: 'Нет. Hypper Sandbox — это песочница без античита и системы банов. У игры нет защиты от модификаций, поэтому скрипт работает полностью безопасно.',
  },
  {
    q: 'Какие устройства поддерживаются?',
    a: 'Android 7.0 (Nougat) и выше с root-доступом через Magisk или KernelSU. Также работает через виртуальные пространства (VMOS, Virtual Xposed) с некоторыми ограничениями. iOS не поддерживается.',
  },
  {
    q: 'Безопасен ли скрипт?',
    a: 'Код полностью открыт — можешь проверить каждую строку. Скрипт не собирает данные, не обращается к сторонним серверам, не требует интернет-подключения. Работает локально на устройстве.',
  },
  {
    q: 'Как часто выходят обновления?',
    a: 'Оффсеты обновляются после каждого обновления игры. Крупные обновления функций — примерно раз в 2-3 недели. Обновление оффсетов можно запустить из меню скрипта.',
  },
  {
    q: 'Скрипт не запускается — что делать?',
    a: 'Проверь: 1) версия GameGuardian 101.1 или выше, 2) выбран правильный процесс Hypper Sandbox, 3) игра полностью загружена, 4) root-доступ активен. Если не помогает — перезагрузи устройство.',
  },
  {
    q: 'Работает ли в мультиплеере?',
    a: 'Да, все функции работают и в одиночной игре, и на мультиплеер-серверах. Speed Hack, God Mode, ESP — всё доступно в онлайне.',
  },
  {
    q: 'Можно ли модифицировать скрипт?',
    a: 'Конечно. Код открыт и не защищён лицензией. Можешь изменять, дополнять и распространять свои версии. Будем рады, если укажешь оригинальный источник.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-28 z-[1]">
      <div className="section-divider max-w-6xl mx-auto mb-28" />

      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-16">
          <p className="text-[12px] font-mono text-grav-light tracking-[0.2em] uppercase mb-4">
            // FAQ
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white-90 tracking-tight leading-tight">
            Частые вопросы.
          </h2>
          <p className="mt-4 text-[14px] text-white-30 max-w-lg">
            Ответы на самые популярные вопросы о скрипте и его работе.
          </p>
        </div>

        <div>
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-white-8 first:border-t">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <div className="flex items-center gap-4 pr-6">
                    <span className="text-[11px] font-mono text-white-15 shrink-0 w-6">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-[15px] font-medium transition-colors duration-300 ${
                      isOpen ? 'text-white-90' : 'text-white-50 group-hover:text-white-70'
                    }`}>
                      {faq.q}
                    </span>
                  </div>
                  <span className={`text-[20px] text-white-15 shrink-0 transition-all duration-300 ${
                    isOpen ? 'rotate-45 text-grav-light/50' : 'group-hover:text-white-30'
                  }`}>
                    +
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${
                  isOpen ? 'max-h-60 opacity-100 pb-6' : 'max-h-0 opacity-0'
                }`}>
                  <p className="text-[13px] leading-[1.8] text-white-30 pl-10 pr-12">
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
