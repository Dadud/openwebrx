#!/bin/bash
# Quick start script for OpenWebRX+ on Ubuntu
# Run this after cloning the repo and installing dependencies

set -e  # Exit on error

echo "Starting OpenWebRX+ setup..."

# Check if we're in the right directory
if [ ! -f "openwebrx.py" ]; then
    echo "Error: openwebrx.py not found. Make sure you're in the project root."
    exit 1
fi

# Build frontend
echo "Building React frontend..."
cd webui
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi
npm run build
cd ..

# Check if pycsdr is installed
echo "Checking for pycsdr..."
if ! python3 -c "import pycsdr" 2>/dev/null; then
    echo "Warning: pycsdr not found. Installing..."
    if [ ! -d "/tmp/pycsdr" ]; then
        git clone https://github.com/jketterl/pycsdr.git /tmp/pycsdr
    fi
    cd /tmp/pycsdr
    sudo python3 setup.py install
    cd -
fi

# Check if OpenWebRX is installed
echo "Checking OpenWebRX installation..."
if ! python3 -c "import owrx" 2>/dev/null; then
    echo "Installing OpenWebRX+..."
    pip3 install --user -e .
fi

# Start the server
echo "Starting OpenWebRX+ server..."
echo "Access it at: http://localhost:8073"
echo "Press Ctrl+C to stop"
echo ""

python3 openwebrx.py

