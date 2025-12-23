@echo off
REM One-click Docker setup for OpenWebRX+ on Windows
REM Requires Docker Desktop to be installed and running

echo ==========================================
echo OpenWebRX+ Docker Setup (Windows)
echo ==========================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [1/3] Building Docker image...
docker build -t openwebrx-dev .

if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Starting container...
echo.
echo The server will be available at: http://localhost:8073
echo Press Ctrl+C to stop
echo.

REM Run container with USB device access (for SDR)
REM Note: On Windows, USB passthrough requires additional setup
docker run -it --rm -p 8073:8073 --name openwebrx-dev openwebrx-dev

pause

