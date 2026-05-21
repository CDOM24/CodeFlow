FROM richarvey/nginx-php-fpm:3.1.6

WORKDIR /var/www/html

COPY . .

ENV WEBROOT=/var/www/html/public
ENV PHP_ERRORS_STDERR=1
ENV RUN_SCRIPTS=1
ENV REAL_IP_HEADER=1

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
ENV COMPOSER_ALLOW_SUPERUSER=1

# ✅ instalar node
RUN apt-get update && apt-get install -y nodejs npm

# ✅ instalar dependencias PHP
RUN composer install --no-dev --optimize-autoloader

# ✅ build frontend
RUN npm install && npm run build

RUN php artisan config:clear
RUN php artisan route:clear
RUN php artisan view:clear

RUN chmod -R 775 storage bootstrap/cache

COPY render-start.sh /var/www/html/render-start.sh
RUN chmod +x /var/www/html/render-start.sh

CMD ["/var/www/html/render-start.sh"]
