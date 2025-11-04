<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'law_firm_id',
        'rating',
        'comment',
        'status',
    ];

    protected $casts = [
        'rating' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lawFirm()
    {
        return $this->belongsTo(LawFirm::class);
    }

    // Scopes for different status types
    public function scopeActive($query)
    {
        return $query->where('status', 'active')->whereNull('deleted_at');
    }

    public function scopeSpam($query)
    {
        return $query->where('status', 'spam')->whereNull('deleted_at');
    }

    public function scopeTrashed($query)
    {
        return $query->where('status', 'trashed')->orWhereNotNull('deleted_at');
    }

    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    public function scopeByLawFirm($query, $lawFirmId)
    {
        return $query->where('law_firm_id', $lawFirmId);
    }

    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    // Status management methods
    public function markAsSpam()
    {
        $this->update(['status' => 'spam']);
    }

    public function moveToTrash()
    {
        $this->update(['status' => 'trashed']);
        $this->delete(); // Soft delete
    }

    public function markAsActive()
    {
        $this->update(['status' => 'active']);
        if ($this->trashed()) {
            $this->restore();
        }
    }

    public function isActive()
    {
        return $this->status === 'active' && ! $this->trashed();
    }

    public function isSpam()
    {
        return $this->status === 'spam';
    }

    public function isTrashed()
    {
        return $this->status === 'trashed' || $this->trashed();
    }
}
