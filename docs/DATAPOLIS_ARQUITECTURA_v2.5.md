# DATAPOLIS PRO - Documentación de Arquitectura

**Versión:** 1.1  
**Fecha:** Diciembre 2025

---

## 1. Visión General

### 1.1 Descripción del Sistema

DATAPOLIS PRO es un sistema SaaS multi-tenant para la gestión integral de comunidades y condominios en Chile, diseñado para cumplir con la normativa legal vigente.

### 1.2 Objetivos de Arquitectura

- **Escalabilidad:** Soportar múltiples comunidades simultáneamente
- **Seguridad:** Protección de datos personales (Ley 21.719)
- **Mantenibilidad:** Código limpio y documentado
- **Disponibilidad:** 99.5% uptime
- **Performance:** Respuesta < 500ms para operaciones comunes

---

## 2. Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React 18 + TypeScript + Vite + TailwindCSS + React Query   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│           Laravel 11 + PHP 8.3 + Sanctum                    │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Controllers│  │ Services │  │  Models  │  │   Jobs   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
      ┌──────────┐      ┌──────────┐      ┌──────────┐
      │  MySQL   │      │  Redis   │      │   S3     │
      │PostgreSQL│      │  Cache   │      │ Storage  │
      │          │      │  Queue   │      │          │
      └──────────┘      └──────────┘      └──────────┘
```

### 2.1 Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.x | Framework UI |
| TypeScript | 5.x | Tipado estático |
| Vite | 5.x | Bundler/Dev server |
| TailwindCSS | 3.x | Estilos utilitarios |
| React Router | 6.x | Enrutamiento SPA |
| React Query | 5.x | Data fetching/cache |
| Axios | 1.x | Cliente HTTP |
| Chart.js | 4.x | Gráficos |
| React Hook Form | 7.x | Formularios |

### 2.2 Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| PHP | 8.3 | Lenguaje servidor |
| Laravel | 11.x | Framework |
| Sanctum | 4.x | Autenticación API |
| Spatie Permission | 6.x | Roles y permisos |
| DomPDF | 2.x | Generación PDF |
| Maatwebsite Excel | 3.x | Exportación Excel |

### 2.3 Infraestructura

| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| Base de datos | MySQL 8 / PostgreSQL 16 | Persistencia |
| Cache | Redis 7.x | Cache y sesiones |
| Cola | Redis + Laravel Queue | Jobs asíncronos |
| Servidor web | Nginx 1.26 | Reverse proxy |
| SSL | Let's Encrypt | HTTPS |

---

## 3. Arquitectura de la Aplicación

### 3.1 Patrón MVC + Services

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/              # Controladores API REST
│   ├── Middleware/           # Middleware (auth, logging)
│   └── Requests/             # Form Requests (validación)
├── Models/                   # Eloquent Models
├── Services/                 # Lógica de negocio
├── Jobs/                     # Tareas asíncronas
├── Notifications/            # Notificaciones
└── Policies/                 # Autorización
```

### 3.2 Flujo de una Petición

```
Request → Middleware → Controller → Service → Model → Database
                                       ↓
Response ← Controller ← Service ← Model ←
```

### 3.3 Capas de la Aplicación

```
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER             │
│    Controllers, Requests, Resources      │
├─────────────────────────────────────────┤
│            BUSINESS LAYER                │
│         Services, Jobs, Events           │
├─────────────────────────────────────────┤
│             DATA LAYER                   │
│        Models, Repositories              │
├─────────────────────────────────────────┤
│          INFRASTRUCTURE                  │
│    Database, Cache, Queue, Storage       │
└─────────────────────────────────────────┘
```

---

## 4. Modelo de Datos

### 4.1 Diagrama Entidad-Relación Principal

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Tenant    │───────│   Edificio  │───────│   Unidad    │
│             │  1:N  │             │  1:N  │             │
└─────────────┘       └─────────────┘       └──────┬──────┘
                                                    │
                           ┌────────────────────────┼────────────────────────┐
                           │                        │                        │
                    ┌──────▼──────┐          ┌──────▼──────┐          ┌──────▼──────┐
                    │  Boleta GC  │          │Copropietario│          │ Distribución│
                    │             │          │             │          │   Detalle   │
                    └──────┬──────┘          └─────────────┘          └─────────────┘
                           │
                    ┌──────▼──────┐
                    │    Pago     │
                    │             │
                    └─────────────┘
