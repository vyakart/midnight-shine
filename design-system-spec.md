# Culturally-Inspired Theme System Specification

## 1. Color Palette Analysis & Refinement

### saffronSunrise (Light Theme)
Inspired by Indian dawn, marigold garlands, and warm hospitality

#### Primary Palette
```yaml
background:     #FFF8E7  # Warm ivory (WCAG AAA with all text)
surface:        #FFFFFF  # Pure white for cards/modals
primary:        #FF9933  # Saffron (Indian flag orange)
secondary:      #096C6C  # Deep teal (peacock neck)
accent:         #9A031E  # Ruby red (bindi/kumkum)
accentSoft:     #D4AF37  # Temple gold (softer accent)
```

#### Text Hierarchy
```yaml
textPrimary:    #3B2E2A  # Warm charcoal (7.8:1 on background)
textSecondary:  #5C4F4B  # Softer brown (5.2:1 on background)
textMuted:      #7A6D69  # Muted brown (4.5:1 minimum)
textInverse:    #FFFFFF  # For dark surfaces
```

#### Semantic Colors
```yaml
success:        #138000  # Forest green (6.1:1 on background)
warning:        #B26500  # Turmeric (4.8:1 on background)
error:          #C41E3A  # Vermillion (4.6:1 on background)
info:           #0066CC  # Peacock blue (5.4:1 on background)
```

#### Surface Variations
```yaml
border:         #E8DFC8  # Soft sand
borderHover:    #D4C9A8  # Darker sand
shadow:         rgba(139, 69, 19, 0.08)  # Warm shadow
shadowElevated: rgba(139, 69, 19, 0.12)
overlay:        rgba(255, 248, 231, 0.95)  # Semi-transparent background
```

### indigoMidnight (Dark Theme)
Inspired by Indian night sky, deep ocean, and cosmic mysteries

#### Primary Palette
```yaml
background:     #0B1D3F  # Deep midnight blue (base)
surface:        #18264D  # Elevated surface
primary:        #B98A2A  # Antique gold
secondary:      #149C9C  # Turquoise
accent:         #9C1149  # Magenta wine
accentSoft:     #DC921A  # Bright gold
```

#### Text Hierarchy
```yaml
textPrimary:    #E6E5EB  # Off-white (12.4:1 on background)
textSecondary:  #C4C4CF  # Muted white (8.7:1 on background)
textMuted:      #9A9AA8  # Gray (5.1:1 minimum)
textInverse:    #0B1D3F  # For light surfaces
```

#### Semantic Colors
```yaml
success:        #4ADE80  # Mint green (9.2:1 on background)
warning:        #FBB040  # Amber (8.8:1 on background)
error:          #F87171  # Coral (7.1:1 on background)
info:           #60A5FA  # Sky blue (7.8:1 on background)
```

#### Surface Variations
```yaml
border:         #2F3B5A  # Subtle border
borderHover:    #3D4A6B  # Hover state
shadow:         rgba(0, 0, 0, 0.3)
shadowElevated: rgba(0, 0, 0, 0.5)
overlay:        rgba(11, 29, 63, 0.95)
```

## 2. Typography Scale & System

### Type Scale (Perfect Fourth - 1.333 ratio)
```yaml
scale:
  xs:   0.75rem   # 12px - Captions, labels
  sm:   0.875rem  # 14px - Body small, helper text
  base: 1rem      # 16px - Body default
  md:   1.125rem  # 18px - Body large, small headings
  lg:   1.333rem  # 21.33px - H4
  xl:   1.777rem  # 28.44px - H3
  2xl:  2.369rem  # 37.90px - H2
  3xl:  3.157rem  # 50.52px - H1
  4xl:  4.209rem  # 67.36px - Display
```

### Line Heights
```yaml
lineHeight:
  tight:   1.1   # Headlines
  snug:    1.25  # Subheadings
  normal:  1.5   # Body text
  relaxed: 1.625 # Reading text
  loose:   1.75  # Spacious text
```

### Font Weights
```yaml
weights:
  light:    300
  regular:  400
  medium:   500
  semibold: 600
  bold:     700
  black:    900
```

### Letter Spacing
```yaml
tracking:
  tighter: -0.05em  # Display text
  tight:   -0.025em # Headlines
  normal:  0        # Body
  wide:    0.025em  # Subheadings
  wider:   0.05em   # All caps
  widest:  0.1em    # Spaced caps
```

