import type { Metadata } from 'next'
import DashboardCard from '@/components/DashboardCard'

export const metadata: Metadata = {
  title: 'Terms of Service - QuranLife',
  description: 'Terms of Service and usage conditions for QuranLife app.',
  openGraph: {
    title: 'Terms of Service - QuranLife',
    description: 'Terms of Service and usage conditions for QuranLife app.',
    url: 'https://quranlife.vercel.app/terms',
  },
  twitter: {
    title: 'Terms of Service - QuranLife',
    description: 'Terms of Service and usage conditions for QuranLife app.',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Terms of Service</h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-8">
          <DashboardCard title="1. Acceptance of Terms">
            <div className="prose prose-sm max-w-none text-gray-700">
              <p>
                By accessing and using QuranLife ("the App"), you accept and agree to be bound by the terms and 
                provision of this agreement. This App is designed to support your Islamic spiritual journey and 
                personal development.
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title="2. Description of Service">
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="mb-4">
                QuranLife is a Progressive Web App (PWA) that provides:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Daily Islamic habit tracking (prayers, Quran reading)</li>
                <li>Personal goal setting and management</li>
                <li>Quranic verses and Islamic guidance</li>
                <li>Local data storage for privacy</li>
                <li>Offline functionality</li>
              </ul>
            </div>
          </DashboardCard>

          <DashboardCard title="3. Islamic Principles and Guidance">
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="mb-4">
                This App incorporates Islamic teachings and Quranic verses. We strive for accuracy but remind users that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>This App is a tool to assist your Islamic practice, not a replacement for proper Islamic education</li>
                <li>Always consult qualified Islamic scholars for religious guidance</li>
                <li>Quranic translations are provided for reflection and may not capture the full meaning of the Arabic text</li>
                <li>The App is designed to encourage good Islamic habits in compliance with Sunni Islamic teachings</li>
              </ul>
            </div>
          </DashboardCard>

          <DashboardCard title="4. User Responsibilities">
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="mb-4">You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the App in accordance with Islamic principles</li>
                <li>Not use the App for any unlawful or prohibited purpose</li>
                <li>Respect the spiritual nature of the content</li>
                <li>Take responsibility for backing up your personal data</li>
                <li>Use the App's guidance as a supplement to, not replacement for, proper Islamic education</li>
              </ul>
            </div>
          </DashboardCard>

          <DashboardCard title="5. Privacy and Data Storage">
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="mb-4">
                QuranLife prioritizes your privacy:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All personal data is stored locally on your device</li>
                <li>We do not collect, store, or transmit your personal information</li>
                <li>Your habit tracking and goals remain private to you</li>
                <li>See our Privacy Policy for complete details</li>
              </ul>
            </div>
          </DashboardCard>

          <DashboardCard title="6. Intellectual Property">
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="mb-4">
                The App and its original content, features, and functionality are owned by QuranLife and are 
                protected by international copyright, trademark, and other intellectual property laws. 
                Quranic verses are from Allah (SWT) and belong to all humanity.
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title="7. Disclaimer of Warranties">
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="mb-4">
                The App is provided "as is" without any warranties. While we strive for accuracy in Islamic 
                content, we make no representations or warranties regarding:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The accuracy or completeness of religious content</li>
                <li>The App's uninterrupted or error-free operation</li>
                <li>The security of local data storage</li>
              </ul>
            </div>
          </DashboardCard>

          <DashboardCard title="8. Limitation of Liability">
            <div className="prose prose-sm max-w-none text-gray-700">
              <p>
                In no event shall QuranLife or its creators be liable for any indirect, incidental, special, 
                consequential, or punitive damages, including loss of data or use, arising out of your use 
                of the App.
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title="9. Modifications to Terms">
            <div className="prose prose-sm max-w-none text-gray-700">
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes through the App. Your continued use of the App after such modifications 
                constitutes acceptance of the updated terms.
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title="10. Islamic Blessing">
            <div className="prose prose-sm max-w-none text-gray-700 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <p className="text-center font-medium text-gray-800 mb-2">
                🤲 "And Allah is the best disposer of affairs"
              </p>
              <p className="text-center text-sm text-gray-600 italic">
                — Quran 3:173
              </p>
              <p className="text-center text-sm text-gray-600 mt-3">
                May Allah (SWT) accept your efforts in using this App to draw closer to Him and improve yourself. 
                Barakallahu feek.
              </p>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
} 