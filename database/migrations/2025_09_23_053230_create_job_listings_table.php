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
        Schema::create('job_listings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->foreignId('law_firm_id')->nullable()->constrained('law_firms')->nullOnDelete();

            $table->foreignId('location_id')->nullable()->constrained('locations')->nullOnDelete();
            // $table->string('location')->nullable();

            $table->enum('workplace_type', ['onsite', 'remote', 'hybrid'])->default('onsite');
            $table->enum('employment_type', ['full_time', 'part_time', 'contract', 'internship'])->default('full_time');
            $table->string('experience_level')->nullable();
            $table->unsignedInteger('salary_min')->nullable();
            $table->unsignedInteger('salary_max')->nullable();
            $table->char('salary_currency', 3)->default('GBP');
            $table->date('closing_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->longText('description')->nullable();
            $table->json('requirements')->nullable();
            $table->json('benefits')->nullable();
            $table->foreignId('posted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('job_listing_practice_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_listing_id')->constrained('job_listings')->cascadeOnDelete();
            $table->foreignId('practice_area_id')->constrained('practice_areas')->cascadeOnDelete();
            $table->unique(['job_listing_id', 'practice_area_id'], 'job_practice_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_listing_practice_areas');
        Schema::dropIfExists('job_listings');
    }
};
