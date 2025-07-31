import React from 'react';
import type { UiEvent } from '../analytics/events';

/**
 * Hero component (skeleton).
 * Displays leading headline and CTAs. No business logic here.
 */
export interface HeroProps {
  heading: string;
  subheading?: string;
  eyebrow?: string;
  backgroundImageSrc?: string;
  backgroundAlt?: string; // Required if non-decorative
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  onTelemetry?: (e: UiEvent) => void;
  className?: string;
  // Allow data- attributes
  [dataAttr: `data-${string}`]: unknown;
}

export default function Hero(_props: HeroProps): JSX.Element {
  // Accessibility:
  // - Render as section with role="region"
  // - aria-labelledby should point to internal heading id
  // - Background image should include alt text if not purely decorative
  // - Ensure visible focus for CTAs; link vs button semantics as appropriate
  return (
    <section role="region" aria-labelledby="hero-heading">
      <h2 id="hero-heading" className="visually-hidden">Hero</h2>
      {/* Skeleton only; implementation deferred */}
    </section>
  );
}