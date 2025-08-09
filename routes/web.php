<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WorkoutLogController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\WeeklyPlanController;
use App\Http\Controllers\ProfileStatsController;

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

    Route::get('/profile', function () {
        return Inertia::render('profile');
    })->name('profile');

    // API endpoints (could be moved to api.php if desired)
    Route::post('/check-in', [WorkoutLogController::class, 'checkIn']);
    Route::get('/calendar', [CalendarController::class, 'index']);
    Route::get('/weekly-plan', [WeeklyPlanController::class, 'index']);
    Route::put('/weekly-plan/{weeklyPlan}', [WeeklyPlanController::class, 'update']);
    Route::post('/weekly-plan', [WeeklyPlanController::class, 'upsert']);

    // Profile stats JSON for frontend consumption
    Route::get('/api/profile', [ProfileStatsController::class, 'show']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
