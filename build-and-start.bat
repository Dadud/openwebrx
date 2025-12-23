@echo off
REM Build the frontend and start OpenWebRX+

echo Building React frontend...
cd webui
call npm run build
if errorlevel 1 (
    echo Build failed! Make sure you've run: npm install
    pause
    exit /b 1
)
cd ..

echo.
echo Frontend built successfully!
echo.
echo Starting OpenWebRX+...
echo Make sure your SDR is plugged in and drivers are installed.
echo.
echo The server will start on http://localhost:8073
echo Press Ctrl+C to stop the server.
echo.

python openwebrx.py

pause

