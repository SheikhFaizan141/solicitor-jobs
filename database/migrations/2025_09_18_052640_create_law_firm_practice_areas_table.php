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
        Schema::create('law_firm_practice_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('law_firm_id')->constrained()->cascadeOnDelete();
            $table->foreignId('practice_area_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['law_firm_id', 'practice_area_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('law_firm_practice_areas');
    }
};
