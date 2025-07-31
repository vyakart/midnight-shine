/**
 * Telemetry client skeleton.
 * No network logic implemented. Provides contracts only.
 */

import type { AnalyticsEvent, BasePayload } from './events';

export interface TelemetryConfig {
  endpointEnv: string;
  writeKeyEnv?: string;
  flushIntervalMs?: number;
  batching?: boolean;
  maxBatchSize?: number;
}

let _cfg: TelemetryConfig | undefined;

/**
 * Initialize telemetry configuration.
 */
export function initTelemetry(cfg: TelemetryConfig): void {
  // Store configuration only; do not access process.env in this skeleton.
  _cfg = { ...cfg };
}

/**
 * Return current telemetry configuration (if initialized).
 */
export function getTelemetryConfig(): TelemetryConfig | undefined {
  return _cfg;
}

/**
 * Enqueue a telemetry event. In this skeleton, no I/O occurs.
 */
export function track(
  event: AnalyticsEvent,
  payload: BasePayload & Record<string, unknown>
): void {
  // Intentionally no-op in skeleton; ensure payload is JSON-safe in real impl.
  void event;
  void payload;
}

/**
 * Flush any pending events. In this skeleton, returns immediately.
 */
export async function flush(): Promise<void> {
  // No-op stub.
}