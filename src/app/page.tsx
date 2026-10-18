import Image from 'next/image';
import About from '@/components/About';
import Contacts from '@/components/Contacts';
import Delivery from '@/components/Delivery';
import LeadModal from '@/components/LeadModal';
import Products from '@/components/Products';

const overlay =
  'linear-gradient(to right, rgba(38,26,16,0.88) 0%, rgba(38,26,16,0.8) 15%, rgba(38,26,16,0.8) 28%, rgba(38,26,16,0.7) 36%, rgba(38,26,16,0.55) 44%, rgba(38,26,16,0.35) 52%, rgba(38,26,16,0.2) 62%, rgba(38,26,16,0.12) 100%)';

const navLink =
  'whitespace-nowrap py-2 text-[10px] font-medium uppercase tracking-[0.08em] text-[#f5efe0] transition-opacity hover:opacity-70 lg:py-0 lg:text-[1vw] lg:tracking-[0.05em]';

export default function Home() {
  return (
    <main>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="paper-cut" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <section className="relative min-h-[640px] w-full overflow-hidden lg:aspect-[1691/748] lg:min-h-0">
        <Image
          src="/home.jpg"
          alt="Обжарщик насыпает свежеобжаренные зёрна в чашу весов"
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 100vw, 1100px"
          className="object-cover object-[65%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-[rgba(38,26,16,0.6)] lg:hidden" />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(38,26,16,0.5) 0%, rgba(38,26,16,0) 42%), ${overlay}`,
          }}
        />
        <div className="absolute inset-x-0 top-0 h-[98px] bg-black/20 lg:h-[6.3vw]" />

        <header className="absolute inset-x-0 top-0 z-20 flex flex-wrap items-center justify-between gap-y-2 px-4 pb-3 pt-4 lg:h-[7.8vw] lg:flex-nowrap lg:gap-y-0 lg:py-0 lg:pl-[4vw] lg:pr-[0.77vw]">
          <div className="flex items-center">
            <span className="font-display text-[24px] font-medium uppercase leading-none tracking-[0.08em] text-[#f5efe0] lg:text-[3.3vw]">
              Кварта
            </span>
            <span className="ml-2.5 border-l border-[#f5efe0]/50 pl-2.5 text-[8.5px] font-medium uppercase leading-[1.5] tracking-[0.1em] text-[#f5efe0]/90 lg:ml-[2.2vw] lg:pl-[2.7vw] lg:text-[1vw] lg:tracking-[0.12em]">
              Обжариваем
              <br />
              в Минске
            </span>
          </div>

          <nav className="contents lg:flex lg:items-center lg:gap-[2.8vw]">
            <div className="order-3 flex w-full items-center gap-3.5 lg:order-none lg:w-auto lg:gap-[2.8vw]">
              <a href="#coffee" className={navLink}>Зерно</a>
              <a href="#subscription" className={navLink}>Подписка</a>
              <a href="#about" className={navLink}>О нас</a>
              <a href="#delivery" className={navLink}>Доставка</a>
              <a href="#contacts" className={navLink}>Контакты</a>
            </div>
            <a
              href="#lead"
              className="relative order-2 -mr-4 h-[42px] w-[150px] transition-opacity hover:opacity-90 lg:order-none lg:mr-0 lg:ml-[-2.8vw] lg:h-[4.31vw] lg:w-[17.6vw]"
            >
              <Image src="/brush.png" alt="" fill sizes="300px" className="object-fill" />
              <span className="absolute inset-0 z-10 flex items-center justify-center text-[9.5px] font-medium uppercase tracking-[0.03em] text-white lg:text-[1.05vw] lg:tracking-[0.06em]">
                Оставить заявку
              </span>
            </a>
          </nav>
        </header>

        <h1
          style={{ filter: 'url(#paper-cut)' }}
          className="absolute left-5 top-[124px] z-10 origin-left font-display text-[clamp(3.25rem,15vw,5.5rem)] font-medium uppercase leading-[0.98] tracking-[0.02em] text-[#f5efe0] lg:left-[4vw] lg:top-[21.9%] lg:scale-x-[1.14] lg:text-[7.1vw]"
        >
          <span className="block">Хороший</span>
          <span className="block">кофе</span>
          <span className="block">не ждёт.</span>
        </h1>

        <p className="absolute bottom-10 left-5 z-10 text-[11px] font-normal uppercase leading-[1.75] tracking-[0.1em] text-[#f5efe0]/90 lg:bottom-auto lg:left-[4.5vw] lg:top-[77%] lg:text-[1.22vw]">
          Обжариваем по четвергам /
          <br />
          доставляем по пятницам
        </p>

        <div className="absolute bottom-[30%] right-[8%] z-10 flex flex-col items-end lg:bottom-auto lg:left-[81.5%] lg:right-auto lg:top-[59.5%] lg:flex-row lg:items-start lg:gap-1">
          <svg
            className="mt-2 hidden h-[3.2vw] w-[3.2vw] flex-shrink-0 lg:block"
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
          <p className="-rotate-6 font-hand text-xl leading-tight text-[#f5efe0] lg:text-[1.75vw]">
            Свежая
            <br />
            обжарка —
            <br />
            вкуснее
          </p>
          <svg
            className="mr-5 mt-1 h-12 w-10 lg:hidden"
            viewBox="0 0 40 48"
            fill="none"
            stroke="#f5efe0"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M 6 4 C 30 8, 36 24, 24 44" />
            <path d="M 24 44 L 22 33" />
            <path d="M 24 44 L 33 36" />
          </svg>
        </div>
      </section>

      <Products />
      <About />
      <Delivery />
      <Contacts />
      <LeadModal />
    </main>
  );
}
