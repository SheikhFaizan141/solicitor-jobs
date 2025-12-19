<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_alert_practice_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_alert_subscription_id')->constrained('job_alert_subscriptions')->cascadeOnDelete();
            $table->foreignId('practice_area_id')->constrained('practice_areas')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['job_alert_subscription_id', 'practice_area_id'], 'job_alert_practice_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_alert_practice_areas');
    }
};
