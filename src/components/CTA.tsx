import React from 'react';
import type { UiEvent } from '../analytics/events';

/**
 * CTA component (skeleton).
 * Renders a primary call-to-action with optional secondary link.
 */
export interface CTAProps {
  headline: string;
  body?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  onTelemetry?: (e: UiEvent) => void;
  className?: string;
  [dataAttr: `data-${string}`]: unknown;
}

export default function CTA(_props: CTAProps): JSX.Element {
  // Accessibility:
  // - Ensure link vs button semantics are correct (navigation vs action).
  // - Maintain visible focus and adequate contrast.
  return (
    <section role="region" aria-labelledby="cta-heading">
      <h2 id="cta-heading" className="visually-hidden">Call to action</h2>
      {/* Skeleton only; implementation deferred */}
    </section>
  );
}