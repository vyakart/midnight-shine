import React from 'react';
import { appConfig } from '../config/appConfig';
import type { SEO } from '../config/types';

/**
 * Zero-dependency SEO utility component.
 * - Merges provided props with defaults from appConfig.seo
 * - Updates document.title, meta description/robots, canonical link,
 *   and basic OG/Twitter tags at runtime.
 * - Keeps index.html as the static baseline to avoid FOUC/duplication.
 *
 * Note: For SSR or advanced head management, migrate to an SSR-capable head lib.
 */

export interface SeoProps {
  title?: string;
  description?: string;
  canonicalPath?: string; // appended to canonicalDomain
  robots?: string;
  openGraph?: Partial<SEO['openGraph']>;
  twitter?: Partial<SEO['twitter']>;
}

function upsertMeta(nameOrProp: { name?: string; property?: string }, content: string) {
  const selector = nameOrProp.name
    ? `meta[name="${nameOrProp.name}"]`
    : `meta[property="${nameOrProp.property}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    if (nameOrProp.name) el.setAttribute('name', nameOrProp.name);
    if (nameOrProp.property) el.setAttribute('property', nameOrProp.property!);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo(props: SeoProps): React.ReactElement {
  const base = appConfig.seo;
  const title = props.title ?? base.title;
  const description = props.description ?? base.description;
  const robots = props.robots ?? base.robots;
  const canonicalUrl = props.canonicalPath
    ? new URL(props.canonicalPath, base.canonicalDomain).toString()
    : base.canonicalDomain;

  const og = {
    ...base.openGraph,
    ...props.openGraph
  };

  const twitter = {
    ...base.twitter,
    ...props.twitter
  };

  React.useEffect(() => {
    // Title
    document.title = title;

    // Description
    if (description) {
      upsertMeta({ name: 'description' }, description);
    }

    // Robots
    if (robots) {
      upsertMeta({ name: 'robots' }, robots);
    }

    // Canonical
    if (canonicalUrl) {
      upsertLink('canonical', canonicalUrl);
    }

    // Open Graph
    if (og.title) upsertMeta({ property: 'og:title' }, og.title);
    if (og.description) upsertMeta({ property: 'og:description' }, og.description);
    if (og.image) upsertMeta({ property: 'og:image' }, og.image);

    // Twitter
    if (twitter.card) upsertMeta({ name: 'twitter:card' }, twitter.card);
    if (twitter.handle) upsertMeta({ name: 'twitter:site' }, twitter.handle);
  }, [title, description, robots, canonicalUrl, og.title, og.description, og.image, twitter.card, twitter.handle]);

  // This component renders nothing; it only updates <head>.
  return <></>;
}