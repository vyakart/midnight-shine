# Pantone Microblog Refinements Plan

## User Requirements
1. **Uniform Card Size**: All cards must have the same fixed height
2. **Center Alignment**: Grid should be centered in the container
3. **Remove PANTONE® Trademark**: Remove the brand text from cards
4. **Remove Tags Section**: Hide/remove the tags from cards
5. **Icon Changes**: Replace share button with like and share icons
6. **Header Text**: Change "Stream" to "Streams"
7. **Single Line Subheading**: Ensure subheading doesn't wrap

## Implementation Details

### 1. Uniform Card Size (CSS)
```css
.pantone-card {
  height: 380px; /* Fixed height for all cards */
  display: flex;
  flex-direction: column;
}

.pantone-card__image {
  flex: 1; /* Take remaining space */
  min-height: 0; /* Allow shrinking */
}

.pantone-card__label {
  flex-shrink: 0; /* Fixed height label area */
  max-height: 120px; /* Constrain label height */
}
```

### 2. Center Grid Alignment (CSS)
```css
.microblog-feed {
  justify-content: center; /* Center the grid */
  max-width: 1200px; /* Optional: limit max width */
  margin: 0 auto; /* Center the container */
}
```

### 3. Remove PANTONE® Brand (HTML/JS)
- Remove the `.pantone-card__brand` div from template
- Remove the line that sets "PANTONE®" text in JS

### 4. Remove Tags (HTML/JS)
- Remove `.micro-post-tags` div from template
- Comment out tag rendering in JS

### 5. Replace Share Button with Icons (HTML/JS)
- Add two icon buttons: like (heart) and share
- Use inline SVG icons
- Style as icon-only buttons

### 6. Change Header Text (HTML)
- Update `<h2>Stream</h2>` to `<h2>Streams</h2>`

### 7. Single Line Subheading (CSS)
```css
.microblog-hero .subheadline {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

## Files to Modify
- `microblog.html` - Template changes
- `css/microblog.css` - Style updates
- `js/microblog.js` - JS rendering logic

## Next Steps
Switch to Code mode to implement these changes.