# Code Quality Standards

## TypeScript Guidelines

### Strict Mode
All code must pass TypeScript strict mode. The following flags are enabled:
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `noUnusedLocals: true`

### Type Definitions

```typescript
// Use interfaces for object shapes
interface SessionConfig {
  mode: TherapyMode;
  duration: number;
  volume: number;
}

// Use types for unions and intersections
type TherapyMode = 'clicktrain' | 'binaural' | 'combined';
type SessionStatus = 'idle' | 'playing' | 'paused' | 'completed';

// Use generics for reusable types
interface StoreState<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}
```

### No Any Types
```typescript
// Bad
function processData(data: any) { ... }

// Good
function processData(data: SessionData) { ... }

// If truly unknown, use unknown with type guards
function processData(data: unknown) {
  if (isSessionData(data)) {
    // data is now SessionData
  }
}
```

## React Component Guidelines

### Component Structure
```typescript
// 1. Imports
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import type { SessionProps } from './types';

// 2. Types/Interfaces
interface Props {
  initialDuration: number;
  onComplete: () => void;
}

// 3. Component
export function Timer({ initialDuration, onComplete }: Props) {
  // a. Hooks
  const [time, setTime] = useState(initialDuration);

  // b. Callbacks
  const handleTick = useCallback(() => {
    setTime(t => t - 1);
  }, []);

  // c. Effects
  useEffect(() => {
    if (time === 0) onComplete();
  }, [time, onComplete]);

  // d. Render
  return <div>{formatTime(time)}</div>;
}
```

### Component Size Limits
- Maximum 200 lines per component file
- Extract logic to custom hooks when > 50 lines of logic
- Split into sub-components when JSX > 100 lines

### Memoization
```typescript
// Memoize expensive calculations
const formattedStats = useMemo(() =>
  calculateStats(sessions), [sessions]
);

// Memoize callbacks passed to children
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);

// Memoize components with expensive renders
export const ExpensiveList = memo(function ExpensiveList({ items }) {
  return items.map(item => <Item key={item.id} {...item} />);
});
```

## Hook Guidelines

### Custom Hook Structure
```typescript
// hooks/useAudioEngine.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import type { AudioMode } from '@/types';

interface UseAudioEngineOptions {
  mode: AudioMode;
  volume: number;
}

interface UseAudioEngineReturn {
  isPlaying: boolean;
  start: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  error: Error | null;
}

export function useAudioEngine(
  options: UseAudioEngineOptions
): UseAudioEngineReturn {
  // Implementation
}
```

### Hook Rules
1. Always handle cleanup in useEffect
2. Memoize returned callbacks
3. Handle errors gracefully
4. Document dependencies clearly

## State Management Guidelines

### Zustand Store Structure
```typescript
// stores/sessionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  // State
  isPlaying: boolean;
  mode: TherapyMode;

  // Actions
  start: () => void;
  stop: () => void;
  setMode: (mode: TherapyMode) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      mode: 'clicktrain',

      start: () => set({ isPlaying: true }),
      stop: () => set({ isPlaying: false }),
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({ mode: state.mode }), // Only persist some fields
    }
  )
);
```

## CSS/Tailwind Guidelines

### Class Organization
```tsx
// Order: layout → sizing → spacing → typography → colors → effects → states
<button
  className={cn(
    // Layout
    'flex items-center justify-center',
    // Sizing
    'h-12 w-full',
    // Spacing
    'px-4 py-2 gap-2',
    // Typography
    'text-lg font-medium',
    // Colors
    'bg-green-500 text-white',
    // Effects
    'rounded-lg shadow-md',
    // States
    'hover:bg-green-600 focus:ring-2 focus:ring-green-500',
    // Conditional
    isDisabled && 'opacity-50 cursor-not-allowed'
  )}
>
```

### Utility Function
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Error Handling

### Component Errors
```typescript
function AudioPlayer() {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <ErrorMessage
        message={error.message}
        onRetry={() => setError(null)}
      />
    );
  }

  return <Player />;
}
```

### Async Errors
```typescript
async function saveSession(data: SessionData) {
  try {
    await storage.save(data);
  } catch (error) {
    console.error('Failed to save session:', error);
    // Fallback to in-memory storage
    memoryStorage.save(data);
    // Notify user
    toast.warning('Session saved locally only');
  }
}
```

## Accessibility Requirements

### Interactive Elements
```tsx
<button
  aria-label="Start therapy session"
  aria-pressed={isPlaying}
  onClick={handleStart}
>
  {isPlaying ? 'Playing' : 'Start'}
</button>
```

### Keyboard Navigation
```tsx
function Modal({ isOpen, onClose, children }) {
  // Trap focus within modal
  // Handle Escape key
  // Return focus on close
}
```

### Screen Reader Announcements
```tsx
<div role="status" aria-live="polite" className="sr-only">
  {isPlaying ? 'Session started' : 'Session stopped'}
</div>
```

## File Naming Conventions

```
components/
├── Button.tsx           # PascalCase for components
├── Button.test.tsx      # Test files
├── index.ts             # Barrel exports

hooks/
├── useAudioEngine.ts    # camelCase with 'use' prefix

stores/
├── sessionStore.ts      # camelCase

lib/
├── utils.ts             # camelCase
├── audio-helpers.ts     # kebab-case for multi-word utilities

types/
├── index.ts             # Type definitions
```

## Import Organization

```typescript
// 1. React/Next
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { create } from 'zustand';

// 3. Internal absolute imports
import { Button } from '@/components/ui/Button';
import { useSessionStore } from '@/stores/sessionStore';

// 4. Relative imports
import { formatTime } from './utils';
import type { TimerProps } from './types';
```
