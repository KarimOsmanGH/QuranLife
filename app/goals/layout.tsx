import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Goals - QuranLife',
  description: 'Set and track your personal development goals with Islamic guidance. Manage spiritual, health, career, and family goals with Quranic wisdom.',
  openGraph: {
    title: 'Personal Goals - QuranLife',
    description: 'Set and track your personal development goals with Islamic guidance. Manage spiritual, health, career, and family goals with Quranic wisdom.',
    url: 'https://quranlife.vercel.app/goals',
    images: ['/og-image.png'],
  },
  twitter: {
    title: 'Personal Goals - QuranLife',
    description: 'Set and track your personal development goals with Islamic guidance. Manage spiritual, health, career, and family goals with Quranic wisdom.',
    images: ['/og-image.png'],
  }
};

export default function GoalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 