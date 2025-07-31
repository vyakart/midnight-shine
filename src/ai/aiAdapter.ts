/**
 * AI adapter (skeleton).
 * Provides provider-agnostic interfaces for generating responses and streaming.
 * Business logic and provider wire-up will be implemented later.
 */

import type {
  ProviderConfig,
  RateLimitConfig,
  ContextWindowConfig,
  ChatMessage
} from './types';
import { Mode } from './prompts';

export interface GenerateParams {
  mode: Mode;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  // Optional: request id for telemetry correlation
  requestId?: string;
}

export interface StreamHandlers {
  onToken?: (chunk: string) => void;
  onDone?: (finalText: string) => void;
  onError?: (err: unknown) => void;
}

export interface AIAdapterConfig {
  provider: ProviderConfig;
  rateLimit?: RateLimitConfig;
  contextWindow?: ContextWindowConfig;
}

export class AIAdapter {
  private cfg: AIAdapterConfig;

  constructor(cfg: AIAdapterConfig) {
    this.cfg = cfg;
  }

  /**
   * Generate a single response (non-streaming).
   */
  async generateResponse(_params: GenerateParams): Promise<string> {
    // Implementation deferred: will delegate to provider and apply moderation/safety.
    return '';
  }

  /**
   * Generate a streaming response.
   */
  async generateResponseStream(_params: GenerateParams, _handlers: StreamHandlers): Promise<void> {
    // Implementation deferred.
  }
}