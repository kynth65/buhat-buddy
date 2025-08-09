<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\WorkoutLog;

class ProfileStatsController extends Controller
{
    public function show()
    {
        $user = Auth::user();

        $byWeekday = WorkoutLog::where('user_id', $user->id)
            ->where('is_rest_day', false)
            ->get()
            ->groupBy(function ($log) {
                return (new \DateTime($log->date))->format('l');
            })
            ->map->count();

        $mostActiveDay = null;
        if ($byWeekday->isNotEmpty()) {
            $mostActiveDay = $byWeekday->sortDesc()->keys()->first();
        }

        if ($mostActiveDay && $user->most_active_day !== $mostActiveDay) {
            $user->most_active_day = $mostActiveDay;
            $user->save();
        }

        return response()->json([
            'xp' => (int) $user->xp,
            'level' => (int) $user->level,
            'title' => (string) ($user->title ?? ''),
            'most_active_day' => $user->most_active_day,
        ]);
    }
}
