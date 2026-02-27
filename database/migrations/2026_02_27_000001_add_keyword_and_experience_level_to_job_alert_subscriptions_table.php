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
        Schema::table('job_alert_subscriptions', function (Blueprint $table) {
            $table->string('keyword')->nullable()->after('location_id');
            $table->string('experience_level', 50)->nullable()->after('keyword');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_alert_subscriptions', function (Blueprint $table) {
            $table->dropColumn(['keyword', 'experience_level']);
        });
    }
};
