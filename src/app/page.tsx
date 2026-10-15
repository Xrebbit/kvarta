import Image from 'next/image';

const overlay =
  'linear-gradient(to right, rgba(38,26,16,0.88) 0%, rgba(38,26,16,0.8) 15%, rgba(38,26,16,0.8) 28%, rgba(38,26,16,0.7) 36%, rgba(38,26,16,0.55) 44%, rgba(38,26,16,0.35) 52%, rgba(38,26,16,0.2) 62%, rgba(38,26,16,0.12) 100%)';

const navLink =
  'hidden text-[1vw] font-medium uppercase tracking-[0.05em] text-[#f5efe0] transition-opacity hover:opacity-70 md:block';

export default function Home() {
  return (
    <main>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="paper-cut" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <section className="relative min-h-[640px] w-full overflow-hidden md:aspect-[1691/748] md:min-h-0">
        <Image
          src="/home.jpg"
          alt="Обжарщик насыпает свежеобжаренные зёрна в чашу весов"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center] md:object-center"
        />
        <div className="absolute inset-0 bg-[rgba(38,26,16,0.6)] md:hidden" />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(38,26,16,0.5) 0%, rgba(38,26,16,0) 42%), ${overlay}`,
          }}
        />
        <div className="absolute inset-x-0 top-0 h-[84px] bg-black/20 md:h-[6.3vw]" />

        <header className="absolute inset-x-0 top-0 z-20 flex h-[84px] items-center justify-between px-5 md:h-[7.8vw] md:pl-[4vw] md:pr-[0.77vw]">
          <div className="flex items-center">
            <span className="font-display text-[34px] font-medium uppercase leading-none tracking-[0.08em] text-[#f5efe0] md:text-[3.3vw]">
              Кварта
            </span>
            <span className="ml-[2.2vw] hidden border-l border-[#f5efe0]/50 pl-[2.7vw] text-[1vw] font-medium uppercase leading-[1.55] tracking-[0.12em] text-[#f5efe0]/90 md:block">
              Обжариваем
              <br />
              в Минске
            </span>
          </div>

          <nav className="flex items-center md:gap-[2.8vw]">
            <a href="#coffee" className={navLink}>Зерно</a>
            <a href="#subscription" className={navLink}>Подписка</a>
            <a href="#about" className={navLink}>О нас</a>
            <a
              href="#lead"
              className="relative h-[56px] w-[200px] transition-opacity hover:opacity-90 md:ml-[-2.8vw] md:h-[4.31vw] md:w-[17.6vw]"
            >
              <Image src="/brush.png" alt="" fill sizes="300px" className="object-fill" />
              <span className="absolute inset-0 z-10 flex items-center justify-center text-[12px] font-medium uppercase tracking-[0.06em] text-white md:text-[1.05vw]">
                Оставить заявку
              </span>
            </a>
          </nav>
        </header>

        <h1
          style={{ filter: 'url(#paper-cut)' }}
          className="absolute left-5 top-[104px] z-10 origin-left font-display text-[clamp(3.25rem,15vw,5.5rem)] font-medium uppercase leading-[0.98] tracking-[0.02em] text-[#f5efe0] md:left-[4vw] md:top-[21.9%] md:scale-x-[1.14] md:text-[7.1vw]"
        >
          <span className="block">Хороший</span>
          <span className="block">кофе</span>
          <span className="block">не ждёт.</span>
        </h1>

        <p className="absolute bottom-10 left-5 z-10 text-[11px] font-normal uppercase leading-[1.75] tracking-[0.1em] text-[#f5efe0]/90 md:bottom-auto md:left-[4.5vw] md:top-[77%] md:text-[1.22vw]">
          Обжариваем по четвергам /
          <br />
          доставляем по пятницам
        </p>

        <div className="absolute bottom-[34%] right-[7%] z-10 flex items-start gap-1 md:bottom-auto md:left-[81.5%] md:right-auto md:top-[59.5%]">
          <svg
            className="mt-2 h-12 w-12 flex-shrink-0 md:h-[3.2vw] md:w-[3.2vw]"
            viewBox="0 0 60 60"
            fill="none"
            stroke="#f5efe0"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M 54 12 C 40 14, 22 24, 8 46" />
            <path d="M 8 46 L 10 34" />
            <path d="M 8 46 L 19 42" />
          </svg>
          <p className="-rotate-6 font-hand text-xl leading-tight text-[#f5efe0] md:text-[1.75vw]">
            Свежая
            <br />
            обжарка –
            <br />
            вкуснее
          </p>
        </div>
      </section>
    </main>
  );
}
