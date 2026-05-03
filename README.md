# LexiType — AI‑Powered Typing Trainer

## Description of the system

LexiType is a full‑stack web application that helps users practice, measure, and improve their typing skills. The backend is built with Laravel (PHP 8.3+, Laravel 13) and exposes JSON endpoints for recording typing sessions, retrieving typing texts, leaderboards, and AI coaching. The frontend uses Inertia + React with Vite and Tailwind CSS for interactive, single‑page experiences.

Users complete typing sessions that record metrics (WPM, accuracy, duration) and optional keystroke‑level data (expected character, typed character, time to press). The system aggregates session history and user statistics, visualizes charts and heatmaps, supports admin management of typing texts and users, accepts user feedback, and provides short, targeted AI coaching tips (via an external generative model) with rate limits and robust error handling.

## List of implemented features

- Project scaffolding: Laravel backend with Inertia + React frontend, Vite build, and Tailwind CSS styling.
- Authentication & user profiles: register/login, edit profile, and account management flows.
- Typing session recording: `POST /typing-sessions` stores `wpm_score`, `accuracy_percentage`, `duration_seconds`, `difficulty_played`, and optional `mistakes[]`.
- Keystroke tracking: `keystrokeMistake` model captures `expected_character`, `typed_char`, and `time_to_press_ms` per session.
- User analytics & stats: per‑user history, paginated sessions, last‑30 sessions chart data, averages, heatmap of mistakes, and trouble cluster detection.
- Global leaderboard: paginated endpoints and controllers to compute top users by highest WPM and determine current user position.
- System typing texts: admin CRUD for `SystemTypingText` and public APIs for obtaining random texts, lists by category/difficulty, and available difficulties with fallback logic.
- Feedback system: users can submit feedback; admins can list, view, and delete feedback entries.
- AI coaching endpoint: `POST /ai-analysis` analyzes recent typing data, enforces a per‑user daily limit, caches usage, and integrates with an external AI model (Gemini) to return short, language‑aware tips.
- Admin management: user listing, create/edit, suspend, reset password, and delete functions under `admin/*` routes with appropriate authorization checks.
- Robust backend patterns: input validation, policy/Gate authorization checks, pagination, formatted JSON responses, logging, and error handling.
- Database support: migrations, factories, and seeders for core models (users, typing_sessions, user_feedbacks, system_typing_texts, keystroke_mistakes, user_stats).
- Developer scripts: `composer` and `npm` scripts to set up, run development servers, and build production assets (see `composer.json` and `package.json`).

