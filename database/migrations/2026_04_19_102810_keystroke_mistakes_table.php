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
        Schema::create('keystroke_mistakes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('typing_session_id')->constrained()->onDelete('cascade');
            $table->text('expected_character');
            $table->text('typed_char');
            $table->text('time_to_press_ms');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keystroke_mistakes');
    }
};
