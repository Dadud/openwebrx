@echo off
REM Quick start script for OpenWebRX+ with new React UI
REM Make sure you've built the frontend first: cd webui && npm run build

echo Starting OpenWebRX+...
echo.
echo Make sure your SDR is plugged in and drivers are installed.
echo.
echo The server will start on http://localhost:8073
echo Press Ctrl+C to stop the server.
echo.

python openwebrx.py

pause

