import type { DailyStats } from '@/types';
import { formatTokenCount, formatCurrency } from '@/utils';
import { useLanguage } from '../i18n';

interface StatsOverviewProps {
  dailyStats: DailyStats[];
}

export function StatsOverview({ dailyStats }: StatsOverviewProps) {
  const { t } = useLanguage();
  
  // Calculate totals from all daily stats
  const totals = dailyStats.reduce(
    (acc, stat) => ({
      tokens: acc.tokens + stat.totalTokens,
      cost: acc.cost + stat.totalEstimatedCost,
      laborValue: acc.laborValue + stat.totalLaborValue,
      sessions: acc.sessions + stat.totalSessions,
    }),
    { tokens: 0, cost: 0, laborValue: 0, sessions: 0 }
  );

  // Get today's stats
  const today = new Date().toISOString().split('T')[0];
  const todayStats = dailyStats.filter((s) => s.date === today);
  const todayTotals = todayStats.reduce(
    (acc, stat) => ({
      tokens: acc.tokens + stat.totalTokens,
      cost: acc.cost + stat.totalEstimatedCost,
      laborValue: acc.laborValue + stat.totalLaborValue,
      sessions: acc.sessions + stat.totalSessions,
    }),
    { tokens: 0, cost: 0, laborValue: 0, sessions: 0 }
  );

  return (
    <div className="space-y-4">
      {/* Today's Stats */}
      <div className="bg-tracker-card rounded-lg p-4">
        <h2 className="text-sm font-medium text-gray-400 mb-3">{t.stats.today}</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label={t.stats.tokens}
            value={formatTokenCount(todayTotals.tokens)}
            subValue={`${todayTotals.sessions} ${t.common.sessions}`}
          />
          <StatCard
            label={t.stats.estCost}
            value={formatCurrency(todayTotals.cost)}
            highlight
          />
          <StatCard
            label={t.stats.laborValue}
            value={formatCurrency(todayTotals.laborValue)}
            subValue={t.stats.ifDoneManually}
          />
          <StatCard
            label={t.stats.savings}
            value={formatCurrency(Math.max(0, todayTotals.laborValue - todayTotals.cost))}
            highlight
          />
        </div>
      </div>

      {/* All-Time Stats */}
      <div className="bg-tracker-card rounded-lg p-4">
        <h2 className="text-sm font-medium text-gray-400 mb-3">{t.stats.allTime}</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label={t.stats.totalTokens}
            value={formatTokenCount(totals.tokens)}
            subValue={`${totals.sessions} ${t.common.sessions}`}
          />
          <StatCard
            label={t.stats.totalCost}
            value={formatCurrency(totals.cost)}
          />
          <StatCard
            label={t.stats.totalLaborValue}
            value={formatCurrency(totals.laborValue)}
          />
          <StatCard
            label={t.stats.totalSavings}
            value={formatCurrency(Math.max(0, totals.laborValue - totals.cost))}
            highlight
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  highlight?: boolean;
}

function StatCard({ label, value, subValue, highlight }: StatCardProps) {
  return (
    <div className="bg-tracker-accent bg-opacity-50 rounded-lg p-3">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div
        className={`text-lg font-bold ${
          highlight ? 'text-primary-400' : 'text-white'
        }`}
      >
        {value}
      </div>
      {subValue && (
        <div className="text-xs text-gray-500 mt-0.5">{subValue}</div>
      )}
    </div>
  );
}
