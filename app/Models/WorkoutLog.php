<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkoutLog extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'workout_text',
        'is_rest_day',
        'xp_gained',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
