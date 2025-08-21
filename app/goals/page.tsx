'use client';

import { useState, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import GoalsList from '@/components/GoalsList';
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

  const getGoalsByCategory = () => {
    const categories = ['spiritual', 'personal', 'health', 'career', 'family'];
    return categories.map(category => ({
      category,
      goals: goals.filter(g => g.category === category),
      count: goals.filter(g => g.category === category).length
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
      {/* Header */}
      <div className="text-center mb-8">
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
              <h3 className="text-lg font-semibold text-gray-800">📋 Categories</h3>
              {getGoalsByCategory().filter(cat => cat.count > 0).map(category => (
                <div key={category.category} className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="text-lg font-semibold text-gray-800 capitalize">{category.category}</div>
                  <div className="text-sm text-gray-600">{category.count} goals</div>
                </div>
              ))}
            </div>
          )}


        </div>

        {/* Right Content - Goals List */}
        <div className="md:col-span-2">
          <DashboardCard 
            title="Your Goals" 
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          >
            <GoalsList 
              goals={goals} 
              onToggleGoal={toggleGoal} 
              onAddGoal={addGoal}
              onEditGoal={editGoal}
              onRemoveGoal={removeGoal}
            />
          </DashboardCard>
        </div>
      </div>

      {/* Mobile Single Column Layout */}
      <div className="md:hidden">
        {/* Mobile Goals by Category */}
        {totalGoals > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-4">
            {getGoalsByCategory().filter(cat => cat.count > 0).map(category => (
              <div key={category.category} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-lg font-semibold text-gray-800 capitalize">{category.category}</div>
                <div className="text-sm text-gray-600">{category.count} goals</div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile Goals List */}
        <DashboardCard 
          title="Your Goals" 
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        >
          <GoalsList 
            goals={goals} 
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