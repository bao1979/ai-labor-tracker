import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'AI Labor Tracker',
  version: '0.1.0',
  description: 'Track your AI interactions, estimate labor value, and export usage data',
  permissions: [
    'storage',
    'activeTab',
    'tabs',
  ],
  host_permissions: [
    'https://chat.deepseek.com/*',
    'https://chatgpt.com/*',
    'https://claude.ai/*',
    'https://kimi.moonshot.cn/*',
    'https://tongyi.aliyun.com/*',
    'https://www.doubao.com/*',
    'https://doubao.com/*',
    'https://www.tiangong.cn/*',
    'https://tiangong.cn/*',
  ],
  action: {
    default_popup: 'src/popup/index.html',
    default_icon: {
      '16': 'public/icons/icon16.png',
      '32': 'public/icons/icon32.png',
      '48': 'public/icons/icon48.png',
      '128': 'public/icons/icon128.png',
    },
  },
  icons: {
    '16': 'public/icons/icon16.png',
    '32': 'public/icons/icon32.png',
    '48': 'public/icons/icon48.png',
    '128': 'public/icons/icon128.png',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://chat.deepseek.com/*'],
      js: ['src/content/deepseek.ts'],
      run_at: 'document_idle',
    },
    {
      matches: ['https://kimi.moonshot.cn/*'],
      js: ['src/content/kimi.ts'],
      run_at: 'document_idle',
    },
    {
      matches: ['https://tongyi.aliyun.com/*'],
      js: ['src/content/qianwen.ts'],
      run_at: 'document_idle',
    },
    {
      matches: ['https://www.doubao.com/*', 'https://doubao.com/*'],
      js: ['src/content/doubao.ts'],
      run_at: 'document_idle',
    },
    {
      matches: ['https://www.tiangong.cn/*', 'https://tiangong.cn/*'],
      js: ['src/content/tiangong.ts'],
      run_at: 'document_idle',
    },
  ],
});
