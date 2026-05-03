# LexiType — Project Documentation

LexiType is a comprehensive web-based typing practice platform designed to help users improve their typing speed, accuracy, and technique through structured exercises, performance tracking, and intelligent recommendations. The application combines modern web technologies with a sophisticated backend architecture to deliver a seamless typing learning experience.

The platform caters to users of varying skill levels by offering both system-provided typing exercises and personalized custom exercises. Users can track their progress through detailed performance metrics, receive AI-driven feedback based on their keystroke patterns, and compare their achievements on an interactive leaderboard. The administrative interface provides comprehensive tools for managing users, overseeing system exercises, and reviewing user feedback.


---

## Table of contents

- Overview
- Quick start
- Features
	- Authentication & Authorization
	- Typing Exercises (System + Custom)
	- Typing Sessions & Keystroke Tracking
	- AI Recommendations
	- User Profiles, Stats & Feedback
	- Admin / Policies
- Data models & schema (summary)
- Controllers & routes (important endpoints)
- Seed data & factories
- Tests
- Running & deployment notes
- Key files and where to find them

---

## Overview

LexiType is a Laravel + Inertia typing-practice application that supports:

- System-provided typing texts grouped by category & difficulty.
- Admin-created custom exercises.
- Typing sessions with detailed keystroke mistake tracking.
- Per-user statistics and profiles.
- AI-generated recommendations (stored for users).
- Authentication and user management (standard Laravel auth routes are available).

This document summarizes how those features are implemented in the codebase so you can paste it into other documentation or extend the system.

---

## Quick start

Prerequisites:

- PHP 8.x
- Composer
- Node.js + npm
- A database supported by Laravel (e.g., MySQL, SQLite for local testing)

Common steps to run locally:

1. Install PHP dependencies: `composer install`
2. Install JS dependencies and build assets: `npm install` then `npm run dev`
3. Copy environment file and generate app key:

```
cp .env.example .env
php artisan key:generate
```

4. Configure your DB settings in `.env` and run migrations + seeders:

```
php artisan migrate --seed
```

5. Start local server:

```
php artisan serve
```

6. Run tests:

