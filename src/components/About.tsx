import Image from 'next/image';
import { paperNoise } from '@/lib/paper';

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#eee5d4] pb-12 text-[#1f1812] md:pb-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{ backgroundImage: paperNoise }}
      />

      <div className="relative md:h-[32.2vw]">
        <div className="px-5 pt-12 md:contents md:px-0 md:pt-0">
          <p className="-rotate-[7deg] font-hand text-[1.55rem] leading-[1.05] text-[#3a2e22] max-md:relative max-md:mb-14 max-md:ml-1 max-md:w-fit md:absolute md:left-[2.6vw] md:top-[0.3vw] md:text-[1.6vw]">
            Аня и Дмитрий
            <br />
            основатели Кварты
            <svg
              aria-hidden="true"
              viewBox="0 0 50 92"
              className="absolute left-[100%] top-[2%] h-[92px] w-[50px] md:hidden"
              fill="none"
              stroke="#3a2e22"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 4 8 C 30 4, 46 28, 38 84" />
              <path d="M 38 84 L 31 73" />
              <path d="M 38 84 L 46 74" />
            </svg>
            <svg
              aria-hidden="true"
              viewBox="0 0 80 30"
              className="absolute left-[101%] top-[12%] hidden h-[1.5vw] w-[3.6vw] md:block"
              fill="none"
              stroke="#3a2e22"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 4 8 C 30 0, 56 4, 72 18" />
              <path d="M 72 18 L 62 17" />
              <path d="M 72 18 L 71 8" />
            </svg>
          </p>

          <div className="relative ml-auto w-[88%] max-w-sm md:absolute md:left-[13.3vw] md:top-[4.8vw] md:mx-0 md:w-[24.6vw] md:max-w-none">
            <div
              aria-hidden="true"
              className="absolute inset-0 rotate-[2.2deg] bg-[#f8f3e8]/80 shadow-[0_1px_6px_rgba(60,40,20,0.22)]"
            />
            <div className="relative -rotate-[2.4deg] bg-[#f8f3e8] p-[1.9%] shadow-[0_2px_10px_rgba(60,40,20,0.28)]">
              <Image
                src="/annadima.jpg"
                alt="Аня и Дмитрий у обжарочной машины"
                width={728}
                height={705}
                sizes="(min-width: 768px) 25vw, 78vw"
                className="h-auto w-full"
              />
            </div>
          </div>

          <p className="-rotate-[8deg] font-hand text-[1.55rem] leading-[1.05] text-[#3a2e22] max-md:mt-7 max-md:ml-3 max-md:w-fit md:absolute md:left-[3vw] md:top-[13.6vw] md:text-[1.8vw]">
            Раньше
            <br />
            были бариста.
            <br />
            Теперь —
            <br />
            свой кофе.
            <svg
              aria-hidden="true"
              viewBox="0 0 120 14"
              className="mt-[0.3vw] h-[1.1vw] w-[8vw] max-md:h-4 max-md:w-28"
              fill="none"
              stroke="#b8552b"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <path d="M 4 10 C 30 4, 70 6, 116 2" />
            </svg>
          </p>

          <div className="mt-10 md:absolute md:left-[42.5vw] md:top-[4.6vw] md:mt-0 md:w-[22vw]">
            <h2 className="font-serif text-[2rem] font-semibold leading-[1.08] tracking-[-0.01em] md:text-[2.5vw]">
              Маленькая
              <br />
              мастерская
              <br />
              в Минске.
            </h2>
            <p className="mt-5 font-serif text-[16px] leading-[1.8] md:mt-[1.5vw] md:text-[1.05vw] md:leading-[1.85]">
              Мы — Аня и Дмитрий, раньше работали бариста. С 2019 года обжариваем свой кофе партиями по 5 кг: жарим по четвергам, развозим по Минску в пятницу. Зерно приходит к вам на 1–3 день после обжарки. Для нас свежесть — не лозунг, а принцип.
            </p>
          </div>
        </div>

        <div
          id="subscription"
          className="relative mx-5 mt-12 min-h-[440px] overflow-hidden bg-[#1a120c] text-[#f5efe0] md:absolute md:left-[71.4vw] md:top-[3.4vw] md:mx-0 md:mt-0 md:h-[26.8vw] md:min-h-0 md:w-[26.7vw]"
        >
          <Image
            src="/subscription.jpg"
            alt=""
            fill
            sizes="(min-width: 768px) 32vw, 100vw"
            className="object-cover object-[right_bottom]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a120c]/80 via-[#1a120c]/35 to-transparent" />

          <div className="relative z-10 px-6 pt-8 md:px-[2.3vw] md:pt-[2.2vw]">
            <div className="flex items-center gap-5 text-[11px] font-medium uppercase tracking-[0.12em] md:text-[0.78vw]">
              <span>Подписка</span>
              <span className="h-px w-[3.4vw] min-w-8 bg-[#f5efe0]/70" />
            </div>

            <h2 className="mt-4 font-serif text-[2.2rem] font-semibold leading-[1.06] tracking-[-0.01em] md:mt-[0.9vw] md:text-[2.35vw]">
              Две пачки.
              <br />
              Каждый месяц.
            </h2>

            <p className="mt-5 text-[16px] leading-[1.7] md:mt-[1.2vw] md:text-[1.08vw] md:leading-[1.7]">
              2 пачки по 250 г — <span className="font-semibold">54 BYN</span> / мес
              <br />
              Доставка бесплатно.
            </p>

            <a
              href="#lead"
              className="relative mt-7 flex h-[58px] w-[240px] items-center justify-center gap-3 transition-opacity hover:opacity-90 md:mt-[1.9vw] md:h-[3.3vw] md:w-[14.2vw]"
            >
              <Image
                src="/orangebebebe.png"
                alt=""
                fill
                sizes="300px"
                className="object-fill"
              />
              <span className="relative z-10 text-[12px] font-medium uppercase tracking-[0.06em] md:text-[0.9vw]">
                Оставить заявку
              </span>
              <span aria-hidden="true" className="relative z-10 text-lg md:text-[1.25vw]">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
