import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Goals - QuranLife',
  description: 'Set and track your spiritual and life goals with Islamic guidance.',
  openGraph: {
    title: 'Goals - QuranLife',
    description: 'Set and track your spiritual and life goals with Islamic guidance.',
    url: 'https://quranlife.vercel.app/goals',
  },
  twitter: {
    title: 'Goals - QuranLife',
    description: 'Set and track your spiritual and life goals with Islamic guidance.',
  },
}

export default function GoalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 