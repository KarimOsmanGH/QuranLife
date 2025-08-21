'use client';

import { useState, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import GoalsList from '@/components/GoalsList';
import GoalsCalendar from '@/components/GoalsCalendar';
import { storage } from '@/lib/security';

interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all'); // New filter state

  // Load data from localStorage on mount
  useEffect(() => {
    const savedGoals = storage.get<Goal[]>('quranlife-goals', []);
    setGoals(savedGoals);
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    storage.set('quranlife-goals', goals);
  }, [goals]);

  const toggleGoal = (goalId: string) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, completed: !goal.completed }
          : goal
      )
    );
  };

  const addGoal = (newGoal: Omit<Goal, 'id'>) => {
    const goal: Goal = {
      ...newGoal,
      id: Date.now().toString()
    };
    setGoals(prev => [goal, ...prev]);
  };

  const editGoal = (goalId: string, updatedGoal: Omit<Goal, 'id'>) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, ...updatedGoal }
          : goal
      )
    );
  };

  const removeGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;

  // Filter goals based on active filter
  const filteredGoals = activeFilter === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === activeFilter);

  const getGoalsByCategory = () => {
    const categories = ['spiritual', 'personal', 'health', 'career', 'family'];
    return categories.map(category => ({
      category,
      goals: goals.filter(g => g.category === category),
      count: goals.filter(g => g.category === category).length
    }));
  };

  // Helper function to get category emoji
  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      spiritual: '🕌',
      personal: '⭐',
      health: '💪',
      career: '💼',
      family: '👨‍👩‍👧‍👦'
    };
    return emojis[category] || '📋';
  };

  // Helper function to get category color
  const getCategoryColor = (category: string, isActive: boolean) => {
    const colors: Record<string, string> = {
      spiritual: isActive ? 'bg-green-100 border-green-300 text-green-800' : 'bg-white hover:bg-green-50 border-gray-100 text-gray-800',
      personal: isActive ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white hover:bg-blue-50 border-gray-100 text-gray-800',
      health: isActive ? 'bg-red-100 border-red-300 text-red-800' : 'bg-white hover:bg-red-50 border-gray-100 text-gray-800',
      career: isActive ? 'bg-purple-100 border-purple-300 text-purple-800' : 'bg-white hover:bg-purple-50 border-gray-100 text-gray-800',
      family: isActive ? 'bg-orange-100 border-orange-300 text-orange-800' : 'bg-white hover:bg-orange-50 border-gray-100 text-gray-800'
    };
    return colors[category] || (isActive ? 'bg-gray-100 border-gray-300 text-gray-800' : 'bg-white hover:bg-gray-50 border-gray-100 text-gray-800');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Goals</h1>
        <p className="text-gray-600">Set and achieve your life goals with Islamic guidance</p>
      </div>

      {/* Mobile Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8 md:hidden">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{totalGoals - completedGoals}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{totalGoals}</div>
          <div className="text-sm text-gray-600">Total Goals</div>
        </div>
      </div>

      {/* Desktop Two-Column Layout */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-8 mb-8">
        {/* Left Sidebar - Stats & Categories */}
        <div className="space-y-6">
          {/* Desktop Stats Cards */}
          <div className="space-y-4">

            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
              <div className="text-sm text-gray-600">Completed Goals</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{totalGoals - completedGoals}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{totalGoals}</div>
              <div className="text-sm text-gray-600">Total Goals</div>
            </div>
          </div>

          {/* Goals by Category */}
          {totalGoals > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">📋 Filter by Category</h3>
              
              {/* All Goals Filter */}
              <button
                onClick={() => setActiveFilter('all')}
                className={`w-full text-left rounded-xl p-4 border transition-all duration-200 cursor-pointer ${
                  activeFilter === 'all' 
                    ? 'bg-gray-100 border-gray-300 text-gray-800 shadow-sm' 
                    : 'bg-white hover:bg-gray-50 border-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold flex items-center gap-2">
                      <span>📋</span>
                      All Goals
                    </div>
                    <div className="text-sm text-gray-600">{totalGoals} total goals</div>
                  </div>
                  {activeFilter === 'all' && (
                    <div className="text-gray-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              {/* Category Filters */}
              {getGoalsByCategory().filter(cat => cat.count > 0).map(category => (
                <button
                  key={category.category}
                  onClick={() => setActiveFilter(category.category)}
                  className={`w-full text-left rounded-xl p-4 border transition-all duration-200 cursor-pointer ${getCategoryColor(category.category, activeFilter === category.category)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold flex items-center gap-2 capitalize">
                        <span>{getCategoryEmoji(category.category)}</span>
                        {category.category}
                      </div>
                      <div className="text-sm opacity-75">{category.count} goals</div>
                    </div>
                    {activeFilter === category.category && (
                      <div className="opacity-75">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}


        </div>

        {/* Right Content - Goals List */}
        <div className="md:col-span-2">
          <DashboardCard 
            title={
              <div className="flex items-center gap-2">
                <span>Your Goals</span>
                {activeFilter !== 'all' && (
                  <span className="text-sm font-normal text-gray-500">
                    - {getCategoryEmoji(activeFilter)} {activeFilter}
                  </span>
                )}
              </div>
            }
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          >
            <GoalsList 
              goals={filteredGoals} 
              onToggleGoal={toggleGoal} 
              onAddGoal={addGoal}
              onEditGoal={editGoal}
              onRemoveGoal={removeGoal}
            />
          </DashboardCard>
        </div>
      </div>

      {/* Goals Calendar - Full Width */}
      {goals.length > 0 && (
        <div className="mt-8">
          <GoalsCalendar goals={goals} />
        </div>
      )}

      {/* Mobile Single Column Layout */}
      <div className="md:hidden">
        {/* Mobile Goals by Category */}
        {totalGoals > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Filter by Category</h3>
            
            {/* Mobile All Goals Filter */}
            <button
              onClick={() => setActiveFilter('all')}
              className={`w-full text-left rounded-xl p-4 border transition-all duration-200 cursor-pointer mb-4 ${
                activeFilter === 'all' 
                  ? 'bg-gray-100 border-gray-300 text-gray-800 shadow-sm' 
                  : 'bg-white hover:bg-gray-50 border-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold flex items-center gap-2">
                    <span>📋</span>
                    All Goals
                  </div>
                  <div className="text-sm text-gray-600">{totalGoals} total goals</div>
                </div>
                {activeFilter === 'all' && (
                  <div className="text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Mobile Category Filters Grid */}
            <div className="grid grid-cols-2 gap-3">
              {getGoalsByCategory().filter(cat => cat.count > 0).map(category => (
                <button
                  key={category.category}
                  onClick={() => setActiveFilter(category.category)}
                  className={`text-left rounded-xl p-4 border transition-all duration-200 cursor-pointer ${getCategoryColor(category.category, activeFilter === category.category)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-semibold flex items-center gap-2 capitalize">
                        <span>{getCategoryEmoji(category.category)}</span>
                        {category.category}
                      </div>
                      <div className="text-sm opacity-75">{category.count} goals</div>
                    </div>
                    {activeFilter === category.category && (
                      <div className="opacity-75">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Goals List */}
        <DashboardCard 
          title={
            <div className="flex items-center gap-2">
              <span>Your Goals</span>
              {activeFilter !== 'all' && (
                <span className="text-sm font-normal text-gray-500">
                  - {getCategoryEmoji(activeFilter)} {activeFilter}
                </span>
              )}
            </div>
          }
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        >
          <GoalsList 
            goals={filteredGoals} 
            onToggleGoal={toggleGoal} 
            onAddGoal={addGoal}
            onEditGoal={editGoal}
            onRemoveGoal={removeGoal}
          />
        </DashboardCard>


      </div>
    </div>
  );
} 