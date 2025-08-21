'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardCard from '@/components/DashboardCard';
import VerseCard from '@/components/VerseCard';
import GoalsList from '@/components/GoalsList';
import { storage, apiRateLimiter } from '@/lib/security';
import { quranEngine } from '@/lib/quran-engine';
import Link from 'next/link';

interface Verse {
  id: number;
  surah: string;
  surah_number: number;
  ayah: number;
  text_ar: string;
  text_en: string;
  theme: string[];
  reflection: string;
  practical_guidance?: string[];
  context?: string;
  audio?: string; // Audio URL for the verse
}

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  icon?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastCompleted?: string; // ISO date string
  streak?: number;
  completionHistory?: string[]; // Array of ISO date strings
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

const defaultHabits: Habit[] = [
  { id: 'fajr', name: 'Fajr Prayer', completed: false, icon: '🌅', frequency: 'daily' },
  { id: 'dhuhr', name: 'Dhuhr Prayer', completed: false, icon: '☀️', frequency: 'daily' },
  { id: 'asr', name: 'Asr Prayer', completed: false, icon: '🌤️', frequency: 'daily' },
  { id: 'maghrib', name: 'Maghrib Prayer', completed: false, icon: '🌅', frequency: 'daily' },
  { id: 'isha', name: 'Isha Prayer', completed: false, icon: '🌙', frequency: 'daily' },
  { id: 'quran', name: 'Quran Reading', completed: false, icon: '📖', frequency: 'daily' },
  { id: 'charity', name: 'Give Charity', completed: false, icon: '💝', frequency: 'weekly' },
  { id: 'fast', name: 'Voluntary Fasting', completed: false, icon: '🌙', frequency: 'weekly' },
  { id: 'zakat', name: 'Pay Zakat', completed: false, icon: '💰', frequency: 'yearly' },
  { id: 'hajj', name: 'Plan for Hajj', completed: false, icon: '🕋', frequency: 'yearly' },
];

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [goals, setGoals] = useState<Goal[]>([]);
  // Initialize with verse data directly
  const [dailyVerse, setDailyVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);

  // Load daily verse on component mount
  useEffect(() => {
    loadDailyVerse();
  }, []);

  // Helper function to check if a habit should be considered completed for its frequency
  const isHabitCompleted = (habit: Habit): boolean => {
    if (!habit.lastCompleted) return false;
    
    const now = new Date();
    const lastCompleted = new Date(habit.lastCompleted);
    
    switch (habit.frequency) {
      case 'daily':
        // Completed today
        return lastCompleted.toDateString() === now.toDateString();
      case 'weekly':
        // Completed this week (Monday to Sunday)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
        startOfWeek.setHours(0, 0, 0, 0);
        return lastCompleted >= startOfWeek;
      case 'monthly':
        // Completed this month
        return lastCompleted.getMonth() === now.getMonth() && 
               lastCompleted.getFullYear() === now.getFullYear();
      case 'yearly':
        // Completed this year
        return lastCompleted.getFullYear() === now.getFullYear();
      default:
        return false;
    }
  };

  // Helper function to calculate streak
  const calculateStreak = (habit: Habit): number => {
    if (!habit.completionHistory || habit.completionHistory.length === 0) return 0;
    
    const now = new Date();
    let streak = 0;
    
    switch (habit.frequency) {
      case 'daily':
        // Check consecutive days
        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(now);
          checkDate.setDate(now.getDate() - i);
          const dateString = checkDate.toISOString().split('T')[0];
          
          if (habit.completionHistory.includes(dateString)) {
            streak++;
          } else {
            break;
          }
        }
        break;
      case 'weekly':
        // Check consecutive weeks
        for (let i = 0; i < 52; i++) {
          const checkDate = new Date(now);
          checkDate.setDate(now.getDate() - (i * 7));
          const weekStart = new Date(checkDate);
          weekStart.setDate(checkDate.getDate() - checkDate.getDay() + 1);
          
          const hasCompletionThisWeek = habit.completionHistory.some(dateStr => {
            const completionDate = new Date(dateStr);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return completionDate >= weekStart && completionDate <= weekEnd;
          });
          
          if (hasCompletionThisWeek) {
            streak++;
          } else {
            break;
          }
        }
        break;
      case 'monthly':
        // Check consecutive months
        for (let i = 0; i < 12; i++) {
          const checkDate = new Date(now);
          checkDate.setMonth(now.getMonth() - i);
          
          const hasCompletionThisMonth = habit.completionHistory.some(dateStr => {
            const completionDate = new Date(dateStr);
            return completionDate.getMonth() === checkDate.getMonth() &&
                   completionDate.getFullYear() === checkDate.getFullYear();
          });
          
          if (hasCompletionThisMonth) {
            streak++;
          } else {
            break;
          }
        }
        break;
      case 'yearly':
        // Check consecutive years
        for (let i = 0; i < 10; i++) {
          const checkYear = now.getFullYear() - i;
          
          const hasCompletionThisYear = habit.completionHistory.some(dateStr => {
            const completionDate = new Date(dateStr);
            return completionDate.getFullYear() === checkYear;
          });
          
          if (hasCompletionThisYear) {
            streak++;
          } else {
            break;
          }
        }
        break;
    }
    
    return streak;
  };

  // Load data from secure storage on mount
  useEffect(() => {
    const savedHabits = storage.get('quranlife-habits', defaultHabits);
    // Update completion status based on frequency
    const updatedHabits = savedHabits.map(habit => ({
      ...habit,
      completed: isHabitCompleted(habit),
      streak: calculateStreak(habit)
    }));
    setHabits(updatedHabits);

    const savedGoals = storage.get('quranlife-goals', []);
    setGoals(savedGoals);
  }, []);

  // Save habits to secure storage whenever habits change
  useEffect(() => {
    storage.set('quranlife-habits', habits);
  }, [habits]);

  const loadDailyVerse = async () => {
    try {
      setLoading(true);
      
      // Small delay to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Show fallback verse immediately with correct audio URL
      console.log('Loading fallback verse (Al-Fatiha)...');
      
      setDailyVerse({
        id: 6,
        surah: "Al-Fatiha",
        surah_number: 1,
        ayah: 6,
        text_ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        text_en: "Guide us to the straight path.",
        theme: ["guidance", "direction"],
        reflection: "A daily prayer for guidance and staying on the right path in life.",
        practical_guidance: [
          "Ask Allah for guidance in your daily decisions",
          "Reflect on whether your actions align with the straight path",
          "Seek knowledge and wisdom in your spiritual journey"
        ],
        context: "Al-Fatiha - Always available for guidance",
        audio: undefined // Audio not available due to CORS restrictions
      });
    } catch (error) {
      console.error('Error loading daily verse:', error);
      
      // Show fallback verse on error
      setDailyVerse({
        id: 6,
        surah: "Al-Fatiha",
        surah_number: 1,
        ayah: 6,
        text_ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        text_en: "Guide us to the straight path.",
        theme: ["guidance", "direction"],
        reflection: "A daily prayer for guidance and staying on the right path in life.",
        practical_guidance: [
          "Ask Allah for guidance in your daily decisions",
          "Reflect on whether your actions align with the straight path",
          "Seek knowledge and wisdom in your spiritual journey"
        ],
        context: "Al-Fatiha - Always available for guidance",
        audio: undefined // Audio not available due to CORS restrictions
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => {
        if (habit.id !== habitId) return habit;
        
        const now = new Date();
        const todayString = now.toISOString().split('T')[0];
        const isCurrentlyCompleted = isHabitCompleted(habit);
        
        if (isCurrentlyCompleted) {
          // Unmark as completed - remove from history
          const updatedHistory = (habit.completionHistory || []).filter(date => {
            const completionDate = new Date(date);
            switch (habit.frequency) {
              case 'daily':
                return completionDate.toISOString().split('T')[0] !== todayString;
              case 'weekly':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay() + 1);
                startOfWeek.setHours(0, 0, 0, 0);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);
                return !(completionDate >= startOfWeek && completionDate <= endOfWeek);
              case 'monthly':
                return !(completionDate.getMonth() === now.getMonth() && 
                        completionDate.getFullYear() === now.getFullYear());
              case 'yearly':
                return completionDate.getFullYear() !== now.getFullYear();
              default:
                return true;
            }
          });
          
          return {
            ...habit,
            completed: false,
            lastCompleted: undefined,
            completionHistory: updatedHistory,
            streak: calculateStreak({ ...habit, completionHistory: updatedHistory })
          };
        } else {
          // Mark as completed - add to history
          const updatedHistory = [...(habit.completionHistory || []), todayString];
          const updatedHabit = {
            ...habit,
            completed: true,
            lastCompleted: now.toISOString(),
            completionHistory: updatedHistory,
            streak: calculateStreak({ ...habit, completionHistory: updatedHistory })
          };
          
          return updatedHabit;
        }
      })
    );
  };

  const completedHabits = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const progressPercentage = (completedHabits / totalHabits) * 100;

  // Calculate goals progress
  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const goalsProgressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;



  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your daily guidance...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20">


      {/* Desktop Two-Column Layout */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-8 mb-8">
        {/* Left Sidebar - Progress Overview */}
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Today's Progress</h3>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-3">🕌 Daily Habits</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-green-600">{completedHabits}/{totalHabits}</div>
                  <div className="text-sm text-gray-600">Habits Completed</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <a href="/habits" className="text-xs text-green-600 hover:text-green-700 block">
                  View all habits →
                </a>
              </div>
            </div>
            

          </div>

          {/* Goals Progress */}
          {totalGoals > 0 && (
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-3">🎯 Goals Progress</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-green-600">{completedGoals}/{totalGoals}</div>
                  <div className="text-sm text-gray-600">Goals Completed</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${goalsProgressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <a href="/goals" className="text-xs text-green-600 hover:text-green-700 block">
                  Manage your goals →
                </a>
              </div>
            </div>
          )}

          {/* Quick Start Habits */}
          {habits.length < 5 && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                ✨ <span>Quick Start Habits</span>
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const newHabits = [
                      { id: Date.now() + '-fajr', name: 'Fajr Prayer', completed: false, icon: '🌅', frequency: 'daily' as const, streak: 0, completionHistory: [] },
                      { id: Date.now() + '-maghrib', name: 'Maghrib Prayer', completed: false, icon: '🌆', frequency: 'daily' as const, streak: 0, completionHistory: [] }
                    ];
                    const updatedHabits = [...habits, ...newHabits.filter(h => !habits.some(ph => ph.name === h.name))];
                    setHabits(updatedHabits);
                    storage.set('quranlife-habits', updatedHabits);
                  }}
                  className="w-full p-2 bg-white rounded-lg border border-emerald-300 hover:bg-emerald-50 transition-colors text-left flex items-center gap-2"
                >
                  <span className="text-lg">🕌</span>
                  <div>
                    <div className="text-sm font-medium text-emerald-700">Essential Prayers</div>
                    <div className="text-xs text-emerald-600">Start with Fajr & Maghrib</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    const newHabits = [
                      { id: Date.now() + '-morning', name: 'Morning Dhikr', completed: false, icon: '🌅', frequency: 'daily' as const, streak: 0, completionHistory: [] },
                      { id: Date.now() + '-evening', name: 'Evening Dhikr', completed: false, icon: '🌙', frequency: 'daily' as const, streak: 0, completionHistory: [] }
                    ];
                    const updatedHabits = [...habits, ...newHabits.filter(h => !habits.some(ph => ph.name === h.name))];
                    setHabits(updatedHabits);
                    storage.set('quranlife-habits', updatedHabits);
                  }}
                  className="w-full p-2 bg-white rounded-lg border border-emerald-300 hover:bg-emerald-50 transition-colors text-left flex items-center gap-2"
                >
                  <span className="text-lg">💫</span>
                  <div>
                    <div className="text-sm font-medium text-emerald-700">Daily Dhikr</div>
                    <div className="text-xs text-emerald-600">Morning & evening remembrance</div>
                  </div>
                </button>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-200">
                <Link 
                  href="/habits" 
                  className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  View all habits →
                </Link>
              </div>
            </div>
          )}

          {/* Smart Guidance */}
          {totalGoals === 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <div className="text-center mb-3">
                <span className="text-2xl mb-2 block">🎯</span>
                <h4 className="font-semibold text-gray-800 mb-1">Set Your First Goal</h4>
                <p className="text-xs text-gray-600 mb-3">
                  Start your spiritual journey with meaningful goals
                </p>
              </div>
              
              <div className="space-y-2">
                <a 
                  href="/goals" 
                  className="block w-full py-2 px-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors text-center"
                >
                  + Add Your First Goal
                </a>
                
                <div className="text-xs text-gray-500 text-center">
                  <p className="mb-1">💡 <strong>Popular spiritual goals:</strong></p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <span className="bg-white/60 px-2 py-1 rounded text-xs">Daily Quran</span>
                    <span className="bg-white/60 px-2 py-1 rounded text-xs">Learn Arabic</span>
                    <span className="bg-white/60 px-2 py-1 rounded text-xs">Memorize Surahs</span>
                  </div>
                </div>
              </div>
            </div>
          )}


        </div>

        {/* Right Content - Daily Verse & Habits */}
        <div className="md:col-span-2 space-y-6">
          {/* Daily Verse */}
          <DashboardCard
            title="Today's Guidance"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : dailyVerse ? (
              <VerseCard verse={dailyVerse} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Unable to load daily verse. Please check your connection.
              </div>
            )}
          </DashboardCard>

        </div>
      </div>

      {/* Mobile Single Column Layout */}
      <div className="md:hidden">
        {/* Mobile Progress Overview */}
        <div className={`grid gap-4 mb-8 ${totalGoals > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{completedHabits}/{totalHabits}</div>
            <div className="text-sm text-gray-600">Daily Habits</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {totalGoals > 0 && (
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{completedGoals}/{totalGoals}</div>
              <div className="text-sm text-gray-600">Goals Completed</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${goalsProgressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Quick Add Goals - when no goals exist */}
        {totalGoals === 0 && (
          <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="text-center mb-3">
              <span className="text-3xl mb-2 block">🎯</span>
              <h4 className="font-semibold text-gray-800 mb-1">Set Your First Goal</h4>
              <p className="text-sm text-gray-600 mb-4">
                Start your spiritual journey with meaningful goals guided by Quranic wisdom
              </p>
            </div>
            
            <div className="space-y-3">
              <a 
                href="/goals" 
                className="block w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                + Add Your First Goal
              </a>
              
              <div className="text-xs text-gray-500 text-center">
                <p className="mb-2">💡 <strong>Popular spiritual goals:</strong></p>
                <div className="grid grid-cols-2 gap-1">
                  <span className="bg-white/60 px-2 py-1 rounded text-xs">Read Quran daily</span>
                  <span className="bg-white/60 px-2 py-1 rounded text-xs">Learn Arabic</span>
                  <span className="bg-white/60 px-2 py-1 rounded text-xs">Memorize Surahs</span>
                  <span className="bg-white/60 px-2 py-1 rounded text-xs">Study Tafsir</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Daily Verse */}
        <DashboardCard
          title="Today's Guidance"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        >
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : dailyVerse ? (
            <VerseCard verse={dailyVerse} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              Unable to load daily verse. Please check your connection.
            </div>
          )}
        </DashboardCard>

      </div>
    </div>
  );
} 