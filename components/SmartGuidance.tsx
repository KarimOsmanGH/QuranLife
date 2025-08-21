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
  const [expanded, setExpanded] = useState<number | null>(null);

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
        <h4 className="font-semibold text-green-800 mb-2">🌟 General Islamic Guidance</h4>
        <p className="text-green-700 text-sm mb-4">
          While we couldn't find specific verses for this goal, remember that every good intention and effort is rewarded by Allah.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-green-600">
            <strong>Recommended:</strong> Start with "Bismillah" and make dua for success
          </p>
          <p className="text-sm text-green-600">
            <strong>Remember:</strong> "And whoever relies upon Allah - then He is sufficient for him" (65:3)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
        <span>🕌</span>
        Islamic Guidance for Your Goal
      </h4>
      
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
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {Math.round(match.relevanceScore * 100)}% match
                </span>
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
                {/* Practical Steps */}
                {match.practicalSteps.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <span>✅</span>
                      Practical Steps
                    </h5>
                    <ul className="space-y-2">
                      {match.practicalSteps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Dua Recommendation */}
                {match.duaRecommendation && (
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <span>🤲</span>
                      Recommended Dua
                    </h5>
                    <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded">
                      {match.duaRecommendation}
                    </p>
                  </div>
                )}

                {/* Related Habits */}
                {match.relatedHabits.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <span>🔄</span>
                      Related Habits
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {match.relatedHabits.map((habit, habitIndex) => (
                        <span
                          key={habitIndex}
                          className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          {habit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Life Application */}
                {match.verse.life_application && (
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <span>🎯</span>
                      Life Application
                    </h5>
                    <p className="text-sm text-gray-700">
                      {match.verse.life_application}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Theme Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {match.verse.theme?.map((theme: string, themeIndex: number) => (
                <span
                  key={themeIndex}
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                >
                  {theme.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Call to Action */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100">
        <p className="text-sm text-gray-700 text-center">
          <strong>💡 Pro Tip:</strong> Write down one practical step from above and implement it this week. 
          Small consistent actions lead to big transformations, insha'Allah.
        </p>
      </div>
    </div>
  );
} 