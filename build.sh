#!/bin/bash
# Cross-platform Docker build script
# Works on: Linux, macOS, Windows (with WSL/Git Bash)

echo "🐳 Building multi-platform Docker images..."

# Enable BuildKit for better cross-platform support
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build for multiple platforms
docker buildx create --use --name multiarch 2>/dev/null || true

echo "📦 Building for amd64 and arm64 platforms..."

# Build backend
echo "🔨 Building backend..."
docker buildx build --platform linux/amd64,linux/arm64 -t pc-backend ./BE/docker/ --load 2>/dev/null || \
docker compose build backend

# Build frontend  
echo "🔨 Building frontend..."
docker buildx build --platform linux/amd64,linux/arm64 -t pc-frontend ./FE/docker/ --load 2>/dev/null || \
docker compose build frontend

echo "✅ Build completed! Run 'docker compose up' to start services."