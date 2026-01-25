# 40Hz Auditory Therapy

A web-based 40-Hz auditory stimulation therapy tool designed to replicate methodology from scientific research on gamma brainwave entrainment for cognitive enhancement and potential therapeutic benefits.

## Features

### Core Functionality
- **Click Train Mode** - 1ms bursts of 1kHz tone at 40Hz, matching the PNAS study protocol
- **Binaural Beats Mode** - 200Hz left ear / 240Hz right ear for perceived 40Hz beat
- **Combined Mode** - Both modes together for enhanced effect
- **Visual Flicker** - Optional 40Hz screen flicker for additional stimulation

### Session Management
- Configurable session durations (15, 30, 45, 60, 90 minutes)
- Real-time timer with progress tracking
- Session notes for tracking subjective effects
- Automatic session history with statistics

### User Experience
- First-time onboarding tutorial
- Keyboard shortcuts for quick control
- Dark/light/system theme support
- Reduced motion accessibility option
- Mobile-friendly responsive design

### Data & Export
- Session history dashboard with stats
- Streak tracking for consistency
- Export to JSON or CSV
- localStorage persistence

### PWA Support
- Installable as standalone app
- Screen Wake Lock to prevent sleep during sessions
- Offline capable

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd auditory-therapy

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production (use --webpack flag for PWA support)
npm run build -- --webpack

# Start production server
npm run start
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `R` | Reset timer |
| `M` | Switch mode |
| `↑` | Volume up |
| `↓` | Volume down |
| `?` | Show shortcuts |
| `Escape` | Close modal |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand with localStorage persistence
- **Audio**: Web Audio API
- **PWA**: next-pwa
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Main therapy session
│   ├── dashboard/         # Progress tracking
│   └── settings/          # User preferences
├── components/
│   ├── therapy/           # Session components
│   ├── visualizers/       # Audio visualizations
│   ├── onboarding/        # Tutorial components
│   └── ui/                # Reusable UI components
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand state stores
├── lib/                    # Utilities
└── types/                  # TypeScript definitions
```

## Scientific Background

This application is based on research demonstrating potential benefits of 40Hz gamma entrainment:

- **PNAS 2026 Study**: 40Hz auditory stimulation in aged primates showed enhanced glymphatic clearance and accelerated cerebrospinal fluid flow
- **MIT GENUS Protocol**: Gamma entrainment using sensory stimulation for potential Alzheimer's treatment
- **Cognitive Enhancement Research**: 40Hz binaural beats associated with improved focus and cognitive performance

**Disclaimer**: This is an experimental tool. Consult a healthcare provider before use, especially if you have epilepsy or other neurological conditions.

## Browser Support

- Chrome 90+
- Firefox 85+
- Safari 14+
- Edge 90+

Note: Binaural beats require stereo headphones. Some features (Wake Lock) may have limited support on certain browsers.

## Documentation

- [Architecture](docs/ARCHITECTURE.md) - System design and component structure
- [Code Quality](docs/CODE_QUALITY.md) - Coding standards and best practices
- [Implementation Plan](docs/TODO.md) - Feature status and file listing

## License

MIT

## Contributing

Contributions are welcome! Please read the [Code Quality Guidelines](docs/CODE_QUALITY.md) before submitting.
