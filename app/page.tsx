'use client';

import { useState, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import VerseCard from '@/components/VerseCard';
import HabitTracker from '@/components/HabitTracker';
import { storage, apiRateLimiter } from '@/lib/security';

interface Verse {
  id: number;
  surah: string;
  surah_number: number;
  ayah: number;
  text_ar: string;
  text_en: string;
  theme: string[];
  reflection: string;
}

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  icon?: string;
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
  { id: 'fajr', name: 'Fajr Prayer', completed: false, icon: '🌅' },
  { id: 'dhuhr', name: 'Dhuhr Prayer', completed: false, icon: '☀️' },
  { id: 'asr', name: 'Asr Prayer', completed: false, icon: '🌤️' },
  { id: 'maghrib', name: 'Maghrib Prayer', completed: false, icon: '🌅' },
  { id: 'isha', name: 'Isha Prayer', completed: false, icon: '🌙' },
  { id: 'quran', name: 'Quran Reading', completed: false, icon: '📖' },
];

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dailyVerse, setDailyVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data from secure storage on mount
  useEffect(() => {
    const savedHabits = storage.get('quranlife-habits', defaultHabits);
    setHabits(savedHabits);

    const savedGoals = storage.get('quranlife-goals', []);
    setGoals(savedGoals);

    // Load daily verse
    loadDailyVerse();
  }, []);

  // Save habits to secure storage whenever habits change
  useEffect(() => {
    storage.set('quranlife-habits', habits);
  }, [habits]);

  const loadDailyVerse = async () => {
    try {
      // Rate limiting check
      if (!apiRateLimiter.isAllowed()) {
        console.warn('Rate limit exceeded for verse loading');
        setLoading(false);
        return;
      }

      const response = await fetch('/data/quran.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.verses || !Array.isArray(data.verses)) {
        throw new Error('Invalid verse data structure');
      }
      
      // Get today's date to select a consistent verse for the day
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
      const verseIndex = dayOfYear % data.verses.length;
      
      setDailyVerse(data.verses[verseIndex]);
    } catch (error) {
      console.error('Failed to load daily verse:', error);
      // Set a fallback verse in case of error
      setDailyVerse({
        id: 1,
        surah: "Al-Fatiha",
        surah_number: 1,
        ayah: 1,
        text_ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        text_en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        theme: ["guidance"],
        reflection: "Begin every endeavor with Allah's name and seek His guidance."
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId 
          ? { ...habit, completed: !habit.completed }
          : habit
      )
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
                  <div className="text-2xl font-bold text-blue-600">{completedGoals}/{totalGoals}</div>
                  <div className="text-sm text-gray-600">Goals Completed</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${goalsProgressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <a href="/goals" className="text-xs text-blue-600 hover:text-blue-700 block">
                  Manage your goals →
                </a>
              </div>
            </div>
          )}


        </div>

        {/* Right Content - Daily Verse & Habits */}
        <div className="md:col-span-2 space-y-6">
          {/* Daily Verse */}
          {dailyVerse && (
            <div className="bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-2xl p-6 border border-green-100/30 shadow-sm">
              <div className="text-center mb-6">
                              <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-green-100/50">
                <span className="text-2xl">📖</span>
                <h3 className="text-lg font-bold text-gray-800">
                  Today's Guidance
                </h3>
                <span className="text-2xl">✨</span>
              </div>
              </div>
              <VerseCard verse={dailyVerse} />
            </div>
          )}

          {/* Habits Tracker */}
          <DashboardCard 
            title="🕌 Daily Habits" 
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Track your Islamic practices and personal development.</p>
                <a href="/habits" className="text-xs text-green-600 hover:text-green-700 transition-colors">
                  View all habits →
                </a>
              </div>
              <HabitTracker habits={habits} onToggleHabit={toggleHabit} />
            </div>
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
              <div className="text-2xl font-bold text-blue-600">{completedGoals}/{totalGoals}</div>
              <div className="text-sm text-gray-600">Goals Completed</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${goalsProgressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Daily Verse */}
        {dailyVerse && (
          <div className="mb-8 bg-gradient-to-r from-green-50/50 to-blue-50/50 rounded-2xl p-6 border border-green-100/30 shadow-sm">
            <div className="text-center mb-6">
                              <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-green-100/50">
                  <span className="text-2xl">📖</span>
                  <h3 className="text-lg font-bold text-gray-800">
                    Today's Guidance
                  </h3>
                  <span className="text-2xl">✨</span>
                </div>
            </div>
            <VerseCard verse={dailyVerse} />
          </div>
        )}

        {/* Mobile Habits Tracker */}
        <DashboardCard 
          title="🕌 Daily Habits" 
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Track your Islamic practices and personal development.</p>
              <a href="/habits" className="text-xs text-green-600 hover:text-green-700 transition-colors">
                View all →
              </a>
            </div>
            <HabitTracker habits={habits} onToggleHabit={toggleHabit} />
          </div>
        </DashboardCard>
      </div>
    </div>
  );
} 