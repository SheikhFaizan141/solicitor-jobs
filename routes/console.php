<?php

use App\Console\Commands\SendJobAlerts;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule job alert commands
Schedule::command(SendJobAlerts::class, ['daily'])->dailyAt('08:00');
Schedule::command(SendJobAlerts::class, ['weekly'])->weeklyOn(1, '08:15'); // Monday