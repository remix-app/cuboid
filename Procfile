# Procfile para Railway.app
# Este archivo le dice a Railway cómo ejecutar la aplicación

# Release: Ejecutar migraciones antes del deploy
release: cd backend && php artisan migrate --force && php artisan config:cache

# Web: Comando para iniciar el servidor
web: cd backend && php artisan serve --host=0.0.0.0 --port=$PORT
