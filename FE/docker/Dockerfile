# Frontend Dockerfile for React + Vite application
# Multi-platform support: linux/amd64, linux/arm64, windows/amd64
FROM --platform=$BUILDPLATFORM node:20-alpine3.21

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose the Vite development server port
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
