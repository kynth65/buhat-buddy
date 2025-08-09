<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkoutTemplate extends Model
{
  protected $fillable = [
    'name',
    'category', // e.g., push, chest, upper
    'equipment_type', // bodyweight | equipment
  ];

  public function items(): HasMany
  {
    return $this->hasMany(WorkoutTemplateItem::class)->orderBy('position');
  }
}
