/**
 * Advanced Quran Engine for QuranLife
 * Provides intelligent verse matching, practical guidance, and thematic organization
 * Now powered by AlQuran.cloud API for complete Quran access
 * Author: Karim Osman (https://kar.im)
 */

import { quranAPI, type Verse, type RandomVerseResponse } from './quran-api';

export interface QuranVerse {
  id: number;
  surah: string;
  surah_number: number;
  ayah: number;
  text_ar: string;
  text_en: string;
  theme: string[];
  reflection: string;
  practical_guidance?: string[];
  related_hadith?: string;
  context?: string;
  life_application?: string;
}

export interface GoalMatchResult {
  verse: QuranVerse;
  relevanceScore: number;
  practicalSteps: string[];
  duaRecommendation?: string;
  relatedHabits: string[];
}

export interface ThematicCollection {
  theme: string;
  description: string;
  verses: QuranVerse[];
  practicalGuidance: string[];
  recommendedActions: string[];
}

// Enhanced guidance for transforming API verses into practical advice
const PRACTICAL_GUIDANCE: Record<string, string[]> = {
  patience: [
    "Make dua during difficult times: 'Rabbana afrigh 'alayna sabran' (Our Lord, pour upon us patience)",
    "Practice the 3-breath technique when feeling impatient",
    "Remember that every difficulty is temporary and has wisdom",
    "Read stories of Prophet Ayub (Job) for inspiration",
    "Set realistic timelines for your goals"
  ],
  prayer: [
    "Set 5 phone reminders for daily prayers",
    "Prepare a clean prayer space in your home",
    "Learn the meanings of Surah Al-Fatiha",
    "Make dua in your own language after each prayer",
    "Join congregation prayers when possible"
  ],
  change: [
    "Start with one small habit change this week",
    "Make du'a: 'Rabbana atina fi'd-dunya hasanatan' (Our Lord, give us good in this world)",
    "Write down 3 specific steps toward your goal",
    "Find an accountability partner in your community",
    "Celebrate small victories along the way"
  ],
  family: [
    "Schedule weekly family time without devices",
    "Teach children one new Islamic value each month",
    "Practice forgiveness and patience with family members",
    "Make family du'a together before meals",
    "Share stories of the Prophet's family life"
  ],
  anxiety: [
    "Recite Ayat al-Kursi when feeling anxious",
    "Practice deep breathing with 'La hawla wa la quwwata illa billah'",
    "Maintain regular prayer times for structure",
    "Seek support from trusted friends or counselors",
    "Remember that Allah does not burden a soul beyond its capacity"
  ],
  success: [
    "Begin every endeavor with 'Bismillah'",
    "Set intentions (niyyah) aligned with Islamic values",
    "Balance worldly goals with spiritual growth",
    "Give charity (sadaqah) as you progress",
    "Remember success comes from Allah alone"
  ]
};

// Enhanced dua recommendations for different life situations
const DUA_RECOMMENDATIONS: Record<string, string> = {
  patience: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana (Our Lord, pour upon us patience and make our steps firm)",
  change: "Rabbana atina fi'd-dunya hasanatan wa fi'l-akhirati hasanatan (Our Lord, give us good in this world and good in the hereafter)",
  guidance: "Rabbana la tuzigh qulubana ba'da idh hadaytana (Our Lord, do not let our hearts deviate after You have guided us)",
  family: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin (Our Lord, grant us wives and offspring who will be the comfort of our eyes)",
  anxiety: "Hasbunallahu wa ni'mal wakeel (Allah is sufficient for us and He is the best guardian)",
  success: "Rabbi a'inni wa la tu'in 'alayya (My Lord, help me and do not help against me)"
};

class QuranEngine {
  private apiCache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get daily verse with guidance - now powered by live API
   */
  async getDailyVerse(): Promise<QuranVerse | null> {
    try {
      const randomVerseResponse = await quranAPI.getRandomVerse();
      return this.convertAPIVerseToQuranVerse(randomVerseResponse);
    } catch (error) {
      console.error('Error fetching daily verse:', error);
      
      // Fallback to a default verse if API fails
      return this.getFallbackVerse();
    }
  }

