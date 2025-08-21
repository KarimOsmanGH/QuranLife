'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string | ReactNode;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export default function DashboardCard({ title, children, className = '', icon }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div className="p-2 bg-green-50 rounded-lg text-green-600">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
} 