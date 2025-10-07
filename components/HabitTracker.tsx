'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

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

interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  habits: Array<{
    name: string;
    icon: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  }>;
}

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
  onAddTemplateHabits?: (template: HabitTemplate) => void;
}

export default function HabitTracker({ habits, onToggleHabit, onAddTemplateHabits }: HabitTrackerProps) {
  // Group habits by frequency for better organization
  const habitsByFrequency = {
    daily: habits.filter(h => h.frequency === 'daily'),
    weekly: habits.filter(h => h.frequency === 'weekly'),
    monthly: habits.filter(h => h.frequency === 'monthly'),
    yearly: habits.filter(h => h.frequency === 'yearly'),
  };

  // Smart template suggestions based on what's missing
  const getSmartTemplates = (): HabitTemplate[] => {
    const templates: HabitTemplate[] = [
      {
        id: 'essential-prayers',
        name: 'Daily Prayers',
        description: 'Start with 5 daily prayers',
        icon: '🕌',
        habits: [
          { name: 'Fajr Prayer', icon: '🌅', frequency: 'daily' },
          { name: 'Maghrib Prayer', icon: '🌆', frequency: 'daily' },
          { name: 'Isha Prayer', icon: '🌙', frequency: 'daily' },
        ]
      },
      {
        id: 'quick-dhikr',
        name: 'Quick Dhikr',
        description: 'Simple daily remembrance',
        icon: '💫',
        habits: [
          { name: 'Morning Dhikr', icon: '🌅', frequency: 'daily' },
          { name: 'Evening Dhikr', icon: '🌙', frequency: 'daily' },
        ]
      }
    ];

    // Only show if user has few habits
    return habits.length < 5 ? templates.slice(0, 2) : [];
  };

  const smartTemplates = getSmartTemplates();

  const totalCompleted = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;
  const progress = totalHabits > 0 ? (totalCompleted / totalHabits) * 100 : 0;

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      daily: 'Daily',
      weekly: 'Weekly', 
      monthly: 'Monthly',
      yearly: 'Yearly'
    };
    return labels[frequency as keyof typeof labels] || frequency;
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

  const renderHabitGroup = (groupHabits: Habit[], frequency: string) => {
    if (groupHabits.length === 0) return null;

    return (
      <div key={frequency} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{getFrequencyEmoji(frequency)}</span>
          <h4 className="text-sm font-medium text-gray-700">{getFrequencyLabel(frequency)} Habits</h4>
          <span className="text-xs text-gray-500">
            ({groupHabits.filter(h => h.completed).length}/{groupHabits.length})
          </span>
        </div>
        
        <div className="grid gap-3">
          {groupHabits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                habit.completed
                  ? 'bg-green-50 border-green-200 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-green-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleHabit(habit.id)}
                  aria-label={`${habit.completed ? 'Unmark' : 'Mark'} ${habit.name} as complete`}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    habit.completed
                      ? 'bg-green-500 border-green-500 text-white shadow-sm'
                      : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  {habit.completed && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </button>
                
                <div className="flex items-center gap-2">
                  {habit.icon && (
                    <span className="text-lg">{habit.icon}</span>
                  )}
                  <span className={`font-medium transition-colors ${
                    habit.completed ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {habit.name}
                  </span>
                </div>
              </div>

              {/* Streak indicator */}
              {habit.streak && habit.streak > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-orange-500">🔥</span>
                  <span className="font-medium text-orange-600">{habit.streak}</span>
                  <span className="text-gray-500">streak</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Overall Progress
          </span>
          <span className="text-sm text-gray-500">
            {totalCompleted}/{totalHabits} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
          />
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center">
          {Math.round(progress)}% complete
        </div>
      </div>

      {/* Habits grouped by frequency */}
      {Object.entries(habitsByFrequency).map(([frequency, groupHabits]) => 
        renderHabitGroup(groupHabits, frequency)
      )}

      {/* Smart Quickstart Templates */}
      {smartTemplates.length > 0 && onAddTemplateHabits && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-600">✨ Quick Start</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          <div className="flex gap-2">
            {smartTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onAddTemplateHabits(template)}
                className="flex-1 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all duration-200 touch-manipulation"
              >
                <div className="text-center">
                  <div className="text-lg mb-1">{template.icon}</div>
                  <div className="text-xs font-medium text-green-700">{template.name}</div>
                  <div className="text-xs text-green-600 mt-1">+{template.habits.length} habits</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 