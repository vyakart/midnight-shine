import React from 'react';
import type { UiEvent } from '../analytics/events';

/**
 * SectionCards (skeleton)
 * Renders a list of cards that can open a ModalDetail or navigate.
 */
export interface SectionCardAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface SectionCard {
  id: string;
  title: string;
  summary: string;
  imgSrc?: string;
  imgAlt?: string; // Provide when image is not decorative
  actions?: SectionCardAction[];
}

export interface SectionCardsProps {
  cards: SectionCard[];
  onTelemetry?: (e: UiEvent) => void;
  onCardActivate?: (id: string) => void;
  className?: string;
  [dataAttr: `data-${string}`]: unknown;
}

export default function SectionCards(_props: SectionCardsProps): JSX.Element {
  // Accessibility:
  // - Use list semantics (ul/li) and ensure keyboard activation.
  // - Images must include alt text unless decorative.
  return (
    <section role="region" aria-labelledby="sections-cards-heading">
      <h2 id="sections-cards-heading" className="visually-hidden">Sections</h2>
      {/* Skeleton only; implementation deferred */}
    </section>
  );
}