import Dexie, { type EntityTable } from 'dexie';
import type { AISession, DailyStats, UserPreferences, LaborRecord, Settings, AIPlatform, AggregatedStats } from '@/types';

/**
 * AI Labor Tracker Database
 * Uses Dexie.js for IndexedDB operations
 */
class AILaborTrackerDB extends Dexie {
  sessions!: EntityTable<AISession, 'id'>;
  dailyStats!: EntityTable<DailyStats, 'id'>;
  preferences!: EntityTable<UserPreferences, 'id'>;
  laborRecords!: EntityTable<LaborRecord, 'id'>;
  settings!: EntityTable<Settings, 'id'>;

  constructor() {
    super('AILaborTrackerDB');

    this.version(1).stores({
      sessions: '++id, platform, startTime, endTime, conversationId',
      dailyStats: '++id, date, platform, [date+platform]',
      preferences: '++id',
    });
    
    this.version(2).stores({
      sessions: '++id, platform, startTime, endTime, conversationId',
      dailyStats: '++id, date, platform, [date+platform]',
      preferences: '++id',
      laborRecords: '++id, platform, model, timestamp, conversationId',
      settings: '++id',
    });
  }
}

export const db = new AILaborTrackerDB();

/**
 * Default user preferences
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
  hourlyRate: 50, // Default hourly rate in USD
  currency: 'USD',
  trackingEnabled: true,
  platforms: ['deepseek', 'chatgpt', 'claude'],
};

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: Settings = {
  captureEnabled: true,
  enabledPlatforms: {
    deepseek: true,
    chatgpt: true,
    claude: true,
    other: false,
  },
  dataRetentionDays: 90,
  theme: 'dark',
};

/**
 * Initialize or get user preferences
 */
export async function getPreferences(): Promise<UserPreferences> {
  const prefs = await db.preferences.toCollection().first();
  if (!prefs) {
    const id = await db.preferences.add(DEFAULT_PREFERENCES);
    return { ...DEFAULT_PREFERENCES, id };
  }
  return prefs;
}

/**
 * Update user preferences
 */
export async function updatePreferences(
  updates: Partial<UserPreferences>
): Promise<UserPreferences> {
  const current = await getPreferences();
  if (current.id) {
    await db.preferences.update(current.id, updates);
    return { ...current, ...updates };
  }
  return current;
}

/**
 * Initialize or get settings
 */
export async function getSettings(): Promise<Settings> {
  const settings = await db.settings.toCollection().first();
  if (!settings) {
    const id = await db.settings.add(DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, id };
  }
  return settings;
}

/**
 * Update settings
 */
export async function updateSettings(
  updates: Partial<Settings>
): Promise<Settings> {
  const current = await getSettings();
  if (current.id) {
    await db.settings.update(current.id, updates);
    return { ...current, ...updates };
  }
  return current;
}

/**
 * Create a new AI session
 */
export async function createSession(
  session: Omit<AISession, 'id'>
): Promise<AISession> {
  const id = await db.sessions.add(session as AISession);
  return { ...session, id };
}

/**
 * Update an existing session
 */
export async function updateSession(
  id: number,
  updates: Partial<AISession>
): Promise<void> {
  await db.sessions.update(id, updates);
}

/**
 * Get session by ID
 */
export async function getSession(id: number): Promise<AISession | undefined> {
  return db.sessions.get(id);
}

/**
 * Get sessions within a date range
 */
export async function getSessionsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<AISession[]> {
  return db.sessions
    .where('startTime')
    .between(startDate, endDate)
    .toArray();
}

/**
 * Get all sessions
 */
export async function getAllSessions(): Promise<AISession[]> {
  return db.sessions.toArray();
}

/**
 * Update or create daily stats
 */
export async function updateDailyStats(
  date: string,
  platform: AISession['platform'],
  session: AISession
): Promise<void> {
  const existing = await db.dailyStats
    .where({ date, platform })
    .first();

  if (existing && existing.id) {
    await db.dailyStats.update(existing.id, {
      totalSessions: existing.totalSessions + 1,
      totalInputTokens: existing.totalInputTokens + session.inputTokens,
      totalOutputTokens: existing.totalOutputTokens + session.outputTokens,
      totalTokens: existing.totalTokens + session.totalTokens,
      totalEstimatedCost: existing.totalEstimatedCost + session.estimatedCost,
      totalLaborValue: existing.totalLaborValue + session.laborValue,
    });
  } else {
    await db.dailyStats.add({
      date,
      platform,
      totalSessions: 1,
      totalInputTokens: session.inputTokens,
      totalOutputTokens: session.outputTokens,
      totalTokens: session.totalTokens,
      totalEstimatedCost: session.estimatedCost,
      totalLaborValue: session.laborValue,
    });
  }
}

/**
 * Get daily stats for a date range
 */
export async function getDailyStatsByDateRange(
  startDate: string,
  endDate: string
): Promise<DailyStats[]> {
  return db.dailyStats
    .where('date')
    .between(startDate, endDate, true, true)
    .toArray();
}

/**
 * Get all daily stats
 */
export async function getAllDailyStats(): Promise<DailyStats[]> {
  return db.dailyStats.toArray();
}

/**
 * Add a labor record
 */
export async function addLaborRecord(
  record: Omit<LaborRecord, 'id'>
): Promise<LaborRecord> {
  const id = await db.laborRecords.add(record as LaborRecord);
  return { ...record, id };
}

