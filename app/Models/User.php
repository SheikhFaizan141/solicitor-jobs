<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    public const ROLE_ADMIN = 'admin';

    public const ROLE_EDITOR = 'editor';

    public const ROLE_USER = 'user';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'email_notifications',
        'job_alerts',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['role'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'email_notifications' => 'boolean',
            'job_alerts' => 'boolean',
        ];
    }

    /**
     * Get the user's primary role name for frontend compatibility.
     */
    public function getRoleAttribute(): string
    {
        return $this->roles->first()?->name ?? self::ROLE_USER;
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(self::ROLE_ADMIN);
    }

    public function isEditor(): bool
    {
        return $this->hasRole(self::ROLE_EDITOR);
    }

    public function isStaff(): bool
    {
        return $this->hasAnyRole([self::ROLE_ADMIN, self::ROLE_EDITOR]);
    }

    public function jobAlertSubscriptions(): HasMany
    {
        return $this->hasMany(JobAlertSubscription::class);
    }

    public function jobInteractions(): HasMany
    {
        return $this->hasMany(UserJobInteraction::class);
    }

    public function savedJobInteractions(): HasMany
    {
        return $this->jobInteractions()
            ->where('type', UserJobInteraction::TYPE_SAVED)
            ->where('status', UserJobInteraction::STATUS_ACTIVE);
    }

    public function savedJobs(): BelongsToMany
    {
        return $this->belongsToMany(JobListing::class, 'user_job_interactions')
            ->withPivot(['type', 'status', 'notes', 'metadata'])
            ->wherePivot('type', UserJobInteraction::TYPE_SAVED)
            ->wherePivot('status', UserJobInteraction::STATUS_ACTIVE)
            ->withTimestamps();
    }
}
