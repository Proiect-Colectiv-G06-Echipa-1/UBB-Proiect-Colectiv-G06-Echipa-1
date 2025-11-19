# Frontend Dockerfile for React + Vite application
# Multi-platform support: linux/amd64, linux/arm64, windows/amd64
FROM --platform=$BUILDPLATFORM node:20-alpine3.21

# Set working directory
WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN rm -rf node_modules package-lock.json && \
    npm install --legacy-peer-deps && \
    npm cache clean --force

# Copy application source code
COPY . .

# Expose the Vite development server port
EXPOSE 5173

# Start the development server with host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
