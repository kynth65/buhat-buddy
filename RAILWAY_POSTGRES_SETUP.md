# Railway PostgreSQL Setup Guide

## Overview
This guide explains how to configure PostgreSQL environment variables in Railway for your Buhat-Buddy application.

## Required Environment Variables

In your Railway project, you need to set these environment variables:

### Database Connection
```
DB_CONNECTION=pgsql
DB_HOST=<your-postgres-service-url>
DB_PORT=5432
DB_DATABASE=<your-database-name>
DB_USERNAME=<your-username>
DB_PASSWORD=<your-password>
```

## How to Set Environment Variables in Railway

### Method 1: Railway Dashboard
1. Go to your Railway project dashboard
2. Click on your **Buhat-Buddy service**
3. Go to the **Variables** tab
4. Add each environment variable:
   - `DB_CONNECTION` = `pgsql`
   - `DB_HOST` = Your PostgreSQL service URL (e.g., `containers-us-west-123.railway.app`)
   - `DB_PORT` = `5432`
   - `DB_DATABASE` = Your database name
   - `DB_USERNAME` = Your database username
   - `DB_PASSWORD` = Your database password

### Method 2: Railway CLI
```bash
railway variables set DB_CONNECTION=pgsql
railway variables set DB_HOST=<your-postgres-host>
railway variables set DB_PORT=5432
railway variables set DB_DATABASE=<your-database-name>
railway variables set DB_USERNAME=<your-username>
railway variables set DB_PASSWORD=<your-password>
```

## Getting PostgreSQL Connection Details

### From Railway Dashboard
1. Go to your **PostgreSQL service** in Railway
2. Click on **Connect** tab
3. Copy the connection details:
   - **Host**: The hostname (e.g., `containers-us-west-123.railway.app`)
   - **Port**: Usually `5432`
   - **Database**: Your database name
   - **Username**: Your database username
   - **Password**: Your database password

### Example Environment Variables
```
DB_CONNECTION=pgsql
DB_HOST=containers-us-west-123.railway.app
DB_PORT=5432
DB_DATABASE=railway
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password_here
```

## Important Notes

1. **Port**: PostgreSQL uses port `5432`, not `3306` (MySQL)
2. **Host**: Use the hostname from Railway, not `127.0.0.1`
3. **Database**: The actual database name, not necessarily `laravel`
4. **Username**: Usually `postgres` for Railway PostgreSQL
5. **Password**: The password you set when creating the PostgreSQL service

## Verification

After setting the environment variables:
1. Redeploy your application
2. Check the logs to see the database connection status
3. The startup script will wait for the database to be ready before starting

## Troubleshooting

### Common Issues:
- **Connection refused**: Check if `DB_HOST` and `DB_PORT` are correct
- **Authentication failed**: Verify `DB_USERNAME` and `DB_PASSWORD`
- **Database does not exist**: Ensure `DB_DATABASE` matches your actual database name

### Check Logs:
The startup script will show detailed database connection information and any errors that occur.
