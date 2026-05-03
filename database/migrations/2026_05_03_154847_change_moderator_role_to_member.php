<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Convert all moderator users to Member
        DB::table('users')
            ->whereRaw("LOWER(role) = 'moderator'")
            ->update(['role' => 'Member']);
    }

    public function down(): void
    {
        // No reliable way to reverse this
    }
};
