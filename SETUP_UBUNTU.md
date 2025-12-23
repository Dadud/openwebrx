# Setting Up OpenWebRX+ on Ubuntu (via SSH)

## Prerequisites

- Ubuntu 20.04 or later
- SSH access to the laptop
- SDR device plugged into the laptop
- Internet connection

## Step 1: SSH into the Laptop

```bash
ssh username@laptop-ip-address
```

## Step 2: Install System Dependencies

```bash
# Update package list
sudo apt update

# Install build tools and dependencies
sudo apt install -y \
    python3-pip \
    python3-dev \
    build-essential \
    cmake \
    libfftw3-dev \
    git \
    nodejs \
    npm \
    sox \
    rtl-sdr \
    librtlsdr-dev

# Install Node.js 18+ if needed (Ubuntu repos may have older version)
# Option 1: Use NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Option 2: Or use nvm
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# source ~/.bashrc
# nvm install 18
```

## Step 3: Clone Your Repository

```bash
# Navigate to where you want to install
cd ~
git clone https://github.com/Dadud/openwebrx.git
cd openwebrx
git checkout dev  # or master, depending on your branch
```

## Step 4: Install pycsdr

```bash
# Clone and install pycsdr
git clone https://github.com/jketterl/pycsdr.git /tmp/pycsdr
cd /tmp/pycsdr
sudo python3 setup.py install
cd ~/openwebrx
```

## Step 5: Install Python Dependencies

```bash
# Install OpenWebRX+ in development mode
pip3 install --user -e .

# Or install system-wide (requires sudo)
# sudo pip3 install -e .
```

## Step 6: Build the React Frontend

```bash
cd webui
npm install
npm run build
cd ..
```

## Step 7: Configure OpenWebRX+ (First Time)

```bash
# Create config directory if needed
mkdir -p ~/.openwebrx

# Edit config file (optional - web UI has settings page)
nano ~/.openwebrx/config_webrx.py
```

Or just start the server and configure via web UI at `http://laptop-ip:8073/settings`

## Step 8: Start the Server

```bash
# Run in foreground (for testing)
python3 openwebrx.py

# Or run in background with nohup
nohup python3 openwebrx.py > openwebrx.log 2>&1 &

# Or use screen/tmux for persistent session
screen -S openwebrx
python3 openwebrx.py
# Press Ctrl+A then D to detach
# Reattach with: screen -r openwebrx
```

## Step 9: Access the Web UI

### Option A: SSH Port Forwarding (Recommended for Testing)

On your local machine:
```bash
ssh -L 8073:localhost:8073 username@laptop-ip-address
```

Then open `http://localhost:8073` in your browser.

### Option B: Direct Network Access

1. Make sure the laptop's firewall allows port 8073:
   ```bash
   sudo ufw allow 8073/tcp
   ```

2. Find the laptop's IP address:
   ```bash
   ip addr show
   # or
   hostname -I
   ```

3. Open `http://laptop-ip-address:8073` in your browser

## Step 10: Configure Your SDR Device

1. Open `http://laptop-ip:8073/settings` (or `http://localhost:8073/settings` if using port forwarding)

2. Go to "SDR Devices" → "New SDR Device"

3. Select your SDR type (RTL-SDR, HackRF, etc.)

4. Configure the device settings

5. Create a profile with your desired frequency range

## Running as a Service (Optional)

To run OpenWebRX+ automatically on boot:

```bash
# Create systemd service file
sudo nano /etc/systemd/system/openwebrx.service
```

Add this content:
```ini
[Unit]
Description=OpenWebRX+ SDR Receiver
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/your-username/openwebrx
ExecStart=/usr/bin/python3 /home/your-username/openwebrx/openwebrx.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable openwebrx

# Start service
sudo systemctl start openwebrx

# Check status
sudo systemctl status openwebrx

# View logs
sudo journalctl -u openwebrx -f
```

## Troubleshooting

### SDR Not Detected
```bash
# Check if SDR is detected
rtl_test

# Make sure user is in the right groups
sudo usermod -a -G dialout $USER
# Log out and back in for changes to take effect
```

### Port Already in Use
```bash
# Check what's using port 8073
sudo lsof -i :8073

# Kill the process or change port in config
```

### Frontend Not Loading
```bash
# Rebuild the frontend
cd ~/openwebrx/webui
npm run build
```

### Permission Errors
```bash
# Make sure you have write permissions
chmod -R u+w ~/openwebrx
```

## Quick Start Script

Save this as `quick-start.sh`:

```bash
#!/bin/bash
cd ~/openwebrx
cd webui && npm run build && cd ..
python3 openwebrx.py
```

Make it executable:
```bash
chmod +x quick-start.sh
./quick-start.sh
```

## Updating from Your Repo

```bash
cd ~/openwebrx
git pull
cd webui
npm install  # If package.json changed
npm run build
cd ..
# Restart the server
```

That's it! You should now be able to access OpenWebRX+ from any device on your network (or via SSH port forwarding).

