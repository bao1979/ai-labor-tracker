/**
 * English language translations
 */
export const en = {
  // Common
  common: {
    loading: 'Loading...',
    retry: 'Retry',
    cancel: 'Cancel',
    delete: 'Delete',
    refresh: 'Refresh',
    tokens: 'tokens',
    sessions: 'sessions',
    days: 'days',
    active: 'active',
  },

  // Header
  header: {
    title: 'AI Labor Tracker',
    subtitle: 'Track your AI interactions',
    activeCount: '{{count}} active',
  },

  // Tabs
  tabs: {
    overview: 'Overview',
    records: 'Records',
    settings: 'Settings',
  },

  // Overview Page
  overview: {
    today: 'Today',
    week: 'Week',
    month: 'Month',
    total: 'Total',
    totalTokens: 'Total Tokens',
    estCost: 'Est. Cost',
    interactions: 'interactions',
    inOut: '{{input}} in / {{output}} out',
    modelDistribution: 'Model Distribution',
    noData: 'No data yet',
    usageTrend: 'Usage Trend (30 Days)',
    noTrendData: 'No data yet. Start using AI to see your trends!',
    count: 'Count',
  },

  // Records Page
  records: {
    searchPlaceholder: 'Search records...',
    all: 'All',
    noRecords: 'No records yet',
    noMatchingRecords: 'No matching records',
    startChatting: 'Start chatting with AI to capture interactions',
    recordsCount: '{{filtered}} of {{total}} records',
    input: 'Input',
    output: 'Output',
    estCostLabel: 'Est. cost:',
    deleteConfirm: 'Delete this record?',
    tokensCount: '{{count}} tokens',
  },

  // Settings Page
  settings: {
    captureSettings: 'Capture Settings',
    enableCapture: 'Enable Capture',
    trackAutomatically: 'Track AI interactions automatically',
    enabledPlatforms: 'Enabled Platforms',
    dataSettings: 'Data Settings',
    dataRetention: 'Data Retention',
    daysToKeep: 'Days to keep records',
    clearAllData: 'Clear All Data',
    clearConfirmMessage: 'This will permanently delete all records. Are you sure?',
    deleteAll: 'Delete All',
    about: 'About',
    version: 'Version',
    developer: 'Developer',
    developerName: 'AI Labor Tracker',
    aboutDescription: 'Track your AI interactions, estimate token usage, and export your data. All data is stored locally on your device.',
    language: 'Language',
    languageDescription: 'Select your preferred language',
    english: 'English',
    chinese: '中文',
  },

  // Platform names
  platforms: {
    deepseek: 'DeepSeek',
    chatgpt: 'ChatGPT',
    claude: 'Claude',
    kimi: 'Kimi',
    qianwen: 'Qianwen',
    doubao: 'Doubao',
    tiangong: 'Tiangong',
    other: 'Other',
  },

  // Stats Overview
  stats: {
    today: 'Today',
    allTime: 'All Time',
    tokens: 'Tokens',
    estCost: 'Est. Cost',
    laborValue: 'Labor Value',
    ifDoneManually: 'if done manually',
    savings: 'Savings',
    totalTokens: 'Total Tokens',
    totalCost: 'Total Cost',
    totalLaborValue: 'Total Labor Value',
    totalSavings: 'Total Savings',
  },

  // Export Button
  export: {
    exporting: 'Exporting...',
    exportData: 'Export Data',
    exportAsJson: 'Export as JSON',
    fullData: 'Full data',
    exportAsCsv: 'Export as CSV',
    sessionsOnly: 'Sessions only',
  },
};

export type Translations = typeof en;