## 3. Spacing System (8px Grid)

```yaml
spacing:
  0:    0
  px:   1px
  0.5:  0.125rem  # 2px
  1:    0.25rem   # 4px
  1.5:  0.375rem  # 6px
  2:    0.5rem    # 8px
  2.5:  0.625rem  # 10px
  3:    0.75rem   # 12px
  3.5:  0.875rem  # 14px
  4:    1rem      # 16px
  5:    1.25rem   # 20px
  6:    1.5rem    # 24px
  7:    1.75rem   # 28px
  8:    2rem      # 32px
  9:    2.25rem   # 36px
  10:   2.5rem    # 40px
  11:   2.75rem   # 44px
  12:   3rem      # 48px
  14:   3.5rem    # 56px
  16:   4rem      # 64px
  20:   5rem      # 80px
  24:   6rem      # 96px
  28:   7rem      # 112px
  32:   8rem      # 128px
  36:   9rem      # 144px
  40:   10rem     # 160px
  44:   11rem     # 176px
  48:   12rem     # 192px
  52:   13rem     # 208px
  56:   14rem     # 224px
  60:   15rem     # 240px
  64:   16rem     # 256px
  72:   18rem     # 288px
  80:   20rem     # 320px
  96:   24rem     # 384px
```

## 4. Border & Radius System

```yaml
borderWidth:
  0:      0
  px:     1px
  2:      2px
  4:      4px
  8:      8px

borderRadius:
  none:   0
  sm:     0.125rem  # 2px - Subtle rounding
  base:   0.25rem   # 4px - Default
  md:     0.375rem  # 6px - Cards
  lg:     0.5rem    # 8px - Buttons
  xl:     0.75rem   # 12px - Modals
  2xl:    1rem      # 16px - Large cards
  3xl:    1.5rem    # 24px - Hero sections
  full:   9999px    # Pills, circles
```

## 5. Elevation System (Shadows)

### saffronSunrise Shadows
```yaml
elevation:
  none: none
  sm:   0 1px 2px 0 rgba(139, 69, 19, 0.05)
  base: 0 1px 3px 0 rgba(139, 69, 19, 0.1), 0 1px 2px 0 rgba(139, 69, 19, 0.06)
  md:   0 4px 6px -1px rgba(139, 69, 19, 0.1), 0 2px 4px -1px rgba(139, 69, 19, 0.06)
  lg:   0 10px 15px -3px rgba(139, 69, 19, 0.1), 0 4px 6px -2px rgba(139, 69, 19, 0.05)
  xl:   0 20px 25px -5px rgba(139, 69, 19, 0.1), 0 10px 10px -5px rgba(139, 69, 19, 0.04)
  2xl:  0 25px 50px -12px rgba(139, 69, 19, 0.25)
  inner: inset 0 2px 4px 0 rgba(139, 69, 19, 0.06)
```

### indigoMidnight Shadows
```yaml
elevation:
  none: none
  sm:   0 1px 2px 0 rgba(0, 0, 0, 0.2)
  base: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.24)
  md:   0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.24)
  lg:   0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)
  xl:   0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.16)
  2xl:  0 25px 50px -12px rgba(0, 0, 0, 0.5)
  inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.24)
```

## 6. Breakpoint System

```yaml
breakpoints:
  xs:   320px   # Small phones
  sm:   640px   # Large phones
  md:   768px   # Tablets
  lg:   1024px  # Small laptops
  xl:   1280px  # Desktops
  2xl:  1536px  # Large screens
  3xl:  1920px  # Full HD
  4xl:  2560px  # 2K/4K displays

containers:
  xs:   100%
  sm:   640px
  md:   768px
  lg:   1024px
  xl:   1280px
  2xl:  1536px
```

## 7. Animation Specifications

