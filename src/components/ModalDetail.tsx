import React from 'react';
import type { UiEvent } from '../analytics/events';

/**
 * ModalDetail (skeleton)
 * Accessible dialog for deeper dives on a section/card.
 */
export interface ModalDetailProps {
  open: boolean;
  title: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onTelemetry?: (e: UiEvent) => void;
  labelledById?: string; // id for aria-labelledby
  describedById?: string; // id for aria-describedby
  className?: string;
  [dataAttr: `data-${string}`]: unknown;
}

export default function ModalDetail(_props: ModalDetailProps): React.ReactElement {
  // Accessibility:
  // - role="dialog" aria-modal="true" with aria-labelledby/aria-describedby
  // - Focus trap and Escape to close (wired in implementation)
  // - Restore focus to the invoker on close
  return (
    <div role="dialog" aria-modal="true">
      {/* Skeleton only; implementation deferred */}
    </div>
  );
}