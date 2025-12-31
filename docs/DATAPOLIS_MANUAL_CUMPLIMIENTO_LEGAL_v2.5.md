# DATAPOLIS PRO - Manual de Cumplimiento Legal

**Versión:** 1.1  
**Fecha:** Diciembre 2025

---

## Introducción

Este manual documenta cómo DATAPOLIS PRO ayuda a las comunidades y condominios a cumplir con la normativa legal chilena vigente. El sistema está diseñado para facilitar el cumplimiento de:

- **Ley 21.442** - Ley de Copropiedad Inmobiliaria
- **Ley 21.713** - Distribución de Ingresos por Bienes Comunes
- **Ley 19.628 / 21.719** - Protección de Datos Personales
- **Código del Trabajo** - Normativa laboral
- **Código Tributario** - Obligaciones tributarias

---

## 1. Ley 21.442 - Copropiedad Inmobiliaria

### 1.1 Resumen de la Ley

La Ley 21.442, publicada el 13 de abril de 2022, moderniza el régimen de copropiedad inmobiliaria en Chile, reemplazando la antigua Ley 19.537.

### 1.2 Principales Obligaciones

| Obligación | Plazo | Cómo DATAPOLIS Ayuda |
|------------|-------|----------------------|
| Actualizar reglamento de copropiedad | 9 enero 2026 (DS 7/2025) | Módulo Legal con plantillas |
| Fondo de reserva mínimo 5% | Permanente | Cálculo automático en boletas GC |
| Asambleas telemáticas | Cuando se convoque | Módulo Reuniones con Jitsi |
| Transparencia financiera | Permanente | Dashboard y reportes |
| Registro de actas | Permanente | Generación automática de actas |

### 1.3 Fondo de Reserva (Art. 30)

**Requisito legal:** Mínimo 5% de los gastos comunes ordinarios.

**Implementación en DATAPOLIS:**
```
Configuración > General > Fondo de Reserva: 5%
```

El sistema:
- Calcula automáticamente el 5% de los gastos comunes
- Lo incluye como línea separada en cada boleta
- Registra contablemente en cuenta separada
- Genera alertas si el fondo cae bajo el mínimo legal

### 1.4 Asambleas Telemáticas (Art. 18)

**Requisito legal:** Permitir participación remota con mismas garantías que presencial.

**Implementación en DATAPOLIS:**
- Creación de reuniones con modalidad "Telemática" o "Mixta"
- Integración con Jitsi Meet para videoconferencia
- Registro de asistencia con hora de conexión/desconexión
- Votaciones electrónicas ponderadas por prorrateo
- Voto secreto (se registra que votó, no cómo votó)
- Generación automática de actas con resultados

### 1.5 Quórum para Asambleas

| Tipo de Asamblea | Quórum Primera Citación | Quórum Segunda Citación |
|------------------|-------------------------|-------------------------|
| Ordinaria | Mayoría absoluta | Los que asistan |
| Extraordinaria (materias simples) | Mayoría absoluta | 1/3 de los derechos |
| Extraordinaria (materias especiales) | 2/3 de los derechos | 2/3 de los derechos |

**Materias que requieren 2/3:**
- Modificación del reglamento
- Cambio de destino de bienes comunes
- Reconstrucción o demolición
- Enajenación de bienes comunes

### 1.6 Morosidad y Cobranza (Art. 32)

**Requisito legal:** Interés máximo corriente para operaciones no reajustables.

**Implementación en DATAPOLIS:**
- Configuración de tasa de interés mensual
- Cálculo automático de intereses por mora
- Reporte de morosidad con días de atraso
- Generación de cartas de cobranza
- Certificados de deuda para cobranza judicial

---

## 2. Ley 21.713 - Distribución de Ingresos

### 2.1 Resumen de la Ley

La Ley 21.713, publicada el 24 de octubre de 2024, establece el tratamiento tributario de los ingresos obtenidos por comunidades de copropietarios por el arriendo de bienes comunes.

### 2.2 Principio Fundamental

> Los ingresos percibidos por la comunidad que sean distribuidos proporcionalmente a los copropietarios **NO constituyen renta** según el Art. 17 N°3 de la Ley de Impuesto a la Renta.

