# OpenWebRX+ Modern Web UI

This is the modern React + TypeScript frontend for OpenWebRX+.

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The dev server will run on http://localhost:3000 with hot module replacement.

## Building for Production

Build the frontend for production:

```bash
npm run build
```

This will output the built files to `htdocs/static/webui/`, which the backend will serve.

## Project Structure

- `src/` - Source code
  - `api/` - Backend API abstraction (WebSocket, HTTP)
  - `components/` - React components
  - `store/` - Zustand state management
  - `audio/` - Audio engine for Web Audio API
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **Three.js** - WebGL waterfall rendering
- **Web Audio API** - Audio playback

## Backend Integration

The frontend communicates with the backend via:
- WebSocket (`/ws/`) - Real-time data (spectrum, audio, metadata)
- HTTP REST API - Configuration and status

See `src/api/` for the API abstraction layer.

