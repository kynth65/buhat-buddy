# Use Node.js 20 as base and install PHP on top
FROM node:20-slim

# Install system dependencies for PHP
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

# Add PHP repository and install PHP 8.2
RUN curl -fsSL https://packages.sury.org/php/apt.gpg | gpg --dearmor -o /usr/share/keyrings/php.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/php.gpg] https://packages.sury.org/php/ $(lsb_release -cs) main" > /etc/apt/sources.list.d/php.list \
    && apt-get update \
    && apt-get install -y php8.2-cli php8.2-mbstring php8.2-xml php8.2-gd php8.2-sqlite3 php8.2-pgsql php8.2-mysql php8.2-bcmath php8.2-pcntl php8.2-exif \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions are already installed via packages

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
RUN npm install --verbose --no-audit --no-fund

# Copy application code
COPY . .

# Show versions for debugging
RUN echo "Node: $(node --version), NPM: $(npm --version), PHP: $(php --version)"

# Create basic .env file for production
RUN echo "APP_NAME=Buhat-Buddy\nAPP_ENV=production\nAPP_DEBUG=false\nAPP_KEY=\nDB_CONNECTION=sqlite\nDB_DATABASE=/app/database/database.sqlite\nCACHE_DRIVER=file\nSESSION_DRIVER=file\nQUEUE_CONNECTION=sync" > .env

# Generate application key
RUN php artisan key:generate --force

# Build frontend assets (both standard and SSR)
RUN npm run build
RUN npm run build:ssr

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