  /**
   * Find verses matching specific goals or themes
   */
  async findVersesForGoal(goal: string): Promise<GoalMatchResult[]> {
    try {
      // Extract keywords from goal
      const keywords = this.extractKeywords(goal);
      const theme = this.determineTheme(keywords);
      
      // Search for verses using the API
      const searchResults = await quranAPI.searchVerses(goal, 'en');
      
      if (searchResults.length === 0) {
        // If no direct matches, try thematic search
        return await this.getThematicVersesForGoal(theme, goal);
      }

      // Convert API results to goal matches
      const matches: GoalMatchResult[] = [];
      
      for (const apiVerse of searchResults.slice(0, 3)) { // Limit to top 3 results
        const quranVerse = await this.convertAPIVerseToQuranVerse({
          verse: apiVerse,
          surah: { number: Math.floor(apiVerse.number / 1000) + 1 } as any, // Approximate surah from verse number
          theme,
          context: `Guidance for: ${goal}`
        });

        if (quranVerse) {
          matches.push({
            verse: quranVerse,
            relevanceScore: this.calculateRelevanceScore(goal, quranVerse),
            practicalSteps: this.generatePracticalSteps(theme, goal),
            duaRecommendation: DUA_RECOMMENDATIONS[theme],
            relatedHabits: this.getRelatedHabits(theme)
          });
        }
      }

      return matches;
    } catch (error) {
      console.error('Error finding verses for goal:', error);
      return [];
    }
  }

