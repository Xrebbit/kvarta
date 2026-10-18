import Image from 'next/image';

const ADDRESS = 'Минск, ул. Короля, 9';
const MAP_URL = `https://yandex.by/maps/?text=${encodeURIComponent(ADDRESS)}`;

export default function Contacts() {
  return (
    <footer
      id="contacts"
      className="bg-[#1c130d] px-5 pb-8 pt-12 text-[#f5efe0] md:px-[4.8vw] md:pb-[2vw] md:pt-[4vw]"
    >
      <div className="flex items-center gap-5 text-[11px] font-medium uppercase tracking-[0.12em] md:text-[0.85vw]">
        <span>Контакты</span>
        <span className="h-px w-[3.4vw] min-w-8 bg-[#f5efe0]/60" />
      </div>

      <div className="mt-6 grid gap-9 md:mt-[2vw] md:grid-cols-[1.1fr_1fr_1fr_auto] md:items-start md:gap-[3vw]">
        <div>
          <p className="font-display text-[2.4rem] font-medium uppercase leading-none tracking-[0.08em] md:text-[3.3vw]">
            Кварта
          </p>
          <p className="mt-3 max-w-[18em] font-serif text-[1rem] leading-[1.6] text-[#f5efe0]/80 md:mt-[0.9vw] md:text-[1.05vw]">
            Небольшая обжарка в Минске. Аня и Дмитрий обжаривают кофе с 2019 года.
          </p>
        </div>

        <div className="font-serif text-[1.05rem] leading-[1.6] md:text-[1.1vw]">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#f5efe0]/60 md:text-[0.78vw]">
            Адрес
          </p>
          <p className="mt-2 md:mt-[0.6vw]">{ADDRESS}</p>
          <p className="text-[#f5efe0]/70">самовывоз</p>
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block underline decoration-[#a0522d] decoration-2 underline-offset-4 transition-opacity hover:opacity-70 md:mt-[0.5vw]"
          >
            Открыть на карте
          </a>
        </div>

        <div className="font-serif text-[1.05rem] leading-[1.6] md:text-[1.1vw]">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#f5efe0]/60 md:text-[0.78vw]">
            Часы работы
          </p>
          <p className="mt-2 md:mt-[0.6vw]">Пн–Пт 8:00–20:00</p>
          <p>Сб–Вс 10:00–18:00</p>
          <p className="mt-2 text-[#f5efe0]/70 md:mt-[0.5vw]">Доставка по Минску — по пятницам</p>
        </div>

        <a
          href="#lead"
          className="relative -ml-[26px] block h-[64px] w-[228px] transition-opacity hover:opacity-90 md:ml-0 md:h-[4.3vw] md:w-[17.4vw]"
        >
          <Image src="/brush.png" alt="" fill sizes="300px" className="object-fill" />
          <span className="absolute inset-0 z-10 flex items-center justify-center gap-3 text-[12px] font-medium uppercase tracking-[0.06em] text-white md:text-[0.95vw]">
            Оставить заявку
            <span aria-hidden="true" className="text-lg md:text-[1.3vw]">
              →
            </span>
          </span>
        </a>
      </div>

      <div className="mt-10 border-t border-[#f5efe0]/15 pt-5 text-[12px] text-[#f5efe0]/55 md:mt-[3vw] md:pt-[1.2vw] md:text-[0.85vw]">
        © 2019–2026 Кварта. Обжариваем в Минске.
      </div>
    </footer>
  );
}
