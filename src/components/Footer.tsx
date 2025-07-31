import React from 'react';
import { appConfig } from '../config/appConfig';
import type { FooterContent } from '../config/types';

/**
 * Footer component
 * Renders social links and copyright from appConfig.content.footer
 * Accessibility: semantic <footer> with nav landmark for social links.
 */
export default function Footer(): React.ReactElement {
  const footer: FooterContent = appConfig.content.footer;

  return (
    <footer role="contentinfo">
      <nav aria-label="Social">
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '1rem' }}>
          {footer.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} rel="noopener noreferrer" target="_blank">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <small style={{ display: 'block', marginTop: '0.75rem' }}>{footer.copyright}</small>
    </footer>
  );
}