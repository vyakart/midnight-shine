/**
 * Motion utilities (skeleton).
 * Respect prefers-reduced-motion and keep animations subtle to protect performance.
 */

export interface MotionOptions {
  durationMs?: number;
  easing?: string;
  delayMs?: number;
}

export const DEFAULT_MOTION: Required<MotionOptions> = {
  durationMs: 180,
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  delayMs: 0
};

export function getMotion(opts: MotionOptions = {}): Required<MotionOptions> {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const base = { ...DEFAULT_MOTION, ...opts };

  if (prefersReduced) {
    return { durationMs: 0, easing: 'linear', delayMs: 0 };
  }
  return base;
}

/**
 * Example helper to compute inline style transition string.
 * Use for small UI transitions; avoid large/expensive properties.
 */
export function transitionStyle(properties: string[], opts?: MotionOptions): React.CSSProperties {
  const m = getMotion(opts);
  const transition = properties
    .map((prop) => `${prop} ${m.durationMs}ms ${m.easing} ${m.delayMs}ms`)
    .join(', ');
  return { transition };
}