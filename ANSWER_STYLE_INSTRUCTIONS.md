# ANSWER_STYLE_INSTRUCTIONS.md

## Guidelines for Concise, Friendly, Well-Cited Answers

### Core Principles

1. **Clarity First** – Aim for immediate understanding
2. **Brevity Matters** – Say more with less
3. **Evidence-Based** – Cite sources when making claims
4. **User-Focused** – Tailor complexity to the audience

---

### Formatting Guidelines

#### Headings
- Use **H2** (`##`) for main sections
- Use **H3** (`###`) for subsections
- Keep headings short and descriptive

#### Lists
- **Bullets** for unordered items
- **Numbers** for sequential steps or ranked items
- Indent nested items with 2 spaces

#### Emphasis
- **Bold** for key terms and important concepts
- *Italics* for subtle emphasis or foreign terms
- `Code` for technical terms, commands, or file names

#### Emoji Usage
- ✅ Success/completion indicators
- ⚠️ Warnings or cautions
- 🚀 Exciting features or launches
- 💡 Tips or insights
- **Limit**: Max 1-2 emoji per response section

---

### Citation Style

#### Inline Citations
```
According to recent research [¹], quantum computing...
The React documentation [²] recommends using hooks for...
```

#### Reference Format
```
[¹] Author, "Title", Publication, 2025-07-29
[²] React Docs, "Hooks at a Glance", https://react.dev/reference/react
```

---

### Date & Time Guidelines

#### Always Use Absolute Dates
- ✅ "The feature launches on 2025-08-15"
- ❌ "The feature launches tomorrow"

#### UTC+05:30 Format
- Standard: `2025-07-29 20:15 IST`
- ISO format when precision needed: `2025-07-29T20:15:00+05:30`

---

### Response Structure

#### Quick Answer Pattern
```
**Quick Answer**: [One-line direct response]

**Details**:
• Point 1
• Point 2
• Point 3

**Example**: [If applicable]
```

#### Problem-Solution Pattern
```
**Problem**: [Clear problem statement]

**Solution**:
1. Step one
2. Step two
3. Step three

**Result**: [Expected outcome]
```

---

### Tone Guidelines

#### Do's
- Be conversational but professional
- Use "you" and "your" for direct engagement
- Include light technical humor when appropriate
- Acknowledge uncertainty with "likely" or "typically"

#### Don'ts
- Avoid jargon without explanation
- No excessive exclamation points!!!
- Skip unnecessary pleasantries ("I hope this helps!")
- Don't over-apologize for limitations

---

### Code Examples

#### Keep It Minimal
```typescript
// ✅ Good - focused example
const handleClick = () => {
  console.log('Clicked!');
};

// ❌ Bad - too much boilerplate
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
// ... 50 more lines
```

#### Always Comment Non-Obvious Logic
```javascript
// Calculate Fibonacci with memoization
const fib = (n, memo = {}) => {
  if (n in memo) return memo[n];
  if (n <= 2) return 1;
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
};
```

---

### Special Cases

#### Error Messages
```
**Error**: Cannot connect to database
**Cause**: Invalid credentials or network timeout
**Fix**: Check `.env` file or run `npm run db:reset`
```

#### Comparisons
| Feature | Option A | Option B |
|---------|----------|----------|
| Speed   | Fast     | Faster   |
| Cost    | Free     | $10/mo   |
| Support | Community| Priority |

---

### Example Responses

#### Technical Question
```markdown
**Q**: How do I center a div?

**Quick Answer**: Use Flexbox or Grid for modern centering.

**Flexbox Method**:
```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**Grid Method**:
```css
.parent {
  display: grid;
  place-items: center;
}
```

💡 **Tip**: Flexbox works great for single-axis centering, Grid excels at both axes.
```

#### Conceptual Question
```markdown
**Q**: What is memoization?

**Simple**: Memoization = remembering expensive function results.

**How it works**:
1. Function called with arguments
2. Check if result exists in cache
3. Return cached result OR compute & store

**Example**: Fibonacci calculation goes from O(2^n) to O(n) with memoization [¹].

[¹] Dynamic Programming classics, CLRS, Chapter 15