# Pantone-Inspired Microblog Architecture

## Vision Statement
Transform the microblog into a visually striking Pantone color swatch grid where each post is presented as a color card with an image, title below, and tag-based color codes that create a unique visual language.

## Core Design Concept

### Pantone Card Structure
```
┌─────────────────────┐
│                     │
│                     │
│   [Image/Visual]    │  ← 4:3 or 1:1 aspect ratio
│                     │
│                     │
├─────────────────────┤
│ PANTONE®            │  ← Small brand label
│ 17-3938             │  ← Color code (from tags)
│ Post Title Here     │  ← Post title/excerpt
└─────────────────────┘
```

## Tag-to-Color Mapping System

### Primary Tag Colors
Each tag gets a unique Pantone-style code and color:

```javascript
const tagColorSystem = {
  // Creative & Design
  "design": { code: "17-3938", name: "Very Peri", color: "#6667AB" },
  "art": { code: "18-1664", name: "Viva Magenta", color: "#BE3455" },
  "photography": { code: "15-1040", name: "Iced Coffee", color: "#B08D74" },
  
  // Technical
  "code": { code: "19-4052", name: "Classic Blue", color: "#0F4C81" },
  "javascript": { code: "13-0932", name: "Cornsilk", color: "#F3D74A" },
  "performance": { code: "16-1546", name: "Living Coral", color: "#FF6F61" },
  
  // Lifestyle
  "bjj": { code: "18-3949", name: "Purple Haze", color: "#7C4789" },
  "movement": { code: "16-4411", name: "Tourmaline", color: "#86A8A3" },
  "meditation": { code: "14-4318", name: "Serenity", color: "#91A8D0" },
  
  // Content Types
  "reading": { code: "17-1755", name: "Paradise Pink", color: "#E8537A" },
  "quotes": { code: "15-2718", name: "Fuchsia Pink", color: "#D77FA1" },
  "video": { code: "18-2133", name: "Pink Flambé", color: "#CC5490" },
  
  // Nature & Morning
  "morning": { code: "17-1341", name: "Tawny Orange", color: "#D68A59" },
  "astro": { code: "19-3832", name: "Galaxy Blue", color: "#2A4B7C" },
  "simplicity": { code: "11-4001", name: "Bright White", color: "#F4F5F0" }
};
```

### Color Code Generation Algorithm
1. Primary tag determines base color
2. Secondary tags create sub-variations (e.g., 17-3938-A, 17-3938-B)
3. If no tags, use timestamp-based generative color

## Layout Specifications

### Grid System
```css
/* Masonry-style grid with fixed column widths */
.pantone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 32px;
}

/* Card dimensions */
.pantone-card {
  width: 100%;
  aspect-ratio: 3/4; /* Classic Pantone proportion */
  min-height: 360px;
  max-width: 320px;
}
```

### Card Components

#### 1. Image Section (70% of card)
- Aspect ratio: 4:3 or 1:1 centered
- Fallback: Gradient generated from tag colors
- Loading: Skeleton with shimmer effect
- Treatment: Subtle vignette or frame

#### 2. Label Section (30% of card)
- Background: White or off-white
- Typography: 
  - "PANTONE®" - 10px, uppercase, letter-spacing: 0.1em
  - Code - 14px, bold, monospace
  - Title - 16px, medium weight, 2-line clamp

### Image Strategy

#### For Posts With Images
- Use provided image
- Apply consistent treatment (crop/frame)
- Lazy loading with blur-up technique

#### For Posts Without Images
Generate abstract visuals based on:
1. **Text posts**: Typography-based design with key quote
2. **Code posts**: Syntax-highlighted snippet preview
3. **Link posts**: Screenshot or favicon composition
4. **Quote posts**: Beautiful typography layout
5. **Video posts**: Video thumbnail or poster frame

