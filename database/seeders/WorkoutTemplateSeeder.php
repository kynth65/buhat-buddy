<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WorkoutTemplate;

class WorkoutTemplateSeeder extends Seeder
{
  public function run(): void
  {
    $templates = [
      [
        'name' => 'Push (Bodyweight)',
        'category' => 'push',
        'equipment_type' => 'bodyweight',
        'items' => [
          ['exercise_name' => 'Push-ups', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Pike Push-ups', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Diamond Push-ups', 'estimated_reps' => 8, 'sets' => 3],
        ],
      ],
      [
        'name' => 'Chest (Gym)',
        'category' => 'chest',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Barbell Bench Press', 'estimated_reps' => 8, 'sets' => 4],
          ['exercise_name' => 'Incline Dumbbell Press', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Cable Fly', 'estimated_reps' => 12, 'sets' => 3],
        ],
      ],
      [
        'name' => 'Upper (Mixed)',
        'category' => 'upper',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Pull-ups', 'estimated_reps' => 6, 'sets' => 4],
          ['exercise_name' => 'Overhead Press', 'estimated_reps' => 8, 'sets' => 3],
          ['exercise_name' => 'Bent-over Row', 'estimated_reps' => 10, 'sets' => 3],
        ],
      ],
    ];

    foreach ($templates as $tpl) {
      $t = WorkoutTemplate::create([
        'name' => $tpl['name'],
        'category' => $tpl['category'],
        'equipment_type' => $tpl['equipment_type'],
      ]);
      $position = 1;
      foreach ($tpl['items'] as $item) {
        $t->items()->create([
          'exercise_name' => $item['exercise_name'],
          'estimated_reps' => $item['estimated_reps'],
          'sets' => $item['sets'],
          'position' => $position++,
        ]);
      }
    }
  }
}
