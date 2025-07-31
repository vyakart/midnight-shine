import React from 'react';
import { Mode } from './ai/types';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Seo from './components/Seo';
import ContactForm from './components/ContactForm';
import { appConfig } from './config/appConfig';

/**
 * App shell.
 * Wires navigation, SEO defaults, hero placeholder, and footer from typed config.
 */
export default function App(): React.ReactElement {
  const [mode] = React.useState<Mode>(Mode.Guide);
  const [isChatOpen] = React.useState(false);

  return (
    <>
      {/* SEO defaults from config; individual sections can override via Seo props */}
      <Seo />

      <main id="main">
        <header role="banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <h1 style={{ margin: 0 }}>{appConfig.app.name}</h1>
          <Navigation />
        </header>

        <section aria-labelledby="hero-heading" role="region" style={{ padding: '1rem' }}>
          <h2 id="hero-heading" className="visually-hidden">Hero</h2>
          {/* Future: replace with concrete Hero; for now show config hero text */}
          <p style={{ marginTop: '0.5rem' }}>
            <strong>{appConfig.content.hero.headline}</strong>
            {appConfig.content.hero.subheadline ? <> — {appConfig.content.hero.subheadline}</> : null}
          </p>
          <p>
            <a href={appConfig.content.hero.primaryCta.url}>
              {appConfig.content.hero.primaryCta.label}
            </a>
          </p>
        </section>

        {/* Placeholder sections */}
        <section aria-labelledby="what-i-do-heading" role="region" style={{ padding: '1rem' }}>
          <h2 id="what-i-do-heading">What I do</h2>
        </section>

        <section aria-labelledby="sections-heading" role="region" style={{ padding: '1rem' }}>
          <h2 id="sections-heading">Sections</h2>
        </section>

        <section aria-labelledby="cta-heading" role="region" style={{ padding: '1rem' }}>
          <h2 id="cta-heading" className="visually-hidden">Call to action</h2>
        </section>

        {/* ModeSwitcher and ChatOverlay placeholders */}
        <div aria-label="Mode switcher container" style={{ padding: '1rem' }}>Mode: {mode}</div>
        <div aria-label="Chat overlay container" style={{ padding: '0 1rem 1rem' }}>Chat open: {isChatOpen ? 'yes' : 'no'}</div>

        {/* Netlify Contact Form (config-driven) */}
        <section id="contact" aria-labelledby="contact-heading" role="region" style={{ padding: '1rem' }}>
          <h2 id="contact-heading">Contact</h2>
          <ContactForm />
        </section>

        <Footer />
      </main>
    </>
  );
}