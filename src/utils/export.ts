import type { ExportData, AISession, DailyStats, UserPreferences, LaborRecord, Settings } from '@/types';

/**
 * Export data to JSON format with metadata
 */
export function exportToJSON(
  records: LaborRecord[],
  sessions: AISession[],
  dailyStats: DailyStats[],
  preferences: UserPreferences,
  settings: Settings
): string {
  const exportData: ExportData = {
    exportedAt: new Date().toISOString(),
    version: '0.1.0',
    totalRecords: records.length,
    metadata: {
      exportVersion: '1.0',
      generatedAt: new Date().toISOString(),
      platform: 'AI Labor Tracker',
    },
    records,
    sessions,
    dailyStats,
    preferences,
    settings,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export data to CSV format (sessions only)
 */
export function exportToCSV(sessions: AISession[]): string {
  const headers = [
    'ID',
    'Platform',
    'Start Time',
    'End Time',
    'Input Tokens',
    'Output Tokens',
    'Total Tokens',
    'Estimated Cost',
    'Labor Value',
    'Conversation ID',
  ];

  const rows = sessions.map((session) => [
    session.id?.toString() ?? '',
    session.platform,
    session.startTime instanceof Date 
      ? session.startTime.toISOString() 
      : String(session.startTime),
    session.endTime instanceof Date 
      ? session.endTime.toISOString() 
      : session.endTime ?? '',
    session.inputTokens.toString(),
    session.outputTokens.toString(),
    session.totalTokens.toString(),
    session.estimatedCost.toFixed(6),
    session.laborValue.toFixed(2),
    session.conversationId ?? '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map(escapeCSVField).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Escape CSV field content
 */
function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Download data as a file
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Generate filename with timestamp
 */
export function generateExportFilename(
  prefix: string,
  extension: string
): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${prefix}-${timestamp}.${extension}`;
}
