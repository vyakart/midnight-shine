/**
 * Analytics event enums and payload contracts.
 * Skeleton only — no runtime logic.
 */

import type { Mode } from '../ai/types';

export enum AnalyticsEvent {
  HeroViewed = 'hero_viewed',
  HeroCtaClicked = 'hero_cta_clicked',
  GridItemViewed = 'grid_item_viewed',
  GridItemActivated = 'grid_item_activated',
  SectionCardAction = 'section_card_action',
  CtaClicked = 'cta_clicked',
  ModeChanged = 'mode_changed',
  ModalOpened = 'modal_opened',
  ModalClosed = 'modal_closed',
  ModalAction = 'modal_action',
  ChatOpened = 'chat_opened',
  ChatClosed = 'chat_closed',
  ChatMessageSent = 'chat_message_sent',
  ChatMessageReceived = 'chat_message_received',
  ChatError = 'chat_error'
}

export interface BasePayload {
  ts: number;
  area?: string;
  path?: string;
  userId?: string;
}

export interface HeroCtaClickedPayload extends BasePayload {
  label: string;
  ctaType: 'primary' | 'secondary' | 'link';
  href?: string;
}

export interface ModeChangedPayload extends BasePayload {
  mode: Mode;
}

export interface ChatMessageSentPayload extends BasePayload {
  mode: Mode;
  messageId: string;
  length: number;
}

export type UiEvent = {
  type: AnalyticsEvent;
  payload: BasePayload & Record<string, unknown>;
};

export type ChatEvent = UiEvent;