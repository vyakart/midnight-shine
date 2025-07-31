import React from 'react';
import type { UiEvent } from '../analytics/events';
import { Mode } from '../ai/types';

/**
 * ModeSwitcher (skeleton)
 * Allows selecting one of the six modes for the chat overlay.
 */
export interface ModeSwitcherProps {
  value: Mode;
  onChange?: (next: Mode) => void;
  onTelemetry?: (e: UiEvent) => void;
  className?: string;
  'aria-labelledby'?: string;
  [dataAttr: `data-${string}`]: unknown;
}

const MODE_LABELS: Record<Mode, string> = {
  [Mode.Guide]: 'Guide',
  [Mode.Studio]: 'Studio',
  [Mode.Lab]: 'Lab',
  [Mode.OpsDeck]: 'Ops Deck',
  [Mode.Dojo]: 'Dojo',
  [Mode.Observatory]: 'Observatory'
};

export default function ModeSwitcher(_props: ModeSwitcherProps): React.JSX.Element {
  // Accessibility:
  // - Implement using native select or ARIA radiogroup pattern.
  // - Ensure keyboard navigation and visible focus.
  return (
    <div role="group" aria-label="Mode switcher">
      {/* Skeleton only; implementation deferred */}
      <span aria-hidden="true">Select mode</span>
    </div>
  );
}