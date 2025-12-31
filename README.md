# DATAPOLIS PRO v2.5

## Sistema de Gestión Integral para Condominios

**Plataforma PropTech/FinTech para administración de copropiedades en Chile**

---

## 🚀 Instalación Rápida

### Opción 1: Instalación Automatizada (Recomendada)

```bash
# 1. Subir el ZIP al servidor
scp datapolis-pro-v2.5-completo.zip root@TU_IP:/var/www/

# 2. Conectar al servidor
ssh root@TU_IP

# 3. Descomprimir
cd /var/www
unzip datapolis-pro-v2.5-completo.zip

# 4. Ejecutar instalador
cd datapolis-pro-v2.5
chmod +x install.sh
./install.sh
```

### Opción 2: Instalación Manual

Ver el archivo `docs/DATAPOLIS_GUIA_DESPLIEGUE_v2.5.md` para instrucciones detalladas.

---

## 📋 Requisitos del Sistema

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| **RAM** | 2 GB | 4 GB |
| **CPU** | 1 vCPU | 2 vCPU |
| **Disco** | 25 GB SSD | 50 GB NVMe |
| **SO** | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |

### Software Requerido
- PHP 8.2+ con extensiones: mysql, xml, mbstring, curl, zip, gd, bcmath
- MySQL 8.0+ o MariaDB 10.6+
- Nginx o Apache
- Composer 2.x
- Node.js 18+

---

## 🔑 Credenciales por Defecto

| Campo | Valor |
|-------|-------|
| **URL** | http://TU_IP |
| **Email** | admin@datapolis.cl |
| **Password** | DataPolis2025! |

⚠️ **IMPORTANTE:** Cambiar la contraseña inmediatamente después del primer login.

---

## 📁 Estructura del Proyecto

```
datapolis-pro-v2.5/
├── backend/                 # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   └── Models/
│   ├── database/migrations/
│   ├── routes/
│   └── resources/views/pdf/
├── frontend/                # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   └── package.json
├── docs/                    # Documentación completa
│   ├── DATAPOLIS_API_REFERENCE_v2.5.yaml
│   ├── DATAPOLIS_MANUAL_USUARIO_v2.5.md
│   └── ...
├── install.sh              # Script de instalación
└── README.md               # Este archivo
```

---

## 🏛️ Cumplimiento Legal

| Ley | Descripción | Estado |
|-----|-------------|--------|
| **Ley 21.442** | Copropiedad Inmobiliaria | ✅ Completo |
| **Ley 21.713** | Distribución de Ingresos | ✅ Completo |
| **Ley 21.719** | Protección de Datos Personales | ✅ Completo |
| **Código del Trabajo** | Liquidaciones de sueldo | ✅ Completo |

---

## 📊 Módulos Incluidos

1. **Dashboard** - Estadísticas y alertas
2. **Edificios/Unidades** - Gestión de propiedades
3. **Gastos Comunes** - Boletas, pagos, morosidad
4. **Arriendos** - Contratos telecom (antenas)
5. **Distribución** - Reparto ingresos (Art. 17 N°3 LIR)
6. **RRHH** - Empleados y liquidaciones
7. **Contabilidad** - Plan cuentas, asientos, balance
8. **Reuniones** - Asambleas telemáticas (Jitsi)
9. **Asistente Legal** - Consultas y oficios
10. **Protección de Datos** - ARCO+, consentimientos
11. **Reportes Tributarios** - DJ, certificados, F22

---

## 🆘 Soporte

- **Email:** soporte@datapolis.cl
- **Documentación:** `/docs/`

---

© 2025 DATAPOLIS SpA - Todos los derechos reservados

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=flat&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

---

## 🎯 Características Principales

### Gestión Operativa
- ✅ **Gastos Comunes**: Boletas, pagos, morosidad, intereses
- ✅ **Arriendos**: Contratos, facturación, UF automática
- ✅ **Distribución**: Reparto proporcional Ley 21.713
- ✅ **RRHH**: Liquidaciones, cotizaciones, finiquitos

### Contabilidad y Tributario
- ✅ **Balance General**: Formato SII/F22
- ✅ **Estado de Resultados**: Con distribución Art. 17 N°3
- ✅ **DJ 1887**: Generación CSV para SII
- ✅ **Certificados de Renta**: Individual y consolidado

### Cumplimiento Legal
- ✅ **Ley 21.442**: Copropiedad inmobiliaria
- ✅ **Ley 21.713**: Distribución de arriendos
- ✅ **Ley 21.719**: Protección de datos personales
- ✅ **Código del Trabajo**: Remuneraciones

### Gobierno Corporativo
- ✅ **Asambleas Telemáticas**: Jitsi Meet integrado
- ✅ **Votaciones Ponderadas**: Por prorrateo
- ✅ **Actas Automáticas**: PDF con firmas

---

## 🚀 Instalación Rápida

### Requisitos
- PHP 8.2+
- Node.js 18+
- MySQL 8.0+
- Redis 7+
- Composer 2+

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Métricas del Sistema

| Componente | Cantidad |
|------------|:--------:|
| Tablas BD | ~95 |
| Endpoints API | ~160 |
| Páginas Frontend | 15 |
| Modelos | 30+ |
| Líneas de código | ~18,000 |

---

## 📁 Estructura del Proyecto

```
datapolis-pro/
├── backend/                # Laravel 11
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/     # 8 migraciones
│   │   └── seeders/
│   ├── routes/
│   └── resources/views/pdf/
├── frontend/               # React 18 + Vite
│   └── src/
│       ├── pages/          # 15 páginas
│       ├── components/
│       └── services/
└── docs/                   # Documentación
```

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [API Reference](docs/DATAPOLIS_API_REFERENCE_v2.5.yaml) | OpenAPI 3.0 |
| [Manual Usuario](docs/DATAPOLIS_MANUAL_USUARIO_v2.5.md) | Guía completa |
| [Guía Despliegue](docs/DATAPOLIS_GUIA_DESPLIEGUE_v2.5.md) | Instalación producción |
| [Arquitectura](docs/DATAPOLIS_ARQUITECTURA_v2.5.md) | Diseño técnico |
| [Diccionario Datos](docs/DATAPOLIS_DICCIONARIO_DATOS_v2.5.md) | Esquema BD |
| [Cumplimiento Legal](docs/DATAPOLIS_MANUAL_CUMPLIMIENTO_LEGAL_v2.5.md) | Leyes chilenas |

---

## 🔐 Seguridad

- Autenticación JWT (Laravel Sanctum)
- Encriptación AES-256 datos sensibles
- TLS 1.3 en tránsito
- Auditoría completa de accesos
- Cumplimiento Ley 21.719

---

## 📞 Soporte

- **Email**: soporte@datapolis.cl
- **Documentación**: https://docs.datapolis.cl
- **Estado del servicio**: https://status.datapolis.cl

---

## 📄 Licencia

Copyright © 2025 DATAPOLIS SpA. Todos los derechos reservados.

---

**Desarrollado con ❤️ para la industria inmobiliaria chilena**
