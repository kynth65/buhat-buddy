<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WorkoutTemplate;

class WorkoutTemplateSeeder extends Seeder
{
  public function run(): void
  {
    $templates = [
      // UPPER BODY ROUTINES
      [
        'name' => 'Upper Body (Bodyweight)',
        'category' => 'upper',
        'equipment_type' => 'bodyweight',
        'items' => [
          ['exercise_name' => 'Push-ups', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Pike Push-ups', 'estimated_reps' => 8, 'sets' => 3],
          ['exercise_name' => 'Tricep Dips', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Superman', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Plank Up-Downs', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Arm Circles', 'estimated_reps' => 20, 'sets' => 2],
        ],
      ],
      [
        'name' => 'Upper Body (Gym)',
        'category' => 'upper',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Barbell Rows', 'estimated_reps' => 8, 'sets' => 4],
          ['exercise_name' => 'Overhead Press', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Lat Pulldowns', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Dumbbell Bench Press', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Cable Face Pulls', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Dumbbell Shrugs', 'estimated_reps' => 12, 'sets' => 3],
        ],
      ],

      // LOWER BODY ROUTINES
      [
        'name' => 'Lower Body (Bodyweight)',
        'category' => 'lower',
        'equipment_type' => 'bodyweight',
        'items' => [
          ['exercise_name' => 'Bodyweight Squats', 'estimated_reps' => 20, 'sets' => 4],
          ['exercise_name' => 'Lunges (each leg)', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Single-Leg Glute Bridges', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Wall Sit', 'estimated_reps' => 45, 'sets' => 3], // seconds
          ['exercise_name' => 'Calf Raises', 'estimated_reps' => 20, 'sets' => 3],
          ['exercise_name' => 'Jump Squats', 'estimated_reps' => 10, 'sets' => 3],
        ],
      ],
      [
        'name' => 'Lower Body (Gym)',
        'category' => 'lower',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Barbell Squats', 'estimated_reps' => 8, 'sets' => 4],
          ['exercise_name' => 'Romanian Deadlifts', 'estimated_reps' => 10, 'sets' => 4],
          ['exercise_name' => 'Bulgarian Split Squats', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Hip Thrusts', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Leg Press', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Standing Calf Raises', 'estimated_reps' => 15, 'sets' => 3],
        ],
      ],

      // PUSH ROUTINES
      [
        'name' => 'Push (Bodyweight)',
        'category' => 'push',
        'equipment_type' => 'bodyweight',
        'items' => [
          ['exercise_name' => 'Push-ups', 'estimated_reps' => 15, 'sets' => 4],
          ['exercise_name' => 'Pike Push-ups', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Diamond Push-ups', 'estimated_reps' => 8, 'sets' => 3],
          ['exercise_name' => 'Tricep Dips', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Decline Push-ups', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Handstand Hold/Wall Walk', 'estimated_reps' => 30, 'sets' => 3], // seconds
        ],
      ],
      [
        'name' => 'Push (Gym)',
        'category' => 'push',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Barbell Bench Press', 'estimated_reps' => 8, 'sets' => 4],
          ['exercise_name' => 'Overhead Press', 'estimated_reps' => 10, 'sets' => 4],
          ['exercise_name' => 'Incline Dumbbell Press', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Dips', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Lateral Raises', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Close-Grip Bench Press', 'estimated_reps' => 10, 'sets' => 3],
        ],
      ],

      // PULL ROUTINES
      [
        'name' => 'Pull (Bodyweight)',
        'category' => 'pull',
        'equipment_type' => 'bodyweight',
        'items' => [
          ['exercise_name' => 'Pull-ups/Chin-ups', 'estimated_reps' => 6, 'sets' => 4],
          ['exercise_name' => 'Inverted Rows', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Superman', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Reverse Fly (lying)', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Face Pull (towel)', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Dead Hang', 'estimated_reps' => 30, 'sets' => 3], // seconds
        ],
      ],
      [
        'name' => 'Pull (Gym)',
        'category' => 'pull',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Deadlifts', 'estimated_reps' => 6, 'sets' => 4],
          ['exercise_name' => 'Pull-ups/Lat Pulldowns', 'estimated_reps' => 8, 'sets' => 4],
          ['exercise_name' => 'Barbell Rows', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Cable Face Pulls', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Hammer Curls', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Shrugs', 'estimated_reps' => 12, 'sets' => 3],
        ],
      ],

      // LEG SPECIFIC ROUTINES
      [
        'name' => 'Legs (Bodyweight)',
        'category' => 'legs',
        'equipment_type' => 'bodyweight',
        'items' => [
          ['exercise_name' => 'Squats', 'estimated_reps' => 25, 'sets' => 4],
          ['exercise_name' => 'Jump Squats', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Reverse Lunges', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Single-Leg Deadlifts', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Lateral Lunges', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Glute Bridges', 'estimated_reps' => 20, 'sets' => 3],
        ],
      ],
      [
        'name' => 'Legs (Gym)',
        'category' => 'legs',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Back Squats', 'estimated_reps' => 8, 'sets' => 4],
          ['exercise_name' => 'Romanian Deadlifts', 'estimated_reps' => 10, 'sets' => 4],
          ['exercise_name' => 'Leg Press', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Walking Lunges', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Leg Curls', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Calf Raises', 'estimated_reps' => 15, 'sets' => 4],
        ],
      ],

      // CHEST ROUTINES
      [
        'name' => 'Chest (Bodyweight)',
        'category' => 'chest',
        'equipment_type' => 'bodyweight',
        'items' => [
          ['exercise_name' => 'Standard Push-ups', 'estimated_reps' => 15, 'sets' => 4],
          ['exercise_name' => 'Wide Push-ups', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Decline Push-ups', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Diamond Push-ups', 'estimated_reps' => 8, 'sets' => 3],
          ['exercise_name' => 'Archer Push-ups', 'estimated_reps' => 6, 'sets' => 3],
          ['exercise_name' => 'Chest Dips', 'estimated_reps' => 10, 'sets' => 3],
        ],
      ],
      [
        'name' => 'Chest (Gym)',
        'category' => 'chest',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Barbell Bench Press', 'estimated_reps' => 8, 'sets' => 4],
          ['exercise_name' => 'Incline Dumbbell Press', 'estimated_reps' => 10, 'sets' => 4],
          ['exercise_name' => 'Decline Barbell Press', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Cable Flyes', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Dips', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Pec Deck Machine', 'estimated_reps' => 15, 'sets' => 3],
        ],
      ],

      // ARM ROUTINES
      [
        'name' => 'Arms (Bodyweight)',
        'category' => 'arms',
        'equipment_type' => 'bodyweight',
        'items' => [
          ['exercise_name' => 'Diamond Push-ups', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Tricep Dips', 'estimated_reps' => 12, 'sets' => 4],
          ['exercise_name' => 'Chin-ups', 'estimated_reps' => 6, 'sets' => 3],
          ['exercise_name' => 'Pike Push-ups', 'estimated_reps' => 8, 'sets' => 3],
          ['exercise_name' => 'Plank to Push-up', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Reverse Plank', 'estimated_reps' => 30, 'sets' => 3], // seconds
        ],
      ],
      [
        'name' => 'Arms (Gym)',
        'category' => 'arms',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Barbell Curls', 'estimated_reps' => 10, 'sets' => 4],
          ['exercise_name' => 'Close-Grip Bench Press', 'estimated_reps' => 10, 'sets' => 4],
          ['exercise_name' => 'Hammer Curls', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Overhead Tricep Extension', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Cable Curls', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Cable Tricep Pushdowns', 'estimated_reps' => 15, 'sets' => 3],
        ],
      ],

      // BICEP FOCUSED
      [
        'name' => 'Biceps (Gym)',
        'category' => 'biceps',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Barbell Curls', 'estimated_reps' => 10, 'sets' => 4],
          ['exercise_name' => 'Hammer Curls', 'estimated_reps' => 12, 'sets' => 4],
          ['exercise_name' => 'Preacher Curls', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Cable Hammer Curls', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Concentration Curls', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => '21s (Barbell Curls)', 'estimated_reps' => 21, 'sets' => 2],
        ],
      ],

      // TRICEP FOCUSED
      [
        'name' => 'Triceps (Gym)',
        'category' => 'triceps',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Close-Grip Bench Press', 'estimated_reps' => 8, 'sets' => 4],
          ['exercise_name' => 'Overhead Tricep Extension', 'estimated_reps' => 12, 'sets' => 4],
          ['exercise_name' => 'Cable Tricep Pushdowns', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Dips', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Skull Crushers', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Diamond Push-ups', 'estimated_reps' => 12, 'sets' => 3],
        ],
      ],

      // ABS/CORE ROUTINES
      [
        'name' => 'Abs & Core (Bodyweight)',
        'category' => 'abs',
        'equipment_type' => 'bodyweight',
        'items' => [
          ['exercise_name' => 'Plank', 'estimated_reps' => 60, 'sets' => 3], // seconds
          ['exercise_name' => 'Bicycle Crunches', 'estimated_reps' => 20, 'sets' => 3],
          ['exercise_name' => 'Russian Twists', 'estimated_reps' => 30, 'sets' => 3],
          ['exercise_name' => 'Mountain Climbers', 'estimated_reps' => 20, 'sets' => 3],
          ['exercise_name' => 'Leg Raises', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Dead Bug', 'estimated_reps' => 12, 'sets' => 3],
        ],
      ],
      [
        'name' => 'Abs & Core (Gym)',
        'category' => 'abs',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Cable Crunches', 'estimated_reps' => 15, 'sets' => 4],
          ['exercise_name' => 'Hanging Leg Raises', 'estimated_reps' => 10, 'sets' => 4],
          ['exercise_name' => 'Ab Wheel Rollouts', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Russian Twists (weighted)', 'estimated_reps' => 20, 'sets' => 3],
          ['exercise_name' => 'Plank (weighted)', 'estimated_reps' => 45, 'sets' => 3], // seconds
          ['exercise_name' => 'Cable Side Bends', 'estimated_reps' => 15, 'sets' => 3],
        ],
      ],

      // BACK SPECIFIC
      [
        'name' => 'Back (Gym)',
        'category' => 'back',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Deadlifts', 'estimated_reps' => 6, 'sets' => 4],
          ['exercise_name' => 'Pull-ups/Lat Pulldowns', 'estimated_reps' => 8, 'sets' => 4],
          ['exercise_name' => 'Barbell Rows', 'estimated_reps' => 10, 'sets' => 4],
          ['exercise_name' => 'T-Bar Rows', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Cable Rows', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Reverse Flyes', 'estimated_reps' => 15, 'sets' => 3],
        ],
      ],

      // SHOULDERS
      [
        'name' => 'Shoulders (Gym)',
        'category' => 'shoulders',
        'equipment_type' => 'equipment',
        'items' => [
          ['exercise_name' => 'Overhead Press', 'estimated_reps' => 8, 'sets' => 4],
          ['exercise_name' => 'Lateral Raises', 'estimated_reps' => 15, 'sets' => 4],
          ['exercise_name' => 'Front Raises', 'estimated_reps' => 12, 'sets' => 3],
          ['exercise_name' => 'Rear Delt Flyes', 'estimated_reps' => 15, 'sets' => 3],
          ['exercise_name' => 'Arnold Press', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Face Pulls', 'estimated_reps' => 20, 'sets' => 3],
        ],
      ],

      // CARDIO/HIIT
      [
        'name' => 'HIIT Cardio (Bodyweight)',
        'category' => 'cardio',
        'equipment_type' => 'bodyweight',
        'items' => [
          ['exercise_name' => 'Burpees', 'estimated_reps' => 10, 'sets' => 4],
          ['exercise_name' => 'Mountain Climbers', 'estimated_reps' => 30, 'sets' => 4],
          ['exercise_name' => 'Jump Squats', 'estimated_reps' => 15, 'sets' => 4],
          ['exercise_name' => 'High Knees', 'estimated_reps' => 30, 'sets' => 4], // seconds
          ['exercise_name' => 'Jumping Jacks', 'estimated_reps' => 25, 'sets' => 4],
          ['exercise_name' => 'Plank Jacks', 'estimated_reps' => 20, 'sets' => 3],
        ],
      ],

      // FUNCTIONAL/MOBILITY
      [
        'name' => 'Functional Movement',
        'category' => 'functional',
        'equipment_type' => 'bodyweight',
        'items' => [
          ['exercise_name' => 'Turkish Get-ups', 'estimated_reps' => 5, 'sets' => 3],
          ['exercise_name' => 'Bear Crawl', 'estimated_reps' => 30, 'sets' => 3], // seconds
          ['exercise_name' => 'Farmer\'s Walk', 'estimated_reps' => 60, 'sets' => 3], // seconds
          ['exercise_name' => 'Single-Leg RDL', 'estimated_reps' => 10, 'sets' => 3],
          ['exercise_name' => 'Crab Walk', 'estimated_reps' => 20, 'sets' => 3],
          ['exercise_name' => 'Bird Dog', 'estimated_reps' => 12, 'sets' => 3],
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
