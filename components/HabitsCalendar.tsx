'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  icon?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastCompleted?: string;
  streak?: number;
  completionHistory?: string[];
}

interface HabitsCalendarProps {
  habits: Habit[];
}

export default function HabitsCalendar({ habits }: HabitsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getCompletionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return habits.filter(habit => 
      habit.completionHistory?.includes(dateStr) && 
      (selectedHabit === null || habit.id === selectedHabit)
    );
  };

  const getStreakIntensity = (habit: Habit, date: Date) => {
    if (!habit.completionHistory) return 0;
    
    const dateStr = date.toISOString().split('T')[0];
    if (!habit.completionHistory.includes(dateStr)) return 0;

    // Calculate intensity based on how many days in a row leading up to this date
    let intensity = 1;
    const checkDate = new Date(date);
    
    for (let i = 1; i <= 7; i++) {
      checkDate.setDate(date.getDate() - i);
      const checkDateStr = checkDate.toISOString().split('T')[0];
      if (habit.completionHistory.includes(checkDateStr)) {
        intensity++;
      } else {
        break;
      }
    }
    
    return Math.min(intensity, 4); // Cap at 4 levels
  };

  const getFrequencyEmoji = (frequency: string) => {
    const emojis = {
      daily: '📅',
      weekly: '📆',
      monthly: '🗓️',
      yearly: '🎯'
    };
    return emojis[frequency as keyof typeof emojis] || '📋';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDay = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dayCompletions = getCompletionsForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

    // Calculate overall intensity for the day
    const maxIntensity = dayCompletions.reduce((max, habit) => {
      return Math.max(max, getStreakIntensity(habit, date));
    }, 0);

    const getIntensityColor = (intensity: number) => {
      switch (intensity) {
        case 1: return 'bg-green-100 border-green-200';
        case 2: return 'bg-green-200 border-green-300';
        case 3: return 'bg-green-300 border-green-400';
        case 4: return 'bg-green-400 border-green-500';
        default: return 'bg-white border-gray-100';
      }
    };

    return (
      <motion.div
        key={day}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: day * 0.01 }}
        className={`relative min-h-[60px] p-1 border ${
          isToday ? 'border-green-500 ring-1 ring-green-300' : getIntensityColor(maxIntensity)
        } ${isPast ? 'opacity-75' : ''}`}
      >
        <div className={`text-xs font-medium ${
          isToday ? 'text-green-700' : 'text-gray-700'
        }`}>
          {day}
        </div>
        
        {dayCompletions.length > 0 && (
          <div className="absolute inset-x-1 bottom-1">
            <div className="flex flex-wrap gap-1 justify-center">
              {dayCompletions.slice(0, 3).map((habit) => (
                <div
                  key={habit.id}
                  className="text-xs"
                  title={`${habit.name} completed`}
                >
                  {habit.icon || '✓'}
                </div>
              ))}
              {dayCompletions.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{dayCompletions.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  // Get habits with completions for filter dropdown
  const habitsWithHistory = habits.filter(habit => 
    habit.completionHistory && habit.completionHistory.length > 0
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          🔥 Habits Streak Calendar
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-gray-100 rounded text-gray-600"
          >
            ←
          </button>
          <span className="font-medium text-gray-700 min-w-[120px] text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-gray-100 rounded text-gray-600"
          >
            →
          </button>
        </div>
      </div>

      {/* Habit Filter */}
      {habitsWithHistory.length > 0 && (
        <div className="mb-4">
          <select
            value={selectedHabit || ''}
            onChange={(e) => setSelectedHabit(e.target.value || null)}
            className="text-sm border border-gray-200 rounded px-2 py-1 bg-white"
          >
            <option value="">All Habits</option>
            {habitsWithHistory.map(habit => (
              <option key={habit.id} value={habit.id}>
                {habit.icon} {habit.name} ({getFrequencyEmoji(habit.frequency)})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 p-2 text-center">
            {day}
          </div>
        ))}
        
        {/* Empty days */}
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="min-h-[60px]" />
        ))}
        
        {/* Calendar days */}
        {days.map(renderCalendarDay)}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>1 day streak</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
            <span>2-3 days</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-300 border border-green-400 rounded"></div>
            <span>4-6 days</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 border border-green-500 rounded"></div>
            <span>7+ days</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      {selectedHabit && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {(() => {
            const habit = habits.find(h => h.id === selectedHabit);
            if (!habit) return null;
            
            const totalCompletions = habit.completionHistory?.length || 0;
            const currentStreak = habit.streak || 0;
            
            return (
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span>
                    <strong>{habit.icon} {habit.name}:</strong>
                  </span>
                  <span>🔥 {currentStreak} day streak</span>
                  <span>✅ {totalCompletions} total completions</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
} 