```

### 4.2 Multi-Tenancy

El sistema usa **multi-tenancy por columna** (`tenant_id` en cada tabla):

```sql
-- Todas las consultas filtran por tenant
SELECT * FROM edificios WHERE tenant_id = :tenant_id;
```

Beneficios:
- Base de datos única (menor costo)
- Migrations simples
- Fácil de implementar

### 4.3 Tablas Principales

| Grupo | Tablas |
|-------|--------|
| **Core** | tenants, users, personas, roles, permissions |
| **Edificios** | edificios, unidades, copropietarios |
| **Gastos Comunes** | periodos_gc, boletas_gc, pagos_gc, cargos_gc |
| **Arriendos** | contratos_arriendo, facturas_arriendo, arrendatarios |
| **Distribución** | distribuciones, distribucion_detalles, certificados_renta |
| **RRHH** | empleados, liquidaciones, afp, isapres |
| **Contabilidad** | plan_cuentas, asientos, asiento_lineas |
| **Reuniones** | reuniones, asistentes, votaciones, votos |
| **Legal** | oficios, certificados_cumplimiento |
| **Protección Datos** | tratamientos, consentimientos, solicitudes_arco, brechas |

---

## 5. API REST

### 5.1 Convenciones

- **Base URL:** `/api/v1`
- **Formato:** JSON
- **Autenticación:** Bearer Token (Sanctum)
- **Códigos HTTP:** Estándar (200, 201, 400, 401, 403, 404, 422, 500)

### 5.2 Estructura de Respuestas

**Éxito:**
```json
{
  "data": { ... },
  "meta": {
    "current_page": 1,
    "total": 100
  }
}
```

**Error:**
```json
{
  "message": "Descripción del error",
  "errors": {
    "campo": ["Error de validación"]
  }
}
```

### 5.3 Endpoints por Módulo

| Módulo | Prefix | Endpoints |
|--------|--------|-----------|
| Auth | `/auth` | 5 |
| Dashboard | `/dashboard` | 4 |
| Edificios | `/edificios` | 6 |
| Unidades | `/unidades` | 5 |
| Gastos Comunes | `/gastos-comunes` | 15 |
| Arriendos | `/arriendos` | 12 |
| Distribución | `/distribucion` | 8 |
| RRHH | `/rrhh` | 10 |
| Contabilidad | `/contabilidad` | 10 |
| Reuniones | `/reuniones` | 12 |
| Legal | `/legal` | 10 |
| Protección Datos | `/proteccion-datos` | 18 |

---

## 6. Seguridad

### 6.1 Autenticación

```
┌──────────┐    POST /auth/login     ┌──────────┐
│  Client  │ ──────────────────────► │  Server  │
│          │                         │          │
│          │ ◄────────────────────── │          │
│          │    { token: "..." }     │          │
│          │                         │          │
│          │    GET /api/resource    │          │
│          │    Authorization:       │          │
│          │    Bearer <token>       │          │
│          │ ──────────────────────► │          │
└──────────┘                         └──────────┘
```

### 6.2 Autorización (RBAC)

```
Super Admin
    │
    ├── Admin Edificio
    │       │
    │       ├── Administrador
    │       │
    │       └── Contador
    │
    └── Copropietario (solo lectura de su unidad)
