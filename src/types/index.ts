/**
 * AI interaction session data
 */
export interface AISession {
  id?: number;
  platform: AIPlatform;
  startTime: Date;
  endTime?: Date;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  laborValue: number;
  conversationId?: string;
}

/**
 * Supported AI platforms
 */
export type AIPlatform = 'deepseek' | 'chatgpt' | 'claude' | 'kimi' | 'qianwen' | 'doubao' | 'tiangong' | 'other';

/**
 * Labor record - represents a single captured AI interaction
 */
export interface LaborRecord {
  id?: number;
  platform: AIPlatform;
  model: string;
  timestamp: number; // Unix timestamp
  input: string;
  output: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  conversationId?: string;
}

/**
 * Daily aggregated usage statistics
 */
export interface DailyStats {
  id?: number;
  date: string; // ISO date string YYYY-MM-DD
  platform: AIPlatform;
  totalSessions: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalEstimatedCost: number;
  totalLaborValue: number;
}

/**
 * Platform-specific pricing configuration
 */
export interface PlatformPricing {
  platform: AIPlatform;
  inputTokenCostPer1k: number;
  outputTokenCostPer1k: number;
  currency: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
  id?: number;
  hourlyRate: number;
  currency: string;
  trackingEnabled: boolean;
  platforms: AIPlatform[];
}

/**
 * Application settings
 */
export interface Settings {
  id?: number;
  captureEnabled: boolean;
  enabledPlatforms: Record<AIPlatform, boolean>;
  dataRetentionDays: number;
  theme: 'dark' | 'light';
}

/**
 * Export data format
 */
export interface ExportData {
  exportedAt: string;
  version: string;
  totalRecords: number;
  metadata: {
    exportVersion: string;
    generatedAt: string;
    platform: string;
  };
  records: LaborRecord[];
  sessions: AISession[];
  dailyStats: DailyStats[];
  preferences: UserPreferences;
  settings: Settings;
}

/**
 * Message types for communication between content scripts, background, and popup
 */
export type MessageType =
  | 'SESSION_START'
  | 'SESSION_UPDATE'
  | 'SESSION_END'
  | 'GET_STATS'
  | 'GET_SESSIONS'
  | 'EXPORT_DATA'
  | 'TOGGLE_TRACKING'
  | 'UPDATE_PREFERENCES'
  | 'ADD_LABOR_RECORD'
  | 'GET_RECORDS'
  | 'DELETE_RECORD'
  | 'SEARCH_RECORDS'
  | 'GET_SETTINGS'
  | 'UPDATE_SETTINGS'
  | 'CLEAR_DATA';

/**
 * Message payload structure
 */
export interface Message<T = unknown> {
  type: MessageType;
  payload?: T;
}

/**
 * Session start payload
 */
export interface SessionStartPayload {
  platform: AIPlatform;
  conversationId?: string;
}

/**
 * Session update payload
 */
export interface SessionUpdatePayload {
  sessionId: number;
  inputTokens?: number;
  outputTokens?: number;
}

/**
 * Token estimation result
 */
export interface TokenEstimation {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

/**
 * Chart data point for visualization
 */
export interface ChartDataPoint {
  date: string;
  tokens: number;
  cost: number;
  laborValue: number;
  sessions: number;
}

/**
 * Add labor record payload
 */
export interface AddLaborRecordPayload {
  platform: AIPlatform;
  model: string;
  input: string;
  output: string;
  conversationId?: string;
}

/**
 * Aggregated statistics
 */
export interface AggregatedStats {
  totalRecords: number;
  totalTokens: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalEstimatedCost: number;
  totalLaborValue: number;
}

/**
 * Statistics response
 */
export interface StatsResponse {
  today: AggregatedStats;
  week: AggregatedStats;
  month: AggregatedStats;
  total: AggregatedStats;
  dailyStats: DailyStats[];
  activeSessions: number;
  modelDistribution: { model: string; count: number; tokens: number }[];
}

/**
 * Records search/filter options
 */
export interface RecordsFilter {
  platform?: AIPlatform;
  model?: string;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}
