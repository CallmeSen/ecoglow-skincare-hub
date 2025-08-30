# EcoGlow Skincare Hub - Production Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    curl \
    postgresql-client \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY drizzle.config.ts ./

# Install dependencies
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production --legacy-peer-deps

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S ecoflow -u 1001

# Change ownership of the built application
RUN chown -R ecoflow:nodejs /app

# Switch to the ecoflow user
USER ecoflow

# Start the server
CMD ["node", "dist/main-production.js"]