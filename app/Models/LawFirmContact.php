<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LawFirmContact extends Model
{
    protected $table = 'law_firm_contacts';

    protected $fillable = [
        'law_firm_id',
        'label',
        'address',
        'email',
        'phone',
    ];

    public function lawFirm()
    {
        return $this->belongsTo(LawFirm::class);
    }
}
