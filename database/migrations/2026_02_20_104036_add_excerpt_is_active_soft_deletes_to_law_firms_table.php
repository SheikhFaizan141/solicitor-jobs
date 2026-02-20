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
        Schema::table('law_firms', function (Blueprint $table) {
            $table->text('excerpt')->nullable()->after('description');
            $table->boolean('is_active')->default(true)->after('excerpt');
            $table->softDeletes()->after('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('law_firms', function (Blueprint $table) {
            $table->dropColumn(['excerpt', 'is_active', 'deleted_at']);
        });
    }
};
