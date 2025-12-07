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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // "New York", "London", "Remote"
            $table->string('slug')->unique();
            $table->string('region')->nullable(); // "England", "Scotland"
            $table->string('country')->default('UK'); // e.g. UK, USA
            $table->boolean('is_remote')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('job_count')->default(0);  // Auto-calculated based
            $table->timestamps();

            $table->index(['is_active', 'job_count']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
