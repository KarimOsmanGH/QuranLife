# QuranLife

**Personal growth with Quran**

QuranLife is a Progressive Web App (PWA) built with Next.js 14, TypeScript, and Tailwind CSS that combines personal development with Islamic guidance. Track your daily habits, set meaningful goals, and receive daily Quranic inspiration with intelligent verse matching.

## ✨ Features

### 🚀 **Core Features**
- **📊 Daily Habit Tracking**: Track 5 daily prayers, Quran reading, and custom habits
- **📖 Smart Quranic Guidance**: Live API access to complete Quran with Arabic text, English translation, reflections, and practical guidance
- **🎯 Intelligent Goal Management**: Set and manage life goals with AI-powered verse matching from all 6,236 Quranic verses
- **📈 Progress Dashboard**: Visual progress tracking with responsive two-column layout
- **💾 Secure Local Storage**: All personal data stored safely in your browser with encryption
- **📤 Data Export**: Export all your data as JSON for backup or transfer
- **📱 PWA Support**: Install as an app on your device with offline functionality

### 🧠 **Smart Features**
- **🤖 SmartGuidance AI**: Click 📖 next to any goal for personalized Quranic guidance from live API
- **🎯 Intelligent Verse Search**: Real-time verse matching from the complete Quran using AlQuran.cloud API
- **📋 Practical Action Steps**: Each verse includes actionable spiritual and practical guidance
- **🤲 Dua Recommendations**: Suggested prayers (duas) for achieving your goals
- **🔄 Related Habit Suggestions**: Discover relevant Islamic practices for your goals
- **📤 Data Export**: Simple one-click export of all your data for backup or transfer
- **⚡ Smart Caching**: Intelligent caching system for improved performance and offline support

### 🎨 **Design & UX**
- **🌈 Consistent Green-Blue Theme**: Islamic colors throughout the app
- **📱 Responsive Design**: Desktop two-column, mobile single-column layouts
- **⚡ Smooth Animations**: Framer Motion transitions for delightful interactions
- **🎯 Clean Navigation**: Simplified header and footer navigation
- **🌙 Accessibility**: High contrast, readable fonts, semantic HTML

### 🔒 **Security & Privacy**
- **🛡️ Content Security Policy**: Advanced XSS protection
- **🔐 Input Validation**: All user inputs sanitized and validated
- **💾 Secure Storage**: Safe localStorage operations with error handling
- **🚫 No Tracking**: Zero analytics, cookies, or user tracking
- **🌐 Offline-First**: Works completely offline after first load

### 🏗️ **Tech Stack**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom green-blue theme
- **UI Components**: ShadCN UI with Framer Motion animations
- **API Integration**: AlQuran.cloud REST API for live Quranic data
- **PWA**: Progressive Web App with service worker
- **Security**: CSP headers, input validation, secure storage utilities
- **SEO**: Complete meta tags, Open Graph, JSON-LD structured data
- **Deployment**: Vercel-optimized with automatic builds

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KarimOsmanGH/QuranLife.git
cd quranlife
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
pnpm build
pnpm start
```

### Security Audit

```bash
pnpm run security-audit
pnpm run security-fix  # Fix vulnerabilities
pnpm run type-check    # TypeScript validation
```

## 📁 Project Structure

```
quranlife/
├── app/                          # Next.js 14 App Router
│   ├── page.tsx                 # Dashboard with responsive layout
│   ├── habits/page.tsx          # Habits tracking (two-column desktop)
│   ├── goals/page.tsx           # Goals with SmartGuidance (two-column desktop)
│   ├── settings/page.tsx        # App settings and data management
│   ├── privacy/page.tsx         # Privacy policy page
│   ├── terms/page.tsx           # Terms of service page
│   ├── layout.tsx               # Root layout with responsive navigation
│   └── globals.css              # Global styles with custom CSS variables
├── components/                   # Reusable UI components
│   ├── DashboardCard.tsx        # Card wrapper with Framer Motion
│   ├── HabitTracker.tsx         # Habit tracking with progress animations
│   ├── VerseCard.tsx            # Quranic verse display with clean design
│   ├── GoalsList.tsx            # Goals CRUD with edit/delete functionality
│   └── SmartGuidance.tsx        # AI-powered Quranic guidance component
├── lib/                         # Utilities and API integration
│   ├── utils.ts                 # Tailwind class utilities
│   ├── security.ts              # Secure storage and validation utilities
│   ├── quran-api.ts             # AlQuran.cloud API service integration
│   └── quran-engine.ts          # AI-powered verse matching and guidance engine
├── public/
│   ├── data/
│   │   └── enhanced-quran.json  # Legacy data (now using live API)
│   ├── icons/                   # PWA icons (192x192, 512x512)
│   ├── favicon.svg              # Islamic-themed SVG favicon
│   ├── manifest.json            # PWA manifest with proper config
│   ├── sw.js                    # Service worker for offline functionality
│   ├── sitemap.xml              # SEO sitemap
│   └── robots.txt               # Search engine directives
└── Configuration files
    ├── next.config.js           # Next.js with security headers
    ├── tailwind.config.js       # Custom green-blue theme
    ├── vercel.json              # Vercel deployment config
    └── package.json             # Dependencies and scripts
