'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  icon?: string;
}

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
}

export default function HabitTracker({ habits, onToggleHabit }: HabitTrackerProps) {
  const completedCount = habits.filter(habit => habit.completed).length;
  const progress = (completedCount / habits.length) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Daily Progress
          </span>
          <span className="text-sm text-gray-500">
            {completedCount}/{habits.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="bg-green-500 h-2 rounded-full"
          />
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              habit.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <button
              onClick={() => onToggleHabit(habit.id)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                habit.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {habit.completed && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            <span className={`flex-1 ${habit.completed ? 'text-green-700 line-through' : 'text-gray-700'}`}>
              {habit.name}
            </span>
            
            {habit.icon && (
              <span className="text-lg">{habit.icon}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 