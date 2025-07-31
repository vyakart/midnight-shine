/**
 * AI contract types and enums.
 * Skeleton only — no business logic or provider calls.
 */

export enum Mode {
  Guide = 'guide',
  Studio = 'studio',
  Lab = 'lab',
  OpsDeck = 'ops_deck',
  Dojo = 'dojo',
  Observatory = 'observatory'
}

export type Role = 'system' | 'user' | 'assistant';

export interface RoleConfig {
  mode: Mode;
  systemPreamble: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  tokensPerMinute?: number;
}

export interface ContextWindowConfig {
  maxInputTokens: number;
  maxOutputTokens: number;
  strategy?: 'truncate-start' | 'truncate-middle' | 'truncate-end';
}

export interface ProviderConfig {
  apiKeyEnv: string;
  baseUrlEnv?: string;
  modelNameEnv?: string;
  rateLimit?: RateLimitConfig;
  contextWindow?: ContextWindowConfig;
}

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface ChatCompletionInput {
  mode: Mode;
  messages: ChatMessage[];
  userId?: string;
  traceId?: string;
}

export interface TokenUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface ChatCompletionChunk {
  id: string;
  content: string;
  done?: boolean;
  usage?: TokenUsage;
}

export interface ModerationResult {
  allowed: boolean;
  categories?: string[];
  reasons?: string[];
}