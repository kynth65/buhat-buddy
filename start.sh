#!/bin/bash
set -e

echo "=== Starting Buhat-Buddy Application ==="

# Set default port if not provided
PORT=${PORT:-8000}
echo "Using port: $PORT"

# Database configuration for production
echo "=== Database Configuration ==="
echo "DB_CONNECTION: ${DB_CONNECTION:-pgsql}"
echo "DB_HOST: ${DB_HOST:-127.0.0.1}"
echo "DB_PORT: ${DB_PORT:-5432}"
echo "DB_DATABASE: ${DB_DATABASE:-laravel}"
echo "DB_USERNAME: ${DB_USERNAME:-root}"
echo "Database password: ${DB_PASSWORD:+[SET]}"

# Wait for database to be ready (for Railway)
echo "Waiting for database connection..."
for i in {1..30}; do
    if php -r "
        try {
            \$pdo = new PDO('pgsql:host=${DB_HOST:-127.0.0.1};port=${DB_PORT:-5432};dbname=${DB_DATABASE:-laravel}', '${DB_USERNAME:-root}', '${DB_PASSWORD}');
            echo 'Database connection successful';
            exit(0);
        } catch (Exception \$e) {
            echo 'Database connection failed: ' . \$e->getMessage();
            exit(1);
        }
    " 2>/dev/null; then
        echo "Database is ready!"
        break
    fi
    echo "Attempt $i: Database not ready, waiting 2 seconds..."
    sleep 2
done

# Run migrations
echo "Running database migrations..."
php artisan migrate --force
echo "Migrations completed successfully"

# Create storage directories if they don't exist
echo "Ensuring storage directories exist..."
mkdir -p /app/storage/logs
mkdir -p /app/storage/framework/cache
mkdir -p /app/storage/framework/sessions
mkdir -p /app/storage/framework/views
mkdir -p /app/bootstrap/ssr

# Set permissions
echo "Setting storage permissions..."
chmod -R 775 /app/storage || echo "Warning: Could not set storage permissions"
chmod -R 775 /app/bootstrap/cache || echo "Warning: Could not set cache permissions"
chmod -R 775 /app/bootstrap/ssr || echo "Warning: Could not set SSR permissions"

# Verify builds exist
echo "Verifying build files..."
if [ ! -d "/app/public/build" ]; then
    echo "ERROR: Public build directory not found!"
    exit 1
fi

if [ ! -d "/app/bootstrap/ssr" ]; then
    echo "ERROR: SSR build directory not found!"
    exit 1
fi

echo "Build verification passed"

# Start the server
echo "Starting PHP development server on 0.0.0.0:$PORT..."
echo "Application will be available at: http://0.0.0.0:$PORT"

# Show final environment info
echo "=== Final Environment Check ==="
echo "Current directory: $(pwd)"
echo "Port: $PORT"
echo "PHP version: $(php --version | head -1)"
echo "Directory contents:"
ls -la
echo "Public directory contents:"
ls -la public/
echo "Starting server..."

# Start the server with verbose output
echo "Server starting on port $PORT..."
echo "Health endpoint available at: http://0.0.0.0:$PORT/health"
echo "Railway health endpoint available at: http://0.0.0.0:$PORT/health/railway"
echo "Main endpoint available at: http://0.0.0.0:$PORT/"
echo "Binding to 0.0.0.0:$PORT for external access..."

# Start the server with proper binding for Railway
php -S 0.0.0.0:$PORT -t public -d display_errors=1 -d log_errors=1 -d max_execution_time=0