```
php artisan test
```
```
---

## Features

The following sections describe the key features and how they are implemented.

### Authentication & Authorization

- Summary: Standard Laravel auth (routes under [routes/auth.php](routes/auth.php)). Some endpoints require `auth`/`sanctum` middleware.
- Implementation details:
	- Model: `app/Models/User.php` — uses `HasUuids`, relationships to profile, stats, sessions, etc.
	- Routes: `routes/auth.php` provides registration, login, password reset, email verification and logout endpoints.
	- Policies: `app/Policies/UserPolicy.php` exists for future user-related rules (currently minimal).

See: [routes/auth.php](routes/auth.php) and [app/Models/User.php](app/Models/User.php)

### Typing Exercises (System + Custom)

- Summary: Two main exercise sources: system-managed texts and user-created custom exercises.

- System typing texts
	- Model: `app/Models/SystemTypingText.php`
	- Migration: `database/migrations/2026_04_19_100039_system_typing_texts_table.php`
	- Factory: `database/factories/SystemTypingTextFactory.php` (creates realistic sample content)
	- Seeder: `database/seeders/SystemTypingTextJsonSeeder.php` reads `database/seeders/data/system_typing_texts.json` for deterministic seed data.
	- Controller & routes: `app/Http/Controllers/SystemTypingTextController.php` exposes:
		- `GET /typing-texts/random` — query params: `category`, `difficulty_level` (accepts 1/2/3 or 'easy'/'medium'/'hard'). Returns a random matching active text and fallback behavior when exact difficulty not available.
		- `GET /typing-texts/list` — returns ordered list for given category+difficulty.
		- `GET /typing-texts/difficulties` — returns available difficulties for a category.

	- DB fields (from migration):
		- `id`, `user_id` (UUID), `category` (text), `content` (text), `difficulty_level` (string), `is_active` (boolean), timestamps.

	- Example request (get random):

```
GET /typing-texts/random?category=paragraphs&difficulty_level=2
```

See: [app/Models/SystemTypingText.php](app/Models/SystemTypingText.php) and [app/Http/Controllers/SystemTypingTextController.php](app/Http/Controllers/SystemTypingTextController.php)

- Custom exercises
	- Model: `app/Models/CustomExercise.php`
	- Migration: `database/migrations/2026_04_19_095806_custom_exercises_table.php`
	- Factory: `database/factories/CustomExerciseFactory.php`
	- Stores `custom_text` and `is_completed` and belongs to a `User`.

See: [app/Models/CustomExercise.php](app/Models/CustomExercise.php)

### Typing Sessions & Keystroke Tracking

- Summary: When a user completes a typing session, the frontend posts session data and optional detailed keystroke mistakes.

- Implementation details:
	- Model: `app/Models/TypingSession.php`
	- Migration: `database/migrations/2026_04_19_101917_typing_sessions.php`
	- Keystroke mistakes model: `app/Models/keystrokeMistake.php`
	- Mistakes migration: `database/migrations/2026_04_19_102810_keystroke_mistakes_table.php`
	- Controller & route: `app/Http/Controllers/TypingSessionController.php`
		- `POST /typing-sessions` — accepts JSON body:

```
{
	"wpm_score": 55,
	"accuracy_percentage": 92,
	"duration_seconds": 60,
	"difficulty_played": "medium",
	"mistakes": [
		{ "expected_character": "e", "typed_char": "r", "time_to_press_ms": 150 },
		...
	]
}
```

		- Requires authenticated user (returns 401 if unauthenticated).
		- Controller validates fields, creates a `TypingSession`, and optionally creates `keystrokeMistake` records attached to the session.

	- DB fields (summary):
		- `typing_sessions`: `id`, `user_id` (UUID), `wpm_score` (int), `accuracy_percentage` (int), `duration_seconds` (int), `difficulty_played` (string), timestamps.
		- `keystroke_mistakes`: `id`, `typing_session_id` (FK), `expected_character` (text), `typed_char` (text), `time_to_press_ms` (text/string), timestamps.

See: [app/Http/Controllers/TypingSessionController.php](app/Http/Controllers/TypingSessionController.php)

### AI Recommendations

- Summary: AI-generated recommendations are persisted in the `a_i_recommendations` table; the project stores recommendation messages and focused letters for practice.

- Implementation details:
	- Model: `app/Models/AIRecommendation.php`
	- Migration: `database/migrations/2026_04_19_100708_a_i_recommendations_table.php`
	- Factory: `database/factories/AIRecommendationFactory.php`
	- The model stores `feedback_message` and `focus_letters`. Generation logic is left to controller/service code or can be implemented as a queued job analyzing recent `TypingSession` and `keystroke_mistakes`.

See: [app/Models/AIRecommendation.php](app/Models/AIRecommendation.php)

### User Profiles, Stats & Feedback

- User profile:
	- Model: `app/Models/UserProfile.php`
	- Migration: `database/migrations/2026_04_19_095329_user_profiles_table.php`
	- Simple `bio` field and relation to `User`.

- User stats:
	- Model: `app/Models/UserStat.php`
	- Migration: `database/migrations/2026_04_19_101751_user_stats_table.php`
	- Tracks `average_wpm`, `highest_wpm`, `total_tests_taken`.

- User feedback:
	- Model: `app/Models/UserFeedback.php`
	- Migration: `database/migrations/2026_04_19_095617_user_feedbacks_table.php`
	- Stores user messages for product feedback.

See: [app/Models/UserProfile.php](app/Models/UserProfile.php), [app/Models/UserStat.php](app/Models/UserStat.php), [app/Models/UserFeedback.php](app/Models/UserFeedback.php)

### Admin / Policies

- `app/Policies/SystemTypingTextPolicy.php` controls creation/updating/deletion of system texts; only users with `role === 'admin'` are allowed to manage system texts (policy checks `user->role`).

See: [app/Policies/SystemTypingTextPolicy.php](app/Policies/SystemTypingTextPolicy.php)

---

## Data models & schema (summary)

Below are the main tables and a quick summary of columns (see each migration for exact schema):

- `users` — standard Laravel user table (UUIDs used for some relations via `HasUuids` on `User` model).
- `user_profiles` — `user_id`, `bio`, timestamps.
- `user_stats` — `user_id`, `average_wpm`, `highest_wpm`, `total_tests_taken`, timestamps.
- `user_feedbacks` — `user_id`, `message`, timestamps.
- `system_typing_texts` — `user_id`, `category`, `content`, `difficulty_level`, `is_active`, timestamps.
- `custom_exercises` — `user_id`, `custom_text`, `is_completed`, timestamps.
- `typing_sessions` — `user_id`, `wpm_score`, `accuracy_percentage`, `duration_seconds`, `difficulty_played`, timestamps.
- `keystroke_mistakes` — `typing_session_id`, `expected_character`, `typed_char`, `time_to_press_ms`, timestamps.
- `a_i_recommendations` — `user_id`, `feedback_message`, `focus_letters`, timestamps.

---

## Controllers & routes (important endpoints)

- `POST /typing-sessions` — `TypingSessionController@store` — save a typing session and associated keystroke mistakes (auth required).
- `GET /typing-texts/random` — `SystemTypingTextController@getRandomText` — accepts `category` + `difficulty_level`.
- `GET /typing-texts/list` — `SystemTypingTextController@getTextsList` — list texts for a category/difficulty.
- `GET /typing-texts/difficulties` — `SystemTypingTextController@getAvailableDifficulties`.

Auth and profile endpoints are registered under `routes/auth.php` and `ProfileController` (Inertia pages) for user profile edits.

See: [routes/web.php](routes/web.php) and related controllers in [app/Http/Controllers](app/Http/Controllers)

---

## Seed data & factories

- Factories exist for main models (`database/factories/*`). The `SystemTypingTextFactory` generates realistic sample texts by category and difficulty.
- `database/seeders/SystemTypingTextJsonSeeder.php` loads `database/seeders/data/system_typing_texts.json` for deterministic seed data.
- Run the full seed via `php artisan db:seed` (or `php artisan migrate --seed`).

---

## Tests

- The `tests` directory contains feature tests for authentication and profile flows and unit tests. Use `php artisan test` to run the test suite.

---

## Running & deployment notes

- Local development uses Vite and Inertia. Use `npm run dev` (or `npm run build` for production) to compile frontend assets.
- Serve the app with `php artisan serve` or use your preferred web server configuration.
- Use `php artisan queue:work` if you implement queued jobs (e.g., recommendation generation, long-running analysis).

---

## Key files (quick index)

- Models: [app/Models](app/Models)
	- `app/Models/SystemTypingText.php`
	- `app/Models/CustomExercise.php`
	- `app/Models/TypingSession.php`
	- `app/Models/keystrokeMistake.php`
	- `app/Models/AIRecommendation.php`
	- `app/Models/UserProfile.php`
	- `app/Models/UserStat.php`
	- `app/Models/UserFeedback.php`

- Migrations: `database/migrations/` (see the filenames starting with the dates for each table). Examples:
	- `2026_04_19_100039_system_typing_texts_table.php`
	- `2026_04_19_095806_custom_exercises_table.php`
	- `2026_04_19_101917_typing_sessions.php`
	- `2026_04_19_102810_keystroke_mistakes_table.php`

- Controllers: [app/Http/Controllers](app/Http/Controllers)
	- `SystemTypingTextController.php` — endpoints for getting texts
	- `TypingSessionController.php` — store session + mistakes
	- `ProfileController.php` — user profile management (Inertia)

- Seeders & data: `database/seeders/SystemTypingTextJsonSeeder.php` and `database/seeders/data/system_typing_texts.json`.

---