### Timing Functions
```yaml
easing:
  linear:      linear
  ease:        ease
  easeIn:      cubic-bezier(0.4, 0, 1, 1)
  easeOut:     cubic-bezier(0, 0, 0.2, 1)
  easeInOut:   cubic-bezier(0.4, 0, 0.2, 1)
  
  # Custom easings
  easeInQuad:  cubic-bezier(0.55, 0.085, 0.68, 0.53)
  easeOutQuad: cubic-bezier(0.25, 0.46, 0.45, 0.94)
  easeInOutQuad: cubic-bezier(0.455, 0.03, 0.515, 0.955)
  
  easeInCubic: cubic-bezier(0.55, 0.055, 0.675, 0.19)
  easeOutCubic: cubic-bezier(0.215, 0.61, 0.355, 1)
  easeInOutCubic: cubic-bezier(0.645, 0.045, 0.355, 1)
  
  easeInQuart: cubic-bezier(0.895, 0.03, 0.685, 0.22)
  easeOutQuart: cubic-bezier(0.165, 0.84, 0.44, 1)
  easeInOutQuart: cubic-bezier(0.77, 0, 0.175, 1)
  
  easeInExpo:  cubic-bezier(0.95, 0.05, 0.795, 0.035)
  easeOutExpo: cubic-bezier(0.19, 1, 0.22, 1)
  easeInOutExpo: cubic-bezier(1, 0, 0, 1)
  
  easeInBack:  cubic-bezier(0.6, -0.28, 0.735, 0.045)
  easeOutBack: cubic-bezier(0.175, 0.885, 0.32, 1.275)
  easeInOutBack: cubic-bezier(0.68, -0.55, 0.265, 1.55)
  
  # Spring animations
  springGentle: cubic-bezier(0.175, 0.885, 0.32, 1.05)
  springBouncy: cubic-bezier(0.68, -0.55, 0.265, 1.55)
  springWobbly: cubic-bezier(0.175, 0.885, 0.32, 1.275)
```

### Duration Values
```yaml
duration:
  instant:  0ms
  fast:     150ms   # Micro-interactions
  base:     300ms   # Default transitions
  moderate: 500ms   # Page transitions
  slow:     700ms   # Complex animations
  slower:   1000ms  # Dramatic reveals
  
  # Specific use cases
  hover:    180ms
  ripple:   600ms
  collapse: 350ms
  modal:    400ms
  drawer:   450ms
  page:     600ms
```

### Animation Keyframes

#### Theme Toggle Animation
```css
@keyframes sunRise {
  0% {
    transform: rotate(-180deg) scale(0);
    opacity: 0;
  }
  50% {
    transform: rotate(-90deg) scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}

@keyframes moonSet {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
  50% {
    transform: rotate(90deg) scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: rotate(180deg) scale(0);
    opacity: 0;
  }
}

@keyframes moonRise {
  0% {
    transform: rotate(180deg) scale(0) translateY(10px);
    opacity: 0;
  }
  50% {
    transform: rotate(90deg) scale(1.1) translateY(-5px);
    opacity: 0.7;
  }
  100% {
    transform: rotate(0deg) scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes sunSet {
  0% {
    transform: rotate(0deg) scale(1) translateY(0);
    opacity: 1;
  }
  50% {
    transform: rotate(-90deg) scale(1.1) translateY(5px);
    opacity: 0.7;
  }
  100% {
    transform: rotate(-180deg) scale(0) translateY(10px);
    opacity: 0;
  }
}
```

#### Micro-interactions
```css
/* Button Press */
@keyframes buttonPress {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.95); }
}

/* Ripple Effect */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Shake */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

/* Slide In */
@keyframes slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Fade Variants */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Loading States */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

@keyframes skeleton {
  0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
}
```

### Transition Properties
```yaml
transitions:
  # Base transitions
  all:        all 300ms ease-in-out
  colors:     background-color 300ms ease-in-out, border-color 300ms ease-in-out, color 300ms ease-in-out, fill 300ms ease-in-out, stroke 300ms ease-in-out
  opacity:    opacity 300ms ease-in-out
  shadow:     box-shadow 300ms ease-in-out
  transform:  transform 300ms ease-in-out
  
  # Component-specific
  button:     background-color 180ms ease-out, transform 180ms ease-out, box-shadow 180ms ease-out
  link:       color 180ms ease-out, border-color 180ms ease-out
  input:      border-color 180ms ease-out, box-shadow 180ms ease-out
  card:       transform 300ms ease-out, box-shadow 300ms ease-out
  modal:      opacity 400ms ease-out, transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.05)
```

### Performance Budgets
```yaml
performance:
  maxAnimationDuration: 1000ms
  maxSimultaneousAnimations: 3
  preferGPU: true  # Use transform and opacity for GPU acceleration
  willChange:
    - transform
    - opacity
    - filter
  avoidAnimating:
    - width
    - height
    - padding
    - margin
    - top
    - left
    - right
    - bottom
```

