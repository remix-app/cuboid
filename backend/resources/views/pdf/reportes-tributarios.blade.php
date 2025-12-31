{{-- ============================================================== --}}
{{-- BALANCE GENERAL - Formato SII --}}
{{-- ============================================================== --}}
@section('balance-general')
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Balance General {{ $balance->anio_tributario }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 10px; margin: 20px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 16px; }
        .header h2 { margin: 5px 0; font-size: 12px; color: #666; }
        .info-box { background: #f5f5f5; padding: 10px; margin-bottom: 15px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th { background: #2c3e50; color: white; padding: 8px; text-align: left; }
        .table td { padding: 6px 8px; border-bottom: 1px solid #ddd; }
        .table .subtotal { background: #ecf0f1; font-weight: bold; }
        .table .total { background: #3498db; color: white; font-weight: bold; }
        .monto { text-align: right; font-family: monospace; }
        .section-title { background: #34495e; color: white; padding: 5px 10px; margin: 15px 0 5px 0; }
        .two-columns { display: table; width: 100%; }
        .column { display: table-cell; width: 50%; vertical-align: top; padding-right: 10px; }
        .cuadrado { color: green; font-weight: bold; }
        .no-cuadrado { color: red; font-weight: bold; }
        .footer { margin-top: 30px; font-size: 8px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>BALANCE GENERAL</h1>
        <h2>{{ $edificio->nombre }}</h2>
        <p>RUT: {{ $edificio->rut }} | Ejercicio: {{ $balance->anio_tributario }}</p>
        <p>Período: {{ $balance->fecha_inicio }} al {{ $balance->fecha_cierre }}</p>
    </div>

    <div class="two-columns">
        <div class="column">
            <div class="section-title">ACTIVOS</div>
            <table class="table">
                <tr><th colspan="2">Activo Circulante</th></tr>
                <tr><td>Caja</td><td class="monto">${{ number_format($balance->activo_circulante_caja, 0, ',', '.') }}</td></tr>
                <tr><td>Bancos</td><td class="monto">${{ number_format($balance->activo_circulante_bancos, 0, ',', '.') }}</td></tr>
                <tr><td>Deudores Gastos Comunes</td><td class="monto">${{ number_format($balance->activo_circulante_deudores_gc, 0, ',', '.') }}</td></tr>
                <tr><td>Arriendos por Cobrar</td><td class="monto">${{ number_format($balance->activo_circulante_arriendos_cobrar, 0, ',', '.') }}</td></tr>
                <tr><td>IVA Crédito Fiscal</td><td class="monto">${{ number_format($balance->activo_circulante_iva_credito, 0, ',', '.') }}</td></tr>
                <tr><td>Otros Activos Circulantes</td><td class="monto">${{ number_format($balance->activo_circulante_otros, 0, ',', '.') }}</td></tr>
                <tr class="subtotal"><td>Total Activo Circulante</td><td class="monto">${{ number_format($balance->total_activo_circulante, 0, ',', '.') }}</td></tr>
                
                <tr><th colspan="2">Activo Fijo</th></tr>
                <tr><td>Terrenos</td><td class="monto">${{ number_format($balance->activo_fijo_terrenos, 0, ',', '.') }}</td></tr>
                <tr><td>Construcciones</td><td class="monto">${{ number_format($balance->activo_fijo_construcciones, 0, ',', '.') }}</td></tr>
                <tr><td>Muebles y Útiles</td><td class="monto">${{ number_format($balance->activo_fijo_muebles, 0, ',', '.') }}</td></tr>
                <tr><td>Equipos</td><td class="monto">${{ number_format($balance->activo_fijo_equipos, 0, ',', '.') }}</td></tr>
                <tr><td>(-) Depreciación Acumulada</td><td class="monto">(${{ number_format(abs($balance->activo_fijo_depreciacion_acum), 0, ',', '.') }})</td></tr>
                <tr class="subtotal"><td>Total Activo Fijo</td><td class="monto">${{ number_format($balance->total_activo_fijo, 0, ',', '.') }}</td></tr>
                
                <tr class="total"><td><strong>TOTAL ACTIVOS</strong></td><td class="monto"><strong>${{ number_format($balance->total_activos, 0, ',', '.') }}</strong></td></tr>
            </table>
        </div>

        <div class="column">
            <div class="section-title">PASIVOS</div>
            <table class="table">
                <tr><th colspan="2">Pasivo Circulante</th></tr>
                <tr><td>Proveedores</td><td class="monto">${{ number_format($balance->pasivo_circulante_proveedores, 0, ',', '.') }}</td></tr>
                <tr><td>Remuneraciones por Pagar</td><td class="monto">${{ number_format($balance->pasivo_circulante_remuneraciones, 0, ',', '.') }}</td></tr>
                <tr><td>Cotizaciones por Pagar</td><td class="monto">${{ number_format($balance->pasivo_circulante_cotizaciones, 0, ',', '.') }}</td></tr>
                <tr><td>Impuestos por Pagar</td><td class="monto">${{ number_format($balance->pasivo_circulante_impuestos, 0, ',', '.') }}</td></tr>
                <tr><td>IVA Débito Fiscal</td><td class="monto">${{ number_format($balance->pasivo_circulante_iva_debito, 0, ',', '.') }}</td></tr>
                <tr class="subtotal"><td>Total Pasivo Circulante</td><td class="monto">${{ number_format($balance->total_pasivo_circulante, 0, ',', '.') }}</td></tr>
                
                <tr><th colspan="2">Pasivo Largo Plazo</th></tr>
                <tr><td>Deudas Largo Plazo</td><td class="monto">${{ number_format($balance->pasivo_largo_plazo_deudas, 0, ',', '.') }}</td></tr>
                <tr><td>Provisiones</td><td class="monto">${{ number_format($balance->pasivo_largo_plazo_provisiones, 0, ',', '.') }}</td></tr>
                <tr class="subtotal"><td>Total Pasivo Largo Plazo</td><td class="monto">${{ number_format($balance->total_pasivo_largo_plazo, 0, ',', '.') }}</td></tr>
                
                <tr class="subtotal"><td><strong>Total Pasivos</strong></td><td class="monto"><strong>${{ number_format($balance->total_pasivos, 0, ',', '.') }}</strong></td></tr>
            </table>

            <div class="section-title">PATRIMONIO</div>
            <table class="table">
                <tr><td>Fondo Común</td><td class="monto">${{ number_format($balance->patrimonio_fondo_comun, 0, ',', '.') }}</td></tr>
                <tr><td>Fondo de Reserva</td><td class="monto">${{ number_format($balance->patrimonio_fondo_reserva, 0, ',', '.') }}</td></tr>
                <tr><td>Resultados Acumulados</td><td class="monto">${{ number_format($balance->patrimonio_resultados_acumulados, 0, ',', '.') }}</td></tr>
                <tr><td>Resultado del Ejercicio</td><td class="monto">${{ number_format($balance->patrimonio_resultado_ejercicio, 0, ',', '.') }}</td></tr>
                <tr class="subtotal"><td><strong>Total Patrimonio</strong></td><td class="monto"><strong>${{ number_format($balance->total_patrimonio, 0, ',', '.') }}</strong></td></tr>
                
                <tr class="total"><td><strong>TOTAL PASIVO + PATRIMONIO</strong></td><td class="monto"><strong>${{ number_format($balance->total_pasivo_patrimonio, 0, ',', '.') }}</strong></td></tr>
            </table>
        </div>
    </div>

    <div class="info-box">
        <strong>Cuadratura:</strong> 
        @if($balance->cuadrado)
            <span class="cuadrado">✓ CUADRADO</span>
        @else
            <span class="no-cuadrado">✗ DIFERENCIA: ${{ number_format($balance->diferencia, 0, ',', '.') }}</span>
        @endif
    </div>

    <div class="footer">
        <p>Documento generado por DATAPOLIS PRO el {{ now()->format('d/m/Y H:i') }}</p>
        <p>Este documento es un reporte interno y no constituye declaración oficial ante el SII.</p>
    </div>
</body>
</html>
@endsection

{{-- ============================================================== --}}
{{-- ESTADO DE RESULTADOS --}}
{{-- ============================================================== --}}
@section('estado-resultados')
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Estado de Resultados {{ $eerr->anio_tributario }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 10px; margin: 20px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 16px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .table th { background: #27ae60; color: white; padding: 8px; text-align: left; }
        .table td { padding: 6px 8px; border-bottom: 1px solid #ddd; }
        .table .subtotal { background: #d5f5e3; font-weight: bold; }
        .table .total { background: #27ae60; color: white; font-weight: bold; }
        .monto { text-align: right; font-family: monospace; }
        .positivo { color: #27ae60; }
        .negativo { color: #e74c3c; }
        .highlight { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>ESTADO DE RESULTADOS</h1>
        <h2>{{ $edificio->nombre }}</h2>
        <p>Período: {{ $eerr->fecha_inicio }} al {{ $eerr->fecha_cierre }}</p>
    </div>

    <table class="table">
        <tr><th colspan="2">INGRESOS OPERACIONALES</th></tr>
        <tr><td>Gastos Comunes Recaudados</td><td class="monto">${{ number_format($eerr->ingresos_gastos_comunes, 0, ',', '.') }}</td></tr>
        <tr><td>Fondo de Reserva</td><td class="monto">${{ number_format($eerr->ingresos_fondo_reserva, 0, ',', '.') }}</td></tr>
        <tr><td>Multas e Intereses</td><td class="monto">${{ number_format($eerr->ingresos_multas_intereses, 0, ',', '.') }}</td></tr>
        <tr><td>Arriendos Antenas/Telecomunicaciones</td><td class="monto">${{ number_format($eerr->ingresos_arriendos_antenas, 0, ',', '.') }}</td></tr>
        <tr><td>Arriendos Publicidad</td><td class="monto">${{ number_format($eerr->ingresos_arriendos_publicidad, 0, ',', '.') }}</td></tr>
        <tr><td>Otros Arriendos</td><td class="monto">${{ number_format($eerr->ingresos_arriendos_otros, 0, ',', '.') }}</td></tr>
        <tr class="subtotal"><td>TOTAL INGRESOS OPERACIONALES</td><td class="monto">${{ number_format($eerr->total_ingresos_operacionales, 0, ',', '.') }}</td></tr>
    </table>

    <table class="table">
        <tr><th colspan="2">GASTOS OPERACIONALES</th></tr>
        <tr><td>Remuneraciones</td><td class="monto">(${{ number_format($eerr->gastos_remuneraciones, 0, ',', '.') }})</td></tr>
        <tr><td>Cotizaciones Previsionales</td><td class="monto">(${{ number_format($eerr->gastos_cotizaciones_previsionales, 0, ',', '.') }})</td></tr>
        <tr><td>Servicios Básicos</td><td class="monto">(${{ number_format($eerr->gastos_servicios_basicos ?? 0, 0, ',', '.') }})</td></tr>
        <tr><td>Mantenciones</td><td class="monto">(${{ number_format($eerr->gastos_mantenciones ?? 0, 0, ',', '.') }})</td></tr>
        <tr><td>Seguros</td><td class="monto">(${{ number_format($eerr->gastos_seguros ?? 0, 0, ',', '.') }})</td></tr>
        <tr><td>Otros Gastos Operacionales</td><td class="monto">(${{ number_format($eerr->otros_gastos_operacionales ?? 0, 0, ',', '.') }})</td></tr>
        <tr class="subtotal"><td>TOTAL GASTOS OPERACIONALES</td><td class="monto">(${{ number_format($eerr->total_gastos_operacionales, 0, ',', '.') }})</td></tr>
    </table>

    <table class="table">
        <tr class="subtotal">
            <td><strong>RESULTADO OPERACIONAL</strong></td>
            <td class="monto {{ $eerr->resultado_operacional >= 0 ? 'positivo' : 'negativo' }}">
                ${{ number_format($eerr->resultado_operacional, 0, ',', '.') }}
            </td>
        </tr>
    </table>

    <div class="highlight">
        <strong>DISTRIBUCIÓN A COPROPIETARIOS (Ley 21.713)</strong><br>
        Monto Distribuido: ${{ number_format($eerr->distribucion_copropietarios, 0, ',', '.') }}<br>
        <em>Monto Art. 17 N°3 LIR (No constituye renta): ${{ number_format($eerr->monto_art_17_n3, 0, ',', '.') }}</em>
    </div>

    <table class="table">
        <tr class="total">
            <td><strong>RESULTADO DEL EJERCICIO</strong></td>
            <td class="monto">
                <strong>${{ number_format($eerr->resultado_ejercicio, 0, ',', '.') }}</strong>
            </td>
        </tr>
    </table>

    <div style="margin-top: 30px; font-size: 8px; text-align: center; color: #666;">
        Generado por DATAPOLIS PRO el {{ now()->format('d/m/Y H:i') }}
    </div>
</body>
</html>
@endsection

{{-- ============================================================== --}}
{{-- CERTIFICADO DE RENTA INDIVIDUAL --}}
{{-- ============================================================== --}}
@section('certificado-renta-individual')
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificado de Renta {{ $detalle->anio }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; margin: 30px; }
        .header { text-align: center; border: 2px solid #2c3e50; padding: 15px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 18px; color: #2c3e50; }
        .header h2 { margin: 5px 0; font-size: 14px; }
        .info-section { margin-bottom: 20px; }
        .info-section h3 { background: #3498db; color: white; padding: 8px; margin: 0 0 10px 0; font-size: 12px; }
        .info-grid { display: table; width: 100%; }
        .info-row { display: table-row; }
        .info-label { display: table-cell; width: 40%; padding: 5px; font-weight: bold; background: #ecf0f1; }
        .info-value { display: table-cell; padding: 5px; }
        .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .table th { background: #34495e; color: white; padding: 8px; text-align: left; }
        .table td { padding: 6px 8px; border: 1px solid #ddd; }
        .table .total { background: #2c3e50; color: white; font-weight: bold; }
        .monto { text-align: right; font-family: monospace; }
        .legal-box { background: #e8f6f3; border: 1px solid #1abc9c; padding: 15px; margin: 20px 0; }
        .legal-box h4 { margin: 0 0 10px 0; color: #16a085; }
        .verification { text-align: center; margin-top: 30px; padding: 15px; border: 1px dashed #999; }
        .verification .code { font-size: 16px; font-weight: bold; letter-spacing: 2px; color: #2c3e50; }
        .footer { margin-top: 30px; font-size: 9px; text-align: center; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CERTIFICADO DE DISTRIBUCIÓN DE INGRESOS</h1>
        <h2>Año Tributario {{ $detalle->anio }}</h2>
        <p>Ley 21.713 - Art. 17 N°3 Ley de Impuesto a la Renta</p>
    </div>

    <div class="info-section">
        <h3>INFORMACIÓN DEL CONTRIBUYENTE</h3>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">RUT:</div>
                <div class="info-value">{{ $detalle->rut_contribuyente }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Nombre/Razón Social:</div>
                <div class="info-value">{{ $detalle->nombre_contribuyente }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Dirección:</div>
                <div class="info-value">{{ $detalle->direccion_contribuyente ?? 'No informada' }}</div>
            </div>
        </div>
    </div>

    <div class="info-section">
        <h3>INFORMACIÓN DE LA PROPIEDAD</h3>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Comunidad/Condominio:</div>
                <div class="info-value">{{ $edificio->nombre }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">RUT Comunidad:</div>
                <div class="info-value">{{ $edificio->rut }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Unidad:</div>
                <div class="info-value">{{ $detalle->numero_unidad }} ({{ $detalle->tipo_unidad }})</div>
            </div>
            <div class="info-row">
                <div class="info-label">Rol de Avalúo:</div>
                <div class="info-value">{{ $detalle->rol_avaluo ?? 'No informado' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Prorrateo:</div>
                <div class="info-value">{{ number_format($detalle->prorrateo * 100, 4) }}%</div>
            </div>
        </div>
    </div>

    <div class="info-section">
        <h3>DETALLE DE DISTRIBUCIÓN MENSUAL</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>Mes</th>
                    <th>Monto Bruto</th>
                    <th>Monto Distribuido</th>
                    <th>Fecha Pago</th>
                </tr>
            </thead>
            <tbody>
                @foreach($detalle_mensual as $mes)
                <tr>
                    <td>{{ $mes['mes'] }}/{{ $detalle->anio }}</td>
                    <td class="monto">${{ number_format($mes['monto_bruto'] ?? $mes['distribuido'], 0, ',', '.') }}</td>
                    <td class="monto">${{ number_format($mes['distribuido'], 0, ',', '.') }}</td>
                    <td>{{ $mes['fecha_pago'] ?? 'Pendiente' }}</td>
                </tr>
                @endforeach
                <tr class="total">
                    <td><strong>TOTAL ANUAL</strong></td>
                    <td class="monto">${{ number_format($detalle->total_ingresos_brutos, 0, ',', '.') }}</td>
                    <td class="monto">${{ number_format($detalle->total_distribuido, 0, ',', '.') }}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="legal-box">
        <h4>INFORMACIÓN TRIBUTARIA</h4>
        <table style="width: 100%;">
            <tr>
                <td style="width: 60%;"><strong>Total Ingresos Percibidos:</strong></td>
                <td class="monto"><strong>${{ number_format($detalle->total_distribuido, 0, ',', '.') }}</strong></td>
            </tr>
            <tr>
                <td><strong>Monto Art. 17 N°3 LIR (NO CONSTITUYE RENTA):</strong></td>
                <td class="monto"><strong>${{ number_format($detalle->monto_art_17_n3, 0, ',', '.') }}</strong></td>
            </tr>
            <tr>
                <td>Monto Afecto a Impuesto:</td>
                <td class="monto">${{ number_format($detalle->monto_afecto_impuesto, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Retenciones Efectuadas:</td>
                <td class="monto">${{ number_format($detalle->retenciones, 0, ',', '.') }}</td>
            </tr>
        </table>
        <p style="margin-top: 10px; font-size: 10px;">
            <em>De acuerdo a la Ley 21.713, los ingresos distribuidos proporcionalmente a los copropietarios 
            por concepto de arriendo de bienes comunes NO constituyen renta según el Art. 17 N°3 de la Ley 
            de Impuesto a la Renta, y por tanto no deben ser declarados en el formulario 22.</em>
        </p>
    </div>

    <div class="verification">
        <p>Código de Verificación</p>
        <p class="code">{{ $detalle->codigo_verificacion }}</p>
        <p style="font-size: 9px;">Verifique este certificado en: https://datapolis.cl/verificar</p>
    </div>

    <div class="footer">
        <p>Certificado generado por DATAPOLIS PRO el {{ now()->format('d/m/Y H:i') }}</p>
        <p>Este certificado tiene validez tributaria según Ley 21.713</p>
    </div>
</body>
</html>
@endsection

{{-- ============================================================== --}}
{{-- CERTIFICADO DE RENTA CONSOLIDADO (Multi-propiedad) --}}
{{-- ============================================================== --}}
@section('certificado-renta-consolidado')
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificado Consolidado {{ $anio }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; margin: 30px; }
        .header { text-align: center; border: 2px solid #8e44ad; padding: 15px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 18px; color: #8e44ad; }
        .info-section { margin-bottom: 20px; }
        .info-section h3 { background: #9b59b6; color: white; padding: 8px; margin: 0 0 10px 0; }
        .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .table th { background: #8e44ad; color: white; padding: 8px; }
        .table td { padding: 6px 8px; border: 1px solid #ddd; }
        .table .total { background: #8e44ad; color: white; font-weight: bold; }
        .monto { text-align: right; font-family: monospace; }
        .summary-box { background: #f5eef8; border: 2px solid #9b59b6; padding: 20px; margin: 20px 0; }
        .summary-box h4 { color: #8e44ad; margin-top: 0; }
        .big-number { font-size: 24px; font-weight: bold; color: #8e44ad; }
        .verification { text-align: center; margin-top: 30px; padding: 15px; border: 1px dashed #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CERTIFICADO CONSOLIDADO DE DISTRIBUCIÓN</h1>
        <h2>Año Tributario {{ $anio }}</h2>
        <p>Consolidado de Todas las Propiedades</p>
    </div>

    <div class="info-section">
        <h3>INFORMACIÓN DEL CONTRIBUYENTE</h3>
        <p><strong>RUT:</strong> {{ $persona->rut }}</p>
        <p><strong>Nombre:</strong> {{ $persona->nombre_completo }}</p>
        <p><strong>Cantidad de Propiedades:</strong> {{ $consolidado['cantidad_propiedades'] }}</p>
    </div>

    <div class="info-section">
        <h3>DETALLE POR PROPIEDAD</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>Edificio/Comunidad</th>
                    <th>Unidad</th>
                    <th>Prorrateo</th>
                    <th>Monto Distribuido</th>
                    <th>Art. 17 N°3</th>
                </tr>
            </thead>
            <tbody>
                @foreach($propiedades as $prop)
                <tr>
                    <td>{{ $prop->edificio_nombre }}</td>
                    <td>{{ $prop->numero_unidad }}</td>
                    <td>{{ number_format($prop->prorrateo * 100, 4) }}%</td>
                    <td class="monto">${{ number_format($prop->total_distribuido, 0, ',', '.') }}</td>
                    <td class="monto">${{ number_format($prop->monto_art_17_n3, 0, ',', '.') }}</td>
                </tr>
                @endforeach
                <tr class="total">
                    <td colspan="3"><strong>TOTAL CONSOLIDADO</strong></td>
                    <td class="monto"><strong>${{ number_format($consolidado['total_distribuido'], 0, ',', '.') }}</strong></td>
                    <td class="monto"><strong>${{ number_format($consolidado['total_art_17_n3'], 0, ',', '.') }}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="summary-box">
        <h4>RESUMEN PARA DECLARACIÓN DE RENTA</h4>
        <p><strong>Total Ingresos por Distribución (todas las propiedades):</strong></p>
        <p class="big-number">${{ number_format($consolidado['total_distribuido'], 0, ',', '.') }}</p>
        <p style="margin-top: 15px;"><strong>Monto que NO debe declarar (Art. 17 N°3 LIR):</strong></p>
        <p class="big-number">${{ number_format($consolidado['total_art_17_n3'], 0, ',', '.') }}</p>
        <hr style="margin: 15px 0;">
        <p><em>La totalidad de los montos distribuidos corresponden a ingresos que NO constituyen renta 
        según el Artículo 17 N°3 de la Ley de Impuesto a la Renta (Ley 21.713), por lo tanto 
        <strong>NO deben ser incluidos en su declaración de renta anual (F22)</strong>.</em></p>
    </div>

    <div class="verification">
        <p>Código de Verificación</p>
        <p style="font-size: 16px; font-weight: bold; letter-spacing: 2px;">{{ $codigo_verificacion }}</p>
        <p style="font-size: 9px;">Verifique en: https://datapolis.cl/verificar</p>
    </div>

    <div style="margin-top: 30px; font-size: 9px; text-align: center; color: #666;">
        <p>Fecha de emisión: {{ $fecha_emision }}</p>
        <p>Generado por DATAPOLIS PRO</p>
    </div>
</body>
</html>
@endsection

{{-- ============================================================== --}}
{{-- CERTIFICADO DE NO DEUDA / PAGO AL DÍA --}}
{{-- ============================================================== --}}
@section('certificado-deuda')
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificado {{ $certificado->tipo }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; margin: 30px; }
        .header { 
            text-align: center; 
            padding: 20px; 
            margin-bottom: 20px; 
            @if($certificado->tiene_deuda)
            border: 3px solid #e74c3c;
            background: #fdf2f2;
            @else
            border: 3px solid #27ae60;
            background: #f2fdf5;
            @endif
        }
        .header h1 { 
            margin: 0; 
            font-size: 20px; 
            @if($certificado->tiene_deuda)
            color: #e74c3c;
            @else
            color: #27ae60;
            @endif
        }
        .status-badge {
            display: inline-block;
            padding: 10px 30px;
            font-size: 14px;
            font-weight: bold;
            margin: 10px 0;
            @if($certificado->tiene_deuda)
            background: #e74c3c;
            @else
            background: #27ae60;
            @endif
            color: white;
        }
        .info-section { margin-bottom: 20px; }
        .info-section h3 { background: #34495e; color: white; padding: 8px; margin: 0 0 10px 0; }
        .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .table th { background: #34495e; color: white; padding: 8px; text-align: left; }
        .table td { padding: 6px 8px; border: 1px solid #ddd; }
        .monto { text-align: right; font-family: monospace; }
        .estado-pagado { color: #27ae60; font-weight: bold; }
        .estado-pendiente { color: #e74c3c; font-weight: bold; }
        .verification { text-align: center; margin-top: 30px; padding: 15px; border: 2px solid #333; }
        .footer { margin-top: 30px; font-size: 9px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        @if($certificado->tipo == 'no_deuda')
            <h1>CERTIFICADO DE NO DEUDA</h1>
            <div class="status-badge">SIN DEUDA PENDIENTE</div>
        @elseif($certificado->tipo == 'pago_al_dia')
            <h1>CERTIFICADO DE PAGO AL DÍA</h1>
            <div class="status-badge">PAGOS AL DÍA</div>
        @else
            <h1>ESTADO DE CUENTA</h1>
            <div class="status-badge">DEUDA PENDIENTE: ${{ number_format($certificado->deuda_total, 0, ',', '.') }}</div>
        @endif
    </div>

    <div class="info-section">
        <h3>INFORMACIÓN DE LA COMUNIDAD</h3>
        <p><strong>Comunidad:</strong> {{ $edificio->nombre }}</p>
        <p><strong>RUT:</strong> {{ $edificio->rut }}</p>
        <p><strong>Dirección:</strong> {{ $edificio->direccion }}, {{ $edificio->comuna }}</p>
    </div>

    <div class="info-section">
        <h3>INFORMACIÓN DE LA UNIDAD</h3>
        <p><strong>Unidad:</strong> {{ $unidad->numero }} ({{ $unidad->tipo }})</p>
        <p><strong>Piso:</strong> {{ $unidad->piso ?? 'N/A' }}</p>
        @if($copropietario)
        <p><strong>Propietario:</strong> {{ $copropietario->nombre_completo }}</p>
        <p><strong>RUT:</strong> {{ $copropietario->rut }}</p>
        @endif
    </div>

    @if($certificado->tiene_deuda)
    <div class="info-section">
        <h3>DETALLE DE DEUDA (al {{ $certificado->fecha_corte }})</h3>
        <table class="table">
            <tr>
                <td>Gastos Comunes</td>
                <td class="monto">${{ number_format($certificado->deuda_gastos_comunes, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Fondo de Reserva</td>
                <td class="monto">${{ number_format($certificado->deuda_fondo_reserva, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Intereses</td>
                <td class="monto">${{ number_format($certificado->deuda_intereses, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Otros</td>
                <td class="monto">${{ number_format($certificado->deuda_otros, 0, ',', '.') }}</td>
            </tr>
            <tr style="background: #e74c3c; color: white; font-weight: bold;">
                <td><strong>TOTAL DEUDA</strong></td>
                <td class="monto"><strong>${{ number_format($certificado->deuda_total, 0, ',', '.') }}</strong></td>
            </tr>
        </table>
    </div>
    @endif

    <div class="info-section">
        <h3>HISTORIAL DE PERÍODOS (últimos 12 meses)</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>Período</th>
                    <th>Monto</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                @foreach(array_slice($periodos, 0, 12) as $periodo)
                <tr>
                    <td>{{ $periodo['periodo'] }}</td>
                    <td class="monto">${{ number_format($periodo['monto'], 0, ',', '.') }}</td>
                    <td class="{{ $periodo['estado'] == 'pagada' ? 'estado-pagado' : 'estado-pendiente' }}">
                        {{ strtoupper($periodo['estado']) }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    @if($certificado->fecha_ultimo_pago)
    <p><strong>Último pago registrado:</strong> {{ $certificado->fecha_ultimo_pago }} 
       por ${{ number_format($certificado->monto_ultimo_pago, 0, ',', '.') }}</p>
    @endif

    <div class="verification">
        <p><strong>Certificado N°:</strong> {{ $certificado->numero_certificado }}</p>
        <p><strong>Código de Verificación:</strong></p>
        <p style="font-size: 18px; font-weight: bold; letter-spacing: 3px;">{{ $certificado->codigo_verificacion }}</p>
        <p style="font-size: 9px;">Verifique en: https://datapolis.cl/verificar/{{ $certificado->codigo_verificacion }}</p>
        <p style="font-size: 9px;"><strong>Válido hasta:</strong> {{ $certificado->fecha_validez }}</p>
    </div>

    <div class="footer">
        <p>Fecha de emisión: {{ $certificado->fecha_emision }}</p>
        <p>Fecha de corte de información: {{ $certificado->fecha_corte }}</p>
        <p>Este certificado es válido por 30 días desde su emisión.</p>
        <p>Generado por DATAPOLIS PRO</p>
    </div>
</body>
</html>
@endsection
