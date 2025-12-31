# DATAPOLIS PRO - Guía de Despliegue en Producción

**Versión:** 1.1  
**Fecha:** Diciembre 2025

---

## Tabla de Contenidos

1. [Requisitos del Servidor](#1-requisitos-del-servidor)
2. [Arquitectura Recomendada](#2-arquitectura-recomendada)
3. [Instalación con Docker](#3-instalación-con-docker)
4. [Instalación Manual](#4-instalación-manual)
5. [Configuración de Nginx](#5-configuración-de-nginx)
6. [SSL/HTTPS con Let's Encrypt](#6-sslhttps-con-lets-encrypt)
7. [Base de Datos](#7-base-de-datos)
8. [Variables de Entorno](#8-variables-de-entorno)
9. [Colas y Workers](#9-colas-y-workers)
10. [Backups](#10-backups)
11. [Monitoreo](#11-monitoreo)
12. [Seguridad](#12-seguridad)
13. [Escalabilidad](#13-escalabilidad)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Requisitos del Servidor

### 1.1 Hardware Mínimo

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 4 GB | 8 GB |
| Disco | 40 GB SSD | 100 GB SSD |
| Red | 100 Mbps | 1 Gbps |

### 1.2 Software

| Componente | Versión Mínima | Recomendada |
|------------|----------------|-------------|
| Sistema Operativo | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| PHP | 8.2 | 8.3 |
| MySQL | 8.0 | 8.0+ |
| PostgreSQL | 15 | 16 |
| Redis | 7.0 | 7.2 |
| Node.js | 18 LTS | 20 LTS |
| Nginx | 1.24 | 1.26 |

### 1.3 Extensiones PHP Requeridas

```bash
php -m | grep -E "bcmath|ctype|curl|dom|fileinfo|gd|intl|json|mbstring|openssl|pdo|pdo_mysql|pdo_pgsql|redis|tokenizer|xml|zip"
```

Instalar si faltan:
```bash
sudo apt install php8.3-{bcmath,ctype,curl,dom,fileinfo,gd,intl,json,mbstring,openssl,pdo,mysql,pgsql,redis,tokenizer,xml,zip}
```

---

## 2. Arquitectura Recomendada

### 2.1 Arquitectura Simple (1 servidor)

```
┌─────────────────────────────────────────┐
│              SERVIDOR                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  Nginx  │  │  PHP    │  │  MySQL  │ │
│  │  :80    │──│  FPM    │──│  :3306  │ │
│  │  :443   │  │  :9000  │  │         │ │
│  └─────────┘  └─────────┘  └─────────┘ │
│       │                                  │
│  ┌─────────┐  ┌─────────┐               │
│  │  Redis  │  │ Workers │               │
│  │  :6379  │  │ (Queue) │               │
│  └─────────┘  └─────────┘               │
└─────────────────────────────────────────┘
```

### 2.2 Arquitectura Escalable (múltiples servidores)

```
                    ┌──────────────┐
                    │ Load Balancer│
                    │   (HAProxy)  │
                    └──────┬───────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
    │  App 1  │      │  App 2  │      │  App 3  │
    │ Nginx+  │      │ Nginx+  │      │ Nginx+  │
    │ PHP-FPM │      │ PHP-FPM │      │ PHP-FPM │
    └────┬────┘      └────┬────┘      └────┬────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
         ┌────▼────┐            ┌────▼────┐
         │ MySQL   │            │  Redis  │
         │ Primary │            │ Cluster │
         │ +Replica│            │         │
         └─────────┘            └─────────┘
```

---

## 3. Instalación con Docker

### 3.1 Docker Compose

Crear archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # ========================================
  # NGINX
  # ========================================
  nginx:
    image: nginx:1.26-alpine
    container_name: datapolis-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./backend/public:/var/www/html/public:ro
      - ./frontend/dist:/var/www/html/frontend:ro
    depends_on:
      - php
    networks:
      - datapolis-network
    restart: unless-stopped

  # ========================================
  # PHP-FPM
  # ========================================
  php:
    build:
      context: ./docker/php
      dockerfile: Dockerfile
    container_name: datapolis-php
    volumes:
      - ./backend:/var/www/html
      - ./docker/php/php.ini:/usr/local/etc/php/php.ini
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
    depends_on:
      - mysql
      - redis
    networks:
      - datapolis-network
    restart: unless-stopped

  # ========================================
  # MYSQL
  # ========================================
  mysql:
    image: mysql:8.0
    container_name: datapolis-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_DATABASE}
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql-data:/var/lib/mysql
      - ./docker/mysql/my.cnf:/etc/mysql/conf.d/my.cnf
    ports:
      - "3306:3306"
    networks:
      - datapolis-network
    restart: unless-stopped

  # ========================================
  # REDIS
  # ========================================
  redis:
    image: redis:7.2-alpine
    container_name: datapolis-redis
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"
    networks:
      - datapolis-network
    restart: unless-stopped

  # ========================================
  # QUEUE WORKER
  # ========================================
  queue:
    build:
      context: ./docker/php
      dockerfile: Dockerfile
    container_name: datapolis-queue
    command: php artisan queue:work --sleep=3 --tries=3 --max-time=3600
    volumes:
      - ./backend:/var/www/html
    depends_on:
      - mysql
      - redis
    networks:
      - datapolis-network
    restart: unless-stopped

  # ========================================
  # SCHEDULER (CRON)
  # ========================================
  scheduler:
    build:
      context: ./docker/php
      dockerfile: Dockerfile
    container_name: datapolis-scheduler
    command: sh -c "while true; do php artisan schedule:run; sleep 60; done"
    volumes:
      - ./backend:/var/www/html
    depends_on:
      - mysql
      - redis
    networks:
      - datapolis-network
    restart: unless-stopped

volumes:
  mysql-data:
  redis-data:

networks:
  datapolis-network:
    driver: bridge
```

### 3.2 Dockerfile PHP

Crear `docker/php/Dockerfile`:

```dockerfile
FROM php:8.3-fpm-alpine

# Instalar extensiones
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    postgresql-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        bcmath \
        gd \
        intl \
        mbstring \
        pdo_mysql \
        pdo_pgsql \
        zip \
        opcache

# Instalar Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configuración PHP
COPY php.ini /usr/local/etc/php/php.ini

WORKDIR /var/www/html

# Usuario no-root
RUN addgroup -g 1000 -S www && adduser -u 1000 -S www -G www
USER www

EXPOSE 9000
CMD ["php-fpm"]
```

### 3.3 Iniciar Servicios

```bash
# Crear archivo .env
cp .env.example .env

# Editar variables de entorno
nano .env

# Construir e iniciar
docker-compose up -d --build

# Ejecutar migraciones
docker-compose exec php php artisan migrate --force

# Ejecutar seeders
docker-compose exec php php artisan db:seed --force

# Optimizar
docker-compose exec php php artisan config:cache
docker-compose exec php php artisan route:cache
docker-compose exec php php artisan view:cache

# Ver logs
docker-compose logs -f
```

---

## 4. Instalación Manual

### 4.1 Actualizar Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 4.2 Instalar PHP 8.3

```bash
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install php8.3 php8.3-fpm php8.3-cli php8.3-common \
    php8.3-mysql php8.3-pgsql php8.3-redis php8.3-mbstring \
    php8.3-xml php8.3-curl php8.3-zip php8.3-gd php8.3-intl \
    php8.3-bcmath -y
```

### 4.3 Instalar Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### 4.4 Instalar MySQL

```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Crear base de datos
sudo mysql -e "CREATE DATABASE datapolis CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'datapolis'@'localhost' IDENTIFIED BY 'tu_password_seguro';"
sudo mysql -e "GRANT ALL PRIVILEGES ON datapolis.* TO 'datapolis'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

### 4.5 Instalar Redis

```bash
sudo apt install redis-server -y
sudo systemctl enable redis-server
```

### 4.6 Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
```

### 4.7 Instalar Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
```

### 4.8 Desplegar Aplicación

```bash
# Crear directorio
sudo mkdir -p /var/www/datapolis
sudo chown -R $USER:www-data /var/www/datapolis

# Clonar/copiar código
cd /var/www/datapolis
# (copiar archivos del proyecto)

# Backend
cd backend
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate

# Editar .env con configuración de producción
nano .env

# Migraciones y seeders
php artisan migrate --force
php artisan db:seed --force

# Optimizar
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link

# Permisos
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Frontend
cd ../frontend
npm install
npm run build
```

---

## 5. Configuración de Nginx

### 5.1 Configuración del Sitio

Crear `/etc/nginx/sites-available/datapolis`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name datapolis.cl www.datapolis.cl;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name datapolis.cl www.datapolis.cl;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/datapolis.cl/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/datapolis.cl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;

    # Logs
    access_log /var/log/nginx/datapolis-access.log;
    error_log /var/log/nginx/datapolis-error.log;

    # Root for frontend
    root /var/www/datapolis/frontend/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Frontend (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
        alias /var/www/datapolis/backend/public;
        try_files $uri $uri/ @api;

        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
            fastcgi_param SCRIPT_FILENAME /var/www/datapolis/backend/public/index.php;
            include fastcgi_params;
        }
    }

    location @api {
        rewrite ^/api/(.*)$ /api/index.php?$1 last;
    }

    # Deny access to sensitive files
    location ~ /\.(?!well-known).* {
        deny all;
    }

    location ~ /\.env {
        deny all;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5.2 Habilitar Sitio

```bash
sudo ln -s /etc/nginx/sites-available/datapolis /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. SSL/HTTPS con Let's Encrypt

### 6.1 Instalar Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 6.2 Obtener Certificado

```bash
sudo certbot --nginx -d datapolis.cl -d www.datapolis.cl
```

### 6.3 Renovación Automática

```bash
# Verificar renovación
sudo certbot renew --dry-run

# Cron automático (ya configurado por certbot)
sudo systemctl status certbot.timer
```

---

## 7. Base de Datos

### 7.1 Configuración MySQL Producción

Crear `/etc/mysql/mysql.conf.d/datapolis.cnf`:

```ini
[mysqld]
# Performance
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# Connections
max_connections = 200
wait_timeout = 600

# Query cache (disabled in MySQL 8)
# query_cache_type = 0

# Logs
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Character set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

### 7.2 Backup Automático

Crear `/opt/scripts/backup-mysql.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/mysql"
DB_NAME="datapolis"
DB_USER="datapolis"
DB_PASS="tu_password"

mkdir -p $BACKUP_DIR

# Backup
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/$DB_NAME_$DATE.sql.gz

# Eliminar backups antiguos (más de 30 días)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Subir a S3 (opcional)
# aws s3 cp $BACKUP_DIR/$DB_NAME_$DATE.sql.gz s3://tu-bucket/backups/
```

Agregar a cron:
```bash
sudo crontab -e
# Agregar:
0 2 * * * /opt/scripts/backup-mysql.sh >> /var/log/backup-mysql.log 2>&1
```

---

## 8. Variables de Entorno

### 8.1 Archivo .env Producción

```env
APP_NAME="DATAPOLIS PRO"
APP_ENV=production
APP_KEY=base64:GENERAR_CON_php_artisan_key:generate
APP_DEBUG=false
APP_URL=https://datapolis.cl

# Logs
LOG_CHANNEL=daily
LOG_LEVEL=error

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=datapolis
DB_USERNAME=datapolis
DB_PASSWORD=tu_password_muy_seguro

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Cache & Session
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@datapolis.cl
MAIL_PASSWORD=tu_api_key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@datapolis.cl
MAIL_FROM_NAME="${APP_NAME}"

# AWS S3 (opcional, para backups)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

# Sanctum
SANCTUM_STATEFUL_DOMAINS=datapolis.cl,www.datapolis.cl
SESSION_DOMAIN=.datapolis.cl
```

### 8.2 Seguridad del .env

```bash
# Permisos restrictivos
chmod 600 /var/www/datapolis/backend/.env
chown www-data:www-data /var/www/datapolis/backend/.env
```

---

## 9. Colas y Workers

### 9.1 Supervisor para Queue Workers

Instalar Supervisor:
```bash
sudo apt install supervisor -y
```

Crear `/etc/supervisor/conf.d/datapolis-worker.conf`:

```ini
[program:datapolis-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/datapolis/backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/log/datapolis-worker.log
stopwaitsecs=3600
```

Iniciar:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start datapolis-worker:*
```

### 9.2 Scheduler (Cron)

```bash
sudo crontab -e -u www-data
# Agregar:
* * * * * cd /var/www/datapolis/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## 10. Backups

### 10.1 Script de Backup Completo

Crear `/opt/scripts/backup-full.sh`:

```bash
#!/bin/bash
set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
APP_DIR="/var/www/datapolis"

# Crear directorio
mkdir -p $BACKUP_DIR/$DATE

# Backup base de datos
mysqldump -u datapolis -p'password' datapolis | gzip > $BACKUP_DIR/$DATE/database.sql.gz

# Backup archivos (sin vendor ni node_modules)
tar -czf $BACKUP_DIR/$DATE/files.tar.gz \
    --exclude='vendor' \
    --exclude='node_modules' \
    --exclude='storage/logs/*' \
    -C $APP_DIR .

# Backup .env
cp $APP_DIR/backend/.env $BACKUP_DIR/$DATE/.env.backup

# Comprimir todo
cd $BACKUP_DIR
tar -czf backup_$DATE.tar.gz $DATE
rm -rf $DATE

# Mantener últimos 7 días
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

# Opcional: subir a S3
# aws s3 cp $BACKUP_DIR/backup_$DATE.tar.gz s3://bucket/backups/

echo "Backup completado: backup_$DATE.tar.gz"
```

### 10.2 Restaurar Backup

```bash
#!/bin/bash
BACKUP_FILE=$1

# Descomprimir
tar -xzf $BACKUP_FILE -C /tmp/restore

# Restaurar BD
gunzip -c /tmp/restore/*/database.sql.gz | mysql -u datapolis -p datapolis

# Restaurar archivos
tar -xzf /tmp/restore/*/files.tar.gz -C /var/www/datapolis

# Limpiar
rm -rf /tmp/restore
```

---

## 11. Monitoreo

### 11.1 Health Check Endpoint

El sistema incluye endpoint de health check:

```bash
curl https://datapolis.cl/api/health
```

### 11.2 Monitoreo con Laravel Telescope (desarrollo)

```bash
composer require laravel/telescope --dev
php artisan telescope:install
```

### 11.3 Monitoreo de Logs

```bash
# Ver logs en tiempo real
tail -f /var/www/datapolis/backend/storage/logs/laravel.log

# Logs de Nginx
tail -f /var/log/nginx/datapolis-error.log
```

### 11.4 Alertas con UptimeRobot (gratuito)

1. Crear cuenta en https://uptimerobot.com
2. Agregar monitor HTTP(s) para `https://datapolis.cl/api/health`
3. Configurar alertas por email/SMS

---

## 12. Seguridad

### 12.1 Firewall (UFW)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 12.2 Fail2Ban

```bash
sudo apt install fail2ban -y

# Configurar para Nginx
sudo nano /etc/fail2ban/jail.local
```

```ini
[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true

[nginx-botsearch]
enabled = true
```

### 12.3 Actualizaciones Automáticas

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 12.4 Auditoría de Seguridad

```bash
# Verificar permisos
find /var/www/datapolis -type f -perm /o+w

# Verificar archivos sensibles
ls -la /var/www/datapolis/backend/.env

# Verificar puertos abiertos
sudo netstat -tlnp
```

---

## 13. Escalabilidad

### 13.1 Caché de Configuración

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 13.2 OPcache

En `/etc/php/8.3/fpm/conf.d/10-opcache.ini`:

```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.revalidate_freq=0
```

### 13.3 Redis para Sesiones y Caché

Ya configurado en `.env`:
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### 13.4 CDN para Assets

Configurar Cloudflare o AWS CloudFront para servir assets estáticos.

---

## 14. Troubleshooting

### 14.1 Errores Comunes

**500 Internal Server Error**
```bash
# Revisar logs
tail -f /var/www/datapolis/backend/storage/logs/laravel.log
tail -f /var/log/nginx/datapolis-error.log

# Verificar permisos
sudo chown -R www-data:www-data /var/www/datapolis/backend/storage
sudo chmod -R 775 /var/www/datapolis/backend/storage
```

**Página en blanco**
```bash
# Limpiar caché
cd /var/www/datapolis/backend
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

**Error de conexión a BD**
```bash
# Verificar servicio
sudo systemctl status mysql

# Probar conexión
mysql -u datapolis -p -e "SELECT 1"
```

**Queue no procesa trabajos**
```bash
# Verificar supervisor
sudo supervisorctl status

# Reiniciar workers
sudo supervisorctl restart datapolis-worker:*
```

### 14.2 Comandos Útiles

```bash
# Estado general
php artisan about

# Rutas registradas
php artisan route:list

# Conexión a BD
php artisan db:show

# Limpiar todo
php artisan optimize:clear

# Reconstruir caché
php artisan optimize
```

---

## Checklist de Despliegue

- [ ] Servidor provisionado con requisitos mínimos
- [ ] PHP 8.3 + extensiones instaladas
- [ ] MySQL/PostgreSQL configurado
- [ ] Redis instalado
- [ ] Nginx configurado
- [ ] SSL/HTTPS activo
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Seeders ejecutados
- [ ] Permisos de archivos correctos
- [ ] Queue workers activos (Supervisor)
- [ ] Cron configurado para scheduler
- [ ] Backups automáticos configurados
- [ ] Firewall configurado
- [ ] Monitoreo activo
- [ ] DNS apuntando al servidor

---

*Guía de Despliegue v2.5 - Diciembre 2025*  
*© DATAPOLIS SpA*
