import type { TokenEstimation } from '@/types';

/**
 * Regular expression to match Chinese characters
 */
const CHINESE_CHAR_REGEX = /[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf\uf900-\ufaff\u2f800-\u2fa1f]/g;

/**
 * Estimate tokens from text content
 * Uses a simple heuristic:
 * - ~4 characters per token for English text
 * - ~1.5 characters per token for Chinese text
 * This is an approximation; actual tokenization varies by model
 */
export function estimateTokensFromText(text: string): number {
  if (!text || text.length === 0) {
    return 0;
  }
  
  const cleanText = text.trim();
  
  // Count Chinese characters
  const chineseChars = cleanText.match(CHINESE_CHAR_REGEX) || [];
  const chineseCharCount = chineseChars.length;
  
  // Remove Chinese characters to count English/other characters
  const nonChineseText = cleanText.replace(CHINESE_CHAR_REGEX, '');
  const nonChineseCharCount = nonChineseText.length;
  
  // Estimate tokens for Chinese: ~1.5 characters per token
  const chineseTokens = Math.ceil(chineseCharCount / 1.5);
  
  // Estimate tokens for English/other: ~4 characters per token
  const wordCount = nonChineseText.split(/\s+/).filter(Boolean).length;
  const charBasedEstimate = Math.ceil(nonChineseCharCount / 4);
  const wordBasedEstimate = Math.ceil(wordCount * 1.3); // ~1.3 tokens per word
  const nonChineseTokens = Math.round((charBasedEstimate + wordBasedEstimate) / 2);
  
  return chineseTokens + nonChineseTokens;
}

/**
 * Estimate tokens from input and output text
 */
export function estimateTokens(
  inputText: string,
  outputText: string
): TokenEstimation {
  const inputTokens = estimateTokensFromText(inputText);
  const outputTokens = estimateTokensFromText(outputText);
  
  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
  };
}

/**
 * Format token count for display
 */
export function formatTokenCount(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(1)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}K`;
  }
  return tokens.toString();
}