/**
 * Get all labor records
 */
export async function getAllLaborRecords(): Promise<LaborRecord[]> {
  return db.laborRecords.orderBy('timestamp').reverse().toArray();
}

/**
 * Get labor records with filtering
 */
export async function getLaborRecords(options?: {
  platform?: AIPlatform;
  model?: string;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<LaborRecord[]> {
  let collection = db.laborRecords.orderBy('timestamp').reverse();
  
  let records = await collection.toArray();
  
  // Apply filters
  if (options?.platform) {
    records = records.filter(r => r.platform === options.platform);
  }
  
  if (options?.model) {
    records = records.filter(r => r.model === options.model);
  }
  
  if (options?.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    records = records.filter(r => 
      r.input.toLowerCase().includes(query) || 
      r.output.toLowerCase().includes(query)
    );
  }
  
  if (options?.startDate) {
    const startTs = new Date(options.startDate).getTime();
    records = records.filter(r => r.timestamp >= startTs);
  }
  
  if (options?.endDate) {
    const endTs = new Date(options.endDate).getTime() + 24 * 60 * 60 * 1000; // End of day
    records = records.filter(r => r.timestamp <= endTs);
  }
  
  // Apply pagination
  const offset = options?.offset ?? 0;
  const limit = options?.limit ?? 100;
  
  return records.slice(offset, offset + limit);
}

/**
 * Delete a labor record
 */
export async function deleteLaborRecord(id: number): Promise<void> {
  await db.laborRecords.delete(id);
}

/**
 * Get labor records count
 */
export async function getLaborRecordsCount(): Promise<number> {
  return db.laborRecords.count();
}

/**
 * Get statistics for a date range
 */
export async function getStatsForDateRange(
  startDate: string,
  endDate: string
): Promise<AggregatedStats> {
  const startTs = new Date(startDate).getTime();
  const endTs = new Date(endDate).getTime() + 24 * 60 * 60 * 1000; // End of day
  
  const records = await db.laborRecords
    .where('timestamp')
    .between(startTs, endTs, true, true)
    .toArray();
  
  return aggregateStats(records);
}

/**
 * Get today's statistics
 */
export async function getTodayStats(): Promise<AggregatedStats> {
  const today = new Date().toISOString().split('T')[0];
  return getStatsForDateRange(today, today);
}

/**
 * Get this week's statistics
 */
export async function getWeekStats(): Promise<AggregatedStats> {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const startDate = weekAgo.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];
  
  return getStatsForDateRange(startDate, endDate);
}

/**
 * Get this month's statistics
 */
export async function getMonthStats(): Promise<AggregatedStats> {
  const today = new Date();
  const monthAgo = new Date(today);
  monthAgo.setDate(monthAgo.getDate() - 30);
  
  const startDate = monthAgo.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];
  
  return getStatsForDateRange(startDate, endDate);
}

/**
 * Get total statistics
 */
export async function getTotalStats(): Promise<AggregatedStats> {
  const records = await db.laborRecords.toArray();
  return aggregateStats(records);
}

/**
 * Aggregate stats from records
 */
function aggregateStats(records: LaborRecord[]): AggregatedStats {
  return records.reduce(
    (acc, record) => ({
      totalRecords: acc.totalRecords + 1,
      totalTokens: acc.totalTokens + record.totalTokens,
      totalInputTokens: acc.totalInputTokens + record.inputTokens,
      totalOutputTokens: acc.totalOutputTokens + record.outputTokens,
      totalEstimatedCost: acc.totalEstimatedCost + record.estimatedCost,
      totalLaborValue: acc.totalLaborValue + 0, // Calculate based on output tokens if needed
    }),
    {
      totalRecords: 0,
      totalTokens: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalEstimatedCost: 0,
      totalLaborValue: 0,
    }
  );
}

/**
 * Get model distribution statistics
 */
export async function getModelDistribution(): Promise<{ model: string; count: number; tokens: number }[]> {
  const records = await db.laborRecords.toArray();
  const distribution = new Map<string, { count: number; tokens: number }>();
  
  for (const record of records) {
    const existing = distribution.get(record.model) || { count: 0, tokens: 0 };
    distribution.set(record.model, {
      count: existing.count + 1,
      tokens: existing.tokens + record.totalTokens,
    });
  }
  
  return Array.from(distribution.entries())
    .map(([model, stats]) => ({ model, ...stats }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get daily stats for chart (last N days)
 */
export async function getDailyStatsForChart(days: number = 30): Promise<DailyStats[]> {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days);
  
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = today.toISOString().split('T')[0];
  
  return getDailyStatsByDateRange(startStr, endStr);
}

/**
 * Clear all data (for testing or user request)
 */
export async function clearAllData(): Promise<void> {
  await db.sessions.clear();
  await db.dailyStats.clear();
  await db.laborRecords.clear();
}

/**
 * Clear old data based on retention policy
 */
export async function clearOldData(retentionDays: number): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
  const cutoffTs = cutoffDate.getTime();
  
  const oldRecords = await db.laborRecords
    .where('timestamp')
    .below(cutoffTs)
    .toArray();
  
  const count = oldRecords.length;
  
  if (count > 0) {
    await db.laborRecords
      .where('timestamp')
      .below(cutoffTs)
      .delete();
  }
  
  return count;
}

/**
 * Generate unique ID
 */
export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
