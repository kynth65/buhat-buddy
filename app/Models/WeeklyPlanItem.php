<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeeklyPlanItem extends Model
{
  protected $fillable = [
    'weekly_plan_id',
    'exercise_name',
    'estimated_reps',
    'sets',
    'notes',
    'position',
  ];

  public function plan(): BelongsTo
  {
    return $this->belongsTo(WeeklyPlan::class, 'weekly_plan_id');
  }
}
