# One-Click Setup for Windows (Docker)

## Prerequisites

1. **Install Docker Desktop for Windows**
   - Download from: https://www.docker.com/products/docker-desktop/
   - Install and start Docker Desktop
   - Make sure it's running (you'll see the Docker icon in system tray)

## One-Click Setup

### Option 1: Using the Batch Script (Easiest)

1. **Double-click `docker-run.bat`**

That's it! The script will:
- Build the Docker image (first time only, takes a few minutes)
- Start the container
- Make the server available at `http://localhost:8073`

### Option 2: Manual Docker Commands

```bash
# Build the image (first time only)
docker build -t openwebrx-dev .

# Run the container
docker run -it --rm -p 8073:8073 --name openwebrx-dev openwebrx-dev
```

## Accessing the Web UI

Open your browser and go to:
```
http://localhost:8073
```

## SDR Device Access

**Important**: USB device passthrough on Windows Docker requires additional setup:

1. **For RTL-SDR**: You may need to use `rtl_tcp` instead of direct USB access
2. **For other SDRs**: Check Docker Desktop settings for USB device passthrough

### Alternative: Use rtl_tcp

If direct USB access doesn't work, you can run `rtl_tcp` on Windows and connect from Docker:

1. **On Windows**, install RTL-SDR drivers and run:
   ```bash
   rtl_tcp -a 0.0.0.0
   ```

2. **In Docker container**, configure OpenWebRX+ to use `rtl_tcp` as the SDR source

## Stopping the Server

Press `Ctrl+C` in the terminal, or:
```bash
docker stop openwebrx-dev
```

## Rebuilding After Code Changes

If you make changes to the code:

```bash
docker build -t openwebrx-dev .
docker run -it --rm -p 8073:8073 --name openwebrx-dev openwebrx-dev
```

## Troubleshooting

- **"Docker is not running"**: Start Docker Desktop
- **Port 8073 already in use**: Stop any other service using that port
- **Build fails**: Make sure you have internet connection and Docker Desktop is running
- **SDR not detected**: Check USB passthrough settings or use rtl_tcp method

## Advantages of Docker

✅ No need to install Python dependencies on Windows  
✅ No need to compile pycsdr on Windows  
✅ Isolated environment  
✅ Works the same on Windows, Mac, and Linux  
✅ Easy to update (just rebuild)  

## Disadvantages

⚠️ Requires Docker Desktop (large download)  
⚠️ USB device access can be tricky on Windows  
⚠️ Slightly more resource usage  

---

**Bottom line**: If you have Docker Desktop installed, this is as close to "one-click" as you can get on Windows!

