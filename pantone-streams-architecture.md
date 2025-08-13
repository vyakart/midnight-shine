# Pantone Streams Layout - Multi-Theme Architecture

## Overview
Transform the microblog streams into a vibrant Pantone-style grid where each card uses colors from different themes (sunsetGlow, midnightAurora, forestMist, cosmicDust, oceanBreeze) to create visual diversity and showcase the theme system.

## Core Concept

### Theme Distribution Algorithm
Instead of using tag-based colors exclusively, cards will be assigned theme palettes in a diverse, visually balanced way:

```javascript
const THEMES = ['sunsetGlow', 'midnightAurora', 'forestMist', 'cosmicDust', 'oceanBreeze'];

// Algorithm for diverse theme assignment
function assignCardTheme(post, index, allPosts) {
  // Method 1: Round-robin distribution
  const themeIndex = index % THEMES.length;
  
  // Method 2: Hash-based (deterministic per post)
  const hash = stringHash(post.id + post.timestamp);
  const themeIndex = hash % THEMES.length;
  
  // Method 3: Time-of-day based with fallback
  const hour = new Date(post.timestamp).getHours();
  const timeBasedTheme = getTimeBasedTheme(hour);
  
  return THEMES[themeIndex];
}
```

## Enhanced Card Structure

### Pantone Card with Theme Integration
```
┌─────────────────────┐
│ ● ● ● ● ●           │ ← Theme indicator dots
├─────────────────────┤
│                     │
│   [Gradient/Media]  │ ← Theme-based gradient
│                     │
├─────────────────────┤
│ PANTONE®            │
│ 17-3938 TPM         │ ← Code + Theme suffix
│ Very Peri           │ ← Color name
│ [Post Title]        │
│                     │
│ 🕐 2h ago • 📝 text │
└─────────────────────┘
```

## Theme Integration System

### 1. Theme Color Extraction
```javascript
const themeColors = {
  sunsetGlow: {
    primary: '#FF6B6B',
    secondary: '#4D96FF',
    accent: '#FFD93D',
    gradient: ['#FFD93D', '#FF6B6B', '#C73E1D'],
    indicator: '🌅'
  },
  midnightAurora: {
    primary: '#764BA2',
    secondary: '#00D2FF',
    accent: '#F093FB',
    gradient: ['#667EEA', '#764BA2', '#F093FB'],
    indicator: '🌌'
  },
  forestMist: {
    primary: '#11998E',
    secondary: '#6A82FB',
    accent: '#FC5C7D',
    gradient: ['#11998E', '#38EF7D', '#FC5C7D'],
    indicator: '🌲'
  },
  cosmicDust: {
    primary: '#7E57C2',
    secondary: '#F953C6',
    accent: '#FFB75E',
    gradient: ['#1E3C72', '#7E57C2', '#F953C6'],
    indicator: '✨'
  },
  oceanBreeze: {
    primary: '#045DE9',
    secondary: '#09C6F9',
    accent: '#FFA8A8',
    gradient: ['#2E3192', '#1BFFFF', '#FFA8A8'],
    indicator: '🌊'
  }
};
```

### 2. Pantone Code Generation with Theme Suffix
```javascript
function generatePantoneCode(theme, tag) {
  const baseCode = getPantoneForTag(tag);
  const themeSuffix = {
    sunsetGlow: 'SG',
    midnightAurora: 'MA',
    forestMist: 'FM',
    cosmicDust: 'CD',
    oceanBreeze: 'OB'
  };
  
  return {
    code: `${baseCode.code} ${themeSuffix[theme]}`,
    name: baseCode.name,
    color: themeColors[theme].primary
  };
}
```

## Visual Components

### 1. Theme Indicator Dots
```html
<div class="theme-indicators">
  <span class="dot" data-theme="sunsetGlow" aria-label="Sunset Glow theme"></span>
  <span class="dot" data-theme="midnightAurora" aria-label="Midnight Aurora theme"></span>
  <span class="dot active" data-theme="forestMist" aria-label="Forest Mist theme"></span>
  <span class="dot" data-theme="cosmicDust" aria-label="Cosmic Dust theme"></span>
  <span class="dot" data-theme="oceanBreeze" aria-label="Ocean Breeze theme"></span>
</div>
```

```css
.theme-indicators {
  display: flex;
  gap: 6px;
  position: absolute;
  top: 12px;
  right: 12px;
}

.theme-indicators .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0.3;
  transition: all 0.3s ease;
}

.theme-indicators .dot.active {
  opacity: 1;
  transform: scale(1.4);
}

.theme-indicators .dot[data-theme="sunsetGlow"] { background: #FF6B6B; }
.theme-indicators .dot[data-theme="midnightAurora"] { background: #764BA2; }
.theme-indicators .dot[data-theme="forestMist"] { background: #11998E; }
.theme-indicators .dot[data-theme="cosmicDust"] { background: #7E57C2; }
.theme-indicators .dot[data-theme="oceanBreeze"] { background: #045DE9; }
```

### 2. Dynamic Gradient Backgrounds
```javascript
function applyThemeGradient(cardElement, theme) {
  const gradientColors = themeColors[theme].gradient;
  const gradientVars = {
    '--sg-c1': gradientColors[0],
    '--sg-c2': gradientColors[1],
    '--sg-c3': gradientColors[2],
    '--sg-opacity': theme.includes('midnight') || theme.includes('cosmic') ? '0.4' : '0.6'
  };
  
  Object.entries(gradientVars).forEach(([key, value]) => {
    cardElement.style.setProperty(key, value);
  });
}
```

