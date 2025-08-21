# QuranLife

**Personal growth with Quran**

QuranLife is a Progressive Web App (PWA) built with Next.js 14, TypeScript, and Tailwind CSS that combines personal development with Islamic guidance. Track your daily habits, set meaningful goals, and receive daily Quranic inspiration with intelligent verse matching.

## ✨ Features

### 🚀 **Core Features**
- **📊 Daily Habit Tracking**: Track 5 daily prayers, Quran reading, and custom habits
- **📖 Smart Quranic Guidance**: Daily verses with Arabic text, English translation, reflections, and practical guidance
- **🎯 Intelligent Goal Management**: Set and manage life goals with AI-powered Quranic verse matching
- **📈 Progress Dashboard**: Visual progress tracking with responsive two-column layout
- **💾 Secure Local Storage**: All data stored safely in your browser with encryption
- **📱 PWA Support**: Install as an app on your device with offline functionality

### 🧠 **Smart Features**
- **🤖 SmartGuidance AI**: Click 📖 next to any goal for personalized Quranic guidance
- **🎯 Intelligent Verse Matching**: Goals automatically matched with relevant Quranic wisdom
- **📋 Practical Action Steps**: Each verse includes actionable spiritual and practical guidance
- **🤲 Dua Recommendations**: Suggested prayers (duas) for achieving your goals
- **🔄 Related Habit Suggestions**: Discover relevant Islamic practices for your goals

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
├── lib/                         # Utilities and security
│   ├── utils.ts                 # Tailwind class utilities
│   └── security.ts              # Secure storage and validation utilities
├── public/
│   ├── data/
│   │   └── enhanced-quran.json  # 20+ verses with practical guidance
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

## 📊 Data Structure

### Enhanced Quranic Verses (`public/data/enhanced-quran.json`)

**Data Sources & Attribution:**
- Quranic verses from widely accepted translations
- English translations based on established scholarly works
- Arabic text following standard Uthmani script
- Enhanced with practical guidance, life applications, and dua connections
- Thematic organization for intelligent goal matching

### Structure
```json
{
  "verses": [
    {
      "id": 1,
      "surah": "Al-Baqarah",
      "surah_number": 2,
      "ayah": 286,
      "text_ar": "Arabic text",
      "text_en": "English translation",
      "theme": ["Patience", "Strength"],
      "reflection": "Personal reflection text",
      "practical_guidance": [
        "Take small, consistent steps toward your goals",
        "Set realistic deadlines and expectations"
      ],
      "life_application": "Real-world scenarios and examples",
      "dua_connection": "Related prayers and supplications"
    }
  ],
  "themes": {
    "Patience": {
      "description": "Building patience through faith",
      "practical_steps": ["Practice gratitude", "Focus on process"],
      "related_habits": ["Morning dhikr", "Evening reflection"]
    }
  }
}
```

### Habits Interface
```typescript
interface Habit {
  id: string;
  name: string;
  completed: boolean;
  icon?: string;
}
```

### Goals Interface
```typescript
interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
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

**Quranic Universal Library (QUL)**

We acknowledge and appreciate the comprehensive [Quranic Universal Library (QUL)](https://github.com/TarteelAI/quranic-universal-library) by TarteelAI, which is an exceptional resource for Quranic data management. QUL provides:

- Comprehensive Quranic translations and tafsirs
- Audio management with multiple recitations
- Arabic scripts in various styles
- Mushaf layouts and typography
- Quranic grammar and morphology data
- Multi-language support
- Community-driven content management

*License: MIT License - Available at [qul.tarteel.ai](https://qul.tarteel.ai/)*

**Our Implementation**

QuranLife uses carefully curated Quranic content that focuses on practical spiritual guidance and personal development. Our enhanced data includes:

- 20+ selected verses with English translations from established scholarly works
- Arabic text following standard Uthmani script
- **Practical guidance** with actionable steps for personal growth
- **Life applications** with real-world scenarios and examples
- **Dua connections** linking verses to relevant prayers
- **Thematic organization** for intelligent goal-verse matching
- **SmartGuidance AI** for personalized spiritual guidance

For comprehensive Quranic study, we recommend:
- Visiting [QUL's official site](https://qul.tarteel.ai/) for complete resources
- Consulting qualified Islamic scholars
- Using established platforms like Quran.com, Tanzil.net
- Connecting with local Islamic centers and mosques

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

## 📱 Screenshots & Demo

Visit [https://quranlife.vercel.app](https://quranlife.vercel.app) to see QuranLife in action!

**Key Features to Try:**
1. 📊 **Dashboard**: See your habit progress and daily Quranic guidance
2. 🎯 **Smart Goals**: Add a goal and click the 📖 icon for personalized Quranic guidance
3. 🕌 **Habit Tracking**: Track your daily Islamic practices
4. 📱 **Mobile PWA**: Install the app on your phone for offline access

## 🤲 Duas for Success

*"Rabbana atina fi'd-dunya hasanatan wa fi'l-akhirati hasanatan wa qina 'adhab an-nar"*

*Our Lord, give us good in this world and good in the hereafter, and save us from the punishment of the Fire.*

---

**Personal growth with Quran** 🌱📖✨

May Allah accept your efforts and make this app a means of drawing closer to Him. 🤲 