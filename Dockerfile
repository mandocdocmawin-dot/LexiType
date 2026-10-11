# Stage 1: i-build ang frontend (Vite + Tailwind)
FROM node:22-alpine AS assets
WORKDIR /app
COPY package*.json .npmrc* ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: PHP + Nginx
FROM serversideup/php:8.4-fpm-nginx
WORKDIR /var/www/html

COPY --chown=www-data:www-data composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY --chown=www-data:www-data . .
COPY --from=assets --chown=www-data:www-data /app/public/build ./public/build

RUN composer dump-autoload --optimize \
    && mkdir -p database \
    && touch database/database.sqlite

# Auto-run ng migrations, storage:link, at optimize tuwing mag-start
ENV AUTORUN_ENABLED=true