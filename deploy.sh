#!/bin/bash
set -e

echo "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "Installing Node dependencies..."
npm ci

echo "Building assets..."
php artisan ziggy:generate
npm run build

echo "Caching config..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Resetting Database (Fresh & Seed)..."

php artisan migrate:fresh --seed --force

echo "Deployment Done Success!"