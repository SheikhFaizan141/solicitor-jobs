<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'region',
        'country',
        'latitude',
        'longitude',
        'is_remote',
        'is_active',
        'popularity',
        'metadata',
    ];

    protected $casts = [
        'is_remote' => 'boolean',
        'is_active' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'metadata' => 'array',
    ];

    public function jobListings()
    {
        return $this->belongsToMany(JobListing::class, 'job_listing_locations');
    }

    public function getDisplayNameAttribute(): string
    {
        if ($this->is_remote) {
            return $this->name;
        }

        return $this->region ? "{$this->name}, {$this->region}" : $this->name;
    }

    public function updatePoularity(): void
    {
        $this->popularity = $this->jobListings()->where('is_active', true)->count();
        $this->save();
    }

    public function scopePopular($query, $limit = 10)
    {
        return $query->where('is_active', true)
            ->orderByDesc('popularity')
            ->limit($limit);
    }
}