### 2.3 Requisitos para Exención

| Requisito | Descripción | Verificación en DATAPOLIS |
|-----------|-------------|---------------------------|
| Distribución proporcional | Según prorrateo de cada unidad | ✅ Automático |
| Documentación | Acuerdo de asamblea + certificados | ✅ Módulo Legal |
| Oportunidad | Dentro del mismo ejercicio | ✅ Control por período |
| Certificados | Emitir antes del 31 de marzo | ✅ Generación automática |

### 2.4 Flujo de Distribución en DATAPOLIS

```
1. Facturar Arriendos (mensual)
   └── Sistema genera facturas con IVA
   └── Registra pago de arrendatarios

2. Crear Distribución
   └── Seleccionar edificio, mes, año
   └── Ingresar monto total a distribuir

3. Procesar Distribución
   └── Sistema calcula: Monto × Prorrateo de cada unidad
   └── Sin retención (Art. 17 N°3 LIR)

4. Aprobar Distribución
   └── Validación administrativa
   └── Registro contable automático

5. Generar Certificados de Renta (anual)
   └── Un certificado por copropietario
   └── Detalle de montos Art. 17 N°3
   └── Código de verificación
```

### 2.5 Certificado de Renta

El certificado incluye:
- Identificación del copropietario (RUT, nombre)
- Identificación de la comunidad
- Año tributario
- **Monto total percibido**
- **Monto Art. 17 N°3 (No Renta)** - Este es el monto que NO debe declarar
- Monto afecto a impuesto (si hubiera)
- Código de verificación único

### 2.6 Ejemplo Práctico

```
Comunidad: Edificio Las Torres
Ingreso anual por arriendo de azotea: $24.000.000
Total unidades: 100
Prorrateo Unidad 101: 1.5%

Distribución a Unidad 101:
  $24.000.000 × 1.5% = $360.000

Certificado de Renta 2025:
  - Renta Total: $360.000
  - Art. 17 N°3 (No Renta): $360.000
  - Afecto a Impuesto: $0

El copropietario de la Unidad 101 NO debe declarar
los $360.000 en su declaración de renta.
```

### 2.7 Documentación de Respaldo

DATAPOLIS genera y almacena:
1. Facturas de arriendo emitidas
2. Acuerdo de distribución (puede adjuntarse acta)
3. Cálculo detallado por unidad
4. Certificados de renta individuales
5. Log de auditoría de todo el proceso

---

## 3. Ley 19.628 / 21.719 - Protección de Datos

### 3.1 Resumen

La Ley 21.719 (2024) moderniza la Ley 19.628 sobre protección de la vida privada, introduciendo:
- Derechos ARCO+ (Acceso, Rectificación, Cancelación, Oposición, Portabilidad)
- Registro obligatorio de tratamientos
- Notificación de brechas de seguridad
- Sanciones más estrictas

### 3.2 Datos Personales en DATAPOLIS

| Categoría | Datos | Base Legal |
|-----------|-------|------------|
| Copropietarios | RUT, nombre, dirección, email, teléfono | Ejecución de contrato |
| Empleados | Datos laborales, AFP, Isapre, cuenta bancaria | Obligación legal |
| Arrendatarios | RUT empresa, contacto | Ejecución de contrato |
| Distribución | Montos, cuenta bancaria | Obligación legal (Ley 21.713) |

### 3.3 Principios Implementados

| Principio | Implementación |
|-----------|----------------|
| **Licitud** | Base legal documentada para cada tratamiento |
| **Finalidad** | Propósito específico definido |
| **Minimización** | Solo datos necesarios, justificados |
| **Exactitud** | Derechos ARCO para corrección |
| **Limitación** | Períodos de retención definidos |
| **Seguridad** | Encriptación, logs de auditoría |
| **Responsabilidad** | Registro de tratamientos |

### 3.4 Derechos ARCO+

**Acceso (Art. 4):** Titular puede conocer qué datos se tratan.
```
POST /api/privacidad/derecho-acceso
{
  "rut": "12.345.678-9",
  "email": "titular@email.com"
}
```

