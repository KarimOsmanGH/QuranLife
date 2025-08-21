/**
 * Advanced Quran Engine for QuranLife
 * Provides intelligent verse matching, practical guidance, and thematic organization
 * Author: Karim Osman (https://kar.im)
 */

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

// Expanded thematic mappings for better goal-verse matching
const THEME_KEYWORDS = {
  // Personal Development
  patience: ['patience', 'sabr', 'endurance', 'perseverance', 'waiting', 'trials', 'difficulty'],
  strength: ['strength', 'power', 'resilience', 'courage', 'steadfastness', 'determination'],
  change: ['change', 'transformation', 'improvement', 'growth', 'development', 'progress'],
  
  // Spiritual Growth
  prayer: ['prayer', 'salah', 'worship', 'dua', 'remembrance', 'dhikr'],
  faith: ['faith', 'iman', 'belief', 'trust', 'conviction', 'certainty'],
  guidance: ['guidance', 'hidayah', 'direction', 'path', 'way', 'light'],
  
  // Life Areas
  family: ['family', 'parents', 'children', 'spouse', 'relatives', 'kinship'],
  health: ['health', 'healing', 'wellness', 'body', 'medicine', 'cure'],
  wealth: ['wealth', 'money', 'rizq', 'provision', 'sustenance', 'work'],
  knowledge: ['knowledge', 'ilm', 'learning', 'wisdom', 'education', 'understanding'],
  
  // Character Development
  honesty: ['honesty', 'truth', 'sincerity', 'integrity', 'trustworthiness'],
  kindness: ['kindness', 'compassion', 'mercy', 'gentleness', 'care'],
  justice: ['justice', 'fairness', 'rights', 'equality', 'balance'],
  
  // Challenges
  anxiety: ['anxiety', 'worry', 'fear', 'stress', 'concern', 'unease'],
  depression: ['sadness', 'grief', 'sorrow', 'despair', 'hope', 'healing'],
  addiction: ['addiction', 'habit', 'compulsion', 'self-control', 'discipline'],
  
  // Success & Achievement
  success: ['success', 'achievement', 'victory', 'accomplishment', 'triumph'],
  leadership: ['leadership', 'responsibility', 'authority', 'management', 'guidance'],
  business: ['business', 'trade', 'commerce', 'work', 'profession', 'career']
};

// Practical guidance templates for different themes
const PRACTICAL_GUIDANCE = {
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
    "Start with one small change and build momentum",
    "Write down your 'why' for wanting to change",
    "Find an accountability partner in your community",
    "Track your progress weekly",
    "Celebrate small victories along the way"
  ],
  family: [
    "Schedule weekly family time without devices",
    "Make dua for your family members daily",
    "Practice active listening with family",
    "Express gratitude to family members regularly",
    "Resolve conflicts with wisdom and patience"
  ],
  anxiety: [
    "Practice dhikr: Say 'La hawla wa la quwwata illa billah' 100 times",
    "Do wudu when feeling anxious - it brings calm",
    "Read Surah Al-Fatiha 7 times",
    "Practice deep breathing with 'Astaghfirullah'",
    "Seek professional help if anxiety persists"
  ],
  success: [
    "Begin every project with 'Bismillah'",
    "Set SMART goals aligned with Islamic values",
    "Work hard but trust in Allah's decree (Tawakkul)",
    "Help others succeed alongside your own journey",
    "Give charity (sadaqah) from your earnings"
  ]
};

// Dua recommendations for different situations
const DUA_RECOMMENDATIONS = {
  patience: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana (Our Lord, pour upon us patience and plant firmly our feet)",
  guidance: "Rabbana la tuzigh qulubana ba'd idh hadaytana (Our Lord, let not our hearts deviate after You have guided us)",
  success: "Rabbi a'inni wa la tu'in 'alayya (My Lord, help me and do not help against me)",
  anxiety: "Hasbunallahu wa ni'mal wakeel (Allah is sufficient for us, and He is the best disposer of affairs)",
  change: "Allahumma ahyini ma kanat al-hayatu khayran li (O Allah, keep me alive as long as life is good for me)",
  family: "Rabbi aw zi'ni an ashkura ni'mataka (My Lord, enable me to be grateful for Your favor)"
};

export class QuranEngine {
  private verses: QuranVerse[] = [];
  private thematicCollections: Map<string, ThematicCollection> = new Map();

