---
name: docker_setup
title: Docker Configuration Generator
description: Generate Docker configurations with best practices for various application types
category: devops
tags: [docker, containerization, devops, deployment, infrastructure]
difficulty: intermediate
author: jezweb
version: 1.0.0
arguments:
  - name: app_type
    description: Type of application (node, python, java, go, static)
    required: true
  - name: app_name
    description: Name of the application
    required: true
  - name: port
    description: Application port
    required: false
    default: 3000
  - name: environment
    description: Target environment (development, production)
    required: false
    default: production
  - name: extras
    description: Additional features (database, redis, nginx)
    required: false
---

# Docker Setup for {{app_name}}

## Application Type: {{app_type}}

### Dockerfile

{{#if (eq app_type "node")}}
```dockerfile
# Dockerfile
# Multi-stage build for Node.js application

# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
{{#if (eq environment "production")}}
# Install dependencies (production only)
RUN npm ci --only=production
{{else}}
# Install all dependencies
RUN npm ci
{{/if}}

# Copy source code
COPY . .

# Build application (if needed)
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE {{port}}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node healthcheck.js || exit 1

# Start application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```
{{/if}}

{{#if (eq app_type "python")}}
```dockerfile
# Dockerfile
# Multi-stage build for Python application

# Build stage
FROM python:3.11-slim AS builder

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Create virtual environment and install dependencies
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim AS runner

# Create non-root user
RUN useradd -m -u 1001 appuser

# Set working directory
WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

# Copy application code
COPY --chown=appuser:appuser . .

# Set environment variables
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Switch to non-root user
USER appuser

# Expose port
EXPOSE {{port}}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:{{port}}/health')" || exit 1

# Run application
CMD ["gunicorn", "--bind", "0.0.0.0:{{port}}", "--workers", "4", "app:app"]
```
{{/if}}

{{#if (eq app_type "java")}}
```dockerfile
# Dockerfile
# Multi-stage build for Java application

# Build stage
FROM maven:3.9-openjdk-17 AS builder

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build application
RUN mvn clean package -DskipTests

# Production stage
FROM openjdk:17-jre-slim

# Create non-root user
RUN useradd -m -u 1001 appuser

# Set working directory
WORKDIR /app

# Copy JAR from builder
COPY --from=builder --chown=appuser:appuser /app/target/*.jar app.jar

# Switch to non-root user
USER appuser

# Expose port
EXPOSE {{port}}

# JVM optimization flags
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=50.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:{{port}}/actuator/health || exit 1

# Run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```
{{/if}}

{{#if (eq app_type "go")}}
```dockerfile
# Dockerfile
# Multi-stage build for Go application

# Build stage
FROM golang:1.21-alpine AS builder

# Install certificates for HTTPS
RUN apk add --no-cache ca-certificates git

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s" \
    -o {{app_name}} \
    ./cmd/main.go

# Production stage
FROM scratch

# Copy certificates
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy binary
COPY --from=builder /app/{{app_name}} /{{app_name}}

# Expose port
EXPOSE {{port}}

# Run binary
ENTRYPOINT ["/{{app_name}}"]
```
{{/if}}

{{#if (eq app_type "static")}}
```dockerfile
# Dockerfile
# Multi-stage build for static site with nginx

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user
RUN adduser -D -H -u 1001 -s /sbin/nologin nginx-user

# Change ownership
RUN chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/run/nginx.pid

# Switch to non-root user
USER nginx-user

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
```
{{/if}}

### docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  {{app_name}}:
    build:
      context: .
      dockerfile: Dockerfile
      {{#if (eq environment "development")}}
      target: builder
      {{/if}}
    container_name: {{app_name}}
    ports:
      - "{{port}}:{{port}}"
    environment:
      - NODE_ENV={{environment}}
      - PORT={{port}}
      {{#if (includes extras "database")}}
      - DATABASE_URL=postgresql://user:password@postgres:5432/{{app_name}}_db
      {{/if}}
      {{#if (includes extras "redis")}}
      - REDIS_URL=redis://redis:6379
      {{/if}}
    {{#if (eq environment "development")}}
    volumes:
      - ./src:/app/src
      - ./public:/app/public
      - /app/node_modules
    {{/if}}
    networks:
      - app-network
    restart: unless-stopped
    {{#if (or (includes extras "database") (includes extras "redis"))}}
    depends_on:
      {{#if (includes extras "database")}}
      - postgres
      {{/if}}
      {{#if (includes extras "redis")}}
      - redis
      {{/if}}
    {{/if}}

{{#if (includes extras "database")}}
  postgres:
    image: postgres:15-alpine
    container_name: {{app_name}}_postgres
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB={{app_name}}_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5
{{/if}}

{{#if (includes extras "redis")}}
  redis:
    image: redis:7-alpine
    container_name: {{app_name}}_redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
{{/if}}

{{#if (includes extras "nginx")}}
  nginx:
    image: nginx:alpine
    container_name: {{app_name}}_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - {{app_name}}
    networks:
      - app-network
    restart: unless-stopped
{{/if}}

volumes:
  {{#if (includes extras "database")}}
  postgres_data:
  {{/if}}
  {{#if (includes extras "redis")}}
  redis_data:
  {{/if}}

networks:
  app-network:
    driver: bridge
```

### .dockerignore

```
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env
.env.*
.DS_Store
*.log
coverage
.nyc_output
.vscode
.idea
dist
build
*.md
.dockerignore
Dockerfile
docker-compose*.yml
```

{{#if (includes extras "nginx")}}
### nginx.conf

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server {{app_name}}:{{port}};
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```
{{/if}}

## Docker Commands

### Build and Run

```bash
# Build image
docker build -t {{app_name}}:latest .

# Run container
docker run -d -p {{port}}:{{port}} --name {{app_name}} {{app_name}}:latest

# Using docker-compose
docker-compose up -d

# Development mode with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Management Commands

```bash
# View logs
docker logs -f {{app_name}}

# Access container shell
docker exec -it {{app_name}} sh

# Stop and remove
docker-compose down

# Remove with volumes
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache
```

## Best Practices Applied

- ✅ Multi-stage builds for smaller images
- ✅ Non-root user for security
- ✅ Health checks for container orchestration
- ✅ Proper signal handling (dumb-init/tini)
- ✅ Layer caching optimization
- ✅ Security scanning considerations
- ✅ Environment-specific configurations
- ✅ Volume mounting for development
- ✅ Network isolation
- ✅ Resource limits (add as needed)

## Production Considerations

```yaml
# Additional production settings
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```