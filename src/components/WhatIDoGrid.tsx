import React from 'react';
import type { UiEvent } from '../analytics/events';

/**
 * WhatIDoGrid component (skeleton).
 * Shows high-level categories. No business logic here.
 */
export interface WhatIDoGridItem {
  id: string;
  title: string;
  summary: string;
  icon?: React.ReactNode;
  onClick?: (id: string) => void;
}

export interface WhatIDoGridProps {
  items: WhatIDoGridItem[];
  onTelemetry?: (e: UiEvent) => void;
  className?: string;
  [dataAttr: `data-${string}`]: unknown;
}

export default function WhatIDoGrid(_props: WhatIDoGridProps): JSX.Element {
  // Accessibility:
  // - Use a list/grid semantics; ensure keyboard activation via Enter/Space.
  // - Provide aria-labels for icons if they convey meaning.
  return (
    <section role="region" aria-labelledby="what-i-do-grid-heading">
      <h2 id="what-i-do-grid-heading" className="visually-hidden">What I Do Grid</h2>
      {/* Skeleton only; implementation deferred */}
    </section>
  );
}