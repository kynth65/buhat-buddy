# Use PHP CLI for Railway deployment
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
    nodejs \
    npm \
    libpq-dev \
    libsqlite3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions (including SQLite for local development)
RUN docker-php-ext-install pdo_mysql pdo_pgsql pdo_sqlite mbstring exif pcntl bcmath gd

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

# Install Node dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create basic .env file for production
RUN echo "APP_NAME=Buhat-Buddy\nAPP_ENV=production\nAPP_DEBUG=false\nAPP_KEY=\nDB_CONNECTION=sqlite\nDB_DATABASE=/app/database/database.sqlite\nCACHE_DRIVER=file\nSESSION_DRIVER=file\nQUEUE_CONNECTION=sync" > .env

# Generate application key
RUN php artisan key:generate --force

# Build frontend assets (both standard and SSR)
RUN npm run build && npm run build:ssr

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
