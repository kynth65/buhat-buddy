<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WorkoutLogController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\WeeklyPlanController;
use App\Http\Controllers\ProfileStatsController;
use App\Http\Controllers\WeeklyPlanItemController;
use App\Http\Controllers\WorkoutTemplateController;

// Health check endpoint for Railway
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'service' => 'Buhat-Buddy',
        'version' => '1.0.0'
    ]);
});

// Additional health endpoint for Railway (alternative)
Route::get('/health/railway', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'Buhat-Buddy',
        'timestamp' => now()->toISOString()
    ]);
});

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Inertia pages
    Route::get('/weekly', function () {
        return Inertia::render('weekly');
    })->name('weekly');

    Route::get('/weekly/{day}', function (string $day) {
        return Inertia::render('weekly-day', [
            'day' => $day,
        ]);
    })->name('weekly.day');

    Route::get('/profile', function () {
        return Inertia::render('profile');
    })->name('profile');

    // API endpoints (could be moved to api.php if desired)
    Route::post('/check-in', [WorkoutLogController::class, 'checkIn']);
    Route::get('/calendar', [CalendarController::class, 'index']);
    Route::get('/weekly-plan', [WeeklyPlanController::class, 'index']);
    Route::put('/weekly-plan/{weeklyPlan}', [WeeklyPlanController::class, 'update']);
    Route::post('/weekly-plan', [WeeklyPlanController::class, 'upsert']);

    // Weekly plan items (CRUD)
    Route::get('/weekly-plan/{weeklyPlan}/items', [WeeklyPlanItemController::class, 'index']);
    Route::post('/weekly-plan/{weeklyPlan}/items', [WeeklyPlanItemController::class, 'store']);
    Route::put('/weekly-plan/{weeklyPlan}/items/{item}', [WeeklyPlanItemController::class, 'update']);
    Route::delete('/weekly-plan/{weeklyPlan}/items/{item}', [WeeklyPlanItemController::class, 'destroy']);

    // Workout templates
    Route::get('/workout-templates', [WorkoutTemplateController::class, 'index']);
    Route::post('/weekly-plan/{weeklyPlan}/apply-template', [WorkoutTemplateController::class, 'apply']);

    // Profile stats JSON for frontend consumption
    Route::get('/api/profile', [ProfileStatsController::class, 'show']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
