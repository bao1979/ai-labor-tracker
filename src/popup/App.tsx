import { useState, useEffect, useCallback } from 'react';
import type { StatsResponse, LaborRecord, Settings } from '@/types';
import { Header } from './components/Header';
import { OverviewPage } from './components/OverviewPage';
import { RecordsPage } from './components/RecordsPage';
import { SettingsPage } from './components/SettingsPage';

type TabId = 'overview' | 'records' | 'settings';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'records',
    label: 'Records',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [records, setRecords] = useState<LaborRecord[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [statsResponse, recordsResponse, settingsResponse] = await Promise.all([
        chrome.runtime.sendMessage({ type: 'GET_STATS' }) as Promise<StatsResponse>,
        chrome.runtime.sendMessage({ type: 'GET_RECORDS' }) as Promise<{ records: LaborRecord[] }>,
        chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }) as Promise<{ settings: Settings }>,
      ]);

      setStats(statsResponse);
      setRecords(recordsResponse.records);
      setSettings(settingsResponse.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSettingsUpdate = async (updates: Partial<Settings>) => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'UPDATE_SETTINGS',
        payload: updates,
      }) as { settings: Settings };
      setSettings(response.settings);
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  const handleClearData = async () => {
    try {
      await chrome.runtime.sendMessage({ type: 'CLEAR_DATA' });
      await loadData();
    } catch (err) {
      console.error('Failed to clear data:', err);
    }
  };

  const handleDeleteRecord = async (id: number) => {
    try {
      await chrome.runtime.sendMessage({
        type: 'DELETE_RECORD',
        payload: { id },
      });
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete record:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px] bg-tracker-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-tracker-bg p-4">
        <div className="text-red-400 mb-4 text-center">{error}</div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[500px] max-h-[600px] bg-tracker-bg">
      <Header activeSessions={stats?.activeSessions ?? 0} />
      
      {/* Tab Navigation */}
      <nav className="flex border-b border-tracker-accent bg-tracker-card">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === tab.id 
                ? 'text-primary-400 border-b-2 border-primary-500 -mb-[1px]' 
                : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
      
      {/* Tab Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="tab-content">
          {activeTab === 'overview' && stats && (
            <OverviewPage stats={stats} records={records} />
          )}
          {activeTab === 'records' && (
            <RecordsPage 
              records={records} 
              onDeleteRecord={handleDeleteRecord}
              onRefresh={loadData}
            />
          )}
          {activeTab === 'settings' && settings && (
            <SettingsPage 
              settings={settings}
              onSettingsUpdate={handleSettingsUpdate}
              onClearData={handleClearData}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
