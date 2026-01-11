/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

// Import crypto for Node.js environment (will be available in Electron)
// Webpack will handle this as an external module
let nodeCrypto: typeof import('crypto') | null = null;
try {
  // Try to load crypto module - this will work in Node.js/Electron environment
  // Webpack externals configuration will handle this properly
  nodeCrypto = require('crypto');
} catch {
  // Browser environment or crypto not available
}

export const uuid = (length = 8) => {
  try {
    // Prefer Web Crypto API for browser compatibility
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID && length >= 36) {
      return window.crypto.randomUUID();
    }

    // Use Web Crypto getRandomValues for browser environment
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const bytes = new Uint8Array(Math.ceil(length / 2));
      window.crypto.getRandomValues(bytes);
      return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, length);
    }

    // Node.js environment - use crypto module if available
    if (nodeCrypto) {
      if (typeof nodeCrypto.randomUUID === 'function' && length >= 36) {
        return nodeCrypto.randomUUID();
      }
      const bytes = nodeCrypto.randomBytes(Math.ceil(length / 2));
      return bytes.toString('hex').slice(0, length);
    }
  } catch {
    // Fallback without crypto
  }

  // Monotonic fallback without cryptographically secure randomness
  const base = Date.now().toString(36);
  return (base + base).slice(0, length);
};

export const parseError = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return error.msg || error.message || JSON.stringify(error);
};

/**
 * 根据语言代码解析为标准化的区域键
 * Resolve language code to standardized locale key
 */
export const resolveLocaleKey = (language: string): 'zh-CN' | 'en-US' => (language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US');
