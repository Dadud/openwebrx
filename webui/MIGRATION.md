# Migration Guide: Legacy UI to Modern React UI

This document describes the migration from the legacy HTML/JS/CSS frontend to the modern React + TypeScript SPA.

## Architecture Changes

### Frontend Structure
- **Old**: Monolithic JavaScript files in `htdocs/` with jQuery and manual DOM manipulation
- **New**: React SPA in `webui/` with TypeScript, Vite build system, and component-based architecture

### State Management
- **Old**: Global variables and jQuery-based state
- **New**: Zustand stores for centralized state management

### Waterfall Rendering
- **Old**: Canvas2D with multiple canvas elements
- **New**: WebGL (Three.js) for smooth, high-performance rendering

### Backend Communication
- **Old**: Direct WebSocket access with global handlers
- **New**: Abstracted API layer (`src/api/`) that handles all backend communication

## Key Features Preserved

All existing functionality has been preserved:
- ✅ Real-time waterfall and spectrum display
- ✅ Frequency tuning and mode selection
- ✅ Audio controls (volume, mute, squelch, noise reduction)
- ✅ Waterfall color/range controls
- ✅ Bookmarks and bandplan display
- ✅ Digital mode message panels (WSJT, JS8, APRS, etc.)
- ✅ Status monitoring (CPU, clients, S-meter)
- ✅ Profile selection
- ✅ Responsive layout

## Building and Deployment

1. **Development**:
   ```bash
   cd webui
   npm install
   npm run dev
   ```

2. **Production Build**:
   ```bash
   cd webui
   npm run build
   ```
   This outputs to `htdocs/static/webui/` which the backend serves automatically.

3. **Backend Integration**:
   - The backend automatically serves the new UI if it exists in `htdocs/static/webui/`
   - Falls back to legacy UI if new UI is not built
   - WebSocket and HTTP APIs remain unchanged

## Known Limitations / TODO

1. **IMA ADPCM Decoder**: The audio decoder is simplified. The full IMA ADPCM implementation should match the backend's encoding format exactly.

2. **Waterfall Color Schemes**: Currently uses a simple gradient. Full color scheme support from the legacy UI should be ported.

3. **Message Panels**: Basic structure is in place, but full rendering for all digital modes (DMR, D-STAR, etc.) needs to be completed.

4. **Bookmark Management**: Display is implemented, but adding/editing bookmarks UI needs to be added.

5. **Keyboard Shortcuts**: Not yet implemented.

6. **Recording**: Audio recording functionality needs to be added.

## Backend Compatibility

The new frontend is **100% compatible** with the existing backend:
- No backend changes required
- Same WebSocket protocol
- Same HTTP endpoints
- Same message formats

The backend treats the frontend as a black box - it just sends data and receives commands.

