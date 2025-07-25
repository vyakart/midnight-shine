# Accessibility Guidelines

Ensure your site is usable by everyone, including those with disabilities.

## Semantic HTML
- Use `<header>`, `<nav>`, `<main>`, `<footer>` appropriately.
- Prefer `<button>` over clickable `<div>`/`<span>`.

## Images & Media
- Every `<img>` must have a meaningful `alt` attribute.
- Provide captions or transcripts for videos.
- Do **not** use `alt=""` unless the image is purely decorative.

## Color & Contrast
- Text contrast ratio ≥ 4.5:1 against its background.
- Interactive elements (links, buttons) contrast ≥ 3:1.

## Keyboard Navigation
- All interactive controls reachable via `Tab`.
- Focus states clearly visible (outline or underlines).

## ARIA
- Only add ARIA roles/labels when native HTML cannot express the relationship.
- Test with a screen reader (VoiceOver, NVDA, TalkBack).

## Auditing
- Run `npx pa11y-ci` or `axe-core` on every commit.
- Fail the build if any critical violations are found.
