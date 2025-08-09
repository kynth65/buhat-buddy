<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\WeeklyPlan;

class WeeklyPlanController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $plans = WeeklyPlan::where('user_id', $user->id)
            ->orderBy('id')
            ->get();
        return response()->json(['plans' => $plans]);
    }

    public function update(Request $request, WeeklyPlan $weeklyPlan)
    {
        $user = Auth::user();
        if ($weeklyPlan->user_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'workout_text' => ['nullable', 'string'],
        ]);

        $weeklyPlan->update($validated);
        return response()->json(['plan' => $weeklyPlan]);
    }

    public function upsert(Request $request)
    {
        $validated = $request->validate([
            'day_of_week' => ['required', 'string'],
            'workout_text' => ['nullable', 'string'],
        ]);
        $user = Auth::user();

        // Only update workout_text if it was provided in the request payload.
        // This prevents accidental overwriting (e.g., when ensuring a plan exists).
        $values = [];
        if (array_key_exists('workout_text', $validated)) {
            $values['workout_text'] = $validated['workout_text'] ?? null;
        }

        $plan = WeeklyPlan::updateOrCreate(
            ['user_id' => $user->id, 'day_of_week' => $validated['day_of_week']],
            $values
        );

        return response()->json(['plan' => $plan]);
    }
}