#### Placeholder System
```javascript
const placeholderGenerators = {
  text: (content, tagColor) => generateTypographicImage(content, tagColor),
  code: (content, tagColor) => generateCodePreview(content, tagColor),
  link: (url, tagColor) => generateLinkPreview(url, tagColor),
  quote: (quote, tagColor) => generateQuoteCard(quote, tagColor),
  default: (tagColor) => generateGradient(tagColor)
};
```

## Interactive Features

### Hover States
- Card lifts with shadow
- Color code reveals full tag list
- Quick preview of full content

### Click Behavior
- Expands to modal with full content
- Or navigates to dedicated post page

### Filter by Color
- Click on color code to filter all posts with same primary tag
- Visual feedback with color highlighting

## Responsive Behavior

### Desktop (1200px+)
- 4-5 columns
- Full hover interactions
- Side-by-side tag legend

### Tablet (768px - 1199px)
- 2-3 columns
- Touch-friendly tap targets
- Collapsible tag legend

### Mobile (< 768px)
- Single column
- Stacked cards
- Swipeable with color indicators

## Technical Implementation

### Data Structure Enhancement
```json
{
  "id": "2025-08-07-001",
  "type": "text",
  "content": {
    "text": "...",
    "html": "..."
  },
  "media": {
    "thumbnail": "/path/to/generated/thumb.jpg",
    "pantoneColor": {
      "code": "17-3938",
      "name": "Very Peri",
      "hex": "#6667AB",
      "rgb": [102, 103, 171]
    }
  },
  "metadata": {
    "tags": ["design", "performance"],
    "primaryTag": "design"
  }
}
```

