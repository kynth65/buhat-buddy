# Railway Deployment Guide for Buhat-Buddy

## Prerequisites

- Railway account
- Git repository with your code
- Railway CLI (optional but recommended)

## Quick Deploy

1. **Connect your repository to Railway:**
    - Go to [Railway](https://railway.app)
    - Click "New Project"
    - Select "Deploy from GitHub repo"
    - Choose your repository

2. **Configure environment variables in Railway dashboard:**

    ```
    APP_NAME=Buhat-Buddy
    APP_ENV=production
    APP_KEY=[will be generated automatically]
    APP_DEBUG=false
    APP_URL=[your-railway-app-url]

    LOG_CHANNEL=stack
    LOG_LEVEL=error

    DB_CONNECTION=sqlite
    DB_DATABASE=/app/database/database.sqlite

    CACHE_DRIVER=file
    SESSION_DRIVER=file
    QUEUE_CONNECTION=sync

    INERTIA_SSR_ENABLED=true
    INERTIA_SSR_URL=http://127.0.0.1:13714
    ```

3. **Deploy:**
    - Railway will automatically detect the Dockerfile
    - Build and deploy your application
    - The app will be available at the provided URL

## Manual Deployment with Railway CLI

1. **Install Railway CLI:**

    ```bash
    npm install -g @railway/cli
    ```

2. **Login to Railway:**

    ```bash
    railway login
    ```

3. **Link your project:**

    ```bash
    railway link
    ```

4. **Deploy:**
    ```bash
    railway up
    ```

## Environment Variables

### Required Variables

- `APP_NAME`: Your application name
- `APP_ENV`: Set to "production"
- `APP_DEBUG`: Set to "false"
- `APP_URL`: Your Railway app URL
- `DB_CONNECTION`: Set to "sqlite"
- `DB_DATABASE`: Set to "/app/database/database.sqlite"

### Optional Variables

- `LOG_LEVEL`: Set to "error" for production
- `CACHE_DRIVER`: Set to "file"
- `SESSION_DRIVER`: Set to "file"
- `QUEUE_CONNECTION`: Set to "sync"
- `INERTIA_SSR_ENABLED`: Set to "true"
- `INERTIA_SSR_URL`: Set to "http://127.0.0.1:13714"

## What the Dockerfile Does

1. **Base Image**: Uses PHP 8.2 with CLI
2. **Dependencies**: Installs system packages, PHP extensions, and Node.js
3. **Composer**: Installs PHP dependencies
4. **NPM**: Installs Node.js dependencies
5. **Build**: Builds both standard and SSR frontend assets
6. **Setup**: Creates storage directories and sets permissions
7. **Database**: Creates SQLite database file
8. **Deploy**: Runs migrations and starts the server

## Post-Deployment

1. **Check logs** in Railway dashboard for any errors
2. **Verify the app** is accessible at your URL
3. **Test functionality** like login, dashboard, weekly plan, etc.

## Troubleshooting

### Common Issues

1. **Build fails**: Check if all dependencies are properly specified
2. **App won't start**: Check environment variables and logs
3. **Database errors**: Ensure SQLite is properly configured
4. **Frontend not loading**: Verify build assets were created

### Debug Commands

```bash
# Check Railway logs
railway logs

# Check app status
railway status

# Restart deployment
railway up
```

## Notes

- The app uses SQLite for simplicity in Railway
- Frontend assets are built during Docker build
- SSR bundle is included for Inertia.js
- All storage directories are created automatically
- Migrations run automatically on startup
