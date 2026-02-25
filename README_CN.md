[English](README.md) | [简体中文](#)

# AI 劳动记录器

> 一个用于追踪和量化 AI 交互劳动价值的浏览器扩展

## 📖 项目介绍

AI 劳动记录器是一个创新的浏览器扩展，旨在帮助用户追踪、记录和量化与 AI 助手（如 DeepSeek、ChatGPT、Claude、Kimi、千问、豆包、天工等）的交互数据。通过估算 Token 消耗和对应的劳动价值，本项目为 AI 劳动凭证系统的建立提供基础数据支持。

### 🎯 愿景

在 AI 时代，人机协作已成为常态。本项目致力于：
- **量化 AI 劳动**：将 AI 交互转化为可度量的劳动凭证
- **提高透明度**：让用户了解 AI 使用的真实成本和价值
- **数据主权**：确保用户完全掌控自己的交互数据
- **促进公平**：为未来的 AI 劳动价值分配提供数据基础

## ✨ 功能特性

### 核心功能
- 🔍 **自动追踪**：自动检测并记录与 AI 平台的对话
- 📊 **Token 统计**：精确统计输入/输出 Token 数量
- 💰 **成本估算**：基于各平台定价估算 API 使用成本
- 👷 **劳动价值计算**：将 AI 输出转换为等效人工劳动价值
- 📈 **数据可视化**：直观展示使用趋势和统计图表
- 🌐 **多语言界面**：支持中文和英文界面切换

### 支持的 AI 平台

#### 国际平台
| 平台 | 网站 | 状态 |
|------|------|------|
| DeepSeek | chat.deepseek.com | ✅ 已支持 |
| ChatGPT | chatgpt.com | ✅ 已支持 |
| Claude | claude.ai | ✅ 已支持 |

#### 中国主流 AI 平台
| 平台 | 中文名称 | 网站 | 状态 |
|------|----------|------|------|
| Kimi | Kimi (月之暗面) | kimi.moonshot.cn | ✅ 已支持 |
| Qianwen | 通义千问 | tongyi.aliyun.com | ✅ 已支持 |
| Doubao | 豆包 | doubao.com | ✅ 已支持 |
| Tiangong | 天工 | tiangong.cn | ✅ 已支持 |

> 扩展架构设计为可扩展模式，便于添加对更多平台的支持。

### 数据管理
- 📁 **本地存储**：所有数据安全存储在本地，保护隐私
- 📤 **数据导出**：支持 JSON 和 CSV 格式导出
- 🗑️ **数据清理**：灵活的数据保留策略设置
- 🔍 **记录搜索**：按平台、模型、日期等条件筛选记录

## 🚀 安装指南

### 环境要求
- Node.js 18.0 或更高版本
- pnpm、npm 或 yarn 包管理器
- Microsoft Edge 或 Google Chrome 浏览器

### 开发安装

1. **克隆仓库**
```bash
git clone https://github.com/bao1979/ai-labor-tracker.git
cd ai-labor-tracker
```

2. **安装依赖**
```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install

# 或使用 yarn
yarn install
```

3. **开发模式运行**
```bash
npm run dev
```

4. **构建生产版本**
```bash
npm run build
```

### 加载扩展到浏览器

#### Microsoft Edge
1. 打开 `edge://extensions/`
2. 开启「开发人员模式」
3. 点击「加载解压缩的扩展」
4. 选择项目的 `dist` 目录

#### Google Chrome
1. 打开 `chrome://extensions/`
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择项目的 `dist` 目录

## 📖 使用说明

### 基本使用

1. **启用追踪**
   - 点击浏览器工具栏中的扩展图标
   - 在设置页面确保追踪功能已启用

2. **进行 AI 对话**
   - 正常使用支持的 AI 平台进行对话
   - 扩展会自动在后台记录交互数据

3. **查看统计**
   - 点击扩展图标打开弹出窗口
   - 在「概览」页面查看今日/本周/本月的统计数据
   - 在「记录」页面查看详细的交互历史

4. **导出数据**
   - 在「设置」页面点击导出按钮
   - 选择 JSON 或 CSV 格式下载数据

### 语言设置

扩展支持中文和英文界面：
1. 点击扩展图标打开弹出窗口
2. 进入「设置」标签页
3. 找到「语言」选项
4. 选择您偏好的语言（English / 中文）

### 设置选项

| 设置项 | 说明 |
|--------|------|
| 启用追踪 | 全局开关，控制是否记录交互 |
| 平台选择 | 选择需要追踪的 AI 平台 |
| 数据保留天数 | 设置历史数据自动清理周期 |
| 语言 | 切换中英文界面 |

## 🏗️ 技术架构

### 技术栈
- **构建工具**：[Vite](https://vitejs.dev/) - 下一代前端构建工具
- **前端框架**：[React 18](https://react.dev/) - 用户界面库
- **开发语言**：[TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- **扩展框架**：[CRXJS](https://crxjs.dev/vite-plugin/) - Vite 的浏览器扩展插件
- **样式方案**：[Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- **数据可视化**：[Recharts](https://recharts.org/) - React 图表库
- **本地数据库**：[Dexie.js](https://dexie.org/) - IndexedDB 封装库

### 扩展架构

```
┌─────────────────────────────────────────────────────────────┐
│                     浏览器扩展架构                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Content    │    │ Background  │    │   Popup     │     │
│  │  Scripts    │───>│  Service    │<───│    UI       │     │
│  │  内容脚本   │    │   Worker    │    │  弹出界面   │     │
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

### 数据流

1. **Content Script（内容脚本）**：注入到目标网页，捕获 AI 对话内容
2. **Background Service Worker（后台服务）**：处理消息、管理数据存储
3. **Popup UI（弹出界面）**：展示统计数据和设置界面
4. **IndexedDB（本地数据库）**：持久化存储所有数据

## 📁 目录结构

```
ai-labor-tracker/
├── public/
│   └── icons/                 # 扩展图标资源
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
├── src/
│   ├── background/           # 后台服务工作线程
│   │   └── index.ts         # 消息处理和数据管理
│   ├── content/             # 内容脚本
│   │   ├── deepseek.ts      # DeepSeek 平台适配器
│   │   ├── kimi.ts          # Kimi 平台适配器
│   │   ├── qianwen.ts       # 千问平台适配器
│   │   ├── doubao.ts        # 豆包平台适配器
│   │   └── tiangong.ts      # 天工平台适配器
│   ├── popup/               # 弹出窗口 UI
│   │   ├── components/      # React 组件
│   │   ├── i18n/            # 国际化（多语言支持）
│   │   │   └── locales/     # 语言文件（en.ts, zh.ts）
│   │   ├── App.tsx          # 主应用组件
│   │   ├── main.tsx         # 入口文件
│   │   ├── index.html       # HTML 模板
│   │   └── styles.css       # 全局样式
│   ├── storage/             # 数据存储层
│   │   ├── db.ts            # Dexie 数据库定义
│   │   └── index.ts         # 存储 API
│   ├── types/               # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/               # 工具函数
│   │   ├── export.ts        # 数据导出
│   │   ├── pricing.ts       # 价格计算
│   │   ├── tokens.ts        # Token 估算
│   │   └── index.ts
│   └── vite-env.d.ts
├── manifest.json             # 扩展清单文件
├── manifest.config.ts        # 清单配置
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── README.md                 # 英文文档
└── README_CN.md              # 中文文档
```

## 🛠️ 开发指南

### 开发命令

```bash
# 启动开发服务器（支持热重载）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint
```

### 添加新平台支持

1. 在 `src/types/index.ts` 中添加平台类型：
```typescript
export type AIPlatform = 'deepseek' | 'chatgpt' | 'claude' | 'kimi' | 'qianwen' | 'doubao' | 'tiangong' | 'newplatform' | 'other';
```

2. 在 `src/utils/pricing.ts` 中添加定价配置：
```typescript
newplatform: {
  platform: 'newplatform',
  inputTokenCostPer1k: 0.001,
  outputTokenCostPer1k: 0.002,
  currency: 'USD',
},
```

3. 创建内容脚本 `src/content/newplatform.ts`

4. 在 `manifest.json` 中添加权限和脚本配置

### 代码规范

- 使用 TypeScript 编写所有代码
- 遵循 ESLint 规则进行代码检查
- 使用 Tailwind CSS 编写样式
- 组件使用函数式组件和 React Hooks

## 🤝 贡献指南

我们欢迎任何形式的贡献！

### 如何贡献

1. **Fork 本仓库**
2. **创建特性分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **提交更改**
   ```bash
   git commit -m 'feat: 添加某个很棒的功能'
   ```
4. **推送到分支**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **创建 Pull Request**

### 提交规范

请使用语义化提交信息：
- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

### 报告问题

如果您发现任何问题，请通过 [GitHub Issues](https://github.com/bao1979/ai-labor-tracker/issues) 报告。

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) 开源。

---

<p align="center">
  用 ❤️ 构建 | AI 劳动凭证系统
</p>
