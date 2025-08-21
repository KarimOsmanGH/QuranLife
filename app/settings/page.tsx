'use client';

import DashboardCard from '@/components/DashboardCard';
import { storage } from '@/lib/security';

export default function SettingsPage() {
  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      storage.remove('quranlife-habits');
      storage.remove('quranlife-goals');
      alert('All data has been cleared. Please refresh the page.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your QuranLife app preferences and data.
        </p>
      </div>

      {/* App Info */}
      <DashboardCard 
        title="App Information" 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800">QuranLife</h4>
            <p className="text-sm text-gray-600">Version 1.0.0</p>
            <p className="text-sm text-gray-600 mt-2">
              Personal growth with Quran. This app helps you track daily Islamic practices and personal development goals.
            </p>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">Features</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Daily prayer tracking</li>
              <li>• Quran reading habits</li>
              <li>• Personal goal management</li>
              <li>• Daily Quranic verses</li>
              <li>• Local data storage</li>
            </ul>
          </div>
        </div>
      </DashboardCard>

      {/* Data Management */}
      <div className="mt-8">
        <DashboardCard 
          title="Data Management" 
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          }
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800">Local Storage</h4>
              <p className="text-sm text-gray-600 mt-1">
                Your data is stored locally in your browser. No data is sent to external servers.
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={clearAllData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Clear All Data
              </button>
              <p className="text-xs text-gray-500 mt-2">
                This will remove all your habits, goals, and progress. This action cannot be undone.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Data Sources & Attribution */}
      <DashboardCard title="📚 Data Sources & Attribution">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Quranic Universal Library (QUL)</h4>
            <p className="text-sm text-gray-700 mb-3">
              We acknowledge and appreciate the comprehensive{' '}
              <a 
                href="https://github.com/TarteelAI/quranic-universal-library" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 underline"
              >
                Quranic Universal Library (QUL)
              </a>{' '}
              by TarteelAI, an exceptional resource for Islamic data management.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <h5 className="font-medium text-green-800 mb-2">QUL Features:</h5>
              <ul className="text-xs text-green-700 space-y-1 list-disc pl-4">
                <li>Comprehensive translations and tafsirs</li>
                <li>Audio management with multiple recitations</li>
                <li>Arabic scripts in various styles</li>
                <li>Quranic grammar and morphology</li>
                <li>Community-driven content (MIT License)</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Our Implementation</h4>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
              <li>Carefully curated verses for practical spiritual guidance</li>
              <li>Arabic text following standard Uthmani script</li>
              <li>English translations from established scholarly works</li>
              <li>Thematic organization aligned with personal development goals</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Future Enhancements</h4>
            <p className="text-sm text-gray-700">
              We're exploring integration with QUL's comprehensive database to enhance QuranLife's 
              capabilities while maintaining our focus on practical spiritual development.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>For Complete Quranic Study:</strong> Visit{' '}
              <a 
                href="https://qul.tarteel.ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                QUL's official site
              </a>
              , consult qualified Islamic scholars, or use established platforms like Quran.com.
            </p>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
} 