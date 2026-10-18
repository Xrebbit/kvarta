import { paperNoise } from '@/lib/paper';

const steps = [
  { day: 'Четверг', text: 'Обжариваем партию по 5 кг' },
  { day: 'Пятница', text: 'Развозим заказы по Минску' },
  { day: '1–3 день', text: 'Зерно у вас, пока оно свежее' },
];

export default function Delivery() {
  return (
    <section
      id="delivery"
      className="relative overflow-hidden bg-[#e8dec9] px-5 py-14 text-[#1f1812] md:px-[4.8vw] md:py-[5vw]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{ backgroundImage: paperNoise }}
      />

      <div className="relative">
        <div className="flex items-center gap-5 text-[11px] font-medium uppercase tracking-[0.12em] md:text-[0.85vw]">
          <span>Доставка и самовывоз</span>
          <span className="h-px w-[3.4vw] min-w-8 bg-[#1f1812]/70" />
        </div>

        <h2 className="mt-4 font-serif text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.015em] md:mt-[0.9vw] md:text-[3.6vw] md:leading-[1.05]">
          Обжариваем в четверг,
          <br />
          привозим в пятницу.
        </h2>

        <ol className="mt-9 grid gap-6 md:mt-[2.6vw] md:grid-cols-3 md:gap-[2.25vw]">
          {steps.map((step, index) => (
            <li key={step.day} className="relative border-t border-[#1f1812]/30 pt-4 md:pt-[1.1vw]">
              <span
                aria-hidden="true"
                className="absolute -top-[5px] left-0 h-[9px] w-[9px] rounded-full bg-[#a0522d]"
              />
              <p className="font-serif text-[1.6rem] font-semibold md:text-[2vw]">{step.day}</p>
              <p className="mt-1 font-serif text-[1rem] leading-[1.6] text-[#1f1812]/85 md:mt-[0.4vw] md:text-[1.1vw]">
                {step.text}
              </p>
              <span className="sr-only">Шаг {index + 1} из 3</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-5 md:mt-[3.2vw] md:grid-cols-2 md:gap-[2.25vw]">
          <article className="border border-[#1f1812]/[0.08] bg-[#f2eadc]/60 p-6 md:p-[2vw]">
            <div className="flex items-center gap-3">
              <svg width="30" height="22" viewBox="0 0 26 20" fill="none" stroke="#1f1812" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
                <path d="M1.5 3 H15 V14 H1.5 Z M15 7 H20 L24.5 11 V14 H15" />
                <circle cx="6" cy="15.5" r="2" fill="#f2eadc" />
                <circle cx="19.5" cy="15.5" r="2" fill="#f2eadc" />
              </svg>
              <h3 className="font-serif text-[1.5rem] font-semibold md:text-[1.8vw]">Доставка по Минску</h3>
            </div>
            <ul className="mt-4 space-y-2 font-serif text-[1rem] leading-[1.6] md:mt-[1.2vw] md:space-y-[0.5vw] md:text-[1.1vw]">
              <li>Развозим по пятницам.</li>
              <li>Заказ от 50 BYN — доставка бесплатно.</li>
              <li>Подписка — доставка всегда бесплатно.</li>
            </ul>
          </article>

          <article className="border border-[#1f1812]/[0.08] bg-[#f2eadc]/60 p-6 md:p-[2vw]">
            <div className="flex items-center gap-3">
              <svg width="24" height="26" viewBox="0 0 20 22" fill="none" stroke="#1f1812" strokeWidth="1.3" aria-hidden="true">
                <path d="M10 21 C 5 14, 2 11, 2 8 A 8 8 0 0 1 18 8 C 18 11, 15 14, 10 21 Z" />
                <circle cx="10" cy="8" r="2.6" />
              </svg>
              <h3 className="font-serif text-[1.5rem] font-semibold md:text-[1.8vw]">Самовывоз</h3>
            </div>
            <ul className="mt-4 space-y-2 font-serif text-[1rem] leading-[1.6] md:mt-[1.2vw] md:space-y-[0.5vw] md:text-[1.1vw]">
              <li>Минск, ул. Короля, 9.</li>
              <li>Пн–Пт 8:00–20:00, Сб–Вс 10:00–18:00.</li>
              <li>
                <a
                  href="#lead"
                  className="underline decoration-[#a0522d] decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
                >
                  Оставьте заявку, и мы подготовим заказ
                </a>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
