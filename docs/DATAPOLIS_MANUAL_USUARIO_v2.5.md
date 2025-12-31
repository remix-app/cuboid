# DATAPOLIS PRO - Manual de Usuario
## Sistema de Gestión Integral para Comunidades y Condominios

**Versión:** 1.1  
**Fecha:** Diciembre 2025

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Acceso al Sistema](#2-acceso-al-sistema)
3. [Dashboard](#3-dashboard)
4. [Gestión de Edificios](#4-gestión-de-edificios)
5. [Gastos Comunes](#5-gastos-comunes)
6. [Arriendos](#6-arriendos)
7. [Distribución de Ingresos](#7-distribución-de-ingresos)
8. [Recursos Humanos](#8-recursos-humanos)
9. [Contabilidad](#9-contabilidad)
10. [Reuniones y Asambleas](#10-reuniones-y-asambleas)
11. [Asistente Legal](#11-asistente-legal)
12. [Protección de Datos](#12-protección-de-datos)
13. [Reportes](#13-reportes)
14. [Configuración](#14-configuración)
15. [Preguntas Frecuentes](#15-preguntas-frecuentes)

---

## 1. Introducción

### 1.1 ¿Qué es DATAPOLIS PRO?

DATAPOLIS PRO es un sistema integral para la administración de comunidades y condominios en Chile. Permite gestionar:

- **Gastos Comunes:** Emisión de boletas, registro de pagos, control de morosidad
- **Arriendos:** Contratos con empresas de telecomunicaciones (antenas)
- **Distribución:** Reparto de ingresos a copropietarios según Ley 21.713
- **RRHH:** Liquidaciones de sueldo, contratos de empleados
- **Contabilidad:** Plan de cuentas, asientos, balances
- **Reuniones:** Asambleas telemáticas con votaciones electrónicas
- **Cumplimiento Legal:** Ley 21.442, Ley 21.713, Ley 21.719

### 1.2 Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet
- Credenciales de acceso proporcionadas por el administrador

### 1.3 Soporte

- **Email:** soporte@datapolis.cl
- **Teléfono:** +56 2 2XXX XXXX
- **Horario:** Lunes a Viernes, 9:00 - 18:00

---

## 2. Acceso al Sistema

### 2.1 Iniciar Sesión

1. Abra su navegador y vaya a la dirección proporcionada
2. Ingrese su **email** y **contraseña**
3. Haga clic en **"Iniciar Sesión"**

![Login](./images/login.png)

### 2.2 Recuperar Contraseña

1. En la pantalla de login, haga clic en **"¿Olvidó su contraseña?"**
2. Ingrese su email registrado
3. Recibirá un enlace para restablecer su contraseña

### 2.3 Cerrar Sesión

1. Haga clic en su nombre en la esquina superior derecha
2. Seleccione **"Cerrar Sesión"**

---

## 3. Dashboard

El Dashboard es la pantalla principal que muestra un resumen de la situación actual.

### 3.1 Indicadores Principales

| Indicador | Descripción |
|-----------|-------------|
| **Unidades** | Total de unidades registradas |
| **Recaudación Mes** | Total recaudado en el mes actual |
| **Morosidad Total** | Suma de deudas pendientes |
| **Contratos Activos** | Contratos de arriendo vigentes |

### 3.2 Gráficos

- **Ingresos Últimos 6 Meses:** Comparativo entre gastos comunes y arriendos
- **Estado de Pagos:** Proporción de unidades al día vs morosas

### 3.3 Alertas

El sistema muestra alertas para:
- Boletas vencidas hace más de 30 días
- Contratos por vencer en los próximos 60 días
- Solicitudes ARCO pendientes

### 3.4 Accesos Rápidos

Botones para las acciones más frecuentes:
- Nuevo Período GC
- Facturar Arriendos
- Nueva Reunión
- Ver Reportes

---

## 4. Gestión de Edificios

### 4.1 Ver Edificios

1. En el menú lateral, haga clic en **"Edificios"**
2. Verá una lista de todos los edificios/comunidades

### 4.2 Crear Edificio

1. Haga clic en **"Nuevo Edificio"**
2. Complete los campos:
   - **Nombre:** Nombre del edificio o comunidad
   - **RUT:** RUT de la comunidad
   - **Dirección:** Dirección completa
   - **Comuna:** Comuna
   - **Tipo:** Condominio, Comunidad o Edificio
   - **Total Unidades:** Cantidad de unidades
3. Haga clic en **"Guardar"**

### 4.3 Gestionar Unidades

1. Haga clic en **"Ver"** en un edificio
2. Seleccione la pestaña **"Unidades"**
3. Puede agregar, editar o ver el estado de cuenta de cada unidad

### 4.4 Información de Unidad

Cada unidad contiene:
- Número/Identificador
- Tipo (departamento, local, bodega, estacionamiento)
- Piso
- Metros cuadrados
- Prorrateo (% de participación)
- Rol de avalúo
- Propietario actual

---

## 5. Gastos Comunes

### 5.1 Crear Período

1. Vaya a **"Gastos Comunes"**
2. Haga clic en **"Nuevo Período"**
3. Seleccione:
   - Edificio
   - Mes
   - Año
4. Haga clic en **"Crear"**

### 5.2 Generar Boletas

1. En el período creado, haga clic en **"Generar Boletas"**
2. El sistema calculará automáticamente:
   - Gastos comunes según prorrateo
   - Saldo anterior (si existe)
   - Intereses por mora (si aplica)
3. Las boletas quedarán en estado **"Pendiente"**

### 5.3 Ver/Descargar Boletas

1. En la pestaña **"Boletas"**, verá todas las boletas del período
2. Haga clic en **"PDF"** para descargar una boleta individual
3. Use **"Descargar Todas"** para obtener un ZIP con todas las boletas

### 5.4 Registrar Pagos

1. Busque la boleta correspondiente
2. Haga clic en **"Registrar Pago"**
3. Complete:
   - **Monto:** Cantidad pagada
   - **Medio de Pago:** Efectivo, Transferencia, Cheque, etc.
   - **N° Documento:** Número de comprobante (opcional)
   - **Observaciones:** Notas adicionales
4. Haga clic en **"Guardar"**

El estado de la boleta cambiará automáticamente:
- **Parcial:** Si el pago es menor al total
- **Pagada:** Si el pago cubre el total

### 5.5 Reporte de Morosidad

1. Vaya a la pestaña **"Morosidad"**
2. Verá un listado con:
   - Unidad
   - Propietario
   - Monto adeudado
   - Días de mora
   - Datos de contacto

---

## 6. Arriendos

### 6.1 Crear Arrendatario

1. Vaya a **"Arriendos"** > **"Arrendatarios"**
2. Haga clic en **"Nuevo Arrendatario"**
3. Complete los datos de la empresa:
   - RUT
   - Razón Social
   - Dirección
   - Contacto (nombre, email, teléfono)

### 6.2 Crear Contrato

1. Vaya a **"Arriendos"** > **"Contratos"**
2. Haga clic en **"Nuevo Contrato"**
3. Complete:
   - **Edificio:** Seleccione el edificio
   - **Arrendatario:** Seleccione la empresa
   - **Tipo de Espacio:** Azotea, Fachada, Subterráneo, etc.
   - **Canon Mensual (UF):** Monto en UF
   - **Fecha Inicio/Término**
   - **Renovación Automática:** Sí/No
   - **Reajuste:** IPC o UF
4. Haga clic en **"Guardar"**

### 6.3 Generar Facturas

1. Vaya a **"Arriendos"** > **"Facturación"**
2. Seleccione mes y año
3. Haga clic en **"Generar Facturas"**
4. El sistema:
   - Calculará el monto en pesos según UF del día
   - Aplicará IVA (19%)
   - Creará las facturas para todos los contratos activos

### 6.4 Descargar Facturas

- Haga clic en **"PDF"** junto a cada factura
- Las facturas incluyen todos los datos para emisión en SII

---

## 7. Distribución de Ingresos

### 7.1 Marco Legal

Según la **Ley 21.713**, los ingresos por arriendo de bienes comunes deben distribuirse proporcionalmente a los copropietarios. Los montos distribuidos **no constituyen renta** según el Art. 17 N°3 de la Ley de Impuesto a la Renta.

### 7.2 Crear Distribución

1. Vaya a **"Distribución"**
2. Haga clic en **"Nueva Distribución"**
3. Seleccione:
   - Edificio
   - Mes/Año
   - Monto Total a Distribuir
4. Haga clic en **"Crear"**

### 7.3 Procesar Distribución

1. Haga clic en **"Procesar"** en la distribución creada
2. El sistema calculará automáticamente:
   - Monto por unidad = Monto Total × Prorrateo de la unidad
   - Sin retención de impuestos (Art. 17 N°3 LIR)
3. Revise los montos calculados

### 7.4 Aprobar Distribución

1. Verifique que los montos sean correctos
2. Haga clic en **"Aprobar"**
3. La distribución quedará lista para pago

### 7.5 Certificados de Renta

Los certificados de renta son obligatorios para la declaración de impuestos anual.

1. Vaya a **"Distribución"** > **"Certificados de Renta"**
2. Seleccione edificio y año
3. Haga clic en **"Generar Certificados"**
4. El sistema generará un certificado por cada copropietario con:
   - Renta total percibida
   - Montos Art. 17 N°3 (No Renta)
   - Código de verificación único

---

## 8. Recursos Humanos

### 8.1 Registrar Empleado

1. Vaya a **"RRHH"** > **"Empleados"**
2. Haga clic en **"Nuevo Empleado"**
3. Complete los datos:

**Personales:**
- RUT, Nombre, Apellidos
- Fecha de nacimiento
- Dirección, Comuna
- Teléfono, Email

**Laborales:**
- Fecha de ingreso
- Tipo de contrato
- Cargo
- Sueldo base

**Previsión:**
- AFP
- Isapre o FONASA
- Banco y cuenta para pago

### 8.2 Generar Liquidación

1. Vaya a **"RRHH"** > **"Liquidaciones"**
2. Haga clic en **"Generar Liquidación"**
3. Seleccione:
   - Empleado
   - Mes/Año
4. El sistema calculará automáticamente:

| Concepto | Cálculo |
|----------|---------|
| **AFP** | Sueldo imponible × Tasa AFP (10.XX% - 11.XX%) |
| **Salud** | 7% (FONASA) o según plan Isapre |
| **Seguro Cesantía** | 0.6% trabajador |
| **Impuesto Único** | Según tramos 2025 |
| **Gratificación** | Tope 4.75 UTM |

5. Revise y apruebe la liquidación

### 8.3 Descargar Liquidación PDF

1. En la lista de liquidaciones, haga clic en **"PDF"**
2. La liquidación incluye todos los datos legales requeridos

---

## 9. Contabilidad

### 9.1 Plan de Cuentas

El sistema incluye un plan de cuentas predefinido basado en PCGA:

| Tipo | Códigos | Naturaleza |
|------|---------|------------|
| Activo | 1.X.X.X | Deudor |
| Pasivo | 2.X.X.X | Acreedor |
| Patrimonio | 3.X.X.X | Acreedor |
| Ingresos | 4.X.X.X | Acreedor |
| Gastos | 5.X.X.X | Deudor |

### 9.2 Crear Asiento Contable

1. Vaya a **"Contabilidad"** > **"Asientos"**
2. Haga clic en **"Nuevo Asiento"**
3. Complete:
   - **Fecha**
   - **Glosa:** Descripción del movimiento
   - **Líneas:** Agregue las cuentas con sus montos Debe/Haber
4. El sistema validará que **Debe = Haber**
5. Haga clic en **"Guardar"**

### 9.3 Libro Diario

1. Vaya a **"Contabilidad"** > **"Libro Diario"**
2. Seleccione el rango de fechas
3. Verá todos los asientos ordenados cronológicamente

### 9.4 Libro Mayor

1. Vaya a **"Contabilidad"** > **"Libro Mayor"**
2. Seleccione una cuenta
3. Verá todos los movimientos de esa cuenta con su saldo

### 9.5 Balance

1. Vaya a **"Contabilidad"** > **"Balance"**
2. Verá el saldo de todas las cuentas
3. Puede exportar a Excel o PDF

---

## 10. Reuniones y Asambleas

### 10.1 Crear Reunión

1. Vaya a **"Reuniones"**
2. Haga clic en **"Nueva Reunión"**
3. Complete:
   - **Edificio**
   - **Título:** Ej. "Asamblea Ordinaria 2025"
   - **Tipo:** Ordinaria, Extraordinaria, Comité, Informativa
   - **Modalidad:** Presencial, Telemática o Mixta
   - **Fecha y Hora**
   - **Duración estimada**
   - **Orden del Día**

### 10.2 Convocar Reunión

1. En la reunión creada, haga clic en **"Convocar"**
2. El sistema:
   - Agregará todos los copropietarios como invitados
   - Enviará notificaciones por email
   - Cambiará el estado a "Convocada"

### 10.3 Iniciar Reunión

1. El día de la reunión, haga clic en **"Iniciar"**
2. Para reuniones telemáticas, se habilitará la sala de video (Jitsi)
3. Los asistentes pueden ingresar con el enlace proporcionado

### 10.4 Crear Votación

1. Durante la reunión, vaya a **"Votaciones"**
2. Haga clic en **"Nueva Votación"**
3. Configure:
   - **Título:** Ej. "Aprobación presupuesto 2025"
   - **Tipo:** Sí/No u Opción Múltiple
   - **Opciones:** Si es opción múltiple
4. Haga clic en **"Iniciar Votación"**

### 10.5 Votar

1. Los copropietarios verán la votación activa
2. Seleccionan su opción y confirman
3. El voto se pondera según el prorrateo de su unidad
4. El voto es secreto (no se muestra quién votó qué)

### 10.6 Cerrar Votación

1. Haga clic en **"Cerrar Votación"**
2. El sistema calculará los resultados:
   - Total votos Sí/No (ponderados)
   - Porcentaje de aprobación
   - Si alcanzó la mayoría requerida

### 10.7 Finalizar Reunión

1. Haga clic en **"Finalizar Reunión"**
2. El sistema:
   - Calculará el quórum alcanzado
   - Generará el acta automáticamente
   - Registrará asistentes y acuerdos

### 10.8 Descargar Acta

1. En la reunión finalizada, haga clic en **"Ver Acta"**
2. El acta incluye:
   - Datos de la reunión
   - Lista de asistentes con prorrateo
   - Quórum alcanzado
   - Votaciones y sus resultados
   - Acuerdos aprobados

---

## 11. Asistente Legal

### 11.1 Consultas Legales

1. Vaya a **"Asistente Legal"** > **"Consultas"**
2. Escriba su consulta en el campo de texto
3. Haga clic en **"Consultar"**
4. El sistema responderá con:
   - Respuesta basada en la normativa vigente
   - Referencias legales (Ley 21.442, Ley 21.713, etc.)

**Temas disponibles:**
- Morosidad y cobranza
- Asambleas y quórum
- Arriendos de bienes comunes
- Distribución de ingresos
- Fondo de reserva
- Y más...

### 11.2 Preguntas Frecuentes

En la sección **"FAQ"** encontrará respuestas a las preguntas más comunes organizadas por categoría.

### 11.3 Oficios

Para enviar comunicaciones oficiales a instituciones:

1. Vaya a **"Asistente Legal"** > **"Oficios"**
2. Haga clic en **"Nuevo Oficio"**
3. Seleccione:
   - **Tipo:** Consulta, Reclamo, Denuncia, Solicitud
   - **Institución:** SII, Dirección del Trabajo, SEC, MINVU, etc.
   - **Asunto**
   - **Contenido**
4. Puede usar plantillas predefinidas
5. Descargue el PDF para enviar

### 11.4 Certificados de Cumplimiento

1. Vaya a **"Asistente Legal"** > **"Certificados"**
2. Haga clic en **"Generar Certificado"**
3. Seleccione el tipo:
   - **General:** Cumplimiento normativo general
   - **Tributario:** Cumplimiento obligaciones SII
   - **Ley 21.442:** Cumplimiento copropiedad
   - **Transparencia:** Información pública
4. El certificado incluye un código de verificación único

### 11.5 Verificar Certificado

Terceros pueden verificar la autenticidad de un certificado:

1. Vaya a **"Verificar Certificado"** (acceso público)
2. Ingrese el código de verificación
3. El sistema confirmará si es válido

---

## 12. Protección de Datos

### 12.1 Marco Legal

DATAPOLIS PRO cumple con la **Ley 19.628** y **Ley 21.719 (2024)** sobre protección de datos personales.

### 12.2 Dashboard de Cumplimiento

1. Vaya a **"Protección de Datos"**
2. El dashboard muestra:
   - Solicitudes ARCO pendientes
   - Solicitudes vencidas (plazo: 10 días hábiles)
   - Consentimientos activos
   - Brechas de seguridad abiertas

### 12.3 Gestionar Solicitudes ARCO

Los titulares de datos pueden ejercer sus derechos:

| Derecho | Descripción |
|---------|-------------|
| **Acceso** | Conocer qué datos tratamos |
| **Rectificación** | Corregir datos inexactos |
| **Cancelación** | Eliminar datos |
| **Oposición** | Oponerse al tratamiento |
| **Portabilidad** | Recibir datos en formato digital |

**Para procesar una solicitud:**

1. Vaya a **"Solicitudes ARCO"**
2. Revise la solicitud recibida
3. Verifique la identidad del solicitante
4. Procese según corresponda:
   - **Aprobar:** Si procede la solicitud
   - **Rechazar:** Si hay impedimento legal
5. El sistema registrará la respuesta y notificará al titular

**IMPORTANTE:** El plazo máximo de respuesta es **10 días hábiles**.

### 12.4 Registro de Tratamientos

1. Vaya a **"Tratamientos"**
2. Verá todos los tratamientos de datos configurados:
   - Gestión de Copropietarios
   - Gestión de Empleados (RRHH)
   - Distribución de Ingresos
   - Etc.
3. Cada tratamiento documenta:
   - Base legal
   - Finalidad
   - Datos recolectados
   - Período de retención

### 12.5 Brechas de Seguridad

Si detecta una brecha de seguridad:

1. Vaya a **"Brechas"**
2. Haga clic en **"Reportar Brecha"**
3. Complete la información del incidente
4. El sistema evaluará el nivel de riesgo

**IMPORTANTE:** Las brechas de alto riesgo deben notificarse a la Agencia de Protección de Datos en **72 horas**.

---

## 13. Reportes

### 13.1 Filtros

1. Vaya a **"Reportes"**
2. Seleccione:
   - **Edificio:** Todos o uno específico
   - **Desde/Hasta:** Rango de fechas

### 13.2 Reportes Disponibles

| Reporte | Contenido |
|---------|-----------|
| **Morosidad Detallada** | Listado de deudores con montos y días |
| **Recaudación por Período** | Resumen mensual de pagos |
| **Ingresos por Arriendos** | Facturas emitidas y pagadas |
| **Distribución de Ingresos** | Montos distribuidos por unidad |
| **Costos de Personal** | Resumen de liquidaciones |
| **Balance General** | Estado financiero contable |

### 13.3 Exportar

- Haga clic en **"Excel"** para descargar en formato XLSX
- Haga clic en **"PDF"** para descargar en formato PDF

---

## 14. Configuración

### 14.1 Configuración General

1. Vaya a **"Configuración"** > **"General"**
2. Configure:
   - **Día de vencimiento GC:** Día del mes para vencimiento (1-28)
   - **Interés por mora:** Porcentaje mensual
   - **Fondo de reserva:** Porcentaje mínimo (legal: 5%)

### 14.2 Usuarios

1. Vaya a **"Configuración"** > **"Usuarios"**
2. Puede:
   - Ver usuarios existentes
   - Crear nuevos usuarios
   - Asignar roles y permisos
   - Activar/Desactivar usuarios

### 14.3 Notificaciones

1. Vaya a **"Configuración"** > **"Notificaciones"**
2. Configure:
   - Envío automático de boletas por email
   - Días de anticipación para recordatorios
   - Alertas de vencimiento de contratos

### 14.4 Cambiar Contraseña

1. Vaya a **"Configuración"** > **"Seguridad"**
2. Ingrese su contraseña actual
3. Ingrese la nueva contraseña (dos veces)
4. Haga clic en **"Cambiar Contraseña"**

---

## 15. Preguntas Frecuentes

### General

**¿Cómo recupero mi contraseña?**
En la pantalla de login, haga clic en "¿Olvidó su contraseña?" e ingrese su email.

**¿Puedo acceder desde mi celular?**
Sí, el sistema es responsive y funciona en dispositivos móviles.

**¿Los datos están seguros?**
Sí, utilizamos encriptación TLS en tránsito y AES-256 en reposo. Además, cumplimos con la Ley 21.719 de protección de datos.

### Gastos Comunes

**¿Cómo se calcula el monto de cada boleta?**
El monto se calcula multiplicando el gasto total del período por el prorrateo de cada unidad.

**¿Qué pasa si un propietario no paga?**
El sistema calculará intereses automáticamente y lo incluirá en el reporte de morosidad.

**¿Puedo anular una boleta?**
Sí, puede cambiar el estado a "Anulada" y generar una nueva si es necesario.

### Arriendos

**¿Cómo se actualiza el canon en UF?**
El sistema obtiene el valor de la UF automáticamente al generar las facturas.

**¿Qué pasa cuando vence un contrato?**
Si tiene renovación automática, se renovará. Si no, aparecerá en las alertas del dashboard.

### Distribución

**¿Los montos distribuidos pagan impuestos?**
No, según el Art. 17 N°3 de la Ley de Impuesto a la Renta, los montos distribuidos proporcionalmente no constituyen renta.

**¿Cuándo debo emitir los certificados de renta?**
Antes del 31 de marzo de cada año para las rentas del año anterior.

### Reuniones

**¿Cuántos copropietarios necesito para tener quórum?**
Depende del tipo de asamblea. Ordinarias requieren mayoría simple, extraordinarias pueden requerir quórum especial según el tema.

**¿Las votaciones son secretas?**
Sí, el sistema registra que el copropietario votó, pero no cómo votó.

### Protección de Datos

**¿Qué hago si recibo una solicitud ARCO?**
Tiene 10 días hábiles para responder. Verifique la identidad del solicitante y procese según corresponda.

**¿Debo reportar todas las brechas de seguridad?**
Las brechas de alto riesgo deben notificarse a la Agencia en 72 horas. Las de bajo riesgo solo requieren registro interno.

---

## Glosario

| Término | Definición |
|---------|------------|
| **ARCO** | Acceso, Rectificación, Cancelación, Oposición (derechos de protección de datos) |
| **Prorrateo** | Porcentaje de participación de una unidad en los gastos/ingresos comunes |
| **UF** | Unidad de Fomento, unidad de cuenta reajustable según inflación |
| **UTM** | Unidad Tributaria Mensual |
| **Quórum** | Cantidad mínima de participación para validar una asamblea |
| **Art. 17 N°3 LIR** | Artículo de la Ley de Impuesto a la Renta que establece qué no constituye renta |

---

## Contacto y Soporte

**DATAPOLIS SpA**  
Email: soporte@datapolis.cl  
Web: https://datapolis.cl  
Teléfono: +56 2 2XXX XXXX

---

*Manual de Usuario v2.5 - Diciembre 2025*  
*© DATAPOLIS SpA - Todos los derechos reservados*
