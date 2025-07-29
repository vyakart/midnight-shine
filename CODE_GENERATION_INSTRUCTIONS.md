# CODE_GENERATION_INSTRUCTIONS.md

## Conventions for TypeScript, React, Tailwind, and Development Practices

### TypeScript Conventions

#### Type Safety First
```typescript
// ✅ Explicit types for function parameters and returns
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Use type inference when obvious
const userName = 'John'; // Type inferred as string

// ❌ Avoid 'any' unless absolutely necessary
function process(data: any) { } // Bad practice
```

#### Interface vs Type
- Use `interface` for object shapes and contracts
- Use `type` for unions, intersections, and utility types
```typescript
// Object shapes
interface User {
  id: string;
  name: string;
}

// Unions and complex types
type Status = 'pending' | 'active' | 'archived';
type AsyncState<T> = Loading | Success<T> | Error;
```

#### Naming Conventions
- Interfaces/Types: `PascalCase`
- Enums: `PascalCase` with `UPPER_SNAKE_CASE` values
- Type parameters: Single letter (`T`, `K`, `V`) or descriptive (`TData`, `TError`)

---

### React Best Practices

#### Component Structure
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import type { ComponentProps } from './types';

// 2. Types/Interfaces
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

// 3. Component
export const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
  // 4. Hooks
  const [isHovered, setIsHovered] = useState(false);
  
  // 5. Handlers
  const handleClick = () => {
    onClick();
  };
  
  // 6. Render
  return (
    <button onClick={handleClick} className={styles}>
      {children}
    </button>
  );
};
```

#### Hook Rules
- Custom hooks start with `use`
- Keep hooks at the top level
- Extract complex logic into custom hooks
```typescript
// Custom hook example
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}
```

---

### Tailwind CSS Ordering

#### Class Order Convention
1. **Layout**: `flex`, `grid`, `block`
2. **Positioning**: `relative`, `absolute`, `fixed`
3. **Spacing**: `m-4`, `p-2`, `space-x-4`
4. **Sizing**: `w-full`, `h-screen`, `max-w-lg`
5. **Typography**: `text-lg`, `font-bold`, `text-center`
6. **Colors**: `bg-white`, `text-gray-900`, `border-blue-500`
7. **Effects**: `shadow-lg`, `rounded-md`, `opacity-50`
8. **States**: `hover:`, `focus:`, `active:`
9. **Responsive**: `sm:`, `md:`, `lg:`

```jsx
<div className="
  flex items-center justify-between
  relative
  px-4 py-2 mt-4
  w-full max-w-4xl
  text-sm font-medium
  bg-white text-gray-900 border-gray-200
  rounded-lg shadow-sm
  hover:shadow-md focus:outline-none
  md:px-6 lg:text-base
">
```

---

### File Organization

```
src/
├── components/
│   ├── common/          # Shared components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   ├── features/        # Feature-specific components
│   └── layouts/         # Layout components
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── types/              # Shared types
├── services/           # API services
└── styles/             # Global styles
```

---

### Commit Message Format

#### Structure
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or fixes
- `chore`: Build process or auxiliary tool changes

#### Examples
```bash
feat(terminal): add command history navigation

- Implement up/down arrow key support
- Store last 100 commands in localStorage
- Add keyboard shortcuts for history search

Closes #123

---

fix(auth): resolve token refresh race condition

Multiple simultaneous API calls were causing token refresh
to fail. Added mutex to ensure single refresh operation.
```

---

### PR Review Checklist

#### Before Submitting
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code coverage maintained (≥80%)
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] Branch is up-to-date with main

#### Code Quality
- [ ] No commented-out code
- [ ] No console.logs in production code
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Accessibility considered (ARIA labels, keyboard nav)
- [ ] Responsive design verified

#### Performance
- [ ] No unnecessary re-renders
- [ ] Large lists virtualized
- [ ] Images optimized
- [ ] Code splitting implemented where needed
- [ ] Bundle size impact assessed

---

### Error Handling Pattern

```typescript
// Consistent error handling
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Usage in try-catch
try {
  const data = await fetchUserData(userId);
  return { success: true, data };
} catch (error) {
  if (error instanceof AppError) {
    logger.error(`${error.code}: ${error.message}`);
    return { success: false, error: error.message };
  }
  
  // Unknown errors
  logger.error('Unexpected error:', error);
  return { success: false, error: 'An unexpected error occurred' };
}
```

---

### Testing Standards

```typescript
// Test file structure
describe('Component/Function Name', () => {
  describe('when condition A', () => {
    it('should behavior X', () => {
      // Arrange
      const props = { /* ... */ };
      
      // Act
      const { getByText } = render(<Component {...props} />);
      
      // Assert
      expect(getByText('Expected Text')).toBeInTheDocument();
    });
  });
  
  describe('when condition B', () => {
    it('should behavior Y', () => {
      // Test implementation
    });
  });
});
```

---

### API Design Guidelines

```typescript
// RESTful endpoints
GET    /api/users          // List
GET    /api/users/:id      // Read
POST   /api/users          // Create
PUT    /api/users/:id      // Update
DELETE /api/users/:id      // Delete

// Response format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    total?: number;
    timestamp: string;
  };
}