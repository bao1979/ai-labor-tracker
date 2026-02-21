import type { Translations } from './en';

/**
 * Chinese language translations
 */
export const zh: Translations = {
  // Common
  common: {
    loading: '加载中...',
    retry: '重试',
    cancel: '取消',
    delete: '删除',
    refresh: '刷新',
    tokens: '令牌',
    sessions: '会话',
    days: '天',
    active: '活跃',
  },

  // Header
  header: {
    title: 'AI 劳动记录器',
    subtitle: '追踪您的 AI 交互',
    activeCount: '{{count}} 活跃',
  },

  // Tabs
  tabs: {
    overview: '概览',
    records: '记录',
    settings: '设置',
  },

  // Overview Page
  overview: {
    today: '今日',
    week: '本周',
    month: '本月',
    total: '总计',
    totalTokens: '总令牌数',
    estCost: '预估费用',
    interactions: '次交互',
    inOut: '{{input}} 输入 / {{output}} 输出',
    modelDistribution: '模型分布',
    noData: '暂无数据',
    usageTrend: '使用趋势 (30天)',
    noTrendData: '暂无数据。开始使用 AI 来查看您的趋势！',
    count: '次数',
  },

  // Records Page
  records: {
    searchPlaceholder: '搜索记录...',
    all: '全部',
    noRecords: '暂无记录',
    noMatchingRecords: '没有匹配的记录',
    startChatting: '开始与 AI 对话以捕获交互',
    recordsCount: '{{filtered}} / {{total}} 条记录',
    input: '输入',
    output: '输出',
    estCostLabel: '预估费用：',
    deleteConfirm: '确定删除此记录？',
    tokensCount: '{{count}} 令牌',
  },

  // Settings Page
  settings: {
    captureSettings: '捕获设置',
    enableCapture: '启用捕获',
    trackAutomatically: '自动追踪 AI 交互',
    enabledPlatforms: '启用的平台',
    dataSettings: '数据设置',
    dataRetention: '数据保留',
    daysToKeep: '记录保留天数',
    clearAllData: '清除所有数据',
    clearConfirmMessage: '这将永久删除所有记录。确定要继续吗？',
    deleteAll: '全部删除',
    about: '关于',
    version: '版本',
    developer: '开发者',
    developerName: 'AI 劳动记录器',
    aboutDescription: '追踪您的 AI 交互，估算令牌使用量，并导出数据。所有数据都存储在您的本地设备上。',
    language: '语言',
    languageDescription: '选择您的首选语言',
    english: 'English',
    chinese: '中文',
  },

  // Stats Overview
  stats: {
    today: '今日',
    allTime: '所有时间',
    tokens: '令牌',
    estCost: '预估费用',
    laborValue: '劳动价值',
    ifDoneManually: '如果手工完成',
    savings: '节省',
    totalTokens: '总令牌数',
    totalCost: '总费用',
    totalLaborValue: '总劳动价值',
    totalSavings: '总节省',
  },

  // Export Button
  export: {
    exporting: '导出中...',
    exportData: '导出数据',
    exportAsJson: '导出为 JSON',
    fullData: '完整数据',
    exportAsCsv: '导出为 CSV',
    sessionsOnly: '仅会话',
  },
};
