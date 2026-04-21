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
        Schema::create('typing_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('wpm_score');
            $table->integer('accuracy_percentage');
            $table->integer('duration_seconds');
            $table->string('difficulty_played');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('typing_sessions');
    }
};
