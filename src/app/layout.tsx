import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const jost = localFont({
  src: [
    { path: './fonts/jost-cyrillic-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/jost-cyrillic-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/jost-cyrillic-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-jost',
  display: 'swap',
});

const oswald = localFont({
  src: './fonts/oswald-cyrillic-500-normal.woff2',
  weight: '500',
  variable: '--font-oswald',
  display: 'swap',
});

const caveat = localFont({
  src: './fonts/caveat-cyrillic-500-normal.woff2',
  weight: '500',
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Кварта – свежий кофе из Минска',
  description:
    'Небольшая обжарка в Минске. Обжариваем по четвергам, доставляем по пятницам. Подписка и разовые заказы.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${jost.variable} ${oswald.variable} ${caveat.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
