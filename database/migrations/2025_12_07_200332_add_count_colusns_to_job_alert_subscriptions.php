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
            $table->unsignedInteger('sent_count')->default(0)->after('last_sent_at');
            $table->unsignedInteger('click_count')->default(0)->after('sent_count');
            $table->unsignedInteger('failed_count')->default(0)->after('click_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_alert_subscriptions', function (Blueprint $table) {
            $table->dropColumn(['sent_count', 'click_count', 'failed_count']);
        });
    }
};
