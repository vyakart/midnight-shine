import React from 'react';
import { appConfig } from '../config/appConfig';
import type { NavItem } from '../config/types';

/**
 * Navigation component
 * Renders primary navigation items from appConfig.content.navigation
 * Accessibility: semantic <nav>, list of links, keyboard accessible.
 */
export default function Navigation(): React.ReactElement {
  const items: NavItem[] = appConfig.content.navigation;

  return (
    <nav aria-label="Primary">
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '1rem' }}>
        {items.map((item) => (
          <li key={item.path}>
            <a
              href={item.path}
              className="nav-link"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}