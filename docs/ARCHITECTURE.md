# Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Router                      │
├─────────────────────────────────────────────────────────────┤
│  Pages                                                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │   Session   │ │  Dashboard  │ │  Settings   │            │
│  │   (main)    │ │  (history)  │ │ (prefs)     │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
├─────────────────────────────────────────────────────────────┤
│  Components Layer                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ TherapySession │ Timer │ Controls │ Visualizers      │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Hooks Layer                                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ useAudioEngine │ useWakeLock │ useKeyboard │ useTheme│   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  State Layer (Zustand)                                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │   Session   │ │   History   │ │ Preferences │            │
│  │    Store    │ │    Store    │ │    Store    │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
├─────────────────────────────────────────────────────────────┤
│  Browser APIs                                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ Web Audio   │ │ Wake Lock   │ │localStorage │            │
│  │    API      │ │    API      │ │             │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Audio Engine Architecture

### Click Train Mode
```
AudioContext
    │
    ├── OscillatorNode (1kHz sine wave)
    │       │
    │       └── GainNode (envelope shaping)
    │               │
    │               └── Destination (speakers)
    │
    └── Scheduler (setInterval @ 25ms = 40Hz)
            │
            └── Creates 1ms burst every 25ms
```

### Binaural Beats Mode
```
AudioContext
    │
    ├── OscillatorNode (200Hz) ──┐
    │                            │
    │                     ChannelMergerNode
    │                            │
    ├── OscillatorNode (240Hz) ──┘
    │                            │
    │                      GainNode
    │                            │
    └────────────────────► Destination
                          (stereo output)
```

### Visual Flicker Mode (Combined)
```
AudioContext + RequestAnimationFrame
    │
    ├── Audio (Click Train or Binaural)
    │
    └── Visual (40Hz screen flicker)
            │
            └── CSS opacity toggle @ 40Hz
```

## State Management

### Session Store
```typescript
interface SessionState {
  isPlaying: boolean;
  mode: 'clicktrain' | 'binaural' | 'combined';
  duration: number;        // preset in seconds
  remainingTime: number;   // countdown
  pulseCount: number;
  volume: number;
  visualFlicker: boolean;
}
```

### History Store
```typescript
interface HistoryState {
  sessions: CompletedSession[];
  totalTime: number;
  streakDays: number;
  lastSessionDate: string;
}
```

### Preferences Store
```typescript
interface PreferencesState {
  theme: 'light' | 'dark' | 'system';
  defaultMode: 'clicktrain' | 'binaural';
  defaultDuration: number;
  defaultVolume: number;
  showOnboarding: boolean;
  audioOutputDevice?: string;
}
```

## Data Flow

```
User Action
    │
    ▼
Component (dispatch action)
    │
    ▼
Zustand Store (update state)
    │
    ├──► localStorage (persist)
    │
    └──► React re-render
            │
            ▼
        UI Update
```

## PWA Architecture

```
┌─────────────────────────────────────┐
│           Next.js App               │
├─────────────────────────────────────┤
│  Service Worker (next-pwa)          │
│  ├── Cache static assets            │
│  ├── Offline support                │
│  └── Background sync                │
├─────────────────────────────────────┤
│  Web App Manifest                   │
│  ├── App name and icons             │
│  ├── Theme colors                   │
│  └── Display mode (standalone)      │
└─────────────────────────────────────┘
```

## Accessibility Architecture

- All buttons have aria-labels
- Focus management for modals
- Keyboard navigation (spacebar, arrows)
- Screen reader announcements for state changes
- Reduced motion support (prefers-reduced-motion)
- High contrast mode support

## Error Handling Strategy

1. **Audio Context Errors**: Fallback message, retry button
2. **Wake Lock Errors**: Continue without, show warning
3. **Storage Errors**: In-memory fallback, warn user
4. **Device Selection Errors**: Use default device

## Performance Considerations

- Audio scheduling uses precise Web Audio timing
- Canvas visualizations use requestAnimationFrame
- State updates batched with Zustand
- Components memoized where beneficial
- Lazy load dashboard and settings pages
