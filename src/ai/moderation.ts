/**
 * Moderation (skeleton).
 * Input/output checks; returns allow/deny signals with categories.
 */

import type { ModerationResult, ChatMessage } from './types';

export async function moderateInput(_messages: ChatMessage[]): Promise<ModerationResult> {
  // Implementation deferred: call provider or local heuristics.
  return { allowed: true };
}

export async function moderateOutput(_text: string): Promise<ModerationResult> {
  // Implementation deferred.
  return { allowed: true };
}