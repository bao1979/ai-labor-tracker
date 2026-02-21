/**
 * AI Labor Tracker - Tiangong/天工 (Kunlun) Content Script
 * Monitors Tiangong chat interactions and tracks token usage
 */

import type { Message, AddLaborRecordPayload } from '@/types';
import { estimateTokensFromText } from '@/utils';

// State management
let isCapturing = true;
let lastProcessedResponse: string | null = null;
let processingTimeout: ReturnType<typeof setTimeout> | null = null;

// Tiangong model name (default, may be updated from page)
let currentModel = 'Tiangong';

/**
 * Send message to background service worker
 */
function sendMessage<T>(message: Message): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else if (response?.error) {
        reject(new Error(response.error));
      } else {
        resolve(response);
      }
    });
  });
}

/**
 * Extract conversation ID from URL
 */
function getConversationId(): string | undefined {
  const match = window.location.pathname.match(/\/chat\/([^/]+)/) ||
                window.location.search.match(/[?&]id=([^&]+)/);
  return match?.[1];
}

/**
 * Detect model name from the page
 */
function detectModelName(): string {
  // Try to find model selector or indicator on the page
  const modelSelectors = [
    '[class*="model-selector"]',
    '[class*="model-name"]',
    '[data-model]',
    '.model-indicator',
    'button[aria-label*="model"]',
    '[class*="model"]',
    '[class*="tiangong"]',
  ];
  
  for (const selector of modelSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.textContent?.trim();
      if (text && text.length > 0 && text.length < 50) {
        return text;
      }
      const dataModel = element.getAttribute('data-model');
      if (dataModel) {
        return dataModel;
      }
    }
  }
  
  // Check page title or meta
  const title = document.title;
  if (title.includes('天工') || title.includes('Tiangong')) {
    if (title.includes('Pro')) return 'Tiangong-Pro';
    if (title.includes('4.0')) return 'Tiangong-4.0';
    return 'Tiangong';
  }
  
  return currentModel;
}

/**
 * Find user message elements
 */
function findUserMessages(): Element[] {
  const selectors = [
    '[class*="user"][class*="message"]',
    '[class*="user-message"]',
    '[data-role="user"]',
    '.user-bubble',
    '[class*="human"]',
    '[class*="question"]',
    '[class*="input-content"]',
    '[class*="userMessage"]',
  ];
  
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      return Array.from(elements);
    }
  }
  
  // Fallback: look for elements with specific structure
  const chatContainer = document.querySelector('[class*="chat"]');
  if (chatContainer) {
    const messageGroups = chatContainer.querySelectorAll('[class*="group"]');
    return Array.from(messageGroups).filter(el => {
      const text = el.textContent || '';
      return text.length > 0 && text.length < 10000;
    });
  }
  
  return [];
}

/**
 * Find AI response elements
 */
function findAIResponses(): Element[] {
  const selectors = [
    '[class*="assistant"][class*="message"]',
    '[class*="assistant-message"]',
    '[data-role="assistant"]',
    '.assistant-bubble',
    '[class*="bot"]',
    '[class*="markdown"]',
    '[class*="answer"]',
    '[class*="response"]',
    '[class*="botMessage"]',
  ];
  
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      return Array.from(elements);
    }
  }
  
  return [];
}

/**
 * Check if AI is currently generating response
 */
