# DELIVERABLE_REQUIREMENTS.md

## Acceptance Criteria for ChatTerminal

### ✅ Code Quality

#### Linting Requirements
```bash
# Must pass without errors
npm run lint

# Expected output
✔ No ESLint errors
✔ No TypeScript errors
✔ No unused variables
✔ No console.log statements
```

#### Code Standards Checklist
- [ ] All components properly typed
- [ ] No `any` types except where absolutely necessary
- [ ] Consistent naming conventions
- [ ] Comments for complex logic
- [ ] Props documented with JSDoc

---

### ✅ Test Coverage

#### Unit Test Requirements
```bash
# Run tests
npm run test

# Coverage requirements
- Statements: ≥ 80%
- Branches: ≥ 75%
- Functions: ≥ 80%
- Lines: ≥ 80%
```

#### Essential Test Cases
```typescript
// Terminal Component Tests
describe('ChatTerminal', () => {
  it('renders without crashing');
  it('initializes with welcome message');
  it('processes commands correctly');
  it('handles chat queries with "nishito" prefix');
  it('supports theme switching');
  it('maintains command history');
});

// Filesystem Tests
describe('useFilesystem', () => {
  it('creates files and directories');
  it('persists to localStorage');
  it('handles path navigation');
  it('prevents invalid operations');
});

// Chat Integration Tests
describe('useChatCompletion', () => {
  it('sends messages to API');
  it('handles streaming responses');
  it('manages rate limiting');
  it('falls back gracefully on errors');
});
```

---

### ✅ Responsive Design

#### Breakpoint Requirements
```css
/* Mobile First Approach */
/* Minimum: 360px (small phones) */
@media (min-width: 360px) {
  .chat-terminal {
    min-height: 100vh;
    font-size: 12px;
  }
}

/* Tablet: 768px */
@media (min-width: 768px) {
  .chat-terminal {
    min-height: 600px;
    font-size: 14px;
  }
}

/* Desktop: 1024px */
@media (min-width: 1024px) {
  .chat-terminal {
    min-height: 700px;
    font-size: 16px;
  }
}
```

#### Touch Support
- [ ] Terminal scrollable on touch devices
- [ ] Virtual keyboard triggers properly
- [ ] Touch targets ≥ 44x44px
- [ ] No hover-only interactions

---

### ✅ Deployment Scripts

#### Vercel Deployment
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

```bash
# deploy-vercel.sh
#!/bin/bash
echo "🚀 Deploying to Vercel..."

# Build the project
npm run build

# Deploy
vercel --prod

echo "✅ Deployment complete!"
```

#### Netlify Deployment
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

```bash
# deploy-netlify.sh
#!/bin/bash
echo "🚀 Deploying to Netlify..."

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist

echo "✅ Deployment complete!"
```

---

### ✅ Performance Criteria

#### Bundle Size Limits
```javascript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'xterm': ['@xterm/xterm'],
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  }
}
```

#### Target Metrics
- Initial bundle: < 200KB gzipped
- TTI (Time to Interactive): < 3s
- FCP (First Contentful Paint): < 1.5s
- CLS (Cumulative Layout Shift): < 0.1

---

### ✅ Accessibility

#### WCAG 2.1 AA Compliance
- [ ] Keyboard navigable
- [ ] Screen reader compatible
- [ ] Color contrast ratios ≥ 4.5:1
- [ ] Focus indicators visible
- [ ] ARIA labels for interactive elements

#### Testing Tools
```bash
# Run accessibility audit
npm run audit:a11y

# Expected: 0 violations
```

---

### ✅ Browser Compatibility

#### Minimum Support
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Android 8+

---

### ✅ Documentation

#### Required Files
- [x] README.md with:
  - [ ] Installation instructions
  - [ ] Usage examples
  - [ ] API configuration
  - [ ] Development setup
- [x] Inline code documentation
- [x] Storybook stories for components

#### README Template
```markdown
# ChatTerminal

A React-based terminal emulator with AI chat integration.

![Demo](./demo.gif)

## Features
- 🖥️ Full terminal emulation with XTerm.js
- 🤖 AI chat with "nishito" prefix
- 📁 Virtual filesystem with localStorage
- 🎨 Multiple themes (dark/light/retro)
- ⌨️ Command history & autocomplete

## Installation
\`\`\`bash
npm install
npm run dev
\`\`\`

## Configuration
Create a `.env` file:
\`\`\`
VITE_OPENAI_API_KEY=your-api-key
\`\`\`

## Usage
\`\`\`javascript
import ChatTerminal from './components/ChatTerminal';

function App() {
  return <ChatTerminal theme="dark" />;
}
\`\`\`

## API Reference
\`\`\`javascript
// Access terminal programmatically
window.terminalApi.send('Hello from outside!');
window.terminalApi.clear();
window.terminalApi.setTheme('retro');
\`\`\`
```

---

### ✅ Demo Requirements

#### Demo GIF Specifications
- Duration: 30-60 seconds
- Resolution: 1280x720 minimum
- Frame rate: 30fps
- File size: < 10MB

#### Demo Script
1. Show terminal boot animation
2. Type `help` command
3. Navigate filesystem (`ls`, `cd`, `cat`)
4. Create a file (`touch`, `echo`)
5. Demonstrate chat: `nishito explain React hooks`
6. Switch themes
7. Show autocomplete with TAB
8. Use command history with arrows

#### Recording Tools
```bash
# Using asciinema + gif conversion
asciinema rec demo.cast
asciinema play demo.cast
docker run --rm -v $PWD:/data asciinema/asciicast2gif demo.cast demo.gif

# Or using screen recording + ffmpeg
ffmpeg -i screen-recording.mov -vf "fps=30,scale=1280:-1:flags=lanczos" -c:v gif demo.gif
```

---

### ✅ Security Checklist

- [ ] No API keys in source code
- [ ] Input sanitization implemented
- [ ] XSS prevention in terminal output
- [ ] Content Security Policy headers
- [ ] Secure localStorage usage

---

### ✅ Pre-Deployment Checklist

```bash
# Run all checks
npm run precheck

# Individual checks
npm run lint
npm run test
npm run build
npm run preview

# Final verification
- [ ] All tests passing
- [ ] No console errors
- [ ] Demo GIF created
- [ ] README complete
- [ ] Environment variables documented
- [ ] Deploy scripts tested
```

---

### 📋 Delivery Artifacts

1. **Source Code**
   - GitHub repository
   - Clean commit history
   - Tagged release (v1.0.0)

2. **Documentation**
   - README.md
   - API documentation
   - Storybook deployment

3. **Demo**
   - Live deployment URL
   - Demo GIF in repository
   - Video walkthrough (optional)

4. **Deployment**
   - One-click deploy scripts
   - CI/CD configuration
   - Environment setup guide