<?php

namespace App\Http\Controllers;

use App\Models\WorkoutTemplate;
use App\Models\WeeklyPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkoutTemplateController extends Controller
{
  public function index(Request $request)
  {
    $category = $request->query('category');
    $equipment = $request->query('equipment');
    $query = WorkoutTemplate::query()->with('items');
    if ($category) $query->where('category', $category);
    if ($equipment) $query->where('equipment_type', $equipment);
    return response()->json(['templates' => $query->orderBy('name')->get()]);
  }

  public function apply(Request $request, WeeklyPlan $weeklyPlan)
  {
    $user = Auth::user();
    abort_unless($weeklyPlan->user_id === $user->id, 403);
    $validated = $request->validate([
      'template_id' => ['required', 'integer', 'exists:workout_templates,id'],
    ]);
    $template = WorkoutTemplate::with('items')->findOrFail($validated['template_id']);

    // Replace existing items with template items
    $weeklyPlan->items()->delete();
    $position = 1;
    foreach ($template->items as $tItem) {
      $weeklyPlan->items()->create([
        'exercise_name' => $tItem->exercise_name,
        'estimated_reps' => $tItem->estimated_reps,
        'sets' => $tItem->sets,
        'position' => $position++,
      ]);
    }

    return response()->json(['status' => 'ok']);
  }
}
