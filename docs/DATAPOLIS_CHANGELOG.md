# DATAPOLIS PRO - Changelog

Todos los cambios notables del proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.5.0] - 2025-12-27

### Agregado

#### Módulo Reportes Tributarios y Contables
- **9 nuevas tablas de base de datos:**
  - `balances_generales` - Balance General formato SII/F22
  - `estados_resultados` - Estado de Resultados con distribución
  - `declaraciones_juradas` - DJ 1887 y otras
  - `reportes_distribucion_consolidado` - Consolidado anual arriendos
  - `distribucion_detalle_contribuyente` - Detalle por persona/unidad
  - `distribucion_consolidado_contribuyente` - Multi-propiedad por RUT
  - `certificados_deuda` - Certificados no deuda / pago GGCC
  - `checklist_cumplimiento_unidad` - Cumplimiento legal por unidad
  - `historial_certificados_tributarios` - Historial de certificados

- **Controlador ReportesTributariosController** (~40 endpoints)
- **Página ReportesTributariosPage** con 6 tabs
- **Plantillas PDF** para Balance, Estado Resultados, Certificados

---

## [2.4.0] - 2025-12-25 a 2025-12-27

### Agregado

#### Consolidación Backend/Frontend Completo
- Sistema completo consolidado para instalación local
- Empaquetado de todos los módulos en estructura instalable
- Scripts de instalación para Windows, Mac y Linux

#### Módulo Protección de Datos (Ley 19.628 / 21.719)
- **10 nuevas tablas** para ARCO+, consentimientos, brechas
- **Controlador ProteccionDatosController** con endpoints ARCO+
- **Middleware de Protección de Datos**
- **Página Frontend ProteccionDatosPage** con 6 tabs

#### Documentación Completa (10 documentos)
- API Reference, Manual Usuario, Guía Despliegue, Arquitectura
- Diccionario Datos, Guía Desarrollo, Manual Cumplimiento Legal
- FAQ/Troubleshooting, Matriz Avance, Changelog

---

## [2.3.0] - 2025-12-23

### Agregado

#### Módulo Asistente Legal Inteligente
- Consultas legales con análisis automático
- Base de conocimiento (Ley 21.442, 21.713, Código Tributario)
- Generador de oficios formales (10 plantillas)
- BD de 35+ instituciones (SII, DOM, JPL, SEC, MINVU, etc.)
- Certificado de Cumplimiento con score 0-100
- Verificación pública de certificados

#### Módulo Reuniones Telemáticas
- Integración Jitsi Meet (videoconferencia)
- Sistema de votaciones (5 tipos, 6 tipos quórum)
- Generación automática de actas PDF
- Calendario con recurrencia y delegación de voto

---

## [2.2.0] - 2025-12-23

### Agregado
- Módulo Reportes con exportación Excel/PDF
- Sistema de Roles y Permisos (~50 permisos granulares)
- 7 roles predefinidos

---

## [2.1.0] - 2025-12-22

### Agregado
- Módulo Distribución de Ingresos (Ley 21.713)
- Cálculo automático según prorrateo
- Art. 17 N°3 LIR (montos no constituyen renta)
- Certificados de renta anuales

---

## [2.0.0] - 2025-12-19 a 2025-12-21

### Agregado
- Backend Laravel 11 (~65 tablas)
- Frontend React + Vite + TypeScript
- Módulo RRHH con liquidaciones
- Módulo Contabilidad (Plan cuentas, Balance)
- Infraestructura Docker

---

## [1.0.0] - 2025-12-19

### Agregado
- Versión inicial del proyecto

---

## Roadmap

### [2.6.0] - Q1 2026
- Integración Transbank/Webpay
- Integración Previred
- App móvil React Native

### [2.7.0] - Q2 2026
- Facturación electrónica SII
- Conciliación bancaria automática
- Portal copropietarios

---

*© DATAPOLIS SpA - 2025*
