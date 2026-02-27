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
        Schema::create('job_alert_delivery_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_alert_subscription_id')->constrained('job_alert_subscriptions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('job_listing_id')->constrained('job_listings')->cascadeOnDelete();
            $table->timestamp('delivered_at');
            $table->unsignedInteger('rank_position');
            $table->decimal('score', 8, 2)->default(0);
            $table->json('reason_codes')->nullable();
            $table->boolean('is_personalized')->default(true);
            $table->timestamp('clicked_at')->nullable();
            $table->timestamp('applied_at')->nullable();
            $table->timestamps();

            $table->index(['job_alert_subscription_id', 'delivered_at'], 'jadi_sub_delivered_idx');
            $table->index(['user_id', 'job_listing_id'], 'jadi_user_job_idx');
            $table->index(['rank_position', 'delivered_at'], 'jadi_rank_delivered_idx');
            $table->index(['is_personalized', 'delivered_at'], 'jadi_personalized_delivered_idx');
            $table->index(['clicked_at'], 'jadi_clicked_idx');
            $table->index(['applied_at'], 'jadi_applied_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_alert_delivery_items');
    }
};
