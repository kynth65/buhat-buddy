# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Backend (Laravel/PHP)
```bash
# Start development server with frontend, queue, and hot reload
composer dev

# Start with SSR support
composer dev:ssr

# Run PHP tests
composer test
# Or directly
php artisan test

# Laravel Pint (PHP code formatting)
vendor/bin/pint

# Database operations
php artisan migrate
php artisan migrate:fresh --seed
php artisan db:seed --class=WorkoutTemplateSeeder

# Clear caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

### Frontend (React/TypeScript)
```bash
# Start Vite development server
npm run dev

# Build for production
npm run build

# Build with SSR
npm run build:ssr

# Linting and formatting
npm run lint
npm run format
npm run format:check

# Type checking
npm run types
```

## Architecture Overview

This is a **Laravel + Inertia.js + React** application for workout tracking and planning called "Buhat-Buddy".

### Backend Structure
- **Framework**: Laravel 12 with PHP 8.2+
- **Frontend Integration**: Inertia.js for SPA-like experience
- **Database**: SQLite (development), PostgreSQL (production on Railway)
- **Authentication**: Laravel Breeze with Inertia
- **Testing**: Pest PHP

### Frontend Structure
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with Radix UI components
- **Build Tool**: Vite with Laravel plugin
- **State**: React hooks and Inertia page props
- **SSR**: Enabled for production builds

### Key Models and Domain
- **User**: Authentication and profile (XP, level, title, most_active_day)
- **WorkoutLog**: Daily workout check-ins
- **WeeklyPlan**: User's weekly workout schedule
- **WeeklyPlanItem**: Individual workout items in a weekly plan
- **WorkoutTemplate**: Pre-built workout templates users can apply

### Application Flow
1. **Authentication**: Laravel Breeze handles login/registration
2. **Dashboard**: Main hub showing user stats and recent activity
3. **Weekly Planning**: Users create and manage weekly workout plans
4. **Daily Check-ins**: Users log completed workouts for XP/progress
5. **Templates**: Pre-built workouts users can apply to their weekly plans

## Important Development Notes

### Database Configuration
- Development uses SQLite (`database/database.sqlite`)
- Production uses PostgreSQL on Railway
- Migrations include workout-specific tables
- Seeders populate workout templates

### Frontend Components
- UI components are in `resources/js/components/ui/` (Radix-based)
- Custom components in `resources/js/components/`
- Layouts organized by type: `app/`, `auth/`, `settings/`
- Pages mirror Laravel route structure

### Inertia.js Integration
- Page components receive props from Laravel controllers
- API routes return JSON, web routes return Inertia pages
- SSR enabled for production builds
- Ziggy provides Laravel routes to JavaScript

### Deployment
- **Railway**: Primary deployment platform
- **Docker**: Containerized with multi-stage build
- **Assets**: Built during Docker build process
- **Database**: Automatic migrations on deployment
- **Environment**: PostgreSQL connection configured via environment variables

### Testing Approach
- **Backend**: Pest PHP for feature and unit tests
- **Frontend**: TypeScript type checking via `npm run types`
- Tests cover authentication, dashboard, and settings functionality

### Code Style
- **PHP**: Laravel Pint (PSR-12 based)
- **JavaScript/TypeScript**: ESLint + Prettier
- **CSS**: Tailwind CSS with custom design system
- Automatic import organization and formatting