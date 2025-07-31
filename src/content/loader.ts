import { SiteContent } from './types';

/**
 * Loads content/content.json at runtime.
 * In SSG/SSR you might import JSON; here we fetch to keep SPA-compatible.
 */
export async function loadSiteContent(): Promise<SiteContent> {
  const res = await fetch('/content/content.json', {
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    throw new Error(`Failed to load content: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as SiteContent;
}