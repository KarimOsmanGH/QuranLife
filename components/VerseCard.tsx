'use client';

import { motion } from 'framer-motion';

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

interface VerseCardProps {
  verse: Verse;
}

export default function VerseCard({ verse }: VerseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-xl p-6 border border-green-100/50 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
    >
      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-100/30 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
      
      <div className="text-center mb-4 relative z-10">
        <h4 className="text-sm font-medium text-green-700 mb-2">
          {verse.surah} ({verse.surah_number}:{verse.ayah})
        </h4>
      </div>
      
      <div className="text-center mb-6 relative z-10">
        <p className="text-xl leading-relaxed text-gray-800 mb-4 font-arabic" dir="rtl">
          {verse.text_ar}
        </p>
        <p className="text-gray-600 leading-relaxed italic">
          "{verse.text_en}"
        </p>
      </div>

      <div className="border-t border-green-200 pt-4 relative z-10">
        <p className="text-sm text-gray-700 leading-relaxed">
          <span className="font-medium text-green-700">Reflection: </span>
          {verse.reflection}
        </p>
      </div>


    </motion.div>
  );
} 