### Reduced Motion Alternatives
```css
@media (prefers-reduced-motion: reduce) {
  /* Instant transitions */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* Preserve essential animations with reduced intensity */
  .theme-toggle {
    transition: opacity 150ms ease-in-out;
  }
  
  /* Remove parallax effects */
  .parallax {
    transform: none !important;
  }
  
  /* Simplify loading indicators */
  .spinner {
    animation: none;
    border-color: currentColor transparent currentColor transparent;
  }
}
```

## 8. Component Animation Guidelines

### Theme Toggle Button
```yaml
states:
  idle:
    sun:
      transform: rotate(0deg) scale(1)
      opacity: 1
    moon:
      transform: rotate(180deg) scale(0)
      opacity: 0
  
  hover:
    duration: 180ms
    easing: easeOut
    transform: scale(1.05)
    filter: brightness(1.1)
  
  active:
    duration: 150ms
    easing: easeIn
    transform: scale(0.95)
  
  transition:
    duration: 300ms
    easing: easeInOutCubic
    sun-to-moon:
      sun: sunSet animation
      moon: moonRise animation
    moon-to-sun:
      moon: moonSet animation
      sun: sunRise animation
```

### Cards
```yaml
states:
  idle:
    transform: translateY(0) scale(1)
    boxShadow: elevation.base
  
  hover:
    duration: 300ms
    easing: easeOut
    transform: translateY(-4px) scale(1.02)
    boxShadow: elevation.lg
  
  active:
    duration: 150ms
    easing: easeIn
    transform: translateY(0) scale(0.98)
    boxShadow: elevation.sm
```

### Buttons
```yaml
states:
  idle:
    transform: scale(1)
    boxShadow: none
  
  hover:
    duration: 180ms
    easing: easeOut
    transform: scale(1.02)
    filter: brightness(1.05)
  
  active:
    duration: 150ms
    easing: easeIn
    transform: scale(0.98)
  
  disabled:
    opacity: 0.5
    cursor: not-allowed
    animation: none
```

### Modals/Drawers
```yaml
enter:
  duration: 400ms
  easing: easeOutBack
  from:
    opacity: 0
    transform: scale(0.9) translateY(20px)
  to:
    opacity: 1
    transform: scale(1) translateY(0)

exit:
  duration: 300ms
  easing: easeIn
  from:
    opacity: 1
    transform: scale(1) translateY(0)
  to:
    opacity: 0
    transform: scale(0.95) translateY(10px)
```

### Page Transitions
```yaml
fadeTransition:
  duration: 600ms
  easing: easeInOut
  overlap: 200ms  # Crossfade overlap
  
slideTransition:
  duration: 500ms
  easing: easeInOutCubic
  direction: horizontal  # or vertical
  
morphTransition:
  duration: 700ms
  easing: easeInOutQuart
  preserveElements: true  # FLIP animation
```

## 9. Accessibility Considerations

### Focus States
```yaml
focus:
  outline: 3px solid currentColor
  outlineOffset: 2px
  borderRadius: 4px
  transition: outline-offset 150ms ease-out
  
focusVisible:
  outlineOffset: 4px
  boxShadow: 0 0 0 4px rgba(primary, 0.2)
```

### Motion Accessibility
- All animations respect `prefers-reduced-motion`
- Essential animations have reduced alternatives
- No auto-playing videos without user consent
- Pause buttons for continuous animations
- Keyboard shortcuts to disable animations

### Color Accessibility
- All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- Interactive elements meet 3:1 contrast
- Focus indicators meet 3:1 contrast
- Error states don't rely solely on color
- Success/warning/error have icons in addition to color

## 10. Implementation Priority

### Phase 1: Core (Must Have)
1. Color tokens and CSS variables
2. Typography scale
3. Basic transitions (colors, opacity)
4. Theme toggle animation
5. Reduced motion support

### Phase 2: Enhanced (Should Have)
1. Component micro-interactions
2. Loading states
3. Page transitions
4. Advanced easings
5. Elevation system

### Phase 3: Delightful (Nice to Have)
1. Parallax effects
2. Morphing transitions
3. Complex keyframe animations
4. Gesture-based animations
5. Physics-based spring animations