# Simple Setup Guide for Windows

## Prerequisites

You need:
1. **Python 3.7+** installed
2. **Node.js** installed (for building the frontend)
3. **WSL (Windows Subsystem for Linux)** - RECOMMENDED for easiest setup

## Why WSL?

OpenWebRX+ requires `pycsdr` which is difficult to build on Windows. WSL lets you run Linux tools easily.

## Quick Start with WSL

1. **Open PowerShell as Administrator** and run:
   ```powershell
   wsl --install
   ```
   Restart your computer when prompted.

2. **Open Ubuntu** (installed automatically with WSL)

3. **In Ubuntu terminal**, run:
   ```bash
   # Update packages
   sudo apt update
   
   # Install build tools and dependencies
   sudo apt install -y python3-pip python3-dev build-essential cmake libfftw3-dev git
   
   # Navigate to your project (adjust path as needed)
   cd /mnt/c/Users/dadud/cursor\ projects/openwebrx
   
   # Install pycsdr
   git clone https://github.com/jketterl/pycsdr.git /tmp/pycsdr
   cd /tmp/pycsdr
   sudo python3 setup.py install
   
   # Install OpenWebRX+
   cd /mnt/c/Users/dadud/cursor\ projects/openwebrx
   pip3 install -e .
   
   # Build frontend
   cd webui
   npm install
   npm run build
   cd ..
   
   # Start server
   python3 openwebrx.py
   ```

4. **Open browser** and go to: `http://localhost:8073`

That's it! The new React UI should load automatically.

## Alternative: Try Windows Native (Advanced)

If you want to try building on Windows directly, you'll need:
- Visual Studio Build Tools
- CMake
- Git

Then follow the same steps but in PowerShell/CMD instead of WSL.

