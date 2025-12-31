#!/bin/bash
#===============================================================================
# DATAPOLIS PRO v2.5 - Script de Instalación Automatizada
# Sistema de Gestión Integral para Condominios
# © 2025 DATAPOLIS SpA
#===============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║           DATAPOLIS PRO v2.5 - Instalación                    ║"
echo "║       Sistema de Gestión Integral para Condominios            ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar que se ejecuta como root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Error: Este script debe ejecutarse como root${NC}"
    echo "Ejecute: sudo bash install.sh"
    exit 1
fi

# Variables de configuración
read -p "Ingrese la IP o dominio del servidor [localhost]: " SERVER_NAME
SERVER_NAME=${SERVER_NAME:-localhost}

read -p "Ingrese el nombre de la base de datos [datapolis]: " DB_NAME
DB_NAME=${DB_NAME:-datapolis}

read -p "Ingrese el usuario de la base de datos [datapolis]: " DB_USER
DB_USER=${DB_USER:-datapolis}

read -sp "Ingrese la contraseña de la base de datos: " DB_PASS
echo ""

if [ -z "$DB_PASS" ]; then
    echo -e "${RED}Error: La contraseña no puede estar vacía${NC}"
    exit 1
fi

INSTALL_DIR="/var/www/datapolis"

echo ""
echo -e "${YELLOW}Configuración:${NC}"
echo "  Servidor: $SERVER_NAME"
echo "  Base de datos: $DB_NAME"
echo "  Usuario BD: $DB_USER"
echo "  Directorio: $INSTALL_DIR"
echo ""
read -p "¿Continuar con la instalación? (s/n): " CONFIRM
if [ "$CONFIRM" != "s" ] && [ "$CONFIRM" != "S" ]; then
    echo "Instalación cancelada."
    exit 0
fi

echo ""
echo -e "${GREEN}[1/10] Actualizando sistema...${NC}"
apt update && apt upgrade -y

echo ""
echo -e "${GREEN}[2/10] Instalando PHP 8.3...${NC}"
apt install -y software-properties-common
add-apt-repository ppa:ondrej/php -y
apt update
apt install -y php8.3 php8.3-fpm php8.3-mysql php8.3-xml php8.3-mbstring \
    php8.3-curl php8.3-zip php8.3-gd php8.3-bcmath php8.3-intl php8.3-redis

echo ""
echo -e "${GREEN}[3/10] Instalando MySQL...${NC}"
apt install -y mysql-server

echo ""
echo -e "${GREEN}[4/10] Instalando Nginx...${NC}"
apt install -y nginx

echo ""
echo -e "${GREEN}[5/10] Instalando Composer...${NC}"
if ! command -v composer &> /dev/null; then
    curl -sS https://getcomposer.org/installer | php
    mv composer.phar /usr/local/bin/composer
fi

echo ""
echo -e "${GREEN}[6/10] Instalando Node.js 20...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

echo ""
echo -e "${GREEN}[7/10] Configurando base de datos...${NC}"
mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF
echo "Base de datos configurada correctamente."

echo ""
echo -e "${GREEN}[8/10] Instalando DATAPOLIS PRO...${NC}"

# Crear directorio de instalación
mkdir -p $INSTALL_DIR
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Copiar archivos
cp -r $SCRIPT_DIR/backend $INSTALL_DIR/
cp -r $SCRIPT_DIR/frontend $INSTALL_DIR/
cp -r $SCRIPT_DIR/docs $INSTALL_DIR/

# Configurar Backend Laravel
cd $INSTALL_DIR/backend
composer install --no-dev --optimize-autoloader

# Crear .env
cp .env.example .env
sed -i "s|APP_URL=.*|APP_URL=http://${SERVER_NAME}|g" .env
sed -i "s|DB_DATABASE=.*|DB_DATABASE=${DB_NAME}|g" .env
sed -i "s|DB_USERNAME=.*|DB_USERNAME=${DB_USER}|g" .env
sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=${DB_PASS}|g" .env

# Generar key y migrar
php artisan key:generate
php artisan migrate --seed --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Configurar Frontend
cd $INSTALL_DIR/frontend
npm install
npm run build

echo ""
echo -e "${GREEN}[9/10] Configurando Nginx...${NC}"

cat > /etc/nginx/sites-available/datapolis <<EOF
server {
    listen 80;
    server_name ${SERVER_NAME};
    root ${INSTALL_DIR}/backend/public;
    index index.php index.html;

    client_max_body_size 100M;

    # Frontend estático (React build)
    location /app {
        alias ${INSTALL_DIR}/frontend/dist;
        try_files \$uri \$uri/ /app/index.html;
    }

    # API Laravel
    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 300;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Cache de assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Activar sitio
ln -sf /etc/nginx/sites-available/datapolis /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo ""
echo -e "${GREEN}[10/10] Configurando permisos...${NC}"
chown -R www-data:www-data $INSTALL_DIR
chmod -R 755 $INSTALL_DIR
chmod -R 775 $INSTALL_DIR/backend/storage
chmod -R 775 $INSTALL_DIR/backend/bootstrap/cache

# Configurar cron para Laravel
(crontab -l 2>/dev/null | grep -v "artisan schedule:run"; echo "* * * * * cd ${INSTALL_DIR}/backend && php artisan schedule:run >> /dev/null 2>&1") | crontab -

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           ✅ INSTALACIÓN COMPLETADA EXITOSAMENTE              ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Acceso al sistema:${NC}"
echo -e "  URL: ${GREEN}http://${SERVER_NAME}${NC}"
echo ""
echo -e "${YELLOW}Credenciales por defecto:${NC}"
echo -e "  Email:    ${GREEN}admin@datapolis.cl${NC}"
echo -e "  Password: ${GREEN}DataPolis2025!${NC}"
echo ""
echo -e "${RED}⚠️  IMPORTANTE: Cambie la contraseña después del primer login${NC}"
echo ""
echo -e "${YELLOW}Para SSL gratuito con Let's Encrypt:${NC}"
echo "  apt install -y certbot python3-certbot-nginx"
echo "  certbot --nginx -d ${SERVER_NAME}"
echo ""
echo -e "${YELLOW}Logs:${NC}"
echo "  Laravel: tail -f ${INSTALL_DIR}/backend/storage/logs/laravel.log"
echo "  Nginx:   tail -f /var/log/nginx/error.log"
echo ""
echo -e "${BLUE}Documentación: ${INSTALL_DIR}/docs/${NC}"
echo ""
