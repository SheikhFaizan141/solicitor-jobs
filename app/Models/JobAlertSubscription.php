<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'sent_count',
        'click_count',
        'failed_count',
    ];

    protected $casts = [
        'employment_types' => 'array',
        'is_active' => 'boolean',
        'last_sent_at' => 'datetime',
        'sent_count' => 'integer',
        'click_count' => 'integer',
        'failed_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function practiceAreas(): BelongsToMany
    {
        return $this->belongsToMany(PracticeArea::class, 'job_alert_practice_areas');
    }

    public function clicks(): HasMany
    {
        return $this->hasMany(JobAlertClick::class);
    }

    public function incrementSentCount(): void
    {
        $this->increment('sent_count');
        $this->update(['last_sent_at' => now()]);
    }

    public function incrementFailedCount(): void
    {
        $this->increment('failed_count');
    }

    public function incrementClickCount(): void
    {
        $this->increment('click_count');
    }

    public function getClickThroughRate(): float
    {
        if ($this->sent_count === 0) {
            return 0;
        }

        return round(($this->click_count / $this->sent_count) * 100, 2);
    }
}
