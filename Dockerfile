# Dockerfile for OpenWebRX+ with new React UI
# Usage: docker build -t openwebrx-dev . && docker run -p 8073:8073 --device=/dev/bus/usb openwebrx-dev

FROM ubuntu:22.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    cmake \
    pkg-config \
    libfftw3-dev \
    libliquid-dev \
    libsamplerate0-dev \
    git \
    curl \
    sox \
    rtl-sdr \
    librtlsdr-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18+ (required for Vite and TypeScript 5)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install libcsdr (use latest master/main)
RUN git clone --depth 1 https://github.com/jketterl/csdr.git /tmp/csdr && \
    cd /tmp/csdr && \
    mkdir -p build && \
    cd build && \
    cmake .. -DCMAKE_BUILD_TYPE=Release && \
    make -j$(nproc) && \
    make install && \
    ldconfig && \
    cd / && \
    rm -rf /tmp/csdr

# Install pycsdr (use latest master/main - should match libcsdr API)
RUN git clone --depth 1 https://github.com/jketterl/pycsdr.git /tmp/pycsdr && \
    cd /tmp/pycsdr && \
    python3 setup.py install && \
    rm -rf /tmp/pycsdr

# Copy project files
WORKDIR /app
COPY . .

# Install OpenWebRX+
RUN pip3 install -e .

# Build React frontend
WORKDIR /app/webui
RUN npm install && npm run build

# Set working directory back to project root
WORKDIR /app

# Expose port
EXPOSE 8073

# Start server
CMD ["python3", "openwebrx.py"]

