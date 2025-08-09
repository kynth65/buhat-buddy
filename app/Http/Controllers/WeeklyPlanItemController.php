<?php

namespace App\Http\Controllers;

use App\Models\WeeklyPlan;
use App\Models\WeeklyPlanItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WeeklyPlanItemController extends Controller
{
  public function index(WeeklyPlan $weeklyPlan)
  {
    $user = Auth::user();
    abort_unless($weeklyPlan->user_id === $user->id, 403);
    return response()->json([
      'plan' => $weeklyPlan,
      'items' => $weeklyPlan->items()->get(),
    ]);
  }

  public function store(Request $request, WeeklyPlan $weeklyPlan)
  {
    $user = Auth::user();
    abort_unless($weeklyPlan->user_id === $user->id, 403);

    $validated = $request->validate([
      'exercise_name' => ['required', 'string', 'max:255'],
      'estimated_reps' => ['nullable', 'integer', 'min:0', 'max:1000'],
      'sets' => ['nullable', 'integer', 'min:0', 'max:1000'],
      'notes' => ['nullable', 'string', 'max:1000'],
    ]);

    $position = ($weeklyPlan->items()->max('position') ?? 0) + 1;
    $item = $weeklyPlan->items()->create(array_merge($validated, ['position' => $position]));

    return response()->json(['item' => $item]);
  }

  public function update(Request $request, WeeklyPlan $weeklyPlan, WeeklyPlanItem $item)
  {
    $user = Auth::user();
    abort_unless($weeklyPlan->user_id === $user->id && $item->weekly_plan_id === $weeklyPlan->id, 403);

    $validated = $request->validate([
      'exercise_name' => ['sometimes', 'string', 'max:255'],
      'estimated_reps' => ['nullable', 'integer', 'min:0', 'max:1000'],
      'sets' => ['nullable', 'integer', 'min:0', 'max:1000'],
      'notes' => ['nullable', 'string', 'max:1000'],
      'position' => ['sometimes', 'integer', 'min:0', 'max:10000'],
    ]);

    $item->update($validated);
    return response()->json(['item' => $item]);
  }

  public function destroy(WeeklyPlan $weeklyPlan, WeeklyPlanItem $item)
  {
    $user = Auth::user();
    abort_unless($weeklyPlan->user_id === $user->id && $item->weekly_plan_id === $weeklyPlan->id, 403);
    $item->delete();
    return response()->json(['status' => 'ok']);
  }
}
