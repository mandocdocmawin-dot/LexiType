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
        Schema::table('users', function (Blueprint $table) {
            $table->string('status')->default('Active')->after('role');
            $table->decimal('accuracy', 5, 2)->default(0)->after('status');
            $table->string('account_type')->default('free')->after('accuracy');
            $table->boolean('mfa_enabled')->default(false)->after('account_type');
            $table->timestamp('last_login_at')->nullable()->after('mfa_enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['status', 'accuracy', 'account_type', 'mfa_enabled', 'last_login_at']);
        });
    }
};
