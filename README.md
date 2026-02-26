[English](#) | [简体中文](README_CN.md)

# AI Labor Tracker

> A browser extension for tracking and quantifying the labor value of AI interactions

## 📖 Introduction

AI Labor Tracker is an innovative browser extension designed to help users track, record, and quantify interaction data with AI assistants (such as DeepSeek, ChatGPT, Claude, Kimi, Qianwen, Doubao, Tiangong, and more). By estimating token consumption and corresponding labor value, this project provides foundational data support for establishing an AI labor credential system.

### 🎯 Vision

In the AI era, human-machine collaboration has become the norm. This project is dedicated to:
- **Quantifying AI Labor**: Converting AI interactions into measurable labor credentials
- **Improving Transparency**: Helping users understand the true cost and value of AI usage
- **Data Sovereignty**: Ensuring users maintain complete control over their interaction data
- **Promoting Fairness**: Providing data foundation for future AI labor value distribution

## ✨ Features

### Core Features
- 🔍 **Automatic Tracking**: Automatically detect and record conversations with AI platforms
- 📊 **Token Statistics**: Precisely count input/output token quantities
- 💰 **Cost Estimation**: Estimate API usage costs based on each platform's pricing
- 👷 **Labor Value Calculation**: Convert AI output into equivalent human labor value
- 📈 **Data Visualization**: Intuitively display usage trends and statistical charts
- 🌐 **Multi-language UI**: Support for English and Chinese (中文) interface

### Supported AI Platforms

#### International Platforms
| Platform | Website | Status |
|----------|---------|--------|
| DeepSeek | chat.deepseek.com | ✅ Supported |
| ChatGPT | chatgpt.com | ✅ Supported |
| Claude | claude.ai | ✅ Supported |

#### China's Mainstream AI Platforms
| Platform | Chinese Name | Website | Status |
|----------|--------------|---------|--------|
| Kimi | Kimi (月之暗面) | kimi.moonshot.cn | ✅ Supported |
| Qianwen | 通义千问 | tongyi.aliyun.com | ✅ Supported |
| Doubao | 豆包 | doubao.com | ✅ Supported |
| Tiangong | 天工 | tiangong.cn | ✅ Supported |

> The extension architecture is designed to be extensible, making it easy to add support for additional platforms.

### Data Management
- 📁 **Local Storage**: All data is securely stored locally to protect privacy
- 📤 **Data Export**: Support for JSON and CSV format exports
- 🗑️ **Data Cleanup**: Flexible data retention policy settings
- 🔍 **Record Search**: Filter records by platform, model, date, and more

## 🚀 Installation Guide

### Requirements
- Node.js 18.0 or higher
- pnpm, npm, or yarn package manager
- Microsoft Edge or Google Chrome browser

### Development Installation

1. **Clone the repository**
```bash
git clone https://github.com/bao1979/ai-labor-tracker.git
cd ai-labor-tracker
```

2. **Install dependencies**
```bash
# Using npm
npm install

# Or using pnpm
pnpm install

# Or using yarn
yarn install
```

3. **Run in development mode**
```bash
npm run dev
```

4. **Build production version**
```bash
npm run build
```

### Load Extension into Browser

#### Microsoft Edge
1. Open `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the project's `dist` directory

#### Google Chrome
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the project's `dist` directory

## 📖 Usage Guide

### Basic Usage

1. **Enable Tracking**
   - Click the extension icon in the browser toolbar
   - Ensure tracking is enabled in the settings page

2. **Have AI Conversations**
   - Use any supported AI platform for conversations as normal
   - The extension will automatically record interaction data in the background

3. **View Statistics**
   - Click the extension icon to open the popup window
   - View today/week/month statistics on the "Overview" page
   - View detailed interaction history on the "Records" page

4. **Export Data**
   - Click the export button on the "Settings" page
   - Choose JSON or CSV format to download your data

### Language Settings

The extension supports both English and Chinese interfaces:
1. Click the extension icon to open the popup
2. Go to the "Settings" tab
3. Find the "Language" option
4. Select your preferred language (English / 中文)

### Configuration Options

| Setting | Description |
|---------|-------------|
| Enable Capture | Global switch to control whether interactions are recorded |
| Platform Selection | Select which AI platforms to track |
| Data Retention Days | Set the automatic cleanup period for historical data |
| Language | Switch between English and Chinese interface |

## 🏗️ Technical Architecture

### Tech Stack
- **Build Tool**: [Vite](https://vitejs.dev/) - Next-generation frontend build tool
- **Frontend Framework**: [React 18](https://react.dev/) - User interface library
- **Development Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Extension Framework**: [CRXJS](https://crxjs.dev/vite-plugin/) - Vite plugin for browser extensions
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Data Visualization**: [Recharts](https://recharts.org/) - React charting library
- **Local Database**: [Dexie.js](https://dexie.org/) - IndexedDB wrapper library

### Extension Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Browser Extension Architecture               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Content    │    │ Background  │    │   Popup     │     │
│  │  Scripts    │───>│  Service    │<───│    UI       │     │
│  │             │    │   Worker    │    │             │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│        │                   │                  │             │
│        │                   │                  │             │
│        v                   v                  v             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              IndexedDB (Dexie.js)                   │   │
│  │  - LaborRecords  - Sessions  - DailyStats          │   │
│  │  - Settings      - Preferences                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Content Script**: Injected into target web pages to capture AI conversation content
2. **Background Service Worker**: Handles messages and manages data storage
3. **Popup UI**: Displays statistics and settings interface
4. **IndexedDB**: Persistently stores all data

## 📁 Directory Structure

```
ai-labor-tracker/
├── public/
│   └── icons/                 # Extension icon resources
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
├── src/
│   ├── background/           # Background service worker
│   │   └── index.ts         # Message handling and data management
│   ├── content/             # Content scripts
│   │   ├── deepseek.ts      # DeepSeek platform adapter
│   │   ├── kimi.ts          # Kimi platform adapter
│   │   ├── qianwen.ts       # Qianwen platform adapter
│   │   ├── doubao.ts        # Doubao platform adapter
│   │   └── tiangong.ts      # Tiangong platform adapter
│   ├── popup/               # Popup window UI
│   │   ├── components/      # React components
│   │   ├── i18n/            # Internationalization (i18n)
│   │   │   └── locales/     # Language files (en.ts, zh.ts)
│   │   ├── App.tsx          # Main application component
│   │   ├── main.tsx         # Entry file
│   │   ├── index.html       # HTML template
│   │   └── styles.css       # Global styles
│   ├── storage/             # Data storage layer
│   │   ├── db.ts            # Dexie database definition
│   │   └── index.ts         # Storage API
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── export.ts        # Data export
│   │   ├── pricing.ts       # Price calculation
│   │   ├── tokens.ts        # Token estimation
│   │   └── index.ts
│   └── vite-env.d.ts
├── manifest.json             # Extension manifest file
├── manifest.config.ts        # Manifest configuration
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── README.md                 # English documentation
└── README_CN.md              # Chinese documentation
```

## 🛠️ Development Setup

### Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build production version
npm run build

# Preview build result
npm run preview

# Code linting
npm run lint
```

### Adding New Platform Support

1. Add platform type in `src/types/index.ts`:
```typescript
export type AIPlatform = 'deepseek' | 'chatgpt' | 'claude' | 'kimi' | 'qianwen' | 'doubao' | 'tiangong' | 'newplatform' | 'other';
```

2. Add pricing configuration in `src/utils/pricing.ts`:
```typescript
newplatform: {
  platform: 'newplatform',
  inputTokenCostPer1k: 0.001,
  outputTokenCostPer1k: 0.002,
  currency: 'USD',
},
```

3. Create content script `src/content/newplatform.ts`

4. Add permissions and script configuration in `manifest.json`

### Code Standards

- Write all code in TypeScript
- Follow ESLint rules for code linting
- Use Tailwind CSS for styling
- Use functional components and React Hooks

## 🤝 Contributing

We welcome contributions of all kinds!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'feat: add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Create a Pull Request**

### Commit Guidelines

Please use semantic commit messages:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `style:` Code formatting (no functional changes)
- `refactor:` Code refactoring
- `test:` Test related
- `chore:` Build/tooling related

### Reporting Issues

If you find any issues, please report them via [GitHub Issues](https://github.com/bao1979/ai-labor-tracker/issues).

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ | AI Labor Credential System
</p>
