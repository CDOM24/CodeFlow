# Etapa 1: compilar Vite con Node
FROM node:20-alpine AS node_build

WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY resources ./resources
COPY vite.config.js ./
RUN npm run build


# Etapa 2: Laravel + Nginx/PHP
FROM richarvey/nginx-php-fpm:3.1.6

WORKDIR /var/www/html

COPY docker/nginx/laravel.conf /etc/nginx/sites-available/default.conf
COPY . .

ENV WEBROOT=/var/www/html/public
ENV PHP_ERRORS_STDERR=1
ENV RUN_SCRIPTS=1
ENV REAL_IP_HEADER=1

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
ENV COMPOSER_ALLOW_SUPERUSER=1

RUN composer install --no-dev --optimize-autoloader

# Copiar build generado por Vite
COPY --from=node_build /app/public/build /var/www/html/public/build

RUN php artisan config:clear
RUN php artisan route:clear
RUN php artisan view:clear

RUN chmod -R 775 storage bootstrap/cache

COPY render-start.sh /var/www/html/render-start.sh
RUN chmod +x /var/www/html/render-start.sh

CMD ["/var/www/html/render-start.sh"]
