# Installing OpenWebRX+ on Windows

## The Problem

OpenWebRX+ requires `pycsdr`, which is a Python binding for the `csdr` library. This package needs to be compiled from source and is complex to install on Windows.

## Option 1: Use WSL (Windows Subsystem for Linux) - RECOMMENDED

This is the easiest way to run OpenWebRX+ on Windows:

1. **Install WSL**:
   ```powershell
   wsl --install
   ```
   Then restart your computer.

2. **Install Ubuntu** from Microsoft Store

3. **In WSL/Ubuntu**, follow the standard Linux installation:
   ```bash
   # Install dependencies
   sudo apt update
   sudo apt install python3-pip python3-dev build-essential cmake libfftw3-dev
   
   # Clone and install pycsdr
   git clone https://github.com/jketterl/pycsdr.git
   cd pycsdr
   python3 setup.py install
   
   # Install OpenWebRX+ dependencies
   cd /path/to/openwebrx
   pip3 install -e .
   ```

4. **Run OpenWebRX+**:
   ```bash
   python3 openwebrx.py
   ```

## Option 2: Build pycsdr on Windows (Advanced)

This requires Visual Studio Build Tools and is more complex:

1. **Install Visual Studio Build Tools** with "Desktop development with C++"

2. **Install Git** and **CMake**

3. **Clone and build pycsdr**:
   ```bash
   git clone https://github.com/jketterl/pycsdr.git
   cd pycsdr
   python setup.py install
   ```

4. **Install OpenWebRX+**:
   ```bash
   cd path\to\openwebrx
   pip install -e .
   ```

## Option 3: Use Pre-built Packages (If Available)

Check if there are pre-built Windows packages available:
- Check the [OpenWebRX+ releases page](https://github.com/luarvique/openwebrx/releases)
- Check the [package repository](https://luarvique.github.io/ppa/)

## Quick Test (After Installation)

Once `pycsdr` is installed:

1. **Build the React frontend**:
   ```bash
   cd webui
   npm install
   npm run build
   cd ..
   ```

2. **Start the server**:
   ```bash
   python openwebrx.py
   ```

3. **Open in browser**:
   - Go to `http://localhost:8073`
   - The new React UI should load automatically

## Troubleshooting

- **"No module named 'pycsdr'"**: You need to install pycsdr (see options above)
- **Build errors**: Make sure you have Visual Studio Build Tools installed (for Windows native build)
- **SDR not detected**: Make sure your SDR drivers are installed (e.g., Zadig for RTL-SDR)

## Recommendation

**Use WSL (Option 1)** - it's the simplest and most reliable way to run OpenWebRX+ on Windows, as it uses the native Linux environment where all dependencies are readily available.

