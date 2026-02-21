import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import type { StatsResponse, LaborRecord, AggregatedStats } from '@/types';
import { formatTokenCount, formatCurrency } from '@/utils';
import { ExportButton } from './ExportButton';

interface OverviewPageProps {
  stats: StatsResponse;
  records: LaborRecord[];
}

const COLORS = ['#6366f1', '#4d6bfe', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function OverviewPage({ stats, records }: OverviewPageProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Stats Cards */}
      <StatsCards stats={stats} />
      
      {/* Model Distribution */}
      <ModelDistribution data={stats.modelDistribution} />
      
      {/* Usage Trend */}
      <UsageTrend dailyStats={stats.dailyStats} />
      
      {/* Export */}
      <div className="pt-2">
        <ExportButton records={records} />
      </div>
    </div>
  );
}

interface StatsCardsProps {
  stats: StatsResponse;
}

function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="space-y-3">
      {/* Period Tabs */}
      <div className="grid grid-cols-4 gap-2">
        <StatPeriodCard label="Today" stats={stats.today} />
        <StatPeriodCard label="Week" stats={stats.week} />
        <StatPeriodCard label="Month" stats={stats.month} />
        <StatPeriodCard label="Total" stats={stats.total} highlight />
      </div>
      
      {/* Detailed Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-tracker-card rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Total Tokens</div>
          <div className="text-lg font-bold text-white">
            {formatTokenCount(stats.total.totalTokens)}
          </div>
          <div className="text-xs text-gray-500">
            {formatTokenCount(stats.total.totalInputTokens)} in / {formatTokenCount(stats.total.totalOutputTokens)} out
          </div>
        </div>
        <div className="bg-tracker-card rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Est. Cost</div>
          <div className="text-lg font-bold text-primary-400">
            {formatCurrency(stats.total.totalEstimatedCost)}
          </div>
          <div className="text-xs text-gray-500">
            {stats.total.totalRecords} interactions
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatPeriodCardProps {
  label: string;
  stats: AggregatedStats;
  highlight?: boolean;
}

function StatPeriodCard({ label, stats, highlight }: StatPeriodCardProps) {
  return (
    <div className={`rounded-lg p-2 text-center ${highlight ? 'bg-primary-500/20 border border-primary-500/30' : 'bg-tracker-card'}`}>
      <div className="text-xs text-gray-400">{label}</div>
      <div className={`text-sm font-bold ${highlight ? 'text-primary-400' : 'text-white'}`}>
        {stats.totalRecords}
      </div>
      <div className="text-xs text-gray-500">
        {formatTokenCount(stats.totalTokens)}
      </div>
    </div>
  );
}

interface ModelDistributionProps {
  data: { model: string; count: number; tokens: number }[];
}

function ModelDistribution({ data }: ModelDistributionProps) {
  if (data.length === 0) {
    return (
      <div className="bg-tracker-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Model Distribution</h3>
        <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
          No data yet
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const chartData = data.slice(0, 5).map((item, index) => ({
    ...item,
    shortName: item.model.length > 12 ? item.model.substring(0, 12) + '...' : item.model,
    fill: COLORS[index % COLORS.length],
  }));

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-tracker-card rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-3">Model Distribution</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="model"
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={45}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid #16213e',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value} (${((value / total) * 100).toFixed(0)}%)`, 'Count']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="space-y-1.5 overflow-y-auto max-h-32">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0" 
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-gray-300 truncate flex-1">{item.model}</span>
              <span className="text-gray-500">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface UsageTrendProps {
  dailyStats: StatsResponse['dailyStats'];
}

function UsageTrend({ dailyStats }: UsageTrendProps) {
  // Aggregate stats by date
  const aggregatedData = aggregateByDate(dailyStats);
  
  // Fill in missing dates for the last 30 days
  const chartData = fillMissingDates(aggregatedData, 30);

  if (chartData.length === 0) {
    return (
      <div className="bg-tracker-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Usage Trend (30 Days)</h3>
        <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
          No data yet. Start using AI to see your trends!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-tracker-card rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-3">Usage Trend (30 Days)</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#16213e" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={9}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#6b7280"
              fontSize={10}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`;
                }
                return value.toString();
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #16213e',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              labelFormatter={(value) => {
                const date = new Date(value as string);
                return date.toLocaleDateString();
              }}
              formatter={(value: number, name: string) => {
                if (name === 'tokens') {
                  return [value.toLocaleString(), 'Tokens'];
                }
                return [value, name];
              }}
            />
            <Line
              type="monotone"
              dataKey="tokens"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#6366f1' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface ChartDataPoint {
  date: string;
  tokens: number;
  sessions: number;
}

function aggregateByDate(dailyStats: StatsResponse['dailyStats']): ChartDataPoint[] {
  const byDate = new Map<string, ChartDataPoint>();

  for (const stat of dailyStats) {
    const existing = byDate.get(stat.date);
    if (existing) {
      existing.tokens += stat.totalTokens;
      existing.sessions += stat.totalSessions;
    } else {
      byDate.set(stat.date, {
        date: stat.date,
        tokens: stat.totalTokens,
        sessions: stat.totalSessions,
      });
    }
  }

  return Array.from(byDate.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

function fillMissingDates(data: ChartDataPoint[], days: number): ChartDataPoint[] {
  const result: ChartDataPoint[] = [];
  const dataMap = new Map(data.map(d => [d.date, d]));
  
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    result.push(dataMap.get(dateStr) || {
      date: dateStr,
      tokens: 0,
      sessions: 0,
    });
  }
  
  return result;
}
