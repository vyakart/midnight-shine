/**
 * Content model types (skeleton) for site sections and chat mode tips.
 * Matches the architect brief; used by loader and components.
 */

export interface HeroContent {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImageSrc?: string;
  backgroundAlt?: string; // Provide when not decorative
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface SectionItem {
  id: string;
  title: string;
  summary: string;
  highlights?: string[]; // 2–3 bullet points
  links?: { label: string; href: string }[];
  image?: { src: string; alt: string }; // alt required if not decorative
}

export interface CtaContent {
  headline: string;
  body?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export interface ModeTip {
  mode: 'Guide' | 'Studio' | 'Lab' | 'Ops Deck' | 'Dojo' | 'Observatory';
  tip: string;
  examples?: string[];
}

export interface SiteContent {
  hero: HeroContent;
  sections: SectionItem[];
  cta: CtaContent;
  modes: ModeTip[];
  a11yNotes?: string[];
}