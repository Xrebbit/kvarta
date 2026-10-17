'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { paperNoise } from '@/lib/paper';

type Product = {
  id: string;
  name: string;
  price: string;
  note: string;
  image: string;
  alt: string;
};

const products: Product[] = [
  {
    id: 'ethiopia',
    name: 'Эфиопия Иргачеффе',
    price: '32 BYN',
    note: 'Цветочный, бергамот, светлая обжарка · 250 г',
    image: '/efiopia.jpg',
    alt: 'Пачка кофе Эфиопия Иргачеффе на деревянном столе',
  },
  {
    id: 'colombia',
    name: 'Колумбия Уила',
    price: '29 BYN',
    note: 'Карамель, красное яблоко · 250 г',
    image: '/colombia.jpg',
    alt: 'Пачка кофе Колумбия Уила на фоне джутовых мешков',
  },
  {
    id: 'brazil',
    name: 'Бразилия Серрадо',
    price: '26 BYN',
    note: 'Орех, шоколад, под эспрессо · 250 г',
    image: '/brazil.jpg',
    alt: 'Пачка кофе Бразилия Серрадо рядом с мини-обжарочной машиной',
  },
  {
    id: 'drip',
    name: 'Дрип-пакеты',
    price: '18 BYN',
    note: 'Ассорти, 10 штук',
    image: '/dripackages.jpg',
    alt: 'Коробка дрип-пакетов и несколько пакетов на деревянном столе',
  },
];

const CLONES = 3;
const INTERVAL_MS = 3500;
const TRANSITION_MS = 700;

const slides = [...products, ...products.slice(0, CLONES)];

export default function Products() {
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      setAnimated(true);
      setIndex((current) => current + 1);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, reduceMotion]);

  useEffect(() => {
    if (animated) return;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimated(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [animated]);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;
    if (index >= products.length) {
      setAnimated(false);
      setIndex(0);
    }
  };

  const goTo = (target: number) => {
    setAnimated(true);
    setIndex(target);
  };

  const activeDot = index % products.length;

  return (
    <section
      id="coffee"
      className="relative overflow-hidden bg-[#eee5d4] px-5 pb-12 pt-12 text-[#1f1812] md:px-[4.8vw] md:pb-[4vw] md:pt-[3.6vw]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply"
        style={{ backgroundImage: paperNoise }}
      />

      <div className="relative">
        <div className="flex items-center gap-5 text-[11px] font-medium uppercase tracking-[0.12em] md:text-[0.85vw]">
          <span>Наш кофе</span>
          <span className="h-px w-[3.4vw] min-w-8 bg-[#2c2419]/70" />
        </div>

        <div className="relative mt-4 md:mt-[0.9vw] md:min-h-[11.5vw]">
          <h2 className="font-serif text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.015em] md:text-[4.7vw] md:leading-[1.05]">
            Кофе, который
            <br />
            не залеживается.
          </h2>

          <p className="mt-5 max-w-md font-serif text-[16px] leading-[1.75] md:absolute md:left-[49.6vw] md:top-[0.6vw] md:mt-0 md:max-w-none md:w-[23vw] md:text-[1.1vw] md:leading-[1.8]">
            Обжариваем партиями по 5 кг и возим по Минску в пятницу. Зерно приходит к вам на 1–3 день после обжарки, пока вкус ещё раскрывается.
          </p>

          <Image
            src="/emblem.jpg"
            alt="Штамп Кварта, Минск, с 2019 года"
            width={1074}
            height={675}
            className="pointer-events-none absolute -top-10 right-[-6px] w-[116px] opacity-70 mix-blend-multiply md:right-[0.3vw] md:top-[-0.4vw] md:w-[16vw]"
          />
        </div>

        <div
          className="mt-8 overflow-hidden md:mt-[2.3vw]"
          role="region"
          aria-roledescription="carousel"
          aria-label="Ассортимент"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            onTransitionEnd={handleTransitionEnd}
            className="flex [--gap:14px] [--pv:1.12] md:[--gap:2.25vw] md:[--pv:2] lg:[--pv:3]"
            style={
              {
                '--i': index,
                gap: 'var(--gap)',
                transform:
                  'translateX(calc(var(--i) * -1 * ((100% - (var(--pv) - 1) * var(--gap)) / var(--pv) + var(--gap))))',
                transition: animated
                  ? `transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
                  : 'none',
              } as React.CSSProperties
            }
          >
            {slides.map((product, position) => {
              const isClone = position >= products.length;
              return (
                <a
                  key={`${product.id}-${position}`}
                  href="#lead"
                  aria-hidden={isClone}
                  tabIndex={isClone ? -1 : 0}
                  className="group block shrink-0 border border-[#2c2419]/[0.07] bg-[#f2eadc]/60"
                  style={{
                    flexBasis:
                      'calc((100% - (var(--pv) - 1) * var(--gap)) / var(--pv))',
                  }}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={product.image}
                      alt={isClone ? '' : product.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                      className="scale-[1.16] object-cover transition-transform duration-500 group-hover:scale-[1.2]"
                    />
                  </div>
                  <div className="px-4 pb-4 pt-4 md:px-[1.4vw] md:pb-[1.3vw] md:pt-[1.2vw]">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-serif text-xl font-medium md:text-[1.65vw] md:leading-tight">
                        {product.name}
                      </h3>
                      <span className="whitespace-nowrap font-serif text-lg md:text-[1.45vw]">
                        {product.price}
                      </span>
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-4 md:mt-[0.9vw]">
                      <p className="max-w-[19em] font-serif text-[15px] leading-[1.7] text-[#1f1812]/85 md:text-[1.04vw]">
                        {product.note}
                      </p>
                      <span
                        aria-hidden="true"
                        className="text-xl transition-transform group-hover:translate-x-1 md:text-[1.6vw]"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3 md:mt-[1.6vw]">
          {products.map((product, dot) => (
            <button
              key={product.id}
              type="button"
              aria-label={`Показать ${product.name}`}
              aria-current={dot === activeDot}
              onClick={() => goTo(dot)}
              className={`h-2 w-2 rounded-full border border-[#2c2419]/60 transition-colors ${
                dot === activeDot ? 'bg-[#2c2419]' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