  constructor(verses: QuranVerse[]) {
    this.verses = verses;
    this.buildThematicCollections();
  }

  /**
   * Find verses that match a specific goal or theme
   */
  findMatchingVerses(goalTitle: string, goalDescription: string = '', category: string = ''): GoalMatchResult[] {
    const searchText = `${goalTitle} ${goalDescription} ${category}`.toLowerCase();
    const matches: GoalMatchResult[] = [];

    for (const verse of this.verses) {
      const score = this.calculateRelevanceScore(searchText, verse);
      if (score > 0.3) { // Minimum relevance threshold
        matches.push({
          verse,
          relevanceScore: score,
          practicalSteps: this.generatePracticalSteps(verse.theme, goalTitle),
          duaRecommendation: this.getDuaRecommendation(verse.theme),
          relatedHabits: this.getRelatedHabits(verse.theme)
        });
      }
    }

    return matches.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3);
  }

  /**
   * Get verses by specific theme
   */
  getVersesByTheme(theme: string): QuranVerse[] {
    return this.verses.filter(verse => 
      verse.theme.some(t => t.toLowerCase().includes(theme.toLowerCase()))
    );
  }

  /**
   * Get a random verse for daily inspiration
   */
  getDailyVerse(date: Date = new Date()): QuranVerse {
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const index = dayOfYear % this.verses.length;
    return this.verses[index];
  }

  /**
   * Get contextual guidance based on user's current challenges
   */
  getContextualGuidance(challenges: string[]): {
    verses: QuranVerse[];
    practicalAdvice: string[];
    recommendedDuas: string[];
  } {
    const relevantVerses: QuranVerse[] = [];
    const practicalAdvice: string[] = [];
    const recommendedDuas: string[] = [];

    for (const challenge of challenges) {
      const matchingVerses = this.findVersesByKeywords(challenge);
      relevantVerses.push(...matchingVerses.slice(0, 2));

      // Add practical advice
      const theme = this.identifyTheme(challenge);
      if (PRACTICAL_GUIDANCE[theme]) {
        practicalAdvice.push(...PRACTICAL_GUIDANCE[theme].slice(0, 3));
      }

      // Add dua recommendations
      if (DUA_RECOMMENDATIONS[theme]) {
        recommendedDuas.push(DUA_RECOMMENDATIONS[theme]);
      }
    }

    return {
      verses: this.removeDuplicates(relevantVerses),
      practicalAdvice: this.removeDuplicates(practicalAdvice),
      recommendedDuas: this.removeDuplicates(recommendedDuas)
    };
  }

  /**
   * Get thematic collection for structured learning
   */
  getThematicCollection(theme: string): ThematicCollection | null {
    return this.thematicCollections.get(theme) || null;
  }

  /**
   * Search verses by keywords
   */
  searchVerses(query: string): QuranVerse[] {
    const keywords = query.toLowerCase().split(' ');
    return this.verses.filter(verse => {
      const searchableText = `${verse.text_en} ${verse.reflection} ${verse.theme.join(' ')}`.toLowerCase();
      return keywords.some(keyword => searchableText.includes(keyword));
    });
  }

  // Private helper methods

  private calculateRelevanceScore(searchText: string, verse: QuranVerse): number {
    let score = 0;
    const searchWords = searchText.split(' ').filter(word => word.length > 2);

    // Check theme matches
    for (const theme of verse.theme) {
      if (searchWords.some(word => theme.toLowerCase().includes(word))) {
        score += 0.8;
      }
    }

    // Check keyword matches in themes
    for (const [themeKey, keywords] of Object.entries(THEME_KEYWORDS)) {
      if (verse.theme.includes(themeKey)) {
        for (const keyword of keywords) {
          if (searchWords.some(word => keyword.includes(word) || word.includes(keyword))) {
            score += 0.6;
          }
        }
      }
    }

    // Check text matches
    const verseText = `${verse.text_en} ${verse.reflection}`.toLowerCase();
    for (const word of searchWords) {
      if (verseText.includes(word)) {
        score += 0.4;
      }
    }

    return Math.min(score, 1.0); // Cap at 1.0
  }

  private generatePracticalSteps(themes: string[], goalTitle: string): string[] {
    const steps: string[] = [];
    
    for (const theme of themes) {
      if (PRACTICAL_GUIDANCE[theme]) {
        steps.push(...PRACTICAL_GUIDANCE[theme].slice(0, 2));
      }
    }

    // Add goal-specific steps
    if (goalTitle.toLowerCase().includes('prayer')) {
      steps.push("Set a consistent prayer schedule", "Find a quiet prayer space");
    } else if (goalTitle.toLowerCase().includes('quran')) {
      steps.push("Read one page of Quran daily", "Learn the meaning of what you read");
    } else if (goalTitle.toLowerCase().includes('health')) {
      steps.push("Make dua for good health", "Follow Islamic dietary guidelines");
    }

    return this.removeDuplicates(steps).slice(0, 4);
  }

  private getDuaRecommendation(themes: string[]): string | undefined {
    for (const theme of themes) {
      if (DUA_RECOMMENDATIONS[theme]) {
        return DUA_RECOMMENDATIONS[theme];
      }
    }
    return DUA_RECOMMENDATIONS.guidance; // Default
  }

  private getRelatedHabits(themes: string[]): string[] {
    const habits: string[] = [];
    
    if (themes.includes('prayer')) {
      habits.push('Daily 5 prayers', 'Morning dhikr', 'Evening dua');
    }
    if (themes.includes('patience')) {
      habits.push('Daily istighfar', 'Meditation', 'Gratitude journaling');
    }
    if (themes.includes('family')) {
      habits.push('Family time', 'Call parents', 'Help with chores');
    }
    
    return habits;
  }

  private findVersesByKeywords(challenge: string): QuranVerse[] {
    const theme = this.identifyTheme(challenge);
    return this.getVersesByTheme(theme);
  }

  private identifyTheme(text: string): string {
    const lowerText = text.toLowerCase();
    
    for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return theme;
      }
    }
    
    return 'guidance'; // Default theme
  }

  private buildThematicCollections(): void {
    const themes = Object.keys(THEME_KEYWORDS);
    
    for (const theme of themes) {
      const themeVerses = this.getVersesByTheme(theme);
      if (themeVerses.length > 0) {
        this.thematicCollections.set(theme, {
          theme,
          description: this.getThemeDescription(theme),
          verses: themeVerses,
          practicalGuidance: PRACTICAL_GUIDANCE[theme] || [],
          recommendedActions: this.getRecommendedActions(theme)
        });
      }
    }
  }

  private getThemeDescription(theme: string): string {
    const descriptions = {
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
    const actions = {
      patience: ["Practice daily dhikr", "Read stories of prophets", "Join Islamic study groups"],
      prayer: ["Attend mosque regularly", "Learn prayer meanings", "Make personal duas"],
      change: ["Set Islamic goals", "Find Muslim mentors", "Track spiritual progress"]
    };
    return actions[theme] || ["Seek Islamic knowledge", "Practice daily", "Connect with community"];
  }

  private removeDuplicates<T>(array: T[]): T[] {
    return [...new Set(array)];
  }
}

// Factory function to create QuranEngine with enhanced data
export function createQuranEngine(basicVerses: any[]): QuranEngine {
  const enhancedVerses: QuranVerse[] = basicVerses.map(verse => ({
    ...verse,
    practical_guidance: generatePracticalGuidance(verse.theme),
    life_application: generateLifeApplication(verse.theme, verse.text_en),
    context: generateContext(verse.surah, verse.ayah)
  }));

  return new QuranEngine(enhancedVerses);
}

function generatePracticalGuidance(themes: string[]): string[] {
  const guidance: string[] = [];
  for (const theme of themes) {
    if (PRACTICAL_GUIDANCE[theme]) {
      guidance.push(...PRACTICAL_GUIDANCE[theme].slice(0, 2));
    }
  }
  return guidance;
}

function generateLifeApplication(themes: string[], verseText: string): string {
  if (themes.includes('patience')) {
    return "Apply this when facing delays, difficulties, or when learning new skills.";
  } else if (themes.includes('prayer')) {
    return "Incorporate this understanding into your daily worship routine.";
  } else if (themes.includes('change')) {
    return "Use this guidance when setting personal development goals.";
  }
  return "Reflect on this verse during your daily activities and decision-making.";
}

function generateContext(surah: string, ayah: number): string {
  // This could be expanded with actual historical context data
  return `This verse from ${surah} provides timeless guidance applicable to modern life challenges.`;
} 