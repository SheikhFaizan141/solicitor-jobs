<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LawFirm extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'email',
        'location',
        'phone',
        // 'logo_path',
    ];
}
