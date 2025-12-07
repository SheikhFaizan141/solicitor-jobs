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
            // Add location_id foreign key
            $table->foreignId('location_id')->nullable()->after('practice_area_ids')->constrained('locations')->nullOnDelete();
            
            // Drop old location string column
            $table->dropColumn('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_alert_subscriptions', function (Blueprint $table) {
            // Drop location_id foreign key
            $table->dropForeign(['location_id']);
            $table->dropColumn('location_id');
            
            // Re-add location string column
            $table->string('location')->nullable();
        });
    }
};