  /**
   * Get thematic collection of verses
   */
  async getThematicCollection(theme: string): Promise<ThematicCollection | null> {
    try {
      const cacheKey = `theme_${theme}`;
      
      // Check cache first
      if (this.isCacheValid(cacheKey)) {
        return this.apiCache.get(cacheKey);
      }

      // Get verses related to the theme
      const searchTerms = this.getThemeSearchTerms(theme);
      const searchResults = await quranAPI.searchVerses(searchTerms, 'en');
      
      const verses: QuranVerse[] = [];
      
      // Convert up to 5 verses for the collection
      for (const apiVerse of searchResults.slice(0, 5)) {
        const quranVerse = await this.convertAPIVerseToQuranVerse({
          verse: apiVerse,
          surah: { number: Math.floor(apiVerse.number / 1000) + 1 } as any,
          theme,
          context: `Thematic guidance: ${theme}`
        });

        if (quranVerse) {
          verses.push(quranVerse);
        }
      }

      const collection: ThematicCollection = {
        theme: this.capitalizeTheme(theme),
        description: this.getThemeDescription(theme),
        verses,
        practicalGuidance: PRACTICAL_GUIDANCE[theme] || [],
        recommendedActions: this.getRecommendedActions(theme)
      };

      // Cache the result
      this.apiCache.set(cacheKey, collection);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);

      return collection;
    } catch (error) {
      console.error('Error getting thematic collection:', error);
      return null;
    }
  }

  /**
   * Convert API verse response to QuranVerse format
   */
  private async convertAPIVerseToQuranVerse(apiResponse: RandomVerseResponse): Promise<QuranVerse | null> {
    try {
      const { verse, surah, theme, context } = apiResponse;
      
      return {
        id: verse.number,
        surah: surah.englishName || `Surah ${surah.number}`,
        surah_number: surah.number,
        ayah: verse.numberInSurah,
        text_ar: verse.text,
        text_en: verse.translation || '',
        theme: theme ? [theme] : ['guidance'],
        reflection: this.generateReflection(verse.translation || '', theme || 'guidance'),
        practical_guidance: PRACTICAL_GUIDANCE[theme || 'guidance']?.slice(0, 3),
        context: context || `From ${surah.englishName}`,
        life_application: this.generateLifeApplication(verse.translation || '', theme || 'guidance')
      };
    } catch (error) {
      console.error('Error converting API verse:', error);
      return null;
    }
  }

  /**
   * Generate practical reflection for a verse
   */
  private generateReflection(translation: string, theme: string): string {
    const reflectionTemplates: Record<string, string[]> = {
      patience: [
        "This verse reminds us that patience is not just waiting, but maintaining faith during challenges.",
        "True patience involves trusting Allah's timing while continuing to make effort.",
        "Every test is an opportunity to grow closer to Allah and strengthen our character."
      ],
      prayer: [
        "Prayer is our direct connection to Allah, offering guidance and peace in all situations.",
        "This verse emphasizes that consistent worship transforms our hearts and daily actions.",
        "Through prayer, we align our will with Allah's guidance and find purpose in our days."
      ],
      change: [
        "Personal transformation begins with sincere intention and trust in Allah's support.",
        "This verse teaches us that positive change requires both effort and reliance on Allah.",
        "Growth happens gradually - each small step taken with faith leads to lasting transformation."
      ],
      guidance: [
        "Divine guidance illuminates our path when we sincerely seek Allah's direction.",
        "This verse reminds us that true wisdom comes from following Islamic teachings.",
        "Guidance is available to all who approach Allah with humility and openness to learn."
      ]
    };

    const templates = reflectionTemplates[theme] || reflectionTemplates.guidance;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Generate life application advice
   */
  private generateLifeApplication(translation: string, theme: string): string {
    const applications: Record<string, string[]> = {
      patience: [
        "When facing delays in your goals, use this time for extra dhikr and self-improvement.",
        "Practice gratitude daily to maintain perspective during challenging periods.",
        "Set small, achievable milestones to maintain motivation while exercising patience."
      ],
      prayer: [
        "Incorporate this verse into your daily dhikr routine for spiritual strengthening.",
        "Use prayer times as natural breaks to refocus on your priorities and values.",
        "Share the wisdom of this verse with family during your daily conversations."
      ],
      change: [
        "Apply this verse's wisdom by taking one concrete step toward your goal today.",
        "Create a accountability system with someone who shares your Islamic values.",
        "Reflect on this verse weekly to stay motivated on your transformation journey."
      ]
    };

    const options = applications[theme] || applications.prayer;
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Fallback verse when API is unavailable
   */
  private getFallbackVerse(): QuranVerse {
    return {
      id: 2255,
      surah: "Al-Baqarah",
      surah_number: 2,
      ayah: 255,
      text_ar: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
      text_en: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.",
      theme: ["faith", "strength"],
      reflection: "This powerful verse reminds us that Allah is always present and in control, providing strength and comfort in all situations.",
      practical_guidance: [
        "Recite Ayat al-Kursi for protection and peace",
        "Remember Allah's constant presence during challenges",
        "Trust in Allah's perfect timing and wisdom"
      ],
      context: "Ayat al-Kursi - The Throne Verse",
      life_application: "Use this verse as a source of strength and comfort throughout your day, especially during moments of uncertainty or stress."
    };
  }

  // Helper methods for theme analysis and guidance generation
  private extractKeywords(text: string): string[] {
    return text.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2)
      .map(word => word.replace(/[^\w]/g, ''));
  }

  private determineTheme(keywords: string[]): string {
    const themeScores: Record<string, number> = {};
    
    for (const [theme, themeKeywords] of Object.entries(PRACTICAL_GUIDANCE)) {
      themeScores[theme] = keywords.filter(keyword => 
        themeKeywords.some(tk => tk.toLowerCase().includes(keyword))
      ).length;
    }

    const topTheme = Object.entries(themeScores)
      .sort(([,a], [,b]) => b - a)[0];
    
    return topTheme ? topTheme[0] : 'guidance';
  }

  private async getThematicVersesForGoal(theme: string, goal: string): Promise<GoalMatchResult[]> {
    try {
      const collection = await this.getThematicCollection(theme);
      if (!collection || collection.verses.length === 0) {
        return [];
      }

      return collection.verses.slice(0, 2).map(verse => ({
        verse,
        relevanceScore: this.calculateRelevanceScore(goal, verse),
        practicalSteps: this.generatePracticalSteps(theme, goal),
        duaRecommendation: DUA_RECOMMENDATIONS[theme],
        relatedHabits: this.getRelatedHabits(theme)
      }));
    } catch (error) {
      console.error('Error getting thematic verses:', error);
      return [];
    }
  }

  private calculateRelevanceScore(goal: string, verse: QuranVerse): number {
    const goalWords = this.extractKeywords(goal);
    const verseWords = this.extractKeywords(verse.text_en + ' ' + verse.reflection);
    
    const matches = goalWords.filter(word => 
      verseWords.some(vw => vw.includes(word) || word.includes(vw))
    );
    
    return Math.min(0.95, matches.length / Math.max(goalWords.length, 1));
  }

  private generatePracticalSteps(theme: string, goal: string): string[] {
    const baseSteps = PRACTICAL_GUIDANCE[theme] || PRACTICAL_GUIDANCE.guidance;
    const goalSpecific = [
      `Set a specific timeline for: ${goal}`,
      `Make daily du'a for success in: ${goal}`,
      `Break down "${goal}" into smaller, manageable tasks`
    ];
    
    return [...baseSteps.slice(0, 2), ...goalSpecific];
  }

  private getRelatedHabits(theme: string): string[] {
    const habitMap: Record<string, string[]> = {
      patience: ['Daily dhikr', 'Gratitude journaling', 'Regular prayer'],
      prayer: ['5 daily prayers', 'Morning athkar', 'Evening dhikr'],
      change: ['Goal setting', 'Daily reflection', 'Skill learning'],
      family: ['Family time', 'Teaching children', 'Shared meals'],
      anxiety: ['Stress management', 'Seeking support', 'Mindful breathing'],
      success: ['Planning', 'Charity giving', 'Continuous learning']
    };
    
    return habitMap[theme] || habitMap.prayer;
  }

  private getThemeSearchTerms(theme: string): string {
    const searchTerms: Record<string, string> = {
      patience: 'patience perseverance endurance',
      prayer: 'prayer worship remembrance',
      change: 'change transformation growth',
      family: 'family children parents',
      anxiety: 'peace comfort trust',
      success: 'success achievement blessing'
    };
    
    return searchTerms[theme] || 'guidance wisdom';
  }

  private getThemeDescription(theme: string): string {
    const descriptions: Record<string, string> = {
      patience: "Building resilience and endurance through Islamic teachings",
      prayer: "Strengthening your connection with Allah through worship",
      change: "Personal transformation guided by Quranic wisdom",
      family: "Nurturing relationships with Islamic values",
      anxiety: "Finding peace and calm through Islamic practices",
      success: "Achieving goals while maintaining Islamic principles"
    };
    return descriptions[theme] || `Islamic guidance for ${theme}`;
  }

  private getRecommendedActions(theme: string): string[] {
    const actions: Record<string, string[]> = {
      patience: ["Practice daily dhikr", "Read stories of the Prophets", "Make dua during challenges"],
      prayer: ["Maintain 5 daily prayers", "Learn prayer meanings", "Join community prayers"],
      change: ["Set Islamic goals", "Find mentorship", "Track spiritual progress"],
      family: ["Schedule family time", "Teach Islamic values", "Practice forgiveness"],
      anxiety: ["Recite protective verses", "Practice breathing exercises", "Seek community support"],
      success: ["Align goals with values", "Give regular charity", "Seek beneficial knowledge"]
    };
    
    return actions[theme] || actions.prayer;
  }

  private capitalizeTheme(theme: string): string {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  /**
   * Smart verse recommendation based on user context
   */
  async getSmartRecommendation(userGoals: string[], completedHabits: string[]): Promise<QuranVerse | null> {
    try {
      // Analyze user's current focus areas
      const currentFocus = this.analyzeUserFocus(userGoals, completedHabits);
      
      // Get a random verse that matches their focus
      const randomResponse = await quranAPI.getRandomVerse();
      
      // Enhance the verse with personalized guidance
      const verse = await this.convertAPIVerseToQuranVerse(randomResponse);
      
      if (verse && currentFocus) {
        verse.practical_guidance = this.getPersonalizedGuidance(currentFocus, userGoals);
        verse.life_application = `Based on your current goals (${userGoals.slice(0, 2).join(', ')}), ${verse.life_application}`;
      }
      
      return verse;
    } catch (error) {
      console.error('Error getting smart recommendation:', error);
      return this.getFallbackVerse();
    }
  }

  private analyzeUserFocus(goals: string[], habits: string[]): string {
    // Simple analysis - in a real app, this could be more sophisticated
    const allText = [...goals, ...habits].join(' ').toLowerCase();
    
    for (const [theme, keywords] of Object.entries(PRACTICAL_GUIDANCE)) {
      if (keywords.some(keyword => allText.includes(keyword.toLowerCase()))) {
        return theme;
      }
    }
    
    return 'guidance';
  }

  private getPersonalizedGuidance(focus: string, goals: string[]): string[] {
    const baseGuidance = PRACTICAL_GUIDANCE[focus] || PRACTICAL_GUIDANCE.guidance;
    const personalizedTips = [
      `Apply this wisdom to your goal: "${goals[0] || 'your current focus'}"`,
      "Reflect on this verse during your daily prayer",
      "Share this insight with someone who could benefit from it"
    ];
    
    return [...baseGuidance.slice(0, 2), ...personalizedTips];
  }
}

// Export singleton instance
export const quranEngine = new QuranEngine();
export default quranEngine; 