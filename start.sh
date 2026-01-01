#!/bin/bash
#===============================================================================
# DATAPOLIS PRO - Quick Start Script
# Desarrollo Local con Docker
#===============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║          DATAPOLIS PRO v2.5 - Quick Start                     ║
║       Entorno de Desarrollo con Docker                        ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker no está instalado${NC}"
    echo "Instale Docker desde: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose no está instalado${NC}"
    exit 1
fi

# Crear archivos .env si no existen
echo -e "${GREEN}[1/6] Configurando archivos de entorno...${NC}"

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✓ Creado backend/.env"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo "✓ Creado frontend/.env"
fi

# Construir contenedores
echo -e "${GREEN}[2/6] Construyendo contenedores Docker...${NC}"
docker-compose build

# Iniciar servicios
echo -e "${GREEN}[3/6] Iniciando servicios...${NC}"
docker-compose up -d mysql redis

# Esperar a que MySQL esté listo
echo -e "${GREEN}[4/6] Esperando a que MySQL esté listo...${NC}"
sleep 10

# Configurar backend
echo -e "${GREEN}[5/6] Configurando Laravel backend...${NC}"
docker-compose run --rm backend bash -c "
    composer install &&
    php artisan key:generate &&
    php artisan migrate:fresh --seed &&
    php artisan storage:link &&
    php artisan config:cache
"

# Iniciar todos los servicios
echo -e "${GREEN}[6/6] Iniciando aplicación...${NC}"
docker-compose up -d

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           ✅ DATAPOLIS PRO INICIADO CORRECTAMENTE             ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Servicios disponibles:${NC}"
echo -e "  Frontend:     ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend API:  ${GREEN}http://localhost:8000${NC}"
echo -e "  PhpMyAdmin:   ${GREEN}http://localhost:8080${NC}"
echo -e "  MailHog:      ${GREEN}http://localhost:8025${NC}"
echo ""
echo -e "${YELLOW}Credenciales por defecto:${NC}"
echo -e "  Email:    ${GREEN}admin@datapolis.cl${NC}"
echo -e "  Password: ${GREEN}DataPolis2025!${NC}"
echo ""
echo -e "${YELLOW}Comandos útiles:${NC}"
echo "  Ver logs:           docker-compose logs -f"
echo "  Detener:            docker-compose down"
echo "  Reiniciar:          docker-compose restart"
echo "  Shell backend:      docker-compose exec backend bash"
echo "  Shell frontend:     docker-compose exec frontend sh"
echo "  Migrar BD:          docker-compose exec backend php artisan migrate"
echo ""
echo -e "${BLUE}Happy coding! 🚀${NC}"
