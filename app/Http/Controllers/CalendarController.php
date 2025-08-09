<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\WorkoutLog;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $year = (int) ($request->query('year') ?? now()->year);
        $month = (int) ($request->query('month') ?? now()->month);

        $logs = WorkoutLog::where('user_id', $user->id)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get(['date', 'is_rest_day', 'workout_text']);

        return response()->json(['logs' => $logs]);
    }
}
