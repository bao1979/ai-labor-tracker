import { useLanguage, interpolate } from '../i18n';

interface HeaderProps {
  activeSessions: number;
}

export function Header({ activeSessions }: HeaderProps) {
  const { t } = useLanguage();
  
  return (
    <header className="flex items-center justify-between p-4 bg-tracker-card border-b border-tracker-accent">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-deepseek-500 rounded-lg flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-base font-bold text-white">{t.header.title}</h1>
          <p className="text-xs text-gray-500">{t.header.subtitle}</p>
        </div>
      </div>
      
      {activeSessions > 0 && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-tracker-success/10 rounded-full">
          <span className="w-2 h-2 bg-tracker-success rounded-full animate-pulse"></span>
          <span className="text-xs text-tracker-success font-medium">
            {interpolate(t.header.activeCount, { count: activeSessions })}
          </span>
        </div>
      )}
    </header>
  );
}
