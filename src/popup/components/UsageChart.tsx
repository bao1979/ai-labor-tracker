import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyStats, ChartDataPoint } from '@/types';

interface UsageChartProps {
  dailyStats: DailyStats[];
}

export function UsageChart({ dailyStats }: UsageChartProps) {
  // Aggregate stats by date
  const chartData = aggregateByDate(dailyStats);

  if (chartData.length === 0) {
    return (
      <div className="bg-tracker-card rounded-lg p-4">
        <h2 className="text-sm font-medium text-gray-400 mb-3">Usage Trend</h2>
        <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
          No data yet. Start using AI to see your trends!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-tracker-card rounded-lg p-4">
      <h2 className="text-sm font-medium text-gray-400 mb-3">Usage Trend (7 Days)</h2>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData.slice(-7)}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#16213e" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={10}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={10}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`;
                }
                return value;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #16213e',
                borderRadius: '8px',
                color: '#fff',
              }}
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString();
              }}
              formatter={(value: number, name: string) => {
                if (name === 'tokens') {
                  return [value.toLocaleString(), 'Tokens'];
                }
                return [value, name];
              }}
            />
            <Area
              type="monotone"
              dataKey="tokens"
              stroke="#6366f1"
              fillOpacity={1}
              fill="url(#colorTokens)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Aggregate daily stats by date
 */
function aggregateByDate(dailyStats: DailyStats[]): ChartDataPoint[] {
  const byDate = new Map<string, ChartDataPoint>();

  for (const stat of dailyStats) {
    const existing = byDate.get(stat.date);
    if (existing) {
      existing.tokens += stat.totalTokens;
      existing.cost += stat.totalEstimatedCost;
      existing.laborValue += stat.totalLaborValue;
      existing.sessions += stat.totalSessions;
    } else {
      byDate.set(stat.date, {
        date: stat.date,
        tokens: stat.totalTokens,
        cost: stat.totalEstimatedCost,
        laborValue: stat.totalLaborValue,
        sessions: stat.totalSessions,
      });
    }
  }

  // Sort by date
  return Array.from(byDate.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
