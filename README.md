# Peace of Mind 🧠💙

Your personal mental health companion with memory - an AI-powered app that remembers your conversations and provides personalized support.

## Features ✨

- **🤖 AI-Powered Conversations**: Powered by Google's Gemini 2.5 Flash AI for empathetic and understanding responses
- **🧠 Memory System**: Remembers your previous conversations and learns from them
- **� Notes & Tasks**: Integrated notes system that AI can reference during conversations
- **�💾 Persistent Storage**: All conversations, notes, and tasks saved locally on your device
- **📱 Cross-Platform**: Works on Android, iOS, and web
- **🎨 Beautiful UI**: Stunning dark-themed interface with dramatic red background and smooth animations
- **🔒 Privacy First**: All data stored locally on your device
- **⚡ Optimized Performance**: GPU-accelerated animations with Material Design principles

## Tech Stack 🛠️

- **Frontend**: React + TypeScript
- **UI Framework**: Ionic React
- **Mobile**: Capacitor
- **AI**: Google Gemini API
- **Storage**: Capacitor Preferences (Local Storage)
- **Build Tool**: Vite

## Getting Started 🚀

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)
- Google Gemini API key (get one at https://makersuite.google.com/app/apikey)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/RitamRoa/JalRakshak.git
cd "Peace of mind"
```

2. Install dependencies:

```bash
npm install
```

3. Configure API Key:

Open `src/services/gemini.ts` and add your Gemini API key, or create a `.env` file:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm start
```

5. Open your browser to `http://localhost:5173`

### Building for Mobile 📱

#### Android

1. Build the web assets:

```bash
npm run build
```

2. Sync with Capacitor:

```bash
npm run sync
```

3. Open Android Studio:

```bash
npm run android
```

4. Connect your device via USB (enable USB debugging)
5. Run the app from Android Studio

Or use the copy command:

```bash
npm run copy:android
npx cap copy android
```

#### iOS (macOS only)

```bash
npm run ios
```

## Project Structure 📁

```
peace-of-mind/
├── src/
│   ├── pages/              # App pages
│   │   ├── Home.tsx        # Home screen with features
│   │   ├── Home.css        # Home page styles
│   │   ├── Chat.tsx        # AI chat interface
│   │   ├── Chat.css        # Chat page styles with animations
│   │   ├── Notes.tsx       # Notes & tasks management
│   │   ├── Notes.css       # Notes page styles
│   │   ├── History.tsx     # Conversation history
│   │   └── History.css     # History page styles
│   ├── services/           # Core services
│   │   ├── gemini.ts       # Gemini AI integration with context
│   │   └── storage.ts      # Local storage service
│   ├── theme/              # Theming
│   │   └── variables.css   # CSS custom properties
│   ├── App.tsx             # Main app component with routing
│   ├── App.css             # Global app styles
│   ├── index.css           # Root styles and theme
│   └── main.tsx            # Entry point
├── public/                 # Static assets
│   ├── bg.jpg              # Dramatic red background image
│   └── icon.svg            # App icon
├── capacitor.config.ts     # Capacitor configuration
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Key Features Explained 🔑

### Memory System

The app implements a sophisticated memory system that:

- Stores all conversation history locally using Capacitor Preferences
- Builds context from previous conversations automatically
- Tracks user challenges, patterns, and preferences
- Provides personalized responses based on accumulated knowledge
- Single continuous chat session (no duplicates)

### Notes & Tasks Integration

The Notes feature allows you to:

- Create and manage personal notes
- Add tasks within notes with checkbox completion
- Have the AI reference your notes during conversations
- Notes are automatically loaded into AI context before each message
- Perfect for tracking goals, triggers, coping strategies

### AI Context System

The Gemini AI maintains context by:

- Loading all notes and tasks before each message
- Remembering the entire conversation history
- Understanding your personal situation and preferences
- Providing increasingly personalized support over time
- Refreshing context automatically to stay current

### Smooth Animations

All UI elements feature subtle, professional animations:

- **Material Design timing**: cubic-bezier(0.4, 0, 0.2, 1) easing
- **Page entrances**: Headers slide down, footers slide up
- **Staggered reveals**: Content fades in sequentially
- **Interactive feedback**: Hover lifts, focus glows, active scales
- **GPU-accelerated**: 60 FPS performance using transform properties

## API Configuration 🔐

The Gemini API key is currently hardcoded in `src/services/gemini.ts`. For production:

1. Create a `.env` file:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

2. Update `gemini.ts` to use the environment variable:

```typescript
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

## Available Scripts 📝

- `npm start` - Start development server (Vite)
- `npm run dev` - Alternative dev server command
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run android` - Open project in Android Studio
- `npm run ios` - Open project in Xcode
- `npm run sync` - Sync web assets with mobile platforms
- `npm run copy:android` - Copy web assets to Android platform

## Design & Theme 🎨

The app features a modern dark theme with:

- **Background**: Dramatic red gun silhouette with 8px blur overlay
- **Primary Color**: Deep navy (#1a1d2e)
- **Accent Color**: Pink (#e94560) for interactive elements
- **Typography**: SF Pro Display/Text (Apple system fonts)
- **Glass Morphism**: Frosted glass effects with backdrop-filter
- **Shadows**: Layered shadows for depth
- **Contrast**: Optimized for readability on dark backgrounds

## Privacy & Security 🔒

- All conversations are stored locally on your device
- No data is sent to external servers except Gemini API calls
- API calls only contain conversation content, no personal identifiers
- You can clear all data at any time from the app

## Mobile Optimization 📱

The app is fully optimized for mobile with:

- **Responsive Design**: Adapts to all screen sizes
- **Touch Optimizations**: Smooth scrolling and touch feedback
- **Mobile Viewport**: Proper viewport configuration
- **Performance**: GPU-accelerated animations
- **Android Compatible**: Tested and optimized for Android devices

## Troubleshooting 🔧

### Development Server Issues

If the server doesn't start:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### API Key Issues

Make sure your Gemini API key is valid and has the proper permissions. Get one at: https://makersuite.google.com/app/apikey

### Build Issues

If builds fail, check that all dependencies are properly installed and your Node.js version is 18+.

## Support 💬

This app is designed for mental health support but is NOT a replacement for professional help. If you're experiencing a mental health crisis, please:

- Call 988 (Suicide & Crisis Lifeline) in the US
- Contact your local emergency services
- Reach out to a mental health professional

## License 📄

MIT License - Feel free to use and modify for personal use.

## Contributing 🤝

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## Author 👤

**Ritam Roa**

- GitHub: [@RitamRoa](https://github.com/RitamRoa)
- Repository: [JalRakshak](https://github.com/RitamRoa/JalRakshak)

---

Built with ❤️ for mental health awareness

**Note**: This project was created with assistance from AI to implement best practices in React, TypeScript, and mobile development.
