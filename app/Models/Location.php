<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Support\Str;

class Location extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'region',
        'country',
        'is_remote',
        'is_active',
        'job_count',
    ];

    protected $casts = [
        'is_remote' => 'boolean',
        'is_active' => 'boolean',
        'job_count' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Location $location) {
            if (blank($location->slug)) {
                $location->slug = Str::slug($location->name);
            }
        });
    }

    public function jobListings(): HasMany
    {
        return $this->hasMany(JobListing::class);
    }

    /**
     * Display name for dropdowns/filters
     */
    public function getDisplayNameAttribute(): string
    {
        if ($this->is_remote) {
            return $this->name; // e.g. "Remote (UK)"
        }

        $parts = [$this->name];

        if ($this->region) {
            $parts[] = $this->region;
        }

        // Only show country if not UK
        if ($this->country && $this->country !== 'UK') {
            $parts[] = $this->country;
        }

        return implode(', ', $parts);
    }

    /**
     * Recalculate Job Count
     */
    public function updateJobCount(): void
    {
        $this->job_count = $this->jobListings()->where('is_active', true)->count();
        $this->save();
    }

    // public function updatePoularity(): void
    // {
    //     $this->popularity = $this->jobListings()->where('is_active', true)->count();
    //     $this->save();
    // }

    /**
     * Scope: popular locations by job count
     */
    public function scopePopular($query, $limit = 10)
    {
        return $query->where('is_active', true)
            ->where('job_count', '>', 0)
            ->orderByDesc('job_count')
            ->orderBy('name')
            ->limit($limit);
    }

    /**
     * Scope: active locations
     */
    public function scopeActive($query) {
        return $query->where('is_active', true);
    }
}
