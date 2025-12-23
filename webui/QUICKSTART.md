# Quick Start Guide - Testing with Real SDR

## Step 1: Build the Frontend

```bash
cd webui
npm install
npm run build
```

This will build the React frontend and place it in `htdocs/static/webui/`

## Step 2: Start the Backend

From the project root directory:

```bash
python openwebrx.py
```

The server will start and you'll see output like:
```
Starting OpenWebRX on port 8073...
```

## Step 3: Access the Web UI

Open your browser and go to:
```
http://localhost:8073
```

The backend will automatically serve the new React UI if it's built, otherwise it will fall back to the legacy UI.

## Configuration

If you need to configure your SDR device, edit `openwebrx.conf` or use the settings page at:
```
http://localhost:8073/settings
```

## Troubleshooting

- **Backend won't start**: Check that Python dependencies are installed
- **No SDR detected**: Make sure your SDR is plugged in and drivers are installed
- **Blank screen**: Make sure you ran `npm run build` in the webui directory
- **WebSocket errors**: Check that the backend is running on the expected port (default: 8073)

