<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeeklyPlan extends Model
{
    protected $fillable = [
        'user_id',
        'day_of_week',
        'workout_text',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Items/exercises belonging to this weekly plan entry (one day).
     */
    public function items()
    {
        return $this->hasMany(WeeklyPlanItem::class)->orderBy('position');
    }
}
