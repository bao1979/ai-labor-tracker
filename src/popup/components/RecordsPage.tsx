import { useState, useMemo } from 'react';
import type { LaborRecord, AIPlatform } from '@/types';
import { formatTokenCount, getPlatformDisplayName } from '@/utils';

interface RecordsPageProps {
  records: LaborRecord[];
  onDeleteRecord: (id: number) => void;
  onRefresh: () => void;
}

export function RecordsPage({ records, onDeleteRecord, onRefresh }: RecordsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<AIPlatform | 'all'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Get unique platforms from records
  const platforms = useMemo(() => {
    const unique = new Set(records.map(r => r.platform));
    return Array.from(unique);
  }, [records]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      // Platform filter
      if (platformFilter !== 'all' && record.platform !== platformFilter) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          record.input.toLowerCase().includes(query) ||
          record.output.toLowerCase().includes(query) ||
          record.model.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [records, platformFilter, searchQuery]);

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this record?')) {
      onDeleteRecord(id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter */}
      <div className="p-4 space-y-2 border-b border-tracker-accent">
        {/* Search */}
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-tracker-accent border border-tracker-accent rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500"
          />
        </div>
        
        {/* Platform Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setPlatformFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              platformFilter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-tracker-accent text-gray-400 hover:text-white'
            }`}
          >
            All ({records.length})
          </button>
          {platforms.map(platform => (
            <button
              key={platform}
              onClick={() => setPlatformFilter(platform)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                platformFilter === platform
                  ? 'bg-primary-500 text-white'
                  : 'bg-tracker-accent text-gray-400 hover:text-white'
              }`}
            >
              {getPlatformDisplayName(platform)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Records List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
            <svg className="w-12 h-12 mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">
              {records.length === 0 
                ? 'No records yet' 
                : 'No matching records'}
            </p>
            {records.length === 0 && (
              <p className="text-xs mt-1 text-gray-600">
                Start chatting with AI to capture interactions
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-tracker-accent">
            {filteredRecords.map(record => (
              <RecordItem
                key={record.id}
                record={record}
                isExpanded={expandedId === record.id}
                onToggle={() => setExpandedId(expandedId === record.id ? null : record.id!)}
                onDelete={(e) => handleDelete(record.id!, e)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-tracker-accent flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {filteredRecords.length} of {records.length} records
        </span>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );
}

interface RecordItemProps {
  record: LaborRecord;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

function RecordItem({ record, isExpanded, onToggle, onDelete }: RecordItemProps) {
  const timestamp = new Date(record.timestamp);
  const timeStr = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <div className="bg-tracker-card">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-tracker-accent/50 transition-colors text-left"
      >
        {/* Platform Icon */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          record.platform === 'deepseek' ? 'bg-deepseek-500/20' : 'bg-primary-500/20'
        }`}>
          <span className={`text-xs font-bold ${
            record.platform === 'deepseek' ? 'text-deepseek-400' : 'text-primary-400'
          }`}>
            {record.platform.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-white truncate">
              {record.model}
            </span>
            <span className="text-xs text-gray-500">
              {dateStr} {timeStr}
            </span>
          </div>
          <p className="text-xs text-gray-400 line-clamp-2">
            {record.input.substring(0, 100)}{record.input.length > 100 ? '...' : ''}
          </p>
        </div>
        
        {/* Stats */}
        <div className="flex flex-col items-end flex-shrink-0">
          <span className="text-xs text-primary-400 font-medium">
            {formatTokenCount(record.totalTokens)}
          </span>
          <span className="text-xs text-gray-500">tokens</span>
        </div>
        
        {/* Expand Icon */}
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Input */}
          <div>
            <div className="text-xs text-gray-500 mb-1">Input ({record.inputTokens} tokens)</div>
            <div className="bg-tracker-accent rounded-lg p-3 text-xs text-gray-300 max-h-24 overflow-y-auto whitespace-pre-wrap">
              {record.input}
            </div>
          </div>
          
          {/* Output */}
          <div>
            <div className="text-xs text-gray-500 mb-1">Output ({record.outputTokens} tokens)</div>
            <div className="bg-tracker-accent rounded-lg p-3 text-xs text-gray-300 max-h-32 overflow-y-auto whitespace-pre-wrap">
              {record.output.substring(0, 500)}{record.output.length > 500 ? '...' : ''}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-tracker-accent">
            <div className="text-xs text-gray-500">
              Est. cost: ${record.estimatedCost.toFixed(6)}
            </div>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
