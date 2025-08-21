import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - QuranLife',
  description: 'Manage your QuranLife app preferences, data, and discover Islamic resources for spiritual growth.',
  openGraph: {
    title: 'Settings - QuranLife',
    description: 'Manage your QuranLife app preferences, data, and discover Islamic resources for spiritual growth.',
    url: 'https://quranlife.vercel.app/settings',
    images: ['/og-image.png'],
  },
  twitter: {
    title: 'Settings - QuranLife',
    description: 'Manage your QuranLife app preferences, data, and discover Islamic resources for spiritual growth.',
    images: ['/og-image.png'],
  }
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 