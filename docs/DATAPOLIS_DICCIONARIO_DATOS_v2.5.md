# DATAPOLIS PRO - Diccionario de Datos

**Versión:** 1.1  
**Fecha:** Diciembre 2025  
**Total Tablas:** ~85

---

## Índice de Tablas

1. [Core/Sistema](#1-coresistema)
2. [Edificios y Unidades](#2-edificios-y-unidades)
3. [Gastos Comunes](#3-gastos-comunes)
4. [Arriendos](#4-arriendos)
5. [Distribución](#5-distribución)
6. [RRHH](#6-rrhh)
7. [Contabilidad](#7-contabilidad)
8. [Reuniones](#8-reuniones)
9. [Legal](#9-legal)
10. [Protección de Datos](#10-protección-de-datos)

---

## 1. Core/Sistema

### 1.1 `tenants`
Organizaciones/clientes del sistema (multi-tenancy).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| nombre | VARCHAR(200) | Nombre de la organización |
| rut | VARCHAR(12) | RUT de la organización |
| plan | ENUM | free, basico, profesional, enterprise |
| activo | BOOLEAN | Estado del tenant |
| config | JSON | Configuraciones específicas |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 1.2 `users`
Usuarios del sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| name | VARCHAR(255) | Nombre completo |
| email | VARCHAR(255) UNIQUE | Email (login) |
| password | VARCHAR(255) | Contraseña hasheada (bcrypt) |
| activo | BOOLEAN | Estado del usuario |
| ultimo_login | TIMESTAMP | Última conexión |
| email_verified_at | TIMESTAMP | Verificación de email |
| remember_token | VARCHAR(100) | Token "recordarme" |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 1.3 `personas`
Personas naturales o jurídicas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| tipo | ENUM | natural, juridica |
| rut | VARCHAR(12) | RUT chileno |
| nombre | VARCHAR(100) | Nombre o razón social |
| apellido_paterno | VARCHAR(100) | Apellido paterno (personas naturales) |
| apellido_materno | VARCHAR(100) | Apellido materno |
| nombre_completo | VARCHAR(255) | Nombre completo calculado |
| sexo | CHAR(1) | M, F, null |
| fecha_nacimiento | DATE | Fecha de nacimiento |
| nacionalidad | VARCHAR(50) | País de nacionalidad |
| direccion | VARCHAR(255) | Dirección |
| comuna | VARCHAR(100) | Comuna |
| ciudad | VARCHAR(100) | Ciudad |
| region | VARCHAR(100) | Región |
| telefono | VARCHAR(20) | Teléfono |
| email | VARCHAR(255) | Email |
| activo | BOOLEAN | Estado |
| acepta_politica_privacidad | BOOLEAN | Aceptación política datos |
| fecha_aceptacion_politica | TIMESTAMP | Fecha aceptación |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Soft delete |

### 1.4 `roles`
Roles del sistema (Spatie Permission).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| name | VARCHAR(255) | Nombre del rol |
| guard_name | VARCHAR(255) | Guard (web, api) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 1.5 `permissions`
Permisos del sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| name | VARCHAR(255) | Nombre del permiso |
| guard_name | VARCHAR(255) | Guard |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

---

## 2. Edificios y Unidades

### 2.1 `edificios`
Comunidades, condominios y edificios.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| nombre | VARCHAR(200) | Nombre del edificio |
| rut | VARCHAR(12) | RUT de la comunidad |
| direccion | VARCHAR(255) | Dirección |
| numero | VARCHAR(20) | Número de calle |
| comuna | VARCHAR(100) | Comuna |
| ciudad | VARCHAR(100) | Ciudad |
| region | VARCHAR(100) | Región |
| tipo | ENUM | condominio, comunidad, edificio |
| total_unidades | INT | Cantidad de unidades |
| total_pisos | INT | Cantidad de pisos |
| anio_construccion | YEAR | Año de construcción |
| administrador_id | BIGINT FK | Persona administrador |
| telefono | VARCHAR(20) | Teléfono contacto |
| email | VARCHAR(255) | Email contacto |
| activo | BOOLEAN | Estado |
| config | JSON | Configuraciones específicas |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Soft delete |

### 2.2 `unidades`
Departamentos, locales, bodegas, estacionamientos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| edificio_id | BIGINT FK | Referencia a edificio |
| numero | VARCHAR(20) | Número/identificador |
| tipo | ENUM | departamento, local, bodega, estacionamiento, oficina |
| piso | INT | Número de piso |
| metros_cuadrados | DECIMAL(10,2) | Superficie en m² |
| metros_terraza | DECIMAL(10,2) | Superficie terraza |
| prorrateo | DECIMAL(8,6) | % participación (ej: 0.025000 = 2.5%) |
| rol_avaluo | VARCHAR(20) | Rol de avalúo SII |
| destino | ENUM | habitacional, comercial, mixto |
| dormitorios | INT | Cantidad de dormitorios |
| banos | INT | Cantidad de baños |
| estacionamientos | INT | Estacionamientos asignados |
| bodegas | INT | Bodegas asignadas |
| activo | BOOLEAN | Estado |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 2.3 `copropietarios`
Relación entre personas y unidades.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| unidad_id | BIGINT FK | Referencia a unidad |
| persona_id | BIGINT FK | Referencia a persona |
| tipo | ENUM | propietario, arrendatario, residente |
| porcentaje_propiedad | DECIMAL(5,2) | % de propiedad (default 100) |
| fecha_inicio | DATE | Inicio de la relación |
| fecha_termino | DATE | Fin de la relación |
| principal | BOOLEAN | Es el contacto principal |
| recibe_correspondencia | BOOLEAN | Recibe comunicaciones |
| activo | BOOLEAN | Estado |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

---

## 3. Gastos Comunes

### 3.1 `periodos_gc`
Períodos de gastos comunes (mensual).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| edificio_id | BIGINT FK | Referencia a edificio |
| mes | TINYINT | Mes (1-12) |
| anio | SMALLINT | Año |
| fecha_emision | DATE | Fecha de emisión |
| fecha_vencimiento | DATE | Fecha de vencimiento |
| total_gastos | DECIMAL(15,2) | Total gastos del período |
| total_fondo_reserva | DECIMAL(15,2) | 5% fondo reserva |
| estado | ENUM | borrador, emitido, cerrado |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 3.2 `boletas_gc`
Boletas de gastos comunes por unidad.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| periodo_id | BIGINT FK | Referencia a período |
| unidad_id | BIGINT FK | Referencia a unidad |
| numero_boleta | VARCHAR(20) | Número correlativo |
| mes | TINYINT | Mes |
| anio | SMALLINT | Año |
| fecha_emision | DATE | Fecha de emisión |
| fecha_vencimiento | DATE | Fecha de vencimiento |
| total_gastos_comunes | DECIMAL(12,2) | Gastos comunes calculados |
| total_fondo_reserva | DECIMAL(12,2) | Fondo de reserva |
| saldo_anterior | DECIMAL(12,2) | Deuda anterior |
| total_intereses | DECIMAL(12,2) | Intereses por mora |
| total_otros_cargos | DECIMAL(12,2) | Otros cargos |
| total_descuentos | DECIMAL(12,2) | Descuentos aplicados |
| subtotal | DECIMAL(12,2) | Subtotal |
| total_a_pagar | DECIMAL(12,2) | Total final |
| total_pagado | DECIMAL(12,2) | Monto pagado |
| saldo_pendiente | DECIMAL(12,2) | Saldo por pagar |
| estado | ENUM | pendiente, parcial, pagada, anulada |
| observaciones | TEXT | Notas |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 3.3 `cargos_boleta_gc`
Detalle de cargos por boleta.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| boleta_id | BIGINT FK | Referencia a boleta |
| concepto_id | BIGINT FK | Referencia a concepto |
| descripcion | VARCHAR(255) | Descripción del cargo |
| monto | DECIMAL(12,2) | Monto del cargo |
| tipo | ENUM | gasto_comun, fondo_reserva, multa, interes, otro |
| created_at | TIMESTAMP | Fecha de creación |

### 3.4 `pagos_gc`
Pagos recibidos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| boleta_id | BIGINT FK | Referencia a boleta |
| fecha_pago | DATETIME | Fecha y hora del pago |
| monto | DECIMAL(12,2) | Monto pagado |
| medio_pago | ENUM | efectivo, transferencia, cheque, tarjeta, pac, webpay |
| numero_documento | VARCHAR(50) | N° comprobante |
| banco | VARCHAR(100) | Banco origen |
| observaciones | TEXT | Notas |
| registrado_por | BIGINT FK | Usuario que registró |
| anulado | BOOLEAN | Si fue anulado |
| fecha_anulacion | TIMESTAMP | Fecha de anulación |
| motivo_anulacion | VARCHAR(255) | Motivo de anulación |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 3.5 `conceptos_gasto`
Catálogo de conceptos de gasto.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| edificio_id | BIGINT FK | Referencia a edificio |
| codigo | VARCHAR(20) | Código del concepto |
| nombre | VARCHAR(100) | Nombre |
| descripcion | TEXT | Descripción |
| tipo | ENUM | fijo, variable, extraordinario |
| monto_fijo | DECIMAL(12,2) | Monto si es fijo |
| cuenta_contable_id | BIGINT FK | Cuenta contable asociada |
| activo | BOOLEAN | Estado |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

---

## 4. Arriendos

### 4.1 `arrendatarios`
Empresas arrendatarias (telecoms).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| rut | VARCHAR(12) | RUT empresa |
| razon_social | VARCHAR(200) | Razón social |
| giro | VARCHAR(200) | Giro comercial |
| direccion | VARCHAR(255) | Dirección |
| comuna | VARCHAR(100) | Comuna |
| ciudad | VARCHAR(100) | Ciudad |
| contacto_nombre | VARCHAR(100) | Nombre contacto |
| contacto_email | VARCHAR(255) | Email contacto |
| contacto_telefono | VARCHAR(20) | Teléfono contacto |
| activo | BOOLEAN | Estado |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 4.2 `contratos_arriendo`
Contratos de arriendo de espacios comunes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| edificio_id | BIGINT FK | Referencia a edificio |
| arrendatario_id | BIGINT FK | Referencia a arrendatario |
| numero_contrato | VARCHAR(30) | Número de contrato |
| tipo_espacio | ENUM | azotea, fachada, subterraneo, sala_tecnica, terreno |
| descripcion_espacio | TEXT | Descripción del espacio |
| metros_cuadrados | DECIMAL(10,2) | Superficie arrendada |
| canon_mensual_uf | DECIMAL(10,4) | Canon en UF |
| fecha_inicio | DATE | Inicio del contrato |
| fecha_termino | DATE | Término del contrato |
| duracion_meses | INT | Duración en meses |
| renovacion_automatica | BOOLEAN | Renovación automática |
| meses_aviso_termino | INT | Meses de aviso para no renovar |
| tipo_reajuste | ENUM | ipc, uf, fijo, ninguno |
| periodicidad_reajuste | ENUM | mensual, trimestral, semestral, anual |
| garantia_uf | DECIMAL(10,4) | Garantía en UF |
| dia_facturacion | TINYINT | Día del mes para facturar |
| estado | ENUM | borrador, activo, vencido, terminado |
| observaciones | TEXT | Notas |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Soft delete |

### 4.3 `facturas_arriendo`
Facturas emitidas a arrendatarios.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| contrato_id | BIGINT FK | Referencia a contrato |
| numero_factura | VARCHAR(30) | Número de factura |
| fecha_emision | DATE | Fecha de emisión |
| fecha_vencimiento | DATE | Fecha de vencimiento |
| mes | TINYINT | Mes facturado |
| anio | SMALLINT | Año facturado |
| uf_valor | DECIMAL(10,4) | Valor UF del día |
| canon_uf | DECIMAL(10,4) | Canon en UF |
| canon_pesos | DECIMAL(15,2) | Canon en pesos |
| neto | DECIMAL(15,2) | Monto neto |
| iva | DECIMAL(15,2) | IVA (19%) |
| total | DECIMAL(15,2) | Total con IVA |
| estado | ENUM | emitida, pagada, vencida, anulada |
| fecha_pago | DATE | Fecha de pago |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

---

## 5. Distribución

### 5.1 `distribuciones`
Distribución de ingresos a copropietarios.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| edificio_id | BIGINT FK | Referencia a edificio |
| mes | TINYINT | Mes |
| anio | SMALLINT | Año |
| monto_total | DECIMAL(15,2) | Monto total a distribuir |
| fuente | ENUM | arriendos, otros, mixto |
| descripcion | TEXT | Descripción de la fuente |
| estado | ENUM | borrador, procesada, aprobada, pagada |
| fecha_aprobacion | DATE | Fecha de aprobación |
| aprobado_por | BIGINT FK | Usuario que aprobó |
| observaciones | TEXT | Notas |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 5.2 `distribucion_detalles`
Detalle por unidad de cada distribución.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| distribucion_id | BIGINT FK | Referencia a distribución |
| unidad_id | BIGINT FK | Referencia a unidad |
| persona_id | BIGINT FK | Beneficiario |
| prorrateo | DECIMAL(8,6) | % de participación |
| monto_bruto | DECIMAL(12,2) | Monto antes de retención |
| retencion | DECIMAL(12,2) | Retención (generalmente 0 por Art. 17 N°3) |
| monto_neto | DECIMAL(12,2) | Monto a pagar |
| pagado | BOOLEAN | Si fue pagado |
| fecha_pago | DATE | Fecha de pago |
| created_at | TIMESTAMP | Fecha de creación |

### 5.3 `certificados_renta`
Certificados anuales de renta.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| edificio_id | BIGINT FK | Referencia a edificio |
| unidad_id | BIGINT FK | Referencia a unidad |
| persona_id | BIGINT FK | Beneficiario |
| anio | SMALLINT | Año tributario |
| numero_certificado | VARCHAR(30) | Número correlativo |
| renta_total | DECIMAL(15,2) | Total percibido |
| renta_articulo_17 | DECIMAL(15,2) | Monto Art. 17 N°3 (no renta) |
| renta_articulo_20 | DECIMAL(15,2) | Monto afecto a impuesto |
| retenciones | DECIMAL(15,2) | Retenciones efectuadas |
| codigo_verificacion | VARCHAR(20) | Código para verificación |
| fecha_emision | DATE | Fecha de emisión |
| created_at | TIMESTAMP | Fecha de creación |

---

## 6. RRHH

### 6.1 `empleados`
Empleados de la comunidad.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| persona_id | BIGINT FK | Referencia a persona |
| edificio_id | BIGINT FK | Edificio donde trabaja |
| codigo_empleado | VARCHAR(20) | Código interno |
| rut | VARCHAR(12) | RUT |
| nombres | VARCHAR(100) | Nombres |
| apellido_paterno | VARCHAR(100) | Apellido paterno |
| apellido_materno | VARCHAR(100) | Apellido materno |
| fecha_nacimiento | DATE | Fecha de nacimiento |
| sexo | CHAR(1) | M, F |
| estado_civil | ENUM | soltero, casado, viudo, divorciado |
| direccion | VARCHAR(255) | Dirección |
| comuna | VARCHAR(100) | Comuna |
| telefono | VARCHAR(20) | Teléfono |
| email | VARCHAR(255) | Email |
| fecha_ingreso | DATE | Fecha de contratación |
| fecha_termino | DATE | Fecha de término |
| tipo_contrato | ENUM | indefinido, plazo_fijo, por_obra, honorarios |
| cargo | VARCHAR(100) | Cargo |
| departamento | VARCHAR(100) | Departamento |
| jornada | ENUM | completa, parcial, articulo_22 |
| horas_semanales | INT | Horas contratadas |
| sueldo_base | DECIMAL(12,2) | Sueldo base mensual |
| afp_id | BIGINT FK | AFP |
| salud_id | BIGINT FK | Isapre/FONASA |
| plan_salud_uf | DECIMAL(6,2) | Plan de salud en UF |
| banco_id | BIGINT FK | Banco para pago |
| tipo_cuenta | ENUM | corriente, vista, ahorro |
| numero_cuenta | VARCHAR(30) | Número de cuenta |
| cargas_familiares | INT | Cantidad de cargas |
| estado | ENUM | activo, licencia, vacaciones, desvinculado |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| deleted_at | TIMESTAMP | Soft delete |

### 6.2 `liquidaciones`
Liquidaciones de sueldo mensuales.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| empleado_id | BIGINT FK | Referencia a empleado |
| mes | TINYINT | Mes |
| anio | SMALLINT | Año |
| dias_trabajados | INT | Días trabajados |
| sueldo_base | DECIMAL(12,2) | Sueldo base |
| gratificacion | DECIMAL(12,2) | Gratificación legal |
| asignacion_colacion | DECIMAL(12,2) | Colación |
| asignacion_movilizacion | DECIMAL(12,2) | Movilización |
| bono_antiguedad | DECIMAL(12,2) | Bono por antigüedad |
| horas_extras_50 | DECIMAL(6,2) | Horas extras 50% |
| monto_horas_extras_50 | DECIMAL(12,2) | Monto HE 50% |
| horas_extras_100 | DECIMAL(6,2) | Horas extras 100% |
| monto_horas_extras_100 | DECIMAL(12,2) | Monto HE 100% |
| otros_haberes | DECIMAL(12,2) | Otros ingresos |
| total_haberes | DECIMAL(12,2) | **Total haberes** |
| base_imponible | DECIMAL(12,2) | Base para cotizaciones |
| afp | DECIMAL(12,2) | Descuento AFP |
| afp_tasa | DECIMAL(5,2) | Tasa AFP usada |
| salud | DECIMAL(12,2) | Descuento salud |
| salud_tasa | DECIMAL(5,2) | Tasa salud usada |
| seguro_cesantia | DECIMAL(12,2) | AFC (0.6%) |
| impuesto_unico | DECIMAL(12,2) | Impuesto único |
| otros_descuentos | DECIMAL(12,2) | Otros descuentos |
| total_descuentos | DECIMAL(12,2) | **Total descuentos** |
| sueldo_liquido | DECIMAL(12,2) | **Líquido a pagar** |
| uf_valor | DECIMAL(10,4) | UF del período |
| utm_valor | DECIMAL(10,2) | UTM del período |
| tope_imponible | DECIMAL(12,2) | Tope imponible usado |
| estado | ENUM | borrador, aprobada, pagada |
| fecha_pago | DATE | Fecha de pago |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 6.3 `afp`
Administradoras de Fondos de Pensiones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| nombre | VARCHAR(50) | Nombre AFP |
| codigo_previred | VARCHAR(10) | Código Previred |
| tasa_trabajador | DECIMAL(5,2) | Tasa cotización obligatoria |
| tasa_sis | DECIMAL(5,2) | Tasa SIS |
| comision | DECIMAL(5,2) | Comisión |
| activo | BOOLEAN | Estado |

### 6.4 `isapres`
Instituciones de Salud Previsional.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| nombre | VARCHAR(100) | Nombre Isapre |
| codigo_previred | VARCHAR(10) | Código Previred |
| tipo | ENUM | isapre, fonasa |
| tasa_legal | DECIMAL(5,2) | Tasa legal (7%) |
| activo | BOOLEAN | Estado |

### 6.5 `tramos_impuesto_unico`
Tramos de impuesto único a la renta.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| anio | SMALLINT | Año de vigencia |
| desde_utm | DECIMAL(10,4) | Desde (en UTM) |
| hasta_utm | DECIMAL(10,4) | Hasta (en UTM) |
| tasa | DECIMAL(5,2) | Tasa del tramo |
| rebaja_utm | DECIMAL(10,4) | Rebaja (en UTM) |

---

## 7. Contabilidad

### 7.1 `plan_cuentas`
Plan de cuentas contable.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| codigo | VARCHAR(20) | Código de la cuenta |
| nombre | VARCHAR(200) | Nombre de la cuenta |
| tipo | ENUM | activo, pasivo, patrimonio, ingreso, gasto, resultado |
| naturaleza | ENUM | deudor, acreedor |
| nivel | TINYINT | Nivel jerárquico (1-5) |
| padre_id | BIGINT FK | Cuenta padre |
| acepta_movimientos | BOOLEAN | Si permite asientos |
| activo | BOOLEAN | Estado |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 7.2 `asientos`
Asientos contables.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| edificio_id | BIGINT FK | Referencia a edificio |
| numero | INT | Número correlativo |
| fecha | DATE | Fecha del asiento |
| glosa | VARCHAR(255) | Descripción |
| tipo | ENUM | apertura, diario, ajuste, cierre |
| total_debe | DECIMAL(15,2) | Total columna debe |
| total_haber | DECIMAL(15,2) | Total columna haber |
| estado | ENUM | borrador, contabilizado, anulado |
| origen | ENUM | manual, gastos_comunes, arriendos, rrhh, sistema |
| documento_origen_id | BIGINT | ID documento que lo generó |
| created_by | BIGINT FK | Usuario que creó |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 7.3 `asiento_lineas`
Líneas de cada asiento.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| asiento_id | BIGINT FK | Referencia a asiento |
| cuenta_id | BIGINT FK | Referencia a cuenta |
| debe | DECIMAL(15,2) | Monto al debe |
| haber | DECIMAL(15,2) | Monto al haber |
| glosa | VARCHAR(255) | Detalle de la línea |
| centro_costo | VARCHAR(50) | Centro de costo |
| created_at | TIMESTAMP | Fecha de creación |

---

## 8. Reuniones

### 8.1 `reuniones`
Asambleas y reuniones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| edificio_id | BIGINT FK | Referencia a edificio |
| uuid | UUID | Identificador público |
| titulo | VARCHAR(255) | Título de la reunión |
| descripcion | TEXT | Descripción |
| tipo | ENUM | asamblea_ordinaria, asamblea_extraordinaria, comite_administracion, informativa |
| modalidad | ENUM | presencial, telematica, mixta |
| fecha_inicio | DATETIME | Fecha y hora de inicio |
| fecha_fin | DATETIME | Fecha y hora de término |
| duracion_minutos | INT | Duración estimada |
| lugar | VARCHAR(255) | Lugar (presencial) |
| sala_url | VARCHAR(500) | URL sala virtual |
| orden_del_dia | TEXT | Tabla de materias |
| quorum_requerido | DECIMAL(5,2) | % quórum necesario |
| quorum_alcanzado | DECIMAL(5,2) | % quórum logrado |
| estado | ENUM | borrador, convocada, en_curso, finalizada, cancelada |
| convocada_por | BIGINT FK | Usuario que convocó |
| fecha_convocatoria | DATETIME | Fecha de convocatoria |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 8.2 `reunion_asistentes`
Asistentes a reuniones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| reunion_id | BIGINT FK | Referencia a reunión |
| persona_id | BIGINT FK | Referencia a persona |
| unidad_id | BIGINT FK | Unidad que representa |
| prorrateo | DECIMAL(8,6) | % de la unidad |
| tipo_asistencia | ENUM | presencial, virtual, poder |
| poder_otorgado_por | BIGINT FK | Si asiste con poder |
| hora_ingreso | DATETIME | Hora de conexión/ingreso |
| hora_salida | DATETIME | Hora de salida |
| presente | BOOLEAN | Si asistió |
| created_at | TIMESTAMP | Fecha de creación |

### 8.3 `votaciones`
Votaciones en reuniones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| reunion_id | BIGINT FK | Referencia a reunión |
| titulo | VARCHAR(255) | Tema a votar |
| descripcion | TEXT | Descripción |
| tipo | ENUM | si_no, opcion_multiple |
| opciones | JSON | Opciones si es múltiple |
| quorum_requerido | DECIMAL(5,2) | % necesario para aprobar |
| estado | ENUM | pendiente, abierta, cerrada |
| resultado | JSON | Resultados |
| aprobada | BOOLEAN | Si fue aprobada |
| fecha_inicio | DATETIME | Inicio de votación |
| fecha_cierre | DATETIME | Cierre de votación |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 8.4 `votos`
Votos emitidos (ponderados, secretos).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| votacion_id | BIGINT FK | Referencia a votación |
| asistente_id | BIGINT FK | Quién votó |
| opcion | VARCHAR(50) | Opción elegida |
| ponderacion | DECIMAL(8,6) | Peso del voto (prorrateo) |
| hash_voto | VARCHAR(64) | Hash para verificación |
| created_at | TIMESTAMP | Fecha del voto |

### 8.5 `actas`
Actas de reuniones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| reunion_id | BIGINT FK | Referencia a reunión |
| numero_acta | VARCHAR(30) | Número correlativo |
| contenido | LONGTEXT | Contenido del acta |
| acuerdos | JSON | Lista de acuerdos |
| asistentes_count | INT | Cantidad de asistentes |
| quorum_porcentaje | DECIMAL(5,2) | Quórum alcanzado |
| fecha_generacion | DATETIME | Fecha de generación |
| firmada | BOOLEAN | Si fue firmada |
| created_at | TIMESTAMP | Fecha de creación |

---

## 9. Legal

### 9.1 `oficios`
Oficios a instituciones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| edificio_id | BIGINT FK | Referencia a edificio |
| numero_oficio | VARCHAR(30) | Número correlativo |
| tipo | ENUM | consulta, reclamo, denuncia, solicitud, fiscalizacion |
| institucion | ENUM | sii, dt, sec, minvu, sernac, jpl, otro |
| institucion_nombre | VARCHAR(200) | Nombre institución |
| asunto | VARCHAR(255) | Asunto |
| contenido | LONGTEXT | Contenido del oficio |
| fecha | DATE | Fecha del oficio |
| estado | ENUM | borrador, enviado, respondido, archivado |
| respuesta | LONGTEXT | Respuesta recibida |
| fecha_respuesta | DATE | Fecha de respuesta |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 9.2 `certificados_cumplimiento`
Certificados de cumplimiento emitidos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| edificio_id | BIGINT FK | Referencia a edificio |
| numero_certificado | VARCHAR(30) | Número correlativo |
| tipo | ENUM | general, tributario, ley_21442, transparencia, deuda |
| fecha_emision | DATE | Fecha de emisión |
| fecha_validez | DATE | Válido hasta |
| codigo_verificacion | VARCHAR(20) | Código único verificación |
| contenido | JSON | Datos del certificado |
| created_at | TIMESTAMP | Fecha de creación |

---

## 10. Protección de Datos

### 10.1 `registro_tratamiento_datos`
Registro de actividades de tratamiento (Art. 14 bis Ley 21.719).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| nombre_tratamiento | VARCHAR(200) | Nombre del tratamiento |
| descripcion | TEXT | Descripción |
| categoria_datos | ENUM | identificacion, contacto, financieros, laborales, salud, biometricos, ubicacion, comportamiento |
| datos_sensibles | BOOLEAN | Si incluye datos sensibles |
| base_legal | ENUM | consentimiento, ejecucion_contrato, obligacion_legal, interes_vital, interes_publico, interes_legitimo |
| justificacion_base_legal | TEXT | Justificación |
| finalidad_tratamiento | TEXT | Propósito |
| usos_permitidos | JSON | Lista de usos |
| campos_recolectados | JSON | Campos que se recolectan |
| periodo_retencion_meses | INT | Período de conservación |
| accion_post_retencion | ENUM | eliminacion, anonimizacion, archivo |
| transferencia_terceros | BOOLEAN | Si se transfiere |
| destinatarios_transferencia | JSON | A quiénes se transfiere |
| transferencia_internacional | BOOLEAN | Si hay transferencia internacional |
| medidas_seguridad | JSON | Medidas implementadas |
| estado | ENUM | activo, suspendido, eliminado |
| proxima_revision | DATE | Fecha próxima revisión |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 10.2 `consentimientos_datos`
Registro de consentimientos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| persona_id | BIGINT FK | Titular del dato |
| tratamiento_id | BIGINT FK | Tratamiento relacionado |
| tipo | ENUM | general, marketing, compartir_terceros, datos_sensibles, perfilamiento, internacional |
| otorgado | BOOLEAN | Si fue otorgado |
| fecha_otorgamiento | TIMESTAMP | Fecha de otorgamiento |
| fecha_revocacion | TIMESTAMP | Fecha de revocación |
| ip_otorgamiento | VARCHAR(45) | IP desde donde se otorgó |
| user_agent | VARCHAR(500) | Navegador/dispositivo |
| texto_consentimiento | TEXT | Texto mostrado |
| version_politica | VARCHAR(20) | Versión de política aceptada |
| metodo_obtencion | VARCHAR(50) | Cómo se obtuvo |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 10.3 `solicitudes_derechos_datos`
Solicitudes de derechos ARCO+.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| numero_solicitud | VARCHAR(20) UNIQUE | Número de seguimiento |
| persona_id | BIGINT FK | Titular (si existe en sistema) |
| nombre_solicitante | VARCHAR(200) | Nombre del solicitante |
| rut_solicitante | VARCHAR(12) | RUT |
| email_solicitante | VARCHAR(255) | Email |
| telefono_solicitante | VARCHAR(20) | Teléfono |
| tipo_derecho | ENUM | acceso, rectificacion, cancelacion, oposicion, portabilidad, limitacion, no_decision_auto |
| descripcion_solicitud | TEXT | Detalle de la solicitud |
| datos_afectados | JSON | Datos específicos |
| motivo | TEXT | Motivo de la solicitud |
| identidad_verificada | BOOLEAN | Si se verificó identidad |
| estado | ENUM | recibida, en_verificacion, en_proceso, requiere_info, aprobada, rechazada, completada |
| fecha_recepcion | TIMESTAMP | Fecha de recepción |
| fecha_limite_respuesta | TIMESTAMP | Plazo legal (10 días hábiles) |
| fecha_respuesta | TIMESTAMP | Fecha de respuesta |
| respuesta | TEXT | Respuesta dada |
| motivo_rechazo | VARCHAR(255) | Motivo si rechazada |
| acciones_realizadas | JSON | Acciones ejecutadas |
| atendido_por | BIGINT FK | Usuario que atendió |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 10.4 `log_acceso_datos_personales`
Log de auditoría de acceso a datos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| user_id | BIGINT FK | Usuario que accedió |
| tabla_accedida | VARCHAR(100) | Tabla accedida |
| registro_id | BIGINT | ID del registro |
| persona_afectada_id | BIGINT FK | Persona cuyos datos se accedieron |
| campos_accedidos | JSON | Campos específicos |
| operacion | ENUM | lectura, creacion, actualizacion, eliminacion, exportacion, impresion, envio_email, consulta_masiva |
| motivo | VARCHAR(200) | Motivo del acceso |
| ip_address | VARCHAR(45) | IP |
| user_agent | VARCHAR(500) | Navegador |
| endpoint | VARCHAR(200) | Endpoint accedido |
| exitoso | BOOLEAN | Si fue exitoso |
| error | VARCHAR(255) | Error si falló |
| created_at | TIMESTAMP | Fecha del acceso |

### 10.5 `brechas_seguridad_datos`
Registro de brechas de seguridad.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| numero_incidente | VARCHAR(20) UNIQUE | Número de incidente |
| fecha_deteccion | TIMESTAMP | Cuándo se detectó |
| fecha_ocurrencia | TIMESTAMP | Cuándo ocurrió |
| descripcion | TEXT | Descripción |
| tipo_brecha | ENUM | acceso_no_autorizado, perdida_datos, robo_datos, divulgacion_accidental, ataque_cibernetico, error_humano, falla_sistema |
| tipos_datos_afectados | JSON | Qué datos se vieron afectados |
| cantidad_registros_afectados | INT | Cuántos registros |
| cantidad_titulares_afectados | INT | Cuántas personas |
| datos_sensibles_afectados | BOOLEAN | Si afectó datos sensibles |
| nivel_riesgo | ENUM | bajo, medio, alto, critico |
| evaluacion_impacto | TEXT | Evaluación del impacto |
| riesgo_derechos_libertades | BOOLEAN | Si hay riesgo a derechos |
| medidas_contencion | JSON | Acciones de contención |
| medidas_correctivas | JSON | Acciones correctivas |
| fecha_contencion | TIMESTAMP | Cuándo se contuvo |
| notificado_agencia | BOOLEAN | Si se notificó a la Agencia |
| fecha_notificacion_agencia | TIMESTAMP | Cuándo se notificó |
| numero_caso_agencia | VARCHAR(50) | N° caso en Agencia |
| notificado_titulares | BOOLEAN | Si se notificó a afectados |
| fecha_notificacion_titulares | TIMESTAMP | Cuándo se notificó |
| estado | ENUM | detectada, en_investigacion, contenida, notificada, resuelta, cerrada |
| detectado_por | BIGINT FK | Quién detectó |
| responsable_gestion | BIGINT FK | Responsable de gestionar |
| lecciones_aprendidas | TEXT | Lecciones aprendidas |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 10.6 `politicas_privacidad`
Versiones de políticas de privacidad.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT PK | Identificador único |
| tenant_id | BIGINT FK | Referencia a tenant |
| version | VARCHAR(20) | Versión (ej: 1.0, 1.1) |
| titulo | VARCHAR(200) | Título |
| contenido_html | LONGTEXT | Contenido HTML |
| contenido_texto | LONGTEXT | Contenido texto plano |
| cambios_desde_anterior | JSON | Cambios desde versión anterior |
| resumen_cambios | TEXT | Resumen de cambios |
| fecha_vigencia | TIMESTAMP | Desde cuándo aplica |
| fecha_fin_vigencia | TIMESTAMP | Hasta cuándo aplicó |
| vigente | BOOLEAN | Si es la versión actual |
| requiere_nuevo_consentimiento | BOOLEAN | Si requiere re-aceptación |
| creado_por | BIGINT FK | Quién la creó |
| aprobado_por | BIGINT FK | Quién la aprobó |
| fecha_aprobacion | TIMESTAMP | Cuándo se aprobó |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

---

*Diccionario de Datos v2.5 - Diciembre 2025*  
*Total: ~85 tablas documentadas*  
*© DATAPOLIS SpA*
