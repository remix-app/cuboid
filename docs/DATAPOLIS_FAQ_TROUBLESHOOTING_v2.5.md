# DATAPOLIS PRO - FAQ y Troubleshooting

**Versión:** 1.1  
**Fecha:** Diciembre 2025

---

## Tabla de Contenidos

1. [Preguntas Frecuentes (FAQ)](#1-preguntas-frecuentes-faq)
2. [Troubleshooting - Problemas Comunes](#2-troubleshooting---problemas-comunes)
3. [Mensajes de Error](#3-mensajes-de-error)
4. [Contacto Soporte](#4-contacto-soporte)

---

## 1. Preguntas Frecuentes (FAQ)

### 1.1 General

**¿Qué es DATAPOLIS PRO?**

DATAPOLIS PRO es un sistema de gestión integral para comunidades y condominios en Chile. Permite administrar gastos comunes, arriendos, distribución de ingresos, RRHH, contabilidad, reuniones y cumplimiento legal.

---

**¿Qué navegadores son compatibles?**

- Google Chrome (recomendado) - versión 90+
- Mozilla Firefox - versión 90+
- Microsoft Edge - versión 90+
- Safari - versión 14+

No se recomienda Internet Explorer.

---

**¿Puedo acceder desde mi celular?**

Sí, el sistema es responsive y funciona en dispositivos móviles. También existe una aplicación móvil en desarrollo.

---

**¿Mis datos están seguros?**

Sí. Implementamos:
- Encriptación TLS 1.3 en tránsito
- Encriptación AES-256 en reposo
- Backups diarios automáticos
- Cumplimiento Ley 21.719 de protección de datos
- Auditoría de accesos

---

**¿Cuántos usuarios pueden acceder?**

Depende del plan contratado:
- **Básico:** 3 usuarios
- **Profesional:** 10 usuarios
- **Enterprise:** Ilimitados

---

### 1.2 Gastos Comunes

**¿Cómo se calcula el monto de cada boleta?**

```
Monto Unidad = Gasto Total del Período × Prorrateo de la Unidad
             + Saldo Anterior (si existe)
             + Intereses por Mora (si aplica)
             + Fondo de Reserva (5%)
```

Ejemplo:
```
Gasto Total: $10.000.000
Prorrateo Unidad 101: 2.5%
Gasto Común: $250.000
Fondo Reserva (5%): $12.500
Total: $262.500
```

---

**¿Cómo configuro la fecha de vencimiento?**

1. Vaya a **Configuración > General**
2. Configure "Día de Vencimiento GC" (1-28)
3. Las boletas vencerán ese día del mes siguiente

---

**¿Qué tasa de interés por mora debo aplicar?**

La ley establece como máximo el "interés corriente para operaciones no reajustables". Recomendamos consultar la tasa vigente en el sitio del Banco Central. Típicamente se usa entre 1% y 3% mensual.

---

**¿Puedo anular una boleta ya emitida?**

Sí:
1. Busque la boleta en **Gastos Comunes > Boletas**
2. Haga clic en **"Anular"**
3. Ingrese el motivo de anulación
4. La boleta quedará en estado "Anulada"

Para generar una nueva boleta corregida, cree un cargo extraordinario o espere al siguiente período.

---

**¿Cómo registro un pago parcial?**

1. En la boleta, haga clic en **"Registrar Pago"**
2. Ingrese el monto pagado (menor al total)
3. El estado cambiará a **"Parcial"**
4. El saldo pendiente se mostrará en la boleta

---

### 1.3 Arriendos

**¿Cómo actualizo el valor de la UF en las facturas?**

El sistema obtiene automáticamente el valor de la UF del SII al generar facturas. Si necesita usar una UF específica, puede editarla manualmente al crear la factura.

---

**¿Qué pasa cuando vence un contrato?**

- Si tiene **renovación automática:** Se renueva por el mismo período
- Si **no tiene renovación:** Aparece en alertas del Dashboard y cambia a estado "Vencido"

---

**¿Puedo tener múltiples contratos con el mismo arrendatario?**

Sí. Cada contrato es independiente. Un arrendatario (ej: Entel) puede tener contratos en diferentes edificios o múltiples espacios en el mismo edificio.

---

### 1.4 Distribución

**¿Los montos distribuidos pagan impuestos?**

**No**, según el Art. 17 N°3 de la Ley de Impuesto a la Renta, los montos distribuidos proporcionalmente a los copropietarios no constituyen renta, siempre que:
- Se distribuyan según prorrateo
- Se documenten correctamente
- Se emitan certificados de renta

---

**¿Cuándo debo emitir los certificados de renta?**

Antes del **31 de marzo** de cada año para las rentas del año anterior.

Ejemplo: Certificados 2025 → Emitir antes del 31 de marzo de 2026.

---

**¿Qué hago si un copropietario vendió su unidad durante el año?**

Se deben emitir dos certificados:
1. Al vendedor: Por los meses que fue propietario
2. Al comprador: Por los meses restantes

El sistema permite ajustar manualmente los montos si es necesario.

---

### 1.5 RRHH

**¿Cómo actualizo los valores de AFP e Isapres?**

Los valores vienen precargados y se actualizan periódicamente. Para actualizar manualmente:
1. Vaya a **Configuración > Indicadores**
2. Actualice las tasas de AFP
3. Los cambios aplican a las nuevas liquidaciones

---

**¿El sistema calcula automáticamente el finiquito?**

Actualmente el sistema genera la base del finiquito (vacaciones proporcionales, años de servicio), pero se recomienda revisión por un contador o abogado laboral antes de formalizar.

---

**¿Cómo manejo las licencias médicas?**

1. Vaya al empleado y cambie su estado a **"Licencia"**
2. En la liquidación del mes, ajuste los días trabajados
3. El subsidio de incapacidad laboral lo paga la Isapre/FONASA, no el empleador

---

### 1.6 Reuniones

**¿Cuántos copropietarios necesito para tener quórum?**

Depende del tipo de asamblea:

| Tipo | Primera Citación | Segunda Citación |
|------|------------------|------------------|
| Ordinaria | 50% + 1 | Los que asistan |
| Extraordinaria Simple | 50% + 1 | 33.3% |
| Extraordinaria Especial | 66.6% | 66.6% |

El quórum se calcula por **prorrateo**, no por cantidad de personas.

---

**¿Las votaciones son secretas?**

Sí. El sistema registra:
- ✅ Que el copropietario votó
- ✅ El peso de su voto (prorrateo)
- ❌ NO registra qué opción eligió cada persona

---

**¿Puedo dar poderes a otro copropietario?**

Sí. Al registrar asistencia, puede indicar que una persona asiste "con poder" de otra unidad. El sistema sumará ambos prorrateos para las votaciones.

---

### 1.7 Protección de Datos

**¿Qué hago si recibo una solicitud ARCO?**

1. Verifique la identidad del solicitante
2. Registre la solicitud en **Protección de Datos > Solicitudes**
3. Procese dentro de **10 días hábiles**
4. Documente la respuesta

---

**¿Debo notificar todas las brechas de seguridad?**

Solo las de **alto o crítico riesgo** deben notificarse a la Agencia de Protección de Datos en **72 horas**. Las de bajo riesgo solo requieren registro interno.

---

**¿Cuánto tiempo debo guardar los datos?**

| Tipo de Dato | Período |
|--------------|---------|
| Copropietarios | 10 años (prescripción tributaria) |
| Empleados | 5 años post-término |
| Facturas/Boletas | 6 años |
| Actas | 5 años |

---

## 2. Troubleshooting - Problemas Comunes

### 2.1 Problemas de Acceso

**No puedo iniciar sesión**

1. Verifique que el email sea correcto
2. Use "Olvidé mi contraseña" para restablecer
3. Verifique que su cuenta esté activa (contacte al administrador)
4. Limpie caché y cookies del navegador
5. Intente en modo incógnito

---

**Mi sesión se cierra constantemente**

- Las sesiones expiran después de 2 horas de inactividad
- Verifique que no tenga sesión abierta en otro dispositivo
- Limpie cookies del navegador

---

**Olvidé mi contraseña**

1. En la pantalla de login, haga clic en **"¿Olvidó su contraseña?"**
2. Ingrese su email registrado
3. Revise su bandeja de entrada (y spam)
4. Haga clic en el enlace recibido
5. Cree una nueva contraseña

---

### 2.2 Problemas con Boletas

**Las boletas no se generan**

Verifique:
- [ ] El período está creado y tiene gastos cargados
- [ ] Las unidades tienen prorrateo asignado
- [ ] El total de prorrateos suma 100%
- [ ] El período no está "Cerrado"

---

**El cálculo de intereses no es correcto**

1. Verifique la tasa configurada en **Configuración > General**
2. Revise la fecha de vencimiento de las boletas anteriores
3. Los intereses se calculan desde el día siguiente al vencimiento

---

**No puedo descargar el PDF de la boleta**

1. Desactive el bloqueador de pop-ups para el sitio
2. Intente con otro navegador
3. Verifique que el período esté "Emitido" (no Borrador)

---

### 2.3 Problemas con Arriendos

**Las facturas se generan con UF incorrecta**

El sistema usa la UF del día de generación. Si necesita otra fecha:
1. Genere la factura
2. Edite y modifique el valor de UF manualmente
3. Los montos se recalcularán

---

**El contrato no aparece para facturar**

Verifique:
- [ ] El contrato está en estado "Activo"
- [ ] La fecha de inicio ya pasó
- [ ] La fecha de término no ha llegado
- [ ] El día de facturación corresponde al mes actual

---

### 2.4 Problemas con RRHH

**La liquidación muestra valores incorrectos**

1. Verifique el sueldo base del empleado
2. Revise la AFP asignada (tasas varían)
3. Verifique el plan de Isapre (si aplica)
4. Confirme los tramos de impuesto único vigentes
5. Revise si hay tope imponible aplicado

---

**El impuesto único es diferente al esperado**

El cálculo depende de:
- Base imponible (sueldo - items no imponibles)
- Valor UTM del mes
- Tramo correspondiente

Fórmula: `Impuesto = (Base / UTM) × Tasa - Rebaja`

---

### 2.5 Problemas con Reuniones

**Los copropietarios no pueden unirse a la videollamada**

1. Verifique que la reunión esté "En Curso"
2. Comparta el enlace correcto (desde la reunión)
3. Pida a los usuarios que:
   - Usen Chrome o Firefox
   - Permitan acceso a cámara/micrófono
   - Desactiven VPN si tienen problemas

---

**La votación no cierra**

Las votaciones cierran cuando:
- El administrador la cierra manualmente, O
- Todos los asistentes presentes han votado

Si falta alguien por votar, puede cerrarla manualmente.

---

### 2.6 Problemas de Rendimiento

**El sistema está lento**

1. Verifique su conexión a Internet
2. Limpie caché del navegador
3. Cierre pestañas innecesarias
4. Intente en otro navegador
5. Si persiste, contacte soporte

---

**Los reportes tardan mucho en generar**

Reportes con muchos datos pueden demorar. Recomendaciones:
- Use filtros para reducir el rango de datos
- Genere reportes en horarios de baja demanda
- Exporte a Excel para análisis complejos

---

## 3. Mensajes de Error

### 3.1 Errores de Autenticación

| Código | Mensaje | Solución |
|--------|---------|----------|
| 401 | "No autenticado" | Vuelva a iniciar sesión |
| 403 | "No autorizado" | No tiene permisos para esta acción |
| 419 | "Sesión expirada" | Recargue la página e inicie sesión |

### 3.2 Errores de Validación

| Mensaje | Causa | Solución |
|---------|-------|----------|
| "El campo X es obligatorio" | Falta completar campo | Complete el campo indicado |
| "El RUT no es válido" | Formato incorrecto | Use formato XX.XXX.XXX-X |
| "El email ya existe" | Duplicado | Use otro email o recupere cuenta |
| "El monto debe ser mayor a 0" | Valor inválido | Ingrese un número positivo |

### 3.3 Errores del Sistema

| Código | Mensaje | Acción |
|--------|---------|--------|
| 500 | "Error interno del servidor" | Contacte soporte con detalle |
| 502 | "Bad Gateway" | Espere unos minutos y reintente |
| 503 | "Servicio no disponible" | Sistema en mantenimiento |
| 504 | "Timeout" | Reintente; si persiste, contacte soporte |

### 3.4 Errores de Negocio

| Mensaje | Causa | Solución |
|---------|-------|----------|
| "El período ya tiene boletas" | Duplicación | Use las boletas existentes |
| "Suma de prorrateos ≠ 100%" | Configuración | Ajuste los prorrateos de unidades |
| "Contrato vencido" | Fecha pasada | Renueve o cree nuevo contrato |
| "Empleado sin AFP asignada" | Datos incompletos | Asigne AFP al empleado |
| "Balance no cuadra" | Debe ≠ Haber | Revise las líneas del asiento |

---

## 4. Contacto Soporte

### 4.1 Canales de Soporte

| Canal | Disponibilidad | Tiempo Respuesta |
|-------|----------------|------------------|
| **Email:** soporte@datapolis.cl | 24/7 | < 24 horas |
| **Chat en App** | Lun-Vie 9-18h | Inmediato |
| **Teléfono:** +56 2 2XXX XXXX | Lun-Vie 9-18h | Inmediato |
| **WhatsApp:** +56 9 XXXX XXXX | Lun-Vie 9-18h | < 2 horas |

### 4.2 Información para Soporte

Al contactar soporte, incluya:
- Nombre de usuario y edificio
- Descripción detallada del problema
- Pasos para reproducir el error
- Capturas de pantalla (si aplica)
- Navegador y dispositivo usado

### 4.3 Niveles de Soporte

| Nivel | Tipo de Consulta | SLA |
|-------|------------------|-----|
| **P1 - Crítico** | Sistema caído, pérdida de datos | 2 horas |
| **P2 - Alto** | Funcionalidad principal no opera | 4 horas |
| **P3 - Medio** | Error en funcionalidad secundaria | 24 horas |
| **P4 - Bajo** | Consulta, mejora, capacitación | 48 horas |

### 4.4 Base de Conocimiento

Visite nuestra base de conocimiento en:
**https://ayuda.datapolis.cl**

Incluye:
- Videos tutoriales
- Guías paso a paso
- Webinars grabados
- Actualizaciones del sistema

---

*FAQ y Troubleshooting v2.5 - Diciembre 2025*  
*© DATAPOLIS SpA*
