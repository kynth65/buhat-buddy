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

# Copy composer files
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy package.json files
COPY package.json package-lock.json ./

# Install Node dependencies (including dev dependencies for build)
RUN npm install --verbose --no-audit --no-fund --legacy-peer-deps

# Copy application code
COPY . .

# Show versions for debugging
RUN echo "=== Environment Info ===" && \
    echo "Node: $(node --version)" && \
    echo "NPM: $(npm --version)" && \
    echo "PHP: $(php --version)" && \
    echo "Composer: $(composer --version)" && \
    echo "Current directory: $(pwd)" && \
    echo "Directory contents:" && ls -la

# Create basic .env file for production
RUN echo "APP_NAME=Buhat-Buddy\nAPP_ENV=production\nAPP_DEBUG=false\nAPP_KEY=\nDB_CONNECTION=sqlite\nDB_DATABASE=/app/database/database.sqlite\nCACHE_DRIVER=file\nSESSION_DRIVER=file\nQUEUE_CONNECTION=sync" > .env

# Generate application key
RUN php artisan key:generate --force

# Build frontend assets (both standard and SSR)
RUN npm run build || (echo "Standard build failed" && exit 1)
RUN npm run build:ssr || (echo "SSR build failed" && exit 1)

# Clean up npm cache and remove dev dependencies to reduce image size
RUN npm cache clean --force && \
    npm prune --production

# Verify builds were successful
RUN ls -la public/build/ && ls -la bootstrap/ssr/

# Create storage directories and set permissions
RUN mkdir -p /app/storage/logs \
    && mkdir -p /app/storage/framework/cache \
    && mkdir -p /app/storage/framework/sessions \
    && mkdir -p /app/storage/framework/views \
    && mkdir -p /app/bootstrap/ssr \
    && chmod -R 775 /app/storage \
    && chmod -R 775 /app/bootstrap/cache \
    && chmod -R 775 /app/bootstrap/ssr

# Create SQLite database file if it doesn't exist
RUN touch /app/database/database.sqlite

# Expose port
EXPOSE $PORT

# Run migrations and start server
CMD php artisan migrate --force && php -S 0.0.0.0:$PORT -t public
