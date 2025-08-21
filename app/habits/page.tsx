'use client';

import { useState, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import HabitTracker from '@/components/HabitTracker';
import { storage } from '@/lib/security';

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  icon?: string;
}

const defaultHabits: Habit[] = [
  { id: 'fajr', name: 'Fajr Prayer', completed: false, icon: '🌅' },
  { id: 'dhuhr', name: 'Dhuhr Prayer', completed: false, icon: '☀️' },
  { id: 'asr', name: 'Asr Prayer', completed: false, icon: '🌤️' },
  { id: 'maghrib', name: 'Maghrib Prayer', completed: false, icon: '🌅' },
  { id: 'isha', name: 'Isha Prayer', completed: false, icon: '🌙' },
  { id: 'quran', name: 'Quran Reading', completed: false, icon: '📖' },
  { id: 'dhikr', name: 'Morning Dhikr', completed: false, icon: '🤲' },
  { id: 'dua', name: 'Evening Dua', completed: false, icon: '🤲' },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHabits = storage.get<Habit[]>('quranlife-habits', defaultHabits);
    setHabits(savedHabits);
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    storage.set('quranlife-habits', habits);
  }, [habits]);

  const toggleHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId 
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  const resetHabits = () => {
    setHabits(prev => prev.map(habit => ({ ...habit, completed: false })));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Daily Habits</h1>
        <p className="text-gray-600">
          Track your daily Islamic practices and personal development habits.
        </p>
      </div>

      {/* Mobile Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8 md:hidden">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <div className="text-sm text-gray-600">Completed Today</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{Math.round((completedCount / totalCount) * 100)}%</div>
          <div className="text-sm text-gray-600">Daily Progress</div>
        </div>
      </div>

      {/* Desktop Two-Column Layout */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-8 mb-8">
        {/* Left Sidebar - Stats & Tips */}
        <div className="space-y-6">
          {/* Desktop Stats Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-600">Completed Today</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{Math.round((completedCount / totalCount) * 100)}%</div>
              <div className="text-sm text-gray-600">Daily Progress</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{totalCount}</div>
              <div className="text-sm text-gray-600">Total Habits</div>
            </div>
          </div>

          {/* Habit Tips - Desktop Sidebar */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100">
            <h3 className="text-md font-semibold text-gray-800 mb-3">💡 Habit Tips</h3>
            <ul className="space-y-2 text-xs text-gray-700">
              <li>• Start small and be consistent</li>
              <li>• Set prayer time reminders</li>
              <li>• Read one Quran page daily</li>
              <li>• Make dhikr during activities</li>
              <li>• Reset daily, stay motivated</li>
            </ul>
          </div>
        </div>

        {/* Right Content - Habits Tracker */}
        <div className="md:col-span-2">
          <DashboardCard 
            title="Today's Habits" 
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <HabitTracker habits={habits} onToggleHabit={toggleHabit} />
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={resetHabits}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Reset All Habits
              </button>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Mobile Single Column Layout */}
      <div className="md:hidden">
        {/* Habits Tracker */}
        <DashboardCard 
          title="Today's Habits" 
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          <HabitTracker habits={habits} onToggleHabit={toggleHabit} />
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={resetHabits}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Reset All Habits
            </button>
          </div>
        </DashboardCard>

        {/* Mobile Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Habit Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Start small and be consistent - it's better to pray one prayer daily than to miss all five occasionally.</li>
            <li>• Set reminders for prayer times using your phone or prayer apps.</li>
            <li>• Read just one page of Quran daily to build the habit gradually.</li>
            <li>• Make dhikr during daily activities like walking or commuting.</li>
            <li>• Reset your habits each day and don't let yesterday's missed practices discourage you.</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 