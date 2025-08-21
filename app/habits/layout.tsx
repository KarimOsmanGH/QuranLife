import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Habits - QuranLife',
  description: 'Track your daily Islamic practices including 5 prayers, Quran reading, dhikr, and dua. Build consistent spiritual habits with QuranLife.',
  openGraph: {
    title: 'Daily Habits - QuranLife',
    description: 'Track your daily Islamic practices including 5 prayers, Quran reading, dhikr, and dua. Build consistent spiritual habits with QuranLife.',
    url: 'https://quranlife.vercel.app/habits',
    images: ['/og-image.png'],
  },
  twitter: {
    title: 'Daily Habits - QuranLife',
    description: 'Track your daily Islamic practices including 5 prayers, Quran reading, dhikr, and dua. Build consistent spiritual habits with QuranLife.',
    images: ['/og-image.png'],
  }
};

export default function HabitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 