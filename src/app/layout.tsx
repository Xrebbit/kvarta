import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const jost = localFont({
  src: [
    { path: './fonts/jost-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/jost-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/jost-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-jost',
  display: 'swap',
});

const serif = localFont({
  src: [
    { path: './fonts/source-serif-4-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/source-serif-4-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/source-serif-4-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-serif',
  display: 'swap',
});

const oswald = localFont({
  src: './fonts/oswald-500.woff2',
  weight: '500',
  variable: '--font-oswald',
  display: 'swap',
});

const caveat = localFont({
  src: './fonts/caveat-500.woff2',
  weight: '500',
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Кварта — свежий кофе из Минска',
  description:
    'Небольшая обжарка в Минске. Обжариваем по четвергам, доставляем по пятницам. Подписка и разовые заказы.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body
        className={`${jost.variable} ${serif.variable} ${oswald.variable} ${caveat.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
