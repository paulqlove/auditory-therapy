# Auditory Therapy App - Claude Instructions

## Project Overview

A Next.js-based 40-Hz auditory stimulation therapy application designed to replicate methodology from scientific studies on gamma brainwave entrainment for cognitive enhancement and potential Alzheimer's treatment.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Audio**: Web Audio API
- **PWA**: next-pwa
- **Icons**: Lucide React

## Architecture Principles

### Component Structure
- Use functional components with TypeScript interfaces
- Keep components focused and single-responsibility
- Extract hooks for reusable logic
- Co-locate related files (component, hooks, types)

### State Management
- Use Zustand for global state (session, preferences, history)
- Use React state for local UI state
- Persist critical state to localStorage

### Audio Engine
- Encapsulate Web Audio API in dedicated hooks
- Handle audio context lifecycle properly
- Support graceful degradation for unsupported browsers

### Accessibility
- All interactive elements must be keyboard accessible
- Use semantic HTML elements
- Include ARIA labels where needed
- Support reduced motion preferences

## File Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Main therapy session
│   ├── dashboard/         # Progress tracking
│   ├── settings/          # User preferences
│   └── layout.tsx         # Root layout with providers
├── components/
│   ├── ui/                # Reusable UI components
│   ├── audio/             # Audio-related components
│   ├── visualizers/       # Canvas visualizations
│   └── therapy/           # Therapy session components
├── hooks/
│   ├── useAudioEngine.ts  # Web Audio API hook
│   ├── useWakeLock.ts     # Screen Wake Lock hook
│   ├── useKeyboardShortcuts.ts
│   └── useTheme.ts
├── stores/
│   ├── sessionStore.ts    # Current session state
│   ├── historyStore.ts    # Session history
│   └── preferencesStore.ts # User preferences
├── lib/
│   ├── audio/             # Audio utilities
│   ├── export/            # Data export utilities
│   └── utils.ts           # General utilities
└── types/
    └── index.ts           # Shared TypeScript types
```

## Code Quality Standards

### TypeScript
- Enable strict mode
- Define explicit types for all props and state
- Use interfaces for objects, types for unions
- No `any` types without justification

### Components
- Max 200 lines per component
- Extract complex logic to custom hooks
- Use React.memo for expensive renders
- Handle loading and error states

### Testing (future)
- Unit tests for utilities and hooks
- Integration tests for critical flows
- Test accessibility with jest-axe

## Key Features to Implement

1. ✅ Core audio engine (Click Train & Binaural Beats)
2. Session timer with presets
3. Visual feedback (bar visualizer, pixel grid)
4. localStorage persistence
5. Progress dashboard
6. PWA support
7. Keyboard shortcuts
8. Theme toggle
9. Audio device selection
10. Session notes and export

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Browser Support

- Chrome 90+
- Firefox 85+
- Safari 14+
- Edge 90+

Note: Some features (Wake Lock, audio device selection) may have limited support on certain browsers.
