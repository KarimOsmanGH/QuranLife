'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useEffect } from 'react';

interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
}

interface GoalsCalendarProps {
  goals: Goal[];
  onGoalClick?: (goal: Goal) => void;
}

export default function GoalsCalendar({ goals, onGoalClick }: GoalsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    const isRecurringDueOn = (g: Goal, d: Date) => {
      if (!g.recurring || g.recurring === 'none') return false;
      // Use anchor date if provided, else sensible defaults
      const anchor = g.dueDate ? new Date(g.dueDate) : new Date(1970, 0, 1); // 1970-01-01 is Thursday
      switch (g.recurring) {
        case 'daily':
          return true; // every day
        case 'weekly': {
          // Default to Monday if no anchor
          const anchorDow = g.dueDate ? anchor.getDay() : 1; // 0=Sun,1=Mon
          return d.getDay() === anchorDow;
        }
        case 'monthly': {
          // Default to 1st of month if no anchor
          const anchorDom = g.dueDate ? anchor.getDate() : 1;
          return d.getDate() === anchorDom;
        }
        case 'yearly': {
          // Default to Jan 1 if no anchor
          const anchorMonth = g.dueDate ? anchor.getMonth() : 0;
          const anchorDom = g.dueDate ? anchor.getDate() : 1;
          return d.getMonth() === anchorMonth && d.getDate() === anchorDom;
        }
        default:
          return false;
      }
    };

    return goals.filter(goal => {
      // Explicit due date match
      if (goal.dueDate) {
        const goalDate = new Date(goal.dueDate);
        if (isSameDay(goalDate, date)) return true;
      }
      // Recurring match
      return isRecurringDueOn(goal, date);
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-emerald-500';
      case 'low': return 'bg-gray-400';
      default: return 'bg-gray-400';
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
            {dayGoals.slice(0, 2).map((goal) => (
              <button
                key={goal.id}
                onClick={() => onGoalClick?.(goal)}
                className={`text-xs px-1 py-0.5 rounded flex items-center gap-1 w-full text-left transition-all duration-200 hover:shadow-sm touch-manipulation ${
                  goal.completed 
                    ? 'bg-green-100 text-green-700 line-through hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                } ${onGoalClick ? 'cursor-pointer' : 'cursor-default'}`}
                title={`${goal.title} - Click to ${goal.completed ? 'view' : 'edit'}`}
                disabled={!onGoalClick}
              >
                <span className="text-xs">{getCategoryEmoji(goal.category)}</span>
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(goal.priority)}`}></div>
                <span className="truncate">{goal.title.slice(0, 8)}...</span>
              </button>
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

  // Server-safe placeholder to avoid hydration mismatches due to Date/timezone
  if (!isClient) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="h-5 w-24 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-7 gap-1 min-w-[560px] sm:min-w-0 overflow-x-auto">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={`ph-h-${i}`} className="text-xs font-medium text-gray-300 p-2 text-center">&nbsp;</div>
          ))}
          {Array.from({ length: 42 }).map((_, i) => (
            <div key={`ph-d-${i}`} className="min-h-[60px] bg-gray-50 border border-gray-100" />
          ))}
        </div>
      </div>
    );
  }

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
      <div className="grid grid-cols-7 gap-1 min-w-[560px] sm:min-w-0 overflow-x-auto">
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
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
} 