```

### 6.3 Protección de Datos

| Control | Implementación |
|---------|----------------|
| Encriptación en tránsito | TLS 1.3 |
| Encriptación en reposo | AES-256 |
| Hash de contraseñas | bcrypt |
| Rate limiting | 60 req/min |
| CSRF | Token en sesión |
| XSS | Sanitización automática |
| SQL Injection | Eloquent ORM (prepared statements) |

### 6.4 Auditoría

```sql
-- Tabla log_acceso_datos_personales
CREATE TABLE log_acceso_datos_personales (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    tabla_accedida VARCHAR(100),
    registro_id BIGINT,
    operacion ENUM('lectura', 'creacion', 'actualizacion', 'eliminacion'),
    ip_address VARCHAR(45),
    created_at TIMESTAMP
);
```

---

## 7. Flujos de Negocio

### 7.1 Generación de Boletas de Gastos Comunes

```
┌─────────────────┐
│ Crear Período   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cargar Gastos   │
│ del Mes         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     Para cada unidad:
│ Generar Boletas │────► Monto = GastoTotal × Prorrateo
└────────┬────────┘      + SaldoAnterior + Intereses
         │
         ▼
┌─────────────────┐
│ Notificar por   │
│ Email (Queue)   │
└─────────────────┘
```

### 7.2 Distribución de Ingresos (Ley 21.713)

```
┌─────────────────┐
│ Crear           │
│ Distribución    │
│ (monto total)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Procesar        │────► Por cada unidad:
│                 │      Monto = Total × Prorrateo
└────────┬────────┘      Art. 17 N°3: Sin retención
         │
         ▼
┌─────────────────┐
│ Aprobar         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generar         │
│ Certificados    │
│ Renta Anuales   │
└─────────────────┘
```

### 7.3 Votación en Asamblea

```
┌─────────────────┐
│ Crear Votación  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Copropietarios  │
│ Emiten Voto     │────► Voto ponderado por prorrateo
└────────┬────────┘      Voto secreto (anónimo)
         │
         ▼
┌─────────────────┐
│ Cerrar Votación │
│                 │────► Calcular resultados
└────────┬────────┘      Verificar mayoría
         │
         ▼
┌─────────────────┐
│ Registrar       │
│ en Acta         │
└─────────────────┘
```

---

## 8. Integraciones

### 8.1 Actuales

| Sistema | Propósito | Método |
|---------|-----------|--------|
| SII | Obtener UF/UTM | API pública |
| Jitsi | Videoconferencia | Embed |
| SMTP | Envío emails | SMTP |

### 8.2 Futuras (Roadmap)

| Sistema | Propósito |
|---------|-----------|
| Transbank/Webpay | Pagos online |
| Previred | Declaración previsional |
| SII | Facturación electrónica |
| Bancos | Conciliación bancaria |

---

## 9. Decisiones de Arquitectura

### 9.1 ¿Por qué Laravel?

- Ecosistema maduro y bien documentado
- Eloquent ORM simplifica acceso a datos
- Sistema de colas integrado
- Sanctum para autenticación API
- Comunidad activa en Chile

### 9.2 ¿Por qué React + Vite?

- Performance superior (Vite)
- Ecosistema rico de componentes
- React Query simplifica data fetching
- TypeScript para type safety
- Fácil de mantener y escalar

### 9.3 ¿Por qué Multi-tenancy por Columna?

- Menor complejidad operacional
- Una sola base de datos que mantener
- Migrations más simples
- Adecuado para el volumen esperado (<10,000 tenants)

### 9.4 ¿Por qué Redis para Queue?

- Ya usado para caché/sesiones
- Menor latencia que base de datos
- Soporte nativo en Laravel
- Escalable horizontalmente

---

## 10. Consideraciones de Escalabilidad

### 10.1 Actual (1-100 clientes)

- Servidor único
- MySQL con réplica para backups
- Redis standalone

### 10.2 Futuro (100-1000 clientes)

- Load balancer (HAProxy/Nginx)
- Múltiples servidores de aplicación
- MySQL Primary + Réplicas de lectura
- Redis Cluster
- CDN para assets estáticos

### 10.3 Métricas Objetivo

| Métrica | Objetivo |
|---------|----------|
| Tiempo de respuesta P95 | < 500ms |
| Uptime | 99.5% |
| RPS máximo | 1000 |
| Usuarios concurrentes | 500 |

---

*Documentación de Arquitectura v2.5 - Diciembre 2025*  
*© DATAPOLIS SpA*
