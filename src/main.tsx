import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import tokens and globals to ensure CSS variables and base styles are available early.
import './styles/tokens.css';
import './styles/globals.css';

/**
 * SPA entry point.
 * Mounts the App component into the root element.
 */
const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}