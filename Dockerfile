# Use PHP 8.2 CLI as base and install Node.js on top
FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    libsqlite3-dev \
    ca-certificates \
    gnupg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_pgsql pdo_sqlite mbstring exif pcntl bcmath gd

# Install Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && node --version \
    && npm --version

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy application code first
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Install Node dependencies (including dev dependencies for build)
RUN echo "=== Starting npm install ===" && \
    echo "Current directory: $(pwd)" && \
    echo "Package.json exists: $(test -f package.json && echo 'YES' || echo 'NO')" && \
    echo "Package-lock.json exists: $(test -f package-lock.json && echo 'YES' || echo 'NO')" && \
    echo "Directory contents:" && ls -la && \
    echo "NPM config:" && npm config list && \
    echo "NPM cache location:" && npm config get cache && \
    npm cache clean --force && \
    (npm ci --verbose --no-audit --no-fund || npm install --verbose --no-audit --no-fund --legacy-peer-deps) || \
    (echo "NPM install failed, trying alternative approach..." && \
     npm install --force --verbose --no-audit --no-fund --legacy-peer-deps)

# Show versions for debugging
RUN echo "=== Environment Info ===" && \
    echo "Node: $(node --version)" && \
    echo "NPM: $(npm --version)" && \
    echo "PHP: $(php --version)" && \
    echo "Composer: $(composer --version)" && \
    echo "Current directory: $(pwd)" && \
    echo "Directory contents:" && ls -la

# Create basic .env file for production (will be overridden by Railway env vars)
RUN echo "APP_NAME=Buhat-Buddy\nAPP_ENV=production\nAPP_DEBUG=false\nAPP_KEY=\nDB_CONNECTION=pgsql\nCACHE_DRIVER=file\nSESSION_DRIVER=file\nQUEUE_CONNECTION=sync" > .env

# Generate application key
RUN php artisan key:generate --force

# Build frontend assets (both standard and SSR)
RUN npm run build || (echo "Standard build failed" && exit 1)
RUN npm run build:ssr || (echo "SSR build failed" && exit 1)

# Clean up npm cache (skip pruning for now to avoid build issues)
RUN echo "Cleaning npm cache..." && \
    npm cache clean --force || echo "Cache clean failed, continuing..."

# Verify builds were successful
RUN echo "=== Verifying builds ===" && \
    echo "Public build directory:" && ls -la public/build/ && \
    echo "SSR build directory:" && ls -la bootstrap/ssr/ && \
    echo "Build verification completed"

# Create storage directories and set permissions
RUN echo "Creating storage directories..." && \
    mkdir -p /app/storage/logs && \
    mkdir -p /app/storage/framework/cache && \
    mkdir -p /app/storage/framework/sessions && \
    mkdir -p /app/storage/framework/views && \
    mkdir -p /app/bootstrap/ssr && \
    echo "Setting permissions..." && \
    chmod -R 775 /app/storage || echo "Storage permissions failed" && \
    chmod -R 775 /app/bootstrap/cache || echo "Cache permissions failed" && \
    chmod -R 775 /app/bootstrap/ssr || echo "SSR permissions failed" && \
    echo "Storage setup completed"

# Note: Using PostgreSQL in production, no local database file needed
RUN echo "Production database: PostgreSQL (configured via environment variables)"

# Make startup script executable
RUN chmod +x /app/start.sh

# Expose port
EXPOSE $PORT

# Run migrations and start server
CMD ["/app/start.sh"]
