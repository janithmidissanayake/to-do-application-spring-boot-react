# Multi-stage build for React frontend

# Stage 1: Build the application
FROM node:20-alpine AS app-builder

WORKDIR /app

# Copy package files first for dependency caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
# Use localhost so the browser can connect to the backend
ENV VITE_API_URL=http://localhost:8080
RUN npm run build

# Stage 2: Production - Serve with Nginx
FROM nginx:alpine AS production

# Copy built files from build stage
COPY --from=app-builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# Stage 3: Development (optional)
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV VITE_API_URL=http://localhost:8080

CMD ["npm", "run", "dev", "--", "--host"]

# Stage 4: E2E Test Runner (Debian-based for Playwright compatibility)
FROM node:20-slim AS e2e-test-runner

WORKDIR /app

# Copy package files first for dependency caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and tests
COPY . .

ENV VITE_API_URL=http://localhost:8080
