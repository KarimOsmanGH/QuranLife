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
      <div className="mt-8">
        <DashboardCard title="📚 Data Sources & Attribution">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">AlQuran.cloud API</h4>
              <p className="text-sm text-gray-700 mb-3">
                QuranLife is powered by the{' '}
                <a 
                  href="https://alquran.cloud/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 underline"
                >
                  AlQuran.cloud API
                </a>{' '}
                - a free, open-source RESTful API providing access to the complete Holy Quran with multiple translations and recitations.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <h5 className="font-medium text-green-800 mb-2">API Features We Use:</h5>
                <ul className="text-xs text-green-700 space-y-1 list-disc pl-4">
                  <li>Complete Quran text (all 6,236 verses) in Uthmani Arabic script</li>
                  <li>Muhammad Asad's English translation</li>
                  <li>Intelligent verse search capabilities</li>
                  <li>Real-time access to authentic Quranic content</li>
                  <li>Free and open for educational/religious purposes</li>
                </ul>
              </div>
            </div>
          
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Our Enhancement</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                <li>Intelligent verse recommendations based on personal goals</li>
                <li>Thematic organization for practical spiritual guidance</li>
                <li>Enhanced practical guidance and dua recommendations</li>
                <li>Smart caching for improved performance and reliability</li>
                <li>Seamless integration with habit tracking and goal setting</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Translation Source</h4>
              <p className="text-sm text-gray-700">
                English translations are from <strong>Muhammad Asad's "The Message of the Qur'an"</strong>, 
                known for its scholarly approach and comprehensive commentary, providing contextual understanding 
                for modern readers.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-800">
                <strong>For Comprehensive Quranic Study:</strong> Visit{' '}
                <a 
                  href="https://quran.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 underline"
                >
                  Quran.com
                </a>
                {' '}or{' '}
                <a 
                  href="https://alquran.cloud/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 underline"
                >
                  AlQuran.cloud
                </a>
                , consult qualified Islamic scholars, or use established Islamic learning platforms.
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
} 