```

## 📊 API Integration & Data Sources

### **AlQuran.cloud API Integration**

QuranLife is powered by the exceptional [AlQuran.cloud API](https://alquran.cloud/) - a free, open-source RESTful API providing comprehensive access to the Holy Quran.

**What AlQuran.cloud Provides:**
- **Complete Quran**: Access to all 6,236 verses with authentic Arabic text
- **Multiple Translations**: Including Muhammad Asad's scholarly translation
- **Multiple Arabic Scripts**: Uthmani, Simple, and other authentic scripts
- **Audio Support**: Multiple recitations with high-quality audio files
- **Free & Open**: Educational and religious use encouraged, no authentication required
- **REST API**: Simple, reliable HTTP API with comprehensive documentation
- **Community-Driven**: Actively maintained and continuously improved

**API Service Structure (`lib/quran-api.ts`):**
```typescript
interface Verse {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  translation?: string;
  audio?: string;
}

interface RandomVerseResponse {
  verse: Verse;
  surah: Surah;
  theme?: string;
  context?: string;
}

// Core API methods
- getSurah(surahNumber): Get complete Surah with translations
- getVerse(surahNumber, verseNumber): Get specific verse with audio
- getRandomVerse(): Intelligent random verse selection
- searchVerses(query): Search across all verses
- getAllSurahs(): Get Surah metadata
- getVerseAudio(surahNumber, verseNumber): Get audio recitation URLs
```

**Enhanced QuranEngine (`lib/quran-engine.ts`):**
```typescript
// AI-powered features built on top of the API
- getDailyVerse(): Smart daily verse recommendation
- findVersesForGoal(goal): Match goals with relevant verses
- getThematicCollection(theme): Curated verse collections
- getSmartRecommendation(userGoals, habits): Personalized guidance
```

**Our Enhancement Layer:**

QuranLife builds intelligent features on top of AlQuran.cloud's robust foundation:

- **🎯 Smart Goal Matching**: AI-powered verse recommendations based on personal goals
- **🧠 Intelligent Search**: Enhanced verse discovery beyond simple text matching
- **📋 Practical Guidance**: Each verse enriched with actionable spiritual steps
- **🤲 Dua Integration**: Connected prayers and supplications for deeper practice
- **🎵 Audio Integration**: Seamless verse recitation with mobile-optimized playback
- **⚡ Performance Optimization**: Smart caching and offline fallbacks
- **🎨 Beautiful UI**: Clean, Islamic-themed interface for better user experience

**Caching & Performance:**
- Intelligent 5-minute cache for frequently accessed verses
- Fallback verses for offline scenarios
- Rate limiting and error handling
- Optimized API calls to reduce latency

### **Translation & Audio Sources**

**English Translation:** Muhammad Asad's "The Message of the Qur'an", known for its scholarly approach and comprehensive commentary, providing contextual understanding for modern readers.

**Audio Recitations:** High-quality recitations from AlQuran.cloud's audio collection, featuring renowned Qari recitations with mobile-optimized playback.

### **For Comprehensive Quranic Study**

While QuranLife focuses on practical spiritual development, for complete Quranic study we recommend:
- **[AlQuran.cloud](https://alquran.cloud/)** - The API that powers our app
- **[Quran.com](https://quran.com/)** - Comprehensive online Quran platform
- **[Tanzil.net](https://tanzil.net/)** - Various Quranic texts and translations
- **Qualified Islamic Scholars** - For proper interpretation and guidance
- **Local Islamic Centers** - For community learning and support

### **Open Source Appreciation**

We're grateful to the AlQuran.cloud team for providing this invaluable service to the global Muslim community. Their commitment to making Quranic content freely accessible enables projects like QuranLife to focus on innovative applications while building on solid, authentic foundations.

### Data Interfaces

#### Habits Interface
```typescript
interface Habit {
  id: string;
  name: string;
  completed: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastCompleted?: string;
  streak: number;
  completionHistory: Record<string, boolean>;
  icon?: string;
}
```

#### Goals Interface
```typescript
interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}
```

## 🚀 Deployment

### Live Demo
- **Production**: [https://quranlife.vercel.app](https://quranlife.vercel.app)
- **Repository**: [https://github.com/KarimOsmanGH/QuranLife](https://github.com/KarimOsmanGH/QuranLife)

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

The app is configured with:
- Automatic builds on push
- PWA manifest serving
- Static file optimization
- Security headers
- SEO optimization

### Other Platforms

The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security & Privacy

QuranLife is built with security and privacy as top priorities:

### 🛡️ **Security Features**
- **Content Security Policy (CSP)**: Prevents XSS attacks and code injection
- **Input Validation**: All user inputs are sanitized and validated using secure utilities
- **Safe Storage**: Secure localStorage operations with error handling (`lib/security.ts`)
- **Rate Limiting**: API calls are rate-limited to prevent abuse
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **No External Dependencies**: All data stays on your device

### 🛡️ **Privacy Protection**
- **Local-Only Storage**: No data sent to external servers
- **No Tracking**: No analytics, cookies, or user tracking
- **No Authentication**: No personal information required
- **Offline-First**: Works completely offline after first load
- **Zero Data Collection**: We don't collect, store, or process any personal data

### 🔍 **Security Audit**
- ✅ No critical vulnerabilities (npm audit clean)
- ✅ Dependencies regularly updated
- ✅ TypeScript for type safety
- ✅ Input sanitization implemented
- ✅ Error handling throughout
- ✅ Secure storage utilities
- ✅ CSP headers configured

## 📚 Data Sources & Acknowledgments

### **AlQuran.cloud API**

QuranLife is powered by the exceptional [AlQuran.cloud API](https://alquran.cloud/) - a free, open-source RESTful API providing comprehensive access to the Holy Quran.

**What AlQuran.cloud Provides:**
- **Complete Quran**: Access to all 6,236 verses with authentic Arabic text
- **Multiple Translations**: Including Muhammad Asad's scholarly translation
- **Multiple Arabic Scripts**: Uthmani, Simple, and other authentic scripts
- **Audio Support**: Multiple recitations with high-quality audio files
- **Free & Open**: Educational and religious use encouraged, no authentication required
- **REST API**: Simple, reliable HTTP API with comprehensive documentation
- **Community-Driven**: Actively maintained and continuously improved

**API Service Structure (`lib/quran-api.ts`):**
```typescript
interface Verse {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  translation?: string;
  audio?: string;
}

