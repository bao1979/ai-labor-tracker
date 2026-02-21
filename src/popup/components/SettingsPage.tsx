import { useState } from 'react';
import type { Settings, AIPlatform } from '@/types';
import { useLanguage, type Language } from '../i18n';

interface SettingsPageProps {
  settings: Settings;
  onSettingsUpdate: (updates: Partial<Settings>) => void;
  onClearData: () => void;
}

const PLATFORMS: { id: AIPlatform; name: string; nameZh: string; color: string }[] = [
  { id: 'deepseek', name: 'DeepSeek', nameZh: 'DeepSeek', color: 'bg-deepseek-500' },
  { id: 'chatgpt', name: 'ChatGPT', nameZh: 'ChatGPT', color: 'bg-green-500' },
  { id: 'claude', name: 'Claude', nameZh: 'Claude', color: 'bg-orange-500' },
  { id: 'kimi', name: 'Kimi', nameZh: 'Kimi (月之暗面)', color: 'bg-blue-500' },
  { id: 'qianwen', name: 'Qianwen', nameZh: '通义千问', color: 'bg-purple-500' },
  { id: 'doubao', name: 'Doubao', nameZh: '豆包', color: 'bg-cyan-500' },
  { id: 'tiangong', name: 'Tiangong', nameZh: '天工', color: 'bg-indigo-500' },
];

export function SettingsPage({ settings, onSettingsUpdate, onClearData }: SettingsPageProps) {
  const { t, language, setLanguage } = useLanguage();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [retentionDays, setRetentionDays] = useState(settings.dataRetentionDays.toString());

  const handleCaptureToggle = () => {
    onSettingsUpdate({ captureEnabled: !settings.captureEnabled });
  };

  const handlePlatformToggle = (platform: AIPlatform) => {
    onSettingsUpdate({
      enabledPlatforms: {
        ...settings.enabledPlatforms,
        [platform]: !settings.enabledPlatforms[platform],
      },
    });
  };

  const handleRetentionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRetentionDays(value);
  };

  const handleRetentionBlur = () => {
    const days = parseInt(retentionDays, 10);
    if (!isNaN(days) && days >= 1 && days <= 365) {
      onSettingsUpdate({ dataRetentionDays: days });
    } else {
      setRetentionDays(settings.dataRetentionDays.toString());
    }
  };

  const handleClearData = () => {
    onClearData();
    setShowClearConfirm(false);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Language Settings */}
      <section className="bg-tracker-card rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-white">{t.settings.language}</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white">{t.settings.language}</div>
            <div className="text-xs text-gray-500">{t.settings.languageDescription}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                language === 'en'
                  ? 'bg-primary-500 text-white'
                  : 'bg-tracker-accent text-gray-400 hover:text-white'
              }`}
            >
              {t.settings.english}
            </button>
            <button
              onClick={() => handleLanguageChange('zh')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                language === 'zh'
                  ? 'bg-primary-500 text-white'
                  : 'bg-tracker-accent text-gray-400 hover:text-white'
              }`}
            >
              {t.settings.chinese}
            </button>
          </div>
        </div>
      </section>

      {/* Capture Settings */}
      <section className="bg-tracker-card rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-white">{t.settings.captureSettings}</h3>
        
        {/* Main Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white">{t.settings.enableCapture}</div>
            <div className="text-xs text-gray-500">{t.settings.trackAutomatically}</div>
          </div>
          <Toggle
            enabled={settings.captureEnabled}
            onToggle={handleCaptureToggle}
          />
        </div>
        
        {/* Platform Toggles */}
        <div className="pt-3 border-t border-tracker-accent space-y-3">
          <div className="text-xs text-gray-400">{t.settings.enabledPlatforms}</div>
          {PLATFORMS.map(platform => (
            <div key={platform.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${platform.color}`} />
                <span className="text-sm text-gray-300">{language === 'zh' ? platform.nameZh : platform.name}</span>
              </div>
              <Toggle
                enabled={settings.enabledPlatforms[platform.id] ?? true}
                onToggle={() => handlePlatformToggle(platform.id)}
                disabled={!settings.captureEnabled}
              />
            </div>
          ))}
        </div>
      </section>
      
      {/* Data Settings */}
      <section className="bg-tracker-card rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-white">{t.settings.dataSettings}</h3>
        
        {/* Retention Days */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white">{t.settings.dataRetention}</div>
            <div className="text-xs text-gray-500">{t.settings.daysToKeep}</div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="365"
              value={retentionDays}
              onChange={handleRetentionChange}
              onBlur={handleRetentionBlur}
              className="w-16 px-2 py-1 bg-tracker-accent border border-tracker-accent rounded text-sm text-white text-center focus:outline-none focus:border-primary-500"
            />
            <span className="text-xs text-gray-500">{t.common.days}</span>
          </div>
        </div>
        
        {/* Clear Data */}
        <div className="pt-3 border-t border-tracker-accent">
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-2 px-4 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
              {t.settings.clearAllData}
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-red-400 text-center">
                {t.settings.clearConfirmMessage}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 px-4 bg-tracker-accent text-gray-300 rounded-lg text-sm hover:bg-opacity-80 transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  {t.settings.deleteAll}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* About */}
      <section className="bg-tracker-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3">{t.settings.about}</h3>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>{t.settings.version}</span>
            <span className="text-gray-300">0.1.0</span>
          </div>
          <div className="flex justify-between">
            <span>{t.settings.developer}</span>
            <span className="text-gray-300">{t.settings.developerName}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-tracker-accent">
          <p className="text-xs text-gray-500">
            {t.settings.aboutDescription}
          </p>
        </div>
      </section>
    </div>
  );
}

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function Toggle({ enabled, onToggle, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${enabled ? 'bg-primary-500' : 'bg-tracker-accent'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
          ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}
