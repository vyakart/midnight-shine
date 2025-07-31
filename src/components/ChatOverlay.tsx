import React from 'react';
import type { UiEvent } from '../analytics/events';
import { Mode } from '../ai/types';

/**
 * ChatOverlay (skeleton)
 * Accessible chat surface with transcript region and composer.
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatOverlayProps {
  open: boolean;
  mode: Mode;
  messages: ChatMessage[];
  onClose?: () => void;
  onSend?: (text: string) => void;
  onTelemetry?: (e: UiEvent) => void;
  'aria-labelledby'?: string;
  className?: string;
  [dataAttr: `data-${string}`]: unknown;
}

export default function ChatOverlay(_props: ChatOverlayProps): JSX.Element {
  // Accessibility:
  // - role="dialog" aria-modal="true" with aria-labelledby
  // - role="log" with aria-live="polite" for transcript updates
  // - Focus trap and Escape close (to be implemented)
  return (
    <aside role="dialog" aria-modal="true">
      <div role="log" aria-live="polite" aria-relevant="additions">
        {/* Transcript skeleton */}
      </div>
      <form aria-label="Chat composer">
        {/* Composer skeleton */}
      </form>
    </aside>
  );
}