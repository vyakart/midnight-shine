/**
 * OpenAI provider contract (skeleton).
 * No real API calls here; only types and function signatures.
 */

import type { ProviderConfig, ChatMessage, ChatCompletionChunk } from '../types';

export interface OpenAIClientConfig extends ProviderConfig {}

export class OpenAIClient {
  private cfg: OpenAIClientConfig;

  constructor(cfg: OpenAIClientConfig) {
    this.cfg = cfg;
  }

  async complete(_messages: ChatMessage[]): Promise<string> {
    // Implementation deferred
    return '';
  }

  async stream(_messages: ChatMessage[], _onChunk: (c: ChatCompletionChunk) => void): Promise<void> {
    // Implementation deferred
  }
}