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
            \App\Models\User::where('id', $user->id)->update(['most_active_day' => $mostActiveDay]);
        }

        return response()->json([
            'xp' => (int) $user->xp,
            'level' => (int) $user->level,
            'title' => (string) ($user->title ?? ''),
            'most_active_day' => $user->most_active_day,
        ]);
    }

    /**
     * Rich stats for charts based on the user's own logs only.
     */
    public function stats()
    {
        $user = Auth::user();

        $logs = WorkoutLog::where('user_id', $user->id)
            ->orderBy('date')
            ->get(['date', 'is_rest_day', 'workout_text', 'xp_gained']);

        // XP over time (cumulative by day)
        $xpSeries = [];
        $cum = 0;
        foreach ($logs as $log) {
            $cum += (int) ($log->xp_gained ?? 0);
            $xpSeries[] = [
                'date' => $log->date,
                'xp' => $cum,
            ];
        }

        // Workouts by weekday (Sun..Sat)
        $weekdayCounts = array_fill(0, 7, 0);
        foreach ($logs as $log) {
            if (!$log->is_rest_day) {
                $weekdayIndex = (int) (new \DateTime($log->date))->format('w'); // 0=Sun
                $weekdayCounts[$weekdayIndex]++;
            }
        }

        // Label distribution (top 10 exact labels)
        $labelCounts = [];
        foreach ($logs as $log) {
            if (!$log->is_rest_day && $log->workout_text) {
                $label = trim($log->workout_text);
                if ($label === '') continue;
                $labelCounts[$label] = ($labelCounts[$label] ?? 0) + 1;
            }
        }
        arsort($labelCounts);
        $labelTop = [];
        foreach (array_slice($labelCounts, 0, 10, true) as $k => $v) {
            $labelTop[] = ['label' => $k, 'count' => $v];
        }

        // Weekly counts (last 8 weeks): workouts vs rest
        $now = new \DateTimeImmutable('today');
        $start = $now->modify('-7 weeks')->modify('last monday');
        $weekBuckets = [];
        for ($i = 0; $i < 8; $i++) {
            $weekStart = $start->modify("+{$i} week");
            $key = $weekStart->format('Y-m-d');
            $weekBuckets[$key] = ['week_start' => $key, 'workouts' => 0, 'rest' => 0];
        }
        foreach ($logs as $log) {
            $d = new \DateTimeImmutable($log->date);
            if ($d < $start) continue;
            // Align to Monday
            $weekStart = $d->modify('last monday');
            $key = $weekStart->format('Y-m-d');
            if (!isset($weekBuckets[$key])) continue;
            if ($log->is_rest_day) $weekBuckets[$key]['rest']++;
            else $weekBuckets[$key]['workouts']++;
        }
        $weekly = array_values($weekBuckets);

        return response()->json([
            'xp_over_time' => $xpSeries,
            'weekday_counts' => $weekdayCounts, // 0..6 => Sun..Sat
            'label_distribution' => $labelTop,
            'weekly_summary' => $weekly,
        ]);
    }
}