**Rectificación (Art. 5):** Corregir datos inexactos.
```
POST /api/privacidad/derecho-rectificacion
{
  "rut": "12.345.678-9",
  "datos_incorrectos": {"telefono": "912345678"},
  "datos_correctos": {"telefono": "987654321"}
}
```

**Cancelación (Art. 6):** Solicitar eliminación de datos.
```
POST /api/privacidad/derecho-cancelacion
{
  "rut": "12.345.678-9",
  "motivo": "Ya no soy copropietario"
}
```

**Oposición (Art. 7):** Oponerse a determinado tratamiento.

**Portabilidad (Art. 8):** Recibir datos en formato estructurado.
```
POST /api/privacidad/derecho-portabilidad
{
  "rut": "12.345.678-9",
  "formato_preferido": "json"  // json, csv, xml
}
```

### 3.5 Plazos de Respuesta

| Solicitud | Plazo Legal | Alerta en Sistema |
|-----------|-------------|-------------------|
| Cualquier derecho ARCO | 10 días hábiles | A partir del día 7 |
| Prórroga (casos complejos) | +10 días hábiles | Notificación al titular |

### 3.6 Notificación de Brechas (Art. 14 ter)

**Obligación:** Notificar a la Agencia de Protección de Datos dentro de **72 horas** si la brecha presenta riesgo para derechos y libertades.

**Proceso en DATAPOLIS:**
1. Detectar incidente
2. Registrar en módulo Brechas
3. Evaluar nivel de riesgo (bajo/medio/alto/crítico)
4. Si es alto/crítico → Alerta de 72 horas
5. Documentar medidas de contención
6. Notificar a titulares afectados si corresponde

### 3.7 Períodos de Retención

| Dato | Período | Base Legal |
|------|---------|------------|
| Copropietarios | 10 años | Prescripción tributaria |
| Empleados | 5 años post-término | Art. 510 Código Trabajo |
| Facturas/Boletas | 6 años | Documentos tributarios |
| Distribución | 6 años | Fiscalización SII |
| Actas reuniones | 5 años | Ley 21.442 |

---

## 4. Código del Trabajo

### 4.1 Obligaciones del Empleador

| Obligación | Frecuencia | Implementación |
|------------|------------|----------------|
| Liquidación de sueldo | Mensual | Módulo RRHH |
| Pago cotizaciones AFP | Mensual | Cálculo automático |
| Pago cotizaciones Salud | Mensual | Cálculo automático |
| Seguro Cesantía (AFC) | Mensual | Cálculo automático |
| Impuesto Único | Mensual | Tramos actualizados |
| Gratificación legal | Anual/Mensual | Tope 4.75 UTM |

### 4.2 Cálculo de Liquidación

```
HABERES
  Sueldo Base                    $ 800.000
  Gratificación Legal (4.75 UTM) $ 326.188
  Colación                       $  50.000
  Movilización                   $  40.000
  ─────────────────────────────────────────
  TOTAL HABERES                  $1.216.188

BASE IMPONIBLE (tope 81.6 UF)    $ 850.000

DESCUENTOS
  AFP Habitat (11.27%)           $  95.795
  Salud (7%)                     $  59.500
  Seguro Cesantía (0.6%)         $   5.100
  Impuesto Único                 $  12.345
  ─────────────────────────────────────────
  TOTAL DESCUENTOS               $ 172.740

SUELDO LÍQUIDO                   $1.043.448
```

### 4.3 Tramos Impuesto Único 2025

| Desde (UTM) | Hasta (UTM) | Tasa | Rebaja (UTM) |
|-------------|-------------|------|--------------|
| 0 | 13.5 | 0% | 0 |
| 13.5 | 30 | 4% | 0.54 |
| 30 | 50 | 8% | 1.74 |
| 50 | 70 | 13.5% | 4.49 |
| 70 | 90 | 23% | 11.14 |
| 90 | 120 | 30.4% | 17.80 |
| 120 | 310 | 35% | 23.32 |
| 310 | + | 40% | 38.82 |

### 4.4 Documentación Laboral

DATAPOLIS genera:
- Liquidaciones de sueldo mensuales (PDF)
- Certificados de antigüedad
- Certificados de renta (para bancos)
- Finiquitos

---

## 5. Obligaciones Tributarias

### 5.1 IVA en Arriendos

Los arriendos de espacios comunes a empresas **están afectos a IVA (19%)**.

```
Canon mensual: 100 UF
UF del día: $37.000
Neto: $3.700.000
IVA (19%): $703.000
Total: $4.403.000
```

### 5.2 Retención de Impuestos

**Distribución a copropietarios:** Sin retención (Art. 17 N°3 LIR)

**Honorarios a contratistas:** Retención 13% (2025)

### 5.3 Declaraciones

| Declaración | Frecuencia | Responsable |
|-------------|------------|-------------|
| F29 (IVA) | Mensual | Administrador |
| F22 (Renta anual) | Anual | Copropietarios individualmente |
| DJ 1887 (Renta pagada) | Anual | Administrador |
| Previred | Mensual | Administrador |

---

## 6. Checklist de Cumplimiento

### 6.1 Mensual

- [ ] Emitir boletas de gastos comunes
- [ ] Facturar arriendos
- [ ] Generar liquidaciones de sueldo
- [ ] Pagar cotizaciones previsionales
- [ ] Procesar distribución de ingresos (si corresponde)
- [ ] Responder solicitudes ARCO pendientes

### 6.2 Anual

- [ ] Asamblea Ordinaria (primer cuatrimestre)
- [ ] Balance y estado de resultados
- [ ] Certificados de renta (antes del 31 de marzo)
- [ ] Revisión de pólizas de seguro
- [ ] Actualización de indicadores (UF, UTM, tramos)

### 6.3 Extraordinario

- [ ] Actualizar reglamento (plazo: 9 enero 2026)
- [ ] Responder requerimientos SII
- [ ] Notificar brechas de seguridad (72 horas)
- [ ] Elección de Comité de Administración

---

## 7. Sanciones por Incumplimiento

### 7.1 Ley 21.442

| Infracción | Sanción |
|------------|---------|
| No mantener fondo de reserva | Multa 1-50 UTM |
| No realizar asambleas | Responsabilidad del administrador |
| No entregar información | Multa + responsabilidad civil |

### 7.2 Ley 21.719 (Datos)

| Infracción | Sanción |
|------------|---------|
| Leve | Amonestación o multa hasta 100 UTM |
| Grave | Multa 101-5.000 UTM |
| Gravísima | Multa 5.001-20.000 UTM |
| Reincidencia | Hasta el doble |

### 7.3 Código Tributario (Art. 97)

| Infracción | Sanción |
|------------|---------|
| Atraso declaración | Multa 10% + 2% mensual |
| No emisión de documentos | Multa 50%-500% del impuesto |
| Declaración incompleta | Multa 5%-20% de diferencia |

---

## 8. Recursos y Referencias

### 8.1 Normativa

- [Ley 21.442](https://www.bcn.cl/leychile/navegar?idNorma=1175332) - Copropiedad Inmobiliaria
- [DS 7/2025](https://www.bcn.cl/leychile/navegar?idNorma=XXX) - Reglamento Ley 21.442
- [Ley 21.713](https://www.bcn.cl/leychile/navegar?idNorma=1204567) - Distribución Ingresos
- [Ley 21.719](https://www.bcn.cl/leychile/navegar?idNorma=1209234) - Protección de Datos

### 8.2 Instituciones

- **SII:** www.sii.cl - Consultas tributarias
- **Dirección del Trabajo:** www.dt.gob.cl - Consultas laborales
- **Agencia Protección de Datos:** www.agenciapd.cl - Denuncias datos
- **MINVU:** www.minvu.cl - Consultas copropiedad

### 8.3 Contacto Soporte Legal

Para consultas específicas sobre cumplimiento:
- Email: legal@datapolis.cl
- Teléfono: +56 2 2XXX XXXX

---

*Manual de Cumplimiento Legal v2.5 - Diciembre 2025*  
*Este documento es orientativo y no constituye asesoría legal.*  
*© DATAPOLIS SpA*
