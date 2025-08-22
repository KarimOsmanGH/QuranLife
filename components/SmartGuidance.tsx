'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { quranEngine, GoalMatchResult } from '@/lib/quran-engine';

interface SmartGuidanceProps {
  goalTitle: string;
  goalDescription?: string;
  goalCategory: string;
}

export default function SmartGuidance({ goalTitle, goalDescription = '', goalCategory }: SmartGuidanceProps) {
  const [guidance, setGuidance] = useState<GoalMatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0); // Open first item by default

  useEffect(() => {
    loadGuidance();
  }, [goalTitle, goalDescription, goalCategory]);

  const loadGuidance = async () => {
    try {
      setLoading(true);
      
      // Use the new QuranEngine API to find verses for the goal
      const goalText = `${goalTitle} ${goalDescription} ${goalCategory}`.trim();
      const matches = await quranEngine.findVersesForGoal(goalText);
      
      setGuidance(matches);
    } catch (error) {
      console.error('Failed to load guidance:', error);
      setGuidance([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      const goalText = `${goalTitle} ${goalDescription} ${goalCategory}`.trim();
      const additionalVerses = await quranEngine.getAdditionalVersesForGoal(goalText, guidance.length);
      setGuidance(prev => [...prev, ...additionalVerses]);
    } catch (error) {
      console.error('Failed to load additional guidance:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
        <div className="animate-pulse">
          <div className="h-4 bg-green-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-green-100 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (guidance.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
        <p className="text-green-700 text-sm mb-4">
          While we're preparing personalized guidance for your goal, here are some universal Islamic principles to remember:
        </p>
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-3 border-l-4 border-green-400">
            <p className="text-sm text-green-600">
              <strong>Start with Bismillah:</strong> Begin every endeavor in the name of Allah
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border-l-4 border-green-400">
            <p className="text-sm text-green-600">
              <strong>Make sincere dua:</strong> Ask Allah for guidance and success in your goal
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border-l-4 border-green-400">
            <p className="text-sm text-green-600">
              <strong>Trust in Allah:</strong> "And whoever relies upon Allah - then He is sufficient for him" (65:3)
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border-l-4 border-green-400">
            <p className="text-sm text-green-600">
              <strong>Take action:</strong> Combine faith with effort - Allah helps those who help themselves
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {guidance.map((match, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100 overflow-hidden"
        >
          <div className="p-4">
            {/* Verse Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-green-700">
                {match.verse.surah} ({match.verse.surah_number}:{match.verse.ayah})
              </div>
              <div className="flex items-center gap-2">
                {/* Audio Button */}
                {match.verse.audio && (
                  <button
                    onClick={() => {
                      const audio = new Audio(match.verse.audio);
                      audio.play().catch(err => console.log('Audio play failed:', err));
                    }}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    title="Play verse recitation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => handleToggleExpand(index)}
                  className="text-green-600 hover:text-green-700"
                >
                  {expanded === index ? '−' : '+'}
                </button>
              </div>
            </div>

            {/* Arabic Text */}
            <div className="text-right mb-3">
              <p className="text-lg text-gray-800 font-arabic leading-relaxed">
                {match.verse.text_ar}
              </p>
            </div>

            {/* English Translation */}
            <div className="mb-4">
              <p className="text-gray-700 italic leading-relaxed">
                "{match.verse.text_en}"
              </p>
            </div>

            {/* Reflection */}
            <div className="mb-4 p-3 bg-white rounded-lg border-l-4 border-green-400">
              <p className="text-sm text-gray-700">
                <strong className="text-green-700">Reflection: </strong>
                {match.verse.reflection}
              </p>
            </div>

            {/* Expanded Content */}
            {expanded === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4"
              >


                {/* Dua Recommendation */}
                {match.duaRecommendation && (
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded">
                      {match.duaRecommendation}
                    </p>
                  </div>
                )}



                {/* Life Application */}
                {match.verse.life_application && (
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      {match.verse.life_application}
                    </p>
                  </div>
                )}
              </motion.div>
            )}


          </div>
        </motion.div>
      ))}

      {/* Load More Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loadingMore ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Load More Guidance
            </span>
          )}
        </button>
      </div>


    </div>
  );
} 