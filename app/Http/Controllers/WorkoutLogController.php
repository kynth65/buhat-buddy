<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\WorkoutLog;
use Carbon\Carbon;

class WorkoutLogController extends Controller
{
    public function checkIn(Request $request)
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'workout_text' => ['nullable', 'string'],
            'is_rest_day' => ['required', 'boolean'],
        ]);

        $user = Auth::user();
        $date = Carbon::parse($validated['date'])->toDateString();

        $isRestDay = (bool) $validated['is_rest_day'];
        $workoutText = $validated['workout_text'] ?? null;

        $xp = 0;
        if (!$isRestDay) {
            $xp = 10;
            if ($workoutText && str_contains(strtolower($workoutText), 'leg day')) {
                $xp += 5;
            }
        }

        $existing = WorkoutLog::where('user_id', $user->id)
            ->where('date', $date)
            ->first();

        $log = WorkoutLog::updateOrCreate(
            [
                'user_id' => $user->id,
                'date' => $date,
            ],
            [
                'workout_text' => $workoutText,
                'is_rest_day' => $isRestDay,
                'xp_gained' => $xp,
            ]
        );

        // Update user's XP, level, and title using delta if updating existing log
        $delta = $existing ? ($xp - (int) $existing->xp_gained) : $xp;
        $totalXp = (int) $user->xp + $delta;
        $user->xp = $totalXp;
        $user->level = intdiv($totalXp, 100) + 1;
        $user->title = $this->titleForLevel($user->level);
        $user->save();

        return response()->json(['log' => $log, 'user' => $user]);
    }

    private function titleForLevel(int $level): string
    {
        if ($level <= 5) return 'Novice';
        if ($level <= 10) return 'Expert';
        return 'God Mode';
    }
}
