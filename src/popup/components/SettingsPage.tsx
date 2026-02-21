import { useState } from 'react';
import type { Settings, AIPlatform } from '@/types';

interface SettingsPageProps {
  settings: Settings;
  onSettingsUpdate: (updates: Partial<Settings>) => void;
  onClearData: () => void;
}

const PLATFORMS: { id: AIPlatform; name: string; color: string }[] = [
  { id: 'deepseek', name: 'DeepSeek', color: 'bg-deepseek-500' },
  { id: 'chatgpt', name: 'ChatGPT', color: 'bg-green-500' },
  { id: 'claude', name: 'Claude', color: 'bg-orange-500' },
];

export function SettingsPage({ settings, onSettingsUpdate, onClearData }: SettingsPageProps) {
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

  return (
    <div className="p-4 space-y-4">
      {/* Capture Settings */}
      <section className="bg-tracker-card rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-medium text-white">Capture Settings</h3>
        
        {/* Main Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white">Enable Capture</div>
            <div className="text-xs text-gray-500">Track AI interactions automatically</div>
          </div>
          <Toggle
            enabled={settings.captureEnabled}
            onToggle={handleCaptureToggle}
          />
        </div>
        
        {/* Platform Toggles */}
        <div className="pt-3 border-t border-tracker-accent space-y-3">
          <div className="text-xs text-gray-400">Enabled Platforms</div>
          {PLATFORMS.map(platform => (
            <div key={platform.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${platform.color}`} />
                <span className="text-sm text-gray-300">{platform.name}</span>
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
        <h3 className="text-sm font-medium text-white">Data Settings</h3>
        
        {/* Retention Days */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white">Data Retention</div>
            <div className="text-xs text-gray-500">Days to keep records</div>
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
            <span className="text-xs text-gray-500">days</span>
          </div>
        </div>
        
        {/* Clear Data */}
        <div className="pt-3 border-t border-tracker-accent">
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-2 px-4 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
              Clear All Data
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-red-400 text-center">
                This will permanently delete all records. Are you sure?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 px-4 bg-tracker-accent text-gray-300 rounded-lg text-sm hover:bg-opacity-80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Delete All
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* About */}
      <section className="bg-tracker-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3">About</h3>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Version</span>
            <span className="text-gray-300">0.1.0</span>
          </div>
          <div className="flex justify-between">
            <span>Developer</span>
            <span className="text-gray-300">AI Labor Tracker</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-tracker-accent">
          <p className="text-xs text-gray-500">
            Track your AI interactions, estimate token usage, and export your data.
            All data is stored locally on your device.
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