function isGenerating(): boolean {
  const indicators = [
    '[class*="loading"]',
    '[class*="generating"]',
    '[class*="typing"]',
    '[class*="spinner"]',
    '.cursor-blink',
    '[class*="thinking"]',
    '[class*="streaming"]',
    '[class*="pending"]',
  ];
  
  for (const selector of indicators) {
    if (document.querySelector(selector)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Extract the last user input
 */
function getLastUserInput(): string {
  const userMessages = findUserMessages();
  if (userMessages.length === 0) return '';
  
  const lastMessage = userMessages[userMessages.length - 1];
  return lastMessage.textContent?.trim() || '';
}

/**
 * Extract the last AI response
 */
function getLastAIResponse(): string {
  const responses = findAIResponses();
  if (responses.length === 0) return '';
  
  const lastResponse = responses[responses.length - 1];
  return lastResponse.textContent?.trim() || '';
}

/**
 * Process a completed AI response
 */
async function processCompletedResponse(input: string, output: string): Promise<void> {
  if (!isCapturing || !input || !output) {
    return;
  }
  
  // Skip if already processed
  const responseKey = `${input.substring(0, 50)}_${output.substring(0, 100)}`;
  if (responseKey === lastProcessedResponse) {
    return;
  }
  lastProcessedResponse = responseKey;
  
  // Estimate tokens
  const inputTokens = estimateTokensFromText(input);
  const outputTokens = estimateTokensFromText(output);
  
  // Detect model
  const model = detectModelName();
  
  // Send to background
  try {
    await sendMessage({
      type: 'ADD_LABOR_RECORD',
      payload: {
        platform: 'tiangong',
        model,
        input,
        output,
        conversationId: getConversationId(),
      } as AddLaborRecordPayload,
    });
    
    console.log('[AI Labor Tracker] Tiangong interaction captured:', {
      inputTokens,
      outputTokens,
      model,
    });
  } catch (error) {
    console.error('[AI Labor Tracker] Failed to capture interaction:', error);
  }
}

/**
 * Handle potential response completion
 */
function handlePotentialCompletion(): void {
  // Clear existing timeout
  if (processingTimeout) {
    clearTimeout(processingTimeout);
  }
  
  // Wait a bit to ensure generation is complete
  processingTimeout = setTimeout(() => {
    if (!isGenerating()) {
      const input = getLastUserInput();
      const output = getLastAIResponse();
      
      if (input && output) {
        processCompletedResponse(input, output);
      }
    }
  }, 1500);
}

/**
 * Setup DOM mutation observer
 */
function setupMutationObserver(): void {
  // Find the main chat container
  const chatContainer = document.querySelector('main') || 
                        document.querySelector('[class*="chat"]') || 
                        document.body;
  
  let lastResponseLength = 0;
  let stabilityCount = 0;
  
  const observer = new MutationObserver((mutations) => {
    if (!isCapturing) return;
    
    // Check for meaningful DOM changes
    let hasRelevantChanges = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            // Check if this is a message-related element
            const className = node.className || '';
            const id = node.id || '';
            
            if (className.includes('message') || 
                className.includes('markdown') ||
                className.includes('chat') ||
                className.includes('response') ||
                className.includes('answer') ||
                id.includes('message')) {
              hasRelevantChanges = true;
              break;
            }
          }
        }
      } else if (mutation.type === 'characterData') {
        hasRelevantChanges = true;
      }
      
      if (hasRelevantChanges) break;
    }
    
    if (hasRelevantChanges) {
      // Get current response length
      const currentResponse = getLastAIResponse();
      const currentLength = currentResponse.length;
      
      // Check if response has stabilized (length hasn't changed)
      if (currentLength === lastResponseLength && currentLength > 0) {
        stabilityCount++;
        
        // If stable for multiple checks, assume generation is complete
        if (stabilityCount >= 3) {
          handlePotentialCompletion();
          stabilityCount = 0;
        }
      } else {
        stabilityCount = 0;
        lastResponseLength = currentLength;
      }
    }
  });
  
  observer.observe(chatContainer, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  
  console.log('[AI Labor Tracker] Tiangong mutation observer initialized');
}

/**
 * Check capture status from settings
 */
async function checkCaptureStatus(): Promise<void> {
  try {
    const response = await sendMessage<{ settings: { captureEnabled: boolean; enabledPlatforms: Record<string, boolean> } }>({
      type: 'GET_SETTINGS',
    });
    
    if (response?.settings) {
      isCapturing = response.settings.captureEnabled && 
                    response.settings.enabledPlatforms?.tiangong !== false;
    }
  } catch (error) {
    console.log('[AI Labor Tracker] Using default capture settings');
    isCapturing = true;
  }
}

/**
 * Initialize content script
 */
async function init(): Promise<void> {
  console.log('[AI Labor Tracker] Tiangong content script loaded');
  
  // Check capture status
  await checkCaptureStatus();
  
  if (!isCapturing) {
    console.log('[AI Labor Tracker] Tiangong capture disabled');
    return;
  }
  
  // Detect model
  currentModel = detectModelName();
  console.log('[AI Labor Tracker] Detected model:', currentModel);
  
  // Setup observer for message tracking
  setupMutationObserver();
  
  // Listen for settings changes
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'SETTINGS_UPDATED') {
      isCapturing = message.payload?.captureEnabled !== false && 
                    message.payload?.enabledPlatforms?.tiangong !== false;
      sendResponse({ success: true });
    }
    return true;
  });
  
  // Handle page navigation (SPA)
  let lastUrl = window.location.href;
  const urlObserver = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      lastProcessedResponse = null;
      console.log('[AI Labor Tracker] Navigation detected, resetting state');
    }
  });
  
  urlObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
