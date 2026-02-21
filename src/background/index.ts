/**
 * AI Labor Tracker - Background Service Worker
 * Handles communication between content scripts and popup
 */

import type { 
  Message, 
  SessionStartPayload, 
  SessionUpdatePayload, 
  AISession,
  AddLaborRecordPayload,
  RecordsFilter,
  Settings,
  StatsResponse,
  LaborRecord,
} from '@/types';
import { 
  createSession, 
  updateSession, 
  getAllSessions, 
  getAllDailyStats, 
  updateDailyStats,
  getPreferences,
  updatePreferences,
  getSettings,
  updateSettings,
  addLaborRecord,
  getLaborRecords,
  deleteLaborRecord,
  getAllLaborRecords,
  getTodayStats,
  getWeekStats,
  getMonthStats,
  getTotalStats,
  getModelDistribution,
  getDailyStatsForChart,
  clearAllData,
} from '@/storage';
import { calculateCost, calculateLaborValue, estimateTokensFromText } from '@/utils';

// Active sessions tracking
const activeSessions: Map<number, AISession> = new Map();

/**
 * Handle incoming messages from content scripts and popup
 */
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  handleMessage(message)
    .then(sendResponse)
    .catch((error) => {
      console.error('Error handling message:', error);
      sendResponse({ error: error.message });
    });
  
  // Return true to indicate async response
  return true;
});

/**
 * Process message and return response
 */
async function handleMessage(message: Message): Promise<unknown> {
  switch (message.type) {
    case 'SESSION_START':
      return handleSessionStart(message.payload as SessionStartPayload);
    
    case 'SESSION_UPDATE':
      return handleSessionUpdate(message.payload as SessionUpdatePayload);
    
    case 'SESSION_END':
      return handleSessionEnd(message.payload as { sessionId: number });
    
    case 'GET_STATS':
      return handleGetStats();
    
    case 'GET_SESSIONS':
      return handleGetSessions();
    
    case 'TOGGLE_TRACKING':
      return handleToggleTracking(message.payload as { enabled: boolean });
    
    case 'UPDATE_PREFERENCES':
      return handleUpdatePreferences(message.payload as Partial<typeof import('@/types').UserPreferences>);
    
    case 'ADD_LABOR_RECORD':
      return handleAddLaborRecord(message.payload as AddLaborRecordPayload);
    
    case 'GET_RECORDS':
      return handleGetRecords(message.payload as RecordsFilter | undefined);
    
    case 'DELETE_RECORD':
      return handleDeleteRecord(message.payload as { id: number });
    
    case 'SEARCH_RECORDS':
      return handleSearchRecords(message.payload as RecordsFilter);
    
    case 'GET_SETTINGS':
      return handleGetSettings();
    
    case 'UPDATE_SETTINGS':
      return handleUpdateSettings(message.payload as Partial<Settings>);
    
    case 'CLEAR_DATA':
      return handleClearData();
    
    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
}

/**
 * Handle session start
 */
async function handleSessionStart(payload: SessionStartPayload): Promise<{ sessionId: number }> {
  const session = await createSession({
    platform: payload.platform,
    startTime: new Date(),
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    estimatedCost: 0,
    laborValue: 0,
    conversationId: payload.conversationId,
  });

  if (session.id) {
    activeSessions.set(session.id, session);
    console.log(`[AI Labor Tracker] Session started: ${session.id} on ${payload.platform}`);
  }

  return { sessionId: session.id! };
}

/**
 * Handle session update with new token counts
 */
async function handleSessionUpdate(payload: SessionUpdatePayload): Promise<void> {
  const { sessionId, inputTokens = 0, outputTokens = 0 } = payload;
  
  const session = activeSessions.get(sessionId);
  if (!session) {
    console.warn(`[AI Labor Tracker] Session not found: ${sessionId}`);
    return;
  }

  const prefs = await getPreferences();
  
  // Update token counts
  session.inputTokens += inputTokens;
  session.outputTokens += outputTokens;
  session.totalTokens = session.inputTokens + session.outputTokens;
  
  // Recalculate costs
  session.estimatedCost = calculateCost(
    session.platform,
    session.inputTokens,
    session.outputTokens
  );
  session.laborValue = calculateLaborValue(session.outputTokens, prefs.hourlyRate);

  // Persist update
  await updateSession(sessionId, {
    inputTokens: session.inputTokens,
    outputTokens: session.outputTokens,
    totalTokens: session.totalTokens,
    estimatedCost: session.estimatedCost,
    laborValue: session.laborValue,
  });

  console.log(`[AI Labor Tracker] Session updated: ${sessionId}, tokens: ${session.totalTokens}`);
}

/**
 * Handle session end
 */
async function handleSessionEnd(payload: { sessionId: number }): Promise<void> {
  const { sessionId } = payload;
  
  const session = activeSessions.get(sessionId);
  if (!session) {
    console.warn(`[AI Labor Tracker] Session not found for end: ${sessionId}`);
    return;
  }

  const endTime = new Date();
  session.endTime = endTime;

  // Persist final state
  await updateSession(sessionId, { endTime });

  // Update daily stats
  const dateStr = endTime.toISOString().split('T')[0];
  await updateDailyStats(dateStr, session.platform, session);

  // Remove from active sessions
  activeSessions.delete(sessionId);

  console.log(`[AI Labor Tracker] Session ended: ${sessionId}`);
}

/**
 * Get aggregated stats
 */
async function handleGetStats(): Promise<StatsResponse> {
  const [today, week, month, total, dailyStats, modelDistribution] = await Promise.all([
    getTodayStats(),
    getWeekStats(),
    getMonthStats(),
    getTotalStats(),
    getDailyStatsForChart(30),
    getModelDistribution(),
  ]);
  
  return {
    today,
    week,
    month,
    total,
    dailyStats,
    activeSessions: activeSessions.size,
    modelDistribution,
  };
}

/**
 * Get all sessions
 */
async function handleGetSessions(): Promise<{ sessions: AISession[] }> {
  const sessions = await getAllSessions();
  return { sessions };
}

/**
 * Toggle tracking on/off
 */
async function handleToggleTracking(payload: { enabled: boolean }): Promise<void> {
  await updatePreferences({ trackingEnabled: payload.enabled });
  console.log(`[AI Labor Tracker] Tracking ${payload.enabled ? 'enabled' : 'disabled'}`);
}

/**
 * Update user preferences
 */
async function handleUpdatePreferences(
  payload: Partial<typeof import('@/types').UserPreferences>
): Promise<void> {
  await updatePreferences(payload);
  console.log('[AI Labor Tracker] Preferences updated');
}

/**
 * Add a labor record from content script
 */
async function handleAddLaborRecord(payload: AddLaborRecordPayload): Promise<{ record: LaborRecord }> {
  const { platform, model, input, output, conversationId } = payload;
  
  // Estimate tokens
  const inputTokens = estimateTokensFromText(input);
  const outputTokens = estimateTokensFromText(output);
  const totalTokens = inputTokens + outputTokens;
  
  // Calculate cost
  const estimatedCost = calculateCost(platform, inputTokens, outputTokens);
  
  // Create record
  const record = await addLaborRecord({
    platform,
    model,
    timestamp: Date.now(),
    input,
    output,
    inputTokens,
    outputTokens,
    totalTokens,
    estimatedCost,
    conversationId,
  });
  
  // Update daily stats
  const dateStr = new Date().toISOString().split('T')[0];
  const prefs = await getPreferences();
  await updateDailyStats(dateStr, platform, {
    platform,
    startTime: new Date(),
    inputTokens,
    outputTokens,
    totalTokens,
    estimatedCost,
    laborValue: calculateLaborValue(outputTokens, prefs.hourlyRate),
  });
  
  console.log(`[AI Labor Tracker] Labor record added: ${record.id}, model: ${model}, tokens: ${totalTokens}`);
  
  return { record };
}

/**
 * Get labor records
 */
async function handleGetRecords(filter?: RecordsFilter): Promise<{ records: LaborRecord[] }> {
  const records = filter ? await getLaborRecords(filter) : await getAllLaborRecords();
  return { records };
}

/**
 * Delete a labor record
 */
async function handleDeleteRecord(payload: { id: number }): Promise<{ success: boolean }> {
  await deleteLaborRecord(payload.id);
  console.log(`[AI Labor Tracker] Record deleted: ${payload.id}`);
  return { success: true };
}

/**
 * Search labor records
 */
async function handleSearchRecords(filter: RecordsFilter): Promise<{ records: LaborRecord[] }> {
  const records = await getLaborRecords(filter);
  return { records };
}

/**
 * Get settings
 */
async function handleGetSettings(): Promise<{ settings: Settings }> {
  const settings = await getSettings();
  return { settings };
}

/**
 * Update settings
 */
async function handleUpdateSettings(payload: Partial<Settings>): Promise<{ settings: Settings }> {
  const settings = await updateSettings(payload);
  
  // Notify content scripts of settings change
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'SETTINGS_UPDATED',
          payload: settings,
        }).catch(() => {
          // Tab may not have content script
        });
      }
    }
  });
  
  console.log('[AI Labor Tracker] Settings updated');
  return { settings };
}

/**
 * Clear all data
 */
async function handleClearData(): Promise<{ success: boolean }> {
  await clearAllData();
  console.log('[AI Labor Tracker] All data cleared');
  return { success: true };
}

// Log when service worker starts
console.log('[AI Labor Tracker] Service worker started');
