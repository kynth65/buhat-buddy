<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkoutTemplateItem extends Model
{
  protected $fillable = [
    'workout_template_id',
    'exercise_name',
    'estimated_reps',
    'sets',
    'position',
  ];

  public function template(): BelongsTo
  {
    return $this->belongsTo(WorkoutTemplate::class, 'workout_template_id');
  }
}
