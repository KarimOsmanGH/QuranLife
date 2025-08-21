'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

interface GoalsCalendarProps {
  goals: Goal[];
}

export default function GoalsCalendar({ goals }: GoalsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const getGoalsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return goals.filter(goal => goal.dueDate === dateStr);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryEmoji = (category: string) => {
    const emojis = {
      spiritual: '🕌',
      learning: '📚',
      health: '💪',
      family: '👨‍👩‍👧‍👦',
      career: '💼',
      personal: '🌟'
    };
    return emojis[category as keyof typeof emojis] || '📋';
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
    const dayGoals = getGoalsForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

    return (
      <motion.div
        key={day}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: day * 0.01 }}
        className={`relative min-h-[60px] p-1 border border-gray-100 ${
          isToday ? 'bg-green-50 border-green-200' : 'bg-white'
        } ${isPast ? 'opacity-75' : ''}`}
      >
        <div className={`text-xs font-medium ${
          isToday ? 'text-green-700' : 'text-gray-700'
        }`}>
          {day}
        </div>
        
        {dayGoals.length > 0 && (
          <div className="absolute inset-x-1 bottom-1 space-y-1">
            {dayGoals.slice(0, 2).map((goal, index) => (
              <div
                key={goal.id}
                className={`text-xs px-1 py-0.5 rounded flex items-center gap-1 ${
                  goal.completed 
                    ? 'bg-green-100 text-green-700 line-through' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                title={goal.title}
              >
                <span className="text-xs">{getCategoryEmoji(goal.category)}</span>
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(goal.priority)}`}></div>
                <span className="truncate">{goal.title.slice(0, 8)}...</span>
              </div>
            ))}
            {dayGoals.length > 2 && (
              <div className="text-xs text-gray-500 text-center">
                +{dayGoals.length - 2} more
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📅 Goals Calendar
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
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
} 