interface RandomVerseResponse {
  verse: Verse;
  surah: Surah;
  theme?: string;
  context?: string;
}

// Core API methods
- getSurah(surahNumber): Get complete Surah with translations
- getVerse(surahNumber, verseNumber): Get specific verse with audio
- getRandomVerse(): Intelligent random verse selection
- searchVerses(query): Search across all verses
- getAllSurahs(): Get Surah metadata
- getVerseAudio(surahNumber, verseNumber): Get audio recitation URLs
```

**Enhanced QuranEngine (`lib/quran-engine.ts`):**
```typescript
// AI-powered features built on top of the API
- getDailyVerse(): Smart daily verse recommendation
- findVersesForGoal(goal): Match goals with relevant verses
- getThematicCollection(theme): Curated verse collections
- getSmartRecommendation(userGoals, habits): Personalized guidance
```

**Our Enhancement Layer:**

QuranLife builds intelligent features on top of AlQuran.cloud's robust foundation:

- **🎯 Smart Goal Matching**: AI-powered verse recommendations based on personal goals
- **🧠 Intelligent Search**: Enhanced verse discovery beyond simple text matching
- **📋 Practical Guidance**: Each verse enriched with actionable spiritual steps
- **🤲 Dua Integration**: Connected prayers and supplications for deeper practice
- **🎵 Audio Integration**: Seamless verse recitation with mobile-optimized playback
- **⚡ Performance Optimization**: Smart caching and offline fallbacks
- **🎨 Beautiful UI**: Clean, Islamic-themed interface for better user experience

**Caching & Performance:**
- Intelligent 5-minute cache for frequently accessed verses
- Fallback verses for offline scenarios
- Rate limiting and error handling
- Optimized API calls to reduce latency

### **Translation & Audio Sources**

**English Translation:** Muhammad Asad's "The Message of the Qur'an", known for its scholarly approach and comprehensive commentary, providing contextual understanding for modern readers.

**Audio Recitations:** High-quality recitations from AlQuran.cloud's audio collection, featuring renowned Qari recitations with mobile-optimized playback.

### **For Comprehensive Quranic Study**

While QuranLife focuses on practical spiritual development, for complete Quranic study we recommend:
- **[AlQuran.cloud](https://alquran.cloud/)** - The API that powers our app
- **[Quran.com](https://quran.com/)** - Comprehensive online Quran platform
- **[Tanzil.net](https://tanzil.net/)** - Various Quranic texts and translations
- **Qualified Islamic Scholars** - For proper interpretation and guidance
- **Local Islamic Centers** - For community learning and support

### **Open Source Appreciation**

We're grateful to the AlQuran.cloud team for providing this invaluable service to the global Muslim community. Their commitment to making Quranic content freely accessible enables projects like QuranLife to focus on innovative applications while building on solid, authentic foundations.

### Data Interfaces

#### Habits Interface
```typescript
interface Habit {
  id: string;
  name: string;
  completed: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastCompleted?: string;
  streak: number;
  completionHistory: Record<string, boolean>;
  icon?: string;
}
```

#### Goals Interface
```typescript
interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}
```

## 🕌 Islamic Principles

This app is built with Islamic values in mind:

- **Intention (Niyyah)**: Every feature encourages sincere intention
- **Consistency**: Small, consistent actions over sporadic efforts  
- **Balance**: Focus on both worldly life (dunya) and hereafter (akhirah)
- **Trust in Allah (Tawakkul)**: Plan and work, then trust in Allah's decree
- **Gratitude**: Daily reflection and appreciation
- **Privacy**: Respects user privacy as an Islamic principle
- **Knowledge**: Integration of Quranic wisdom with practical action

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 🚀 Future Enhancements

- **📅 Advanced Calendar Integration**: Google/Outlook sync for prayer times
- **☁️ Cloud Sync**: Optional Supabase/Firebase integration
- **📊 Advanced Analytics**: Streak tracking and habit insights
- **👥 Community Features**: Share goals and achievements (with privacy)
- **🌍 Multiple Languages**: Arabic, Urdu, Turkish, French support
- **🔔 Smart Notifications**: Prayer time reminders and goal nudges
- **🎯 Advanced Goal Templates**: Pre-built Islamic development paths

## 👨‍💻 Author & License

**Created by:** [Karim Osman](https://kar.im)

MIT License - feel free to use this project for personal or commercial purposes.

## 🤲 Duas for Success

*"Rabbana atina fi'd-dunya hasanatan wa fi'l-akhirati hasanatan wa qina 'adhab an-nar"*

*Our Lord, give us good in this world and good in the hereafter, and save us from the punishment of the Fire.*

---

**Personal growth with Quran** 🌱📖✨

May Allah accept your efforts and make this app a means of drawing closer to Him. 🤲 