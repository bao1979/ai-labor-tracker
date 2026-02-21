import type { AIPlatform, PlatformPricing } from '@/types';

/**
 * Platform pricing configuration
 * Prices are per 1000 tokens in USD
 */
export const PLATFORM_PRICING: Record<AIPlatform, PlatformPricing> = {
  deepseek: {
    platform: 'deepseek',
    inputTokenCostPer1k: 0.0001, // DeepSeek V3 pricing
    outputTokenCostPer1k: 0.0002,
    currency: 'USD',
  },
  chatgpt: {
    platform: 'chatgpt',
    inputTokenCostPer1k: 0.0015, // GPT-4 Turbo approximate
    outputTokenCostPer1k: 0.002,
    currency: 'USD',
  },
  claude: {
    platform: 'claude',
    inputTokenCostPer1k: 0.003, // Claude 3 Sonnet approximate
    outputTokenCostPer1k: 0.015,
    currency: 'USD',
  },
  other: {
    platform: 'other',
    inputTokenCostPer1k: 0.001,
    outputTokenCostPer1k: 0.002,
    currency: 'USD',
  },
};

/**
 * Calculate estimated API cost
 */
export function calculateCost(
  platform: AIPlatform,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = PLATFORM_PRICING[platform];
  const inputCost = (inputTokens / 1000) * pricing.inputTokenCostPer1k;
  const outputCost = (outputTokens / 1000) * pricing.outputTokenCostPer1k;
  return inputCost + outputCost;
}

/**
 * Calculate labor value based on equivalent human time
 * Assumes average human typing speed and research time
 */
export function calculateLaborValue(
  outputTokens: number,
  hourlyRate: number
): number {
  // Estimate: ~50 words per minute for human writing
  // Average word is ~1.3 tokens, so ~65 tokens per minute
  // This gives us equivalent human hours for the output
  const equivalentMinutes = outputTokens / 65;
  const equivalentHours = equivalentMinutes / 60;
  return equivalentHours * hourlyRate;
}

/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
}

/**
 * Get platform display name
 */
export function getPlatformDisplayName(platform: AIPlatform): string {
  const names: Record<AIPlatform, string> = {
    deepseek: 'DeepSeek',
    chatgpt: 'ChatGPT',
    claude: 'Claude',
    other: 'Other',
  };
  return names[platform];
}
