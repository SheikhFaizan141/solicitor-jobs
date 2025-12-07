<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobAlertSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'frequency',
        'employment_types',
        'practice_area_ids',
        'location_id',
        'is_active',
        'last_sent_at',
    ];

    protected $casts = [
        'employment_types' => 'array',
        'practice_area_ids' => 'array',
        'is_active' => 'boolean',
        'last_sent_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }
}