### CSS Architecture
```css
/* Base card structure */
.pantone-card {
  --card-color: var(--tag-color, #6667AB);
  --card-code: var(--tag-code, "17-3938");
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

/* Image section */
.pantone-card__image {
  height: 70%;
  background: var(--card-color);
  position: relative;
  overflow: hidden;
}

/* Label section */
.pantone-card__label {
  height: 30%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Pantone branding */
.pantone-card__brand {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.6;
  margin-bottom: 4px;
}

/* Color code */
.pantone-card__code {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  color: var(--card-color);
  margin-bottom: 8px;
}

/* Post title */
.pantone-card__title {
  font-size: 16px;
  line-height: 1.3;
  color: var(--color-text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

## Animation & Transitions

### Card Entry Animation
```css
@keyframes pantoneReveal {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.pantone-card {
  animation: pantoneReveal 0.4s ease-out backwards;
  animation-delay: calc(var(--card-index) * 0.05s);
}
```

### Color Transitions
- Smooth color morphing when filtering
- Gradient animations for placeholders
- Subtle pulse on new posts

## Accessibility Considerations

1. **Color Contrast**: Ensure text on colored backgrounds meets WCAG AA
2. **Alt Text**: Rich descriptions for generated images
3. **Keyboard Navigation**: Tab through cards, Enter to expand
4. **Screen Readers**: Announce color names, not just codes
5. **Reduced Motion**: Respect prefers-reduced-motion

## Performance Optimizations

1. **Image Loading**:
   - Lazy load with Intersection Observer
   - Progressive JPEG/WebP with fallbacks
   - Thumbnail generation on server/build

2. **Rendering**:
   - Virtual scrolling for large feeds
   - CSS containment for card isolation
   - GPU-accelerated transforms

3. **Caching**:
   - Cache generated placeholder images
   - Store color calculations
   - Preload next batch on scroll

## Future Enhancements

1. **Color Mixing**: Blend colors for multi-tag posts
2. **Seasonal Palettes**: Rotate color schemes by time/season
3. **User Collections**: Save favorite color combinations
4. **Print Mode**: Generate actual Pantone-style cards for printing
5. **AR Preview**: View cards in physical space
6. **Color Stories**: Group related posts by color harmony

## Next Steps

1. Create tag-to-color mapping configuration
2. Build image placeholder generators
3. Implement card component CSS
4. Update JavaScript for new data structure
5. Add grid layout system
6. Test across devices
7. Create color legend/key component
## Component API (Implementation Notes)

This section documents the current implementation for the Pantone microblog cards.

- Data source:
  - Posts: [data/microblog/posts.json](data/microblog/posts.json)
  - Tag → Pantone map: [config/tag-pantone-map.json](config/tag-pantone-map.json)
- Runtime:
  - Loader and renderer: [js/microblog.js](js/microblog.js)
  - Styles: [css/microblog.css](css/microblog.css)
  - Template: [microblog.html](microblog.html)

### Public Helpers (JS)

- getPantoneForTag(tag) — resolves a tag to color/code using the runtime map, falling back to built‑in defaults and then a deterministic generator
  - [JavaScript.function()](js/microblog.js:134)
- primaryTagFor(post) — decides primary tag from metadata or type
  - [JavaScript.function()](js/microblog.js:142)
- deriveTitle(post) — derives a human title from content or metadata
  - [JavaScript.function()](js/microblog.js:148)
- svgPlaceholderURI({hex, emoji, label}) — generates an encoded, accessible SVG placeholder
  - [JavaScript.function()](js/microblog.js:179)

Runtime Tag Map Loader:
- loadTagPantoneMap() — loads [config/tag-pantone-map.json](config/tag-pantone-map.json) at startup
  - [JavaScript.function()](js/microblog.js:72)

### DOM Contract (Template)

- Card root: .pantone-card (article)
- Image area: .pantone-card__image (contains figure/img or video)
- Label area: .pantone-card__label
  - Brand: .pantone-card__brand
  - Code: .pantone-card__code
  - Title: .pantone-card__title
  - Meta row: .pantone-card__meta (time + type)
  - Tags: .micro-post-tags
  - Share button: .micro-post-share

Custom properties set on card:
- --card-color: tag color (hex)
- --card-fg: ideal contrasting text color for the card color

### Color Code Suffix Rule

- For secondary tags, take the first letter of up to three secondary tags (A–Z), concatenate with hyphen: e.g., 17-3938-DR for “design + reading”.
- Implemented when rendering .pantone-card__code inside [JavaScript.function()](js/microblog.js:386)

### Accessibility

- Each card is role="article" with aria-labelledby bound to the title id
  - Title id set next to .pantone-card__title in [JavaScript.function()](js/microblog.js:395)
- Placeholder images include meaningful alt text (derived title) and use an XML-encoded data URI via [JavaScript.function()](js/microblog.js:179)
- Share button gets aria-label with the post title for AT users in [JavaScript.function()](js/microblog.js:441)
- Reduced motion respected in CSS (prefers-reduced-motion) at [CSS.rule()](css/microblog.css:1)

### Performance

- Cards are contained to improve paint/scroll perf: [CSS.rule()](css/microblog.css:1)
- Media lazy-loaded; videos use preload="metadata" optimization at [JavaScript.function()](js/microblog.js:520)
- Grid uses repeat(auto-fill, minmax(...)) for efficient layout rendering.

### Maintenance Guides

- To add/update a tag’s color/code:
  - Edit [config/tag-pantone-map.json](config/tag-pantone-map.json:1) (preferred).
  - The runtime loader overrides built-in defaults automatically.
- To adjust fallback palette behavior:
  - Update the HSL hashing logic in [JavaScript.function()](js/microblog.js:112) and the code formatter in [JavaScript.function()](js/microblog.js:120).
- To tune typography or spacing:
  - Edit Pantone card rules in [css/microblog.css](css/microblog.css).

### Testing Checklist

- Visual:
  - Cards show correct brand, code with suffix, and title.
  - Placeholder displays for imageless posts with readable contrast.
- A11y:
  - Tab focus reaches tag chips and share button.
  - Screen reader announces title and color code context from label.
- Themes:
  - Legibility in both sunsetGlow and midnightAurora.
- Perf:
  - No layout shift when images load; smooth scroll; minimal repaint.