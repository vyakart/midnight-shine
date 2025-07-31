import React from 'react';
import { appConfig } from '../config/appConfig';

/**
 * ContactForm component
 * Netlify Forms compatible, driven by appConfig.forms.contact
 * - Adds hidden honeypot field
 * - Includes required hidden input "form-name"
 * - Client-only; no external dependencies
 */
export default function ContactForm(): React.ReactElement | null {
  const cfg = appConfig.forms.contact;
  if (!cfg.enabled) return null;

  const formName = cfg.formName;
  const honeypot = cfg.spamProtection.honeypot;

  return (
    <form
      name={formName}
      method="POST"
      data-netlify="true"
      netlify-honeypot={honeypot}
      action="/thank-you"
      style={{ display: 'grid', gap: '0.75rem', maxWidth: 640 }}
      aria-labelledby="contact-form-heading"
    >
      {/* Required hidden input for Netlify Forms */}
      <input type="hidden" name="form-name" value={formName} />

      {/* Honeypot field */}
      <p style={{ display: 'none' }}>
        <label>
          Don’t fill this out if you’re human:
          <input name={honeypot} />
        </label>
      </p>

      <h2 id="contact-form-heading" className="visually-hidden">Contact</h2>

      {/* Fields based on config order */}
      {cfg.fields.includes('name') && (
        <label>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
      )}

      {cfg.fields.includes('email') && (
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      )}

      {cfg.fields.includes('message') && (
        <label>
          <span>Message</span>
          <textarea name="message" rows={5} required />
        </label>
      )}

      <button type="submit">Send</button>
    </form>
  );
}