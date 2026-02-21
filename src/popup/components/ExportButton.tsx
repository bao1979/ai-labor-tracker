import { useState } from 'react';
import type { AISession, DailyStats, UserPreferences, LaborRecord, Settings } from '@/types';
import {
  exportToJSON,
  exportToCSV,
  downloadFile,
  generateExportFilename,
} from '@/utils';
import { useLanguage } from '../i18n';

interface ExportButtonProps {
  records?: LaborRecord[];
}

export function ExportButton({ records = [] }: ExportButtonProps) {
  const { t } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleExport = async (format: 'json' | 'csv') => {
    setIsExporting(true);
    setShowOptions(false);

    try {
      // Fetch all data
      const [sessionsResponse, statsResponse, settingsResponse] = await Promise.all([
        chrome.runtime.sendMessage({ type: 'GET_SESSIONS' }) as Promise<{ sessions: AISession[] }>,
        chrome.runtime.sendMessage({ type: 'GET_STATS' }) as Promise<{ dailyStats: DailyStats[] }>,
        chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }) as Promise<{ settings: Settings }>,
      ]);

      // Get preferences (mock for now)
      const preferences: UserPreferences = {
        hourlyRate: 50,
        currency: 'USD',
        trackingEnabled: true,
        platforms: ['deepseek', 'chatgpt', 'claude', 'kimi', 'qianwen', 'doubao', 'tiangong'],
      };

      if (format === 'json') {
        const content = exportToJSON(
          records,
          sessionsResponse.sessions,
          statsResponse.dailyStats,
          preferences,
          settingsResponse.settings
        );
        const filename = generateExportFilename('ai-labor-tracker', 'json');
        downloadFile(content, filename, 'application/json');
      } else {
        const content = exportToCSV(sessionsResponse.sessions);
        const filename = generateExportFilename('ai-labor-tracker', 'csv');
        downloadFile(content, filename, 'text/csv');
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isExporting}
        className="w-full py-2.5 px-4 bg-primary-500 text-white rounded-lg 
                   font-medium hover:bg-primary-600 disabled:opacity-50 
                   disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>{t.export.exporting}</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{t.export.exportData}</span>
          </>
        )}
      </button>

      {showOptions && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-tracker-card 
                        border border-tracker-accent rounded-lg overflow-hidden shadow-lg z-10">
          <button
            onClick={() => handleExport('json')}
            className="w-full py-2.5 px-4 text-left text-sm text-white 
                       hover:bg-tracker-accent transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t.export.exportAsJson}
            <span className="text-xs text-gray-500 ml-auto">{t.export.fullData}</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="w-full py-2.5 px-4 text-left text-sm text-white 
                       hover:bg-tracker-accent transition-colors border-t border-tracker-accent flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {t.export.exportAsCsv}
            <span className="text-xs text-gray-500 ml-auto">{t.export.sessionsOnly}</span>
          </button>
        </div>
      )}
    </div>
  );
}