### 3. Color Palette Legend
```html
<section class="palette-legend" aria-label="Theme color palettes">
  <h3>Color Palettes</h3>
  <div class="palette-grid">
    <div class="palette-card" data-theme="sunsetGlow">
      <div class="palette-swatches">
        <span style="background: #FFD93D"></span>
        <span style="background: #FF6B6B"></span>
        <span style="background: #C73E1D"></span>
      </div>
      <p>Sunset Glow</p>
    </div>
    <!-- Repeat for other themes -->
  </div>
</section>
```

```css
.palette-legend {
  margin-top: 48px;
  padding: 24px;
  background: var(--color-surface);
  border-radius: 16px;
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.palette-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.palette-card:hover {
  transform: translateY(-2px);
}

.palette-swatches {
  display: flex;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.palette-swatches span {
  flex: 1;
}
```

## Interactive Features

### 1. Theme Switching for All Cards
```javascript
class ThemeSwitcher {
  constructor() {
    this.currentTheme = 'mixed'; // or specific theme
  }
  
  switchAllCards(theme) {
    if (theme === 'mixed') {
      // Redistribute themes diversely
      document.querySelectorAll('.pantone-card').forEach((card, i) => {
        const assignedTheme = THEMES[i % THEMES.length];
        this.applyTheme(card, assignedTheme);
      });
    } else {
      // Apply single theme to all
      document.querySelectorAll('.pantone-card').forEach(card => {
        this.applyTheme(card, theme);
      });
    }
  }
  
  applyTheme(card, theme) {
    card.dataset.cardTheme = theme;
    applyThemeGradient(card, theme);
    updateThemeIndicators(card, theme);
  }
}
```

### 2. Time-Based Theme Rotation
```javascript
function getTimeBasedTheme(hour) {
  if (hour >= 5 && hour < 9) return 'sunsetGlow';      // Morning
  if (hour >= 9 && hour < 12) return 'forestMist';     // Late morning
  if (hour >= 12 && hour < 17) return 'oceanBreeze';   // Afternoon
  if (hour >= 17 && hour < 21) return 'cosmicDust';    // Evening
  return 'midnightAurora';                              // Night
}

// Auto-rotate based on current time
function initTimeBasedRotation() {
  const updateThemes = () => {
    const now = new Date();
    const theme = getTimeBasedTheme(now.getHours());
    document.documentElement.dataset.dominantTheme = theme;
  };
  
  updateThemes();
  setInterval(updateThemes, 60000); // Check every minute
}
```

### 3. Theme Filter Controls
```html
<div class="theme-filter-dock">
  <button data-filter-theme="all" class="active">All Themes</button>
  <button data-filter-theme="sunsetGlow">🌅 Sunset</button>
  <button data-filter-theme="midnightAurora">🌌 Midnight</button>
  <button data-filter-theme="forestMist">🌲 Forest</button>
  <button data-filter-theme="cosmicDust">✨ Cosmic</button>
  <button data-filter-theme="oceanBreeze">🌊 Ocean</button>
</div>
```

## Implementation Steps

### Phase 1: Theme Assignment System
1. Create theme distribution algorithm
2. Implement theme color extraction from config
3. Add theme assignment to card rendering

### Phase 2: Visual Enhancement
1. Add theme indicator dots to cards
2. Implement dynamic gradient backgrounds
3. Create Pantone code with theme suffixes

### Phase 3: Interactive Features
1. Build color palette legend component
2. Add theme switching functionality
3. Implement theme filter controls

### Phase 4: Advanced Features
1. Time-based theme rotation
2. User preference persistence
3. Smooth theme transitions

## CSS Architecture Updates

```css
/* Theme-aware Pantone cards */
.pantone-card[data-card-theme="sunsetGlow"] {
  --theme-primary: #FF6B6B;
  --theme-secondary: #4D96FF;
  --theme-accent: #FFD93D;
}

.pantone-card[data-card-theme="midnightAurora"] {
  --theme-primary: #764BA2;
  --theme-secondary: #00D2FF;
  --theme-accent: #F093FB;
}

/* ... other themes ... */

.pantone-card {
  --card-color: var(--theme-primary);
  --card-accent: var(--theme-accent);
}

/* Transition for theme changes */
.pantone-card {
  transition: 
    transform 0.3s ease,
    box-shadow 0.3s ease,
    background-color 0.5s ease;
}

.pantone-card[data-transitioning="true"] {
  animation: themeTransition 0.8s ease;
}

@keyframes themeTransition {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.98); }
}
```

## Accessibility Considerations

1. **Theme Indicators**: Use aria-labels for screen readers
2. **Color Contrast**: Ensure text remains readable on all theme backgrounds
3. **Motion**: Respect prefers-reduced-motion for theme transitions
4. **Keyboard Navigation**: Allow theme switching via keyboard
5. **Focus States**: Clear focus indicators that work with all themes

## Performance Optimizations

1. **CSS Variables**: Use custom properties for efficient theme switching
2. **Batch Updates**: Apply theme changes in requestAnimationFrame
3. **Lazy Rendering**: Only apply themes to visible cards
4. **Cache Theme Data**: Store processed theme colors in memory

## Testing Checklist

- [ ] Cards display correct theme colors
- [ ] Theme indicators show active theme
- [ ] Theme switching affects all cards smoothly
- [ ] Palette legend is interactive
- [ ] Time-based rotation works correctly
- [ ] Accessibility features function properly
- [ ] Performance remains smooth with many cards
- [ ] Responsive layout works on all devices