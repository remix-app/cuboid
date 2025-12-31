{{-- resources/views/pdf/boleta-gc.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Boleta Gastos Comunes</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 20px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 18px; }
        .header p { margin: 5px 0; color: #666; }
        .info-box { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background: #333; color: white; }
        .total-row { font-weight: bold; background: #f0f0f0; }
        .amount { text-align: right; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
        .watermark { position: fixed; bottom: 100px; right: 50px; opacity: 0.1; font-size: 60px; transform: rotate(-45deg); }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $boleta->edificio }}</h1>
        <p>{{ $boleta->direccion }}</p>
        <p>RUT: {{ $boleta->edificio_rut }}</p>
    </div>

    <h2 style="text-align: center; margin-bottom: 20px;">BOLETA DE GASTOS COMUNES</h2>

    <div class="info-box">
        <div class="info-row">
            <span><strong>N° Boleta:</strong> {{ $boleta->numero_boleta }}</span>
            <span><strong>Período:</strong> {{ $boleta->mes }}/{{ $boleta->anio }}</span>
        </div>
        <div class="info-row">
            <span><strong>Unidad:</strong> {{ $boleta->unidad }}</span>
            <span><strong>Fecha Emisión:</strong> {{ \Carbon\Carbon::parse($boleta->fecha_emision)->format('d/m/Y') }}</span>
        </div>
        <div class="info-row">
            <span><strong>Propietario:</strong> {{ $boleta->propietario ?? 'N/A' }}</span>
            <span><strong>Vencimiento:</strong> {{ \Carbon\Carbon::parse($boleta->fecha_vencimiento)->format('d/m/Y') }}</span>
        </div>
        <div class="info-row">
            <span><strong>RUT:</strong> {{ $boleta->propietario_rut ?? 'N/A' }}</span>
            <span></span>
        </div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Concepto</th>
                <th class="amount">Monto</th>
            </tr>
        </thead>
        <tbody>
            @foreach($cargos as $cargo)
            <tr>
                <td>{{ $cargo->descripcion }}</td>
                <td class="amount">${{ number_format($cargo->monto, 0, ',', '.') }}</td>
            </tr>
            @endforeach
            @if($boleta->saldo_anterior > 0)
            <tr>
                <td>Saldo Anterior</td>
                <td class="amount">${{ number_format($boleta->saldo_anterior, 0, ',', '.') }}</td>
            </tr>
            @endif
            @if($boleta->total_intereses > 0)
            <tr>
                <td>Intereses por Mora</td>
                <td class="amount">${{ number_format($boleta->total_intereses, 0, ',', '.') }}</td>
            </tr>
            @endif
            <tr class="total-row">
                <td><strong>TOTAL A PAGAR</strong></td>
                <td class="amount"><strong>${{ number_format($boleta->total_a_pagar, 0, ',', '.') }}</strong></td>
            </tr>
        </tbody>
    </table>

    @if($boleta->observaciones)
    <p><strong>Observaciones:</strong> {{ $boleta->observaciones }}</p>
    @endif

    <div style="margin-top: 30px; padding: 15px; border: 1px dashed #999;">
        <p style="margin: 0;"><strong>Datos para Transferencia:</strong></p>
        <p style="margin: 5px 0;">Banco: [BANCO]</p>
        <p style="margin: 5px 0;">Cuenta Corriente: [NÚMERO]</p>
        <p style="margin: 5px 0;">RUT: {{ $boleta->edificio_rut }}</p>
        <p style="margin: 5px 0;">Email: [EMAIL]</p>
    </div>

    <div class="footer">
        <p>Documento generado por DATAPOLIS PRO - Sistema de Gestión de Comunidades</p>
        <p>{{ now()->format('d/m/Y H:i') }}</p>
    </div>

    @if($boleta->estado === 'pagada')
    <div class="watermark">PAGADA</div>
    @endif
</body>
</html>

{{-- resources/views/pdf/liquidacion.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Liquidación de Sueldo</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11px; margin: 0; padding: 15px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
        .section { margin-bottom: 15px; }
        .section-title { background: #333; color: white; padding: 5px 10px; font-weight: bold; margin-bottom: 10px; }
        .row { display: flex; justify-content: space-between; padding: 3px 10px; }
        .row:nth-child(even) { background: #f5f5f5; }
        .total { font-weight: bold; border-top: 2px solid #333; padding-top: 5px; margin-top: 5px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .box { border: 1px solid #ddd; padding: 10px; }
        .highlight { background: #e8f5e9; padding: 10px; text-align: center; margin-top: 15px; }
        .highlight .amount { font-size: 20px; font-weight: bold; color: #2e7d32; }
    </style>
</head>
<body>
    <div class="header">
        <h2 style="margin: 0;">LIQUIDACIÓN DE REMUNERACIONES</h2>
        <p>Período: {{ $liquidacion->mes }}/{{ $liquidacion->anio }}</p>
    </div>

    <div class="grid">
        <div class="box">
            <strong>EMPLEADOR</strong><br>
            RUT: [RUT_EMPRESA]<br>
            [NOMBRE_EMPRESA]<br>
            [DIRECCION]
        </div>
        <div class="box">
            <strong>TRABAJADOR</strong><br>
            RUT: {{ $liquidacion->rut }}<br>
            {{ $liquidacion->nombres }} {{ $liquidacion->apellido_paterno }}<br>
            Cargo: {{ $liquidacion->cargo ?? 'N/A' }}
        </div>
    </div>

    <div class="section">
        <div class="section-title">HABERES</div>
        <div class="row"><span>Sueldo Base</span><span>${{ number_format($liquidacion->sueldo_base, 0, ',', '.') }}</span></div>
        @if($liquidacion->gratificacion > 0)
        <div class="row"><span>Gratificación Legal</span><span>${{ number_format($liquidacion->gratificacion, 0, ',', '.') }}</span></div>
        @endif
        @if($liquidacion->asignacion_colacion > 0)
        <div class="row"><span>Colación</span><span>${{ number_format($liquidacion->asignacion_colacion, 0, ',', '.') }}</span></div>
        @endif
        @if($liquidacion->asignacion_movilizacion > 0)
        <div class="row"><span>Movilización</span><span>${{ number_format($liquidacion->asignacion_movilizacion, 0, ',', '.') }}</span></div>
        @endif
        @if($liquidacion->monto_horas_extras_50 > 0)
        <div class="row"><span>Horas Extras 50%</span><span>${{ number_format($liquidacion->monto_horas_extras_50, 0, ',', '.') }}</span></div>
        @endif
        <div class="row total"><span>TOTAL HABERES</span><span>${{ number_format($liquidacion->total_haberes, 0, ',', '.') }}</span></div>
    </div>

    <div class="section">
        <div class="section-title">DESCUENTOS LEGALES</div>
        <div class="row"><span>AFP ({{ $liquidacion->afp_tasa }}%)</span><span>${{ number_format($liquidacion->afp, 0, ',', '.') }}</span></div>
        <div class="row"><span>Salud ({{ $liquidacion->salud_tasa }}%)</span><span>${{ number_format($liquidacion->salud, 0, ',', '.') }}</span></div>
        @if($liquidacion->seguro_cesantia > 0)
        <div class="row"><span>Seguro Cesantía (0.6%)</span><span>${{ number_format($liquidacion->seguro_cesantia, 0, ',', '.') }}</span></div>
        @endif
        @if($liquidacion->impuesto_unico > 0)
        <div class="row"><span>Impuesto Único</span><span>${{ number_format($liquidacion->impuesto_unico, 0, ',', '.') }}</span></div>
        @endif
        <div class="row total"><span>TOTAL DESCUENTOS</span><span>${{ number_format($liquidacion->total_descuentos, 0, ',', '.') }}</span></div>
    </div>

    <div class="highlight">
        <p style="margin: 0;">LÍQUIDO A PAGAR</p>
        <p class="amount">${{ number_format($liquidacion->sueldo_liquido, 0, ',', '.') }}</p>
    </div>

    <div style="margin-top: 20px; font-size: 10px; color: #666;">
        <p><strong>Indicadores del mes:</strong> UF: ${{ number_format($liquidacion->uf_valor, 2, ',', '.') }} | UTM: ${{ number_format($liquidacion->utm_valor, 0, ',', '.') }}</p>
        <p>Tope Imponible: ${{ number_format($liquidacion->tope_imponible, 0, ',', '.') }}</p>
    </div>

    <div style="margin-top: 40px; display: flex; justify-content: space-between;">
        <div style="width: 40%; border-top: 1px solid #333; text-align: center; padding-top: 5px;">
            Firma Empleador
        </div>
        <div style="width: 40%; border-top: 1px solid #333; text-align: center; padding-top: 5px;">
            Firma Trabajador
        </div>
    </div>
</body>
</html>

{{-- resources/views/pdf/certificado-renta.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificado de Renta</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: 16px; margin: 0; }
        .content { line-height: 1.8; }
        .data-table { width: 100%; margin: 20px 0; border-collapse: collapse; }
        .data-table td { padding: 8px; border: 1px solid #ddd; }
        .data-table td:first-child { background: #f5f5f5; font-weight: bold; width: 40%; }
        .legal-box { background: #f0f7ff; border: 1px solid #c0d8f0; padding: 15px; margin: 20px 0; font-size: 11px; }
        .signature { margin-top: 50px; text-align: center; }
        .verification { margin-top: 30px; padding: 15px; border: 2px dashed #999; text-align: center; }
        .verification code { font-size: 16px; font-weight: bold; letter-spacing: 2px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CERTIFICADO DE RENTAS PERCIBIDAS</h1>
        <p>Año Tributario {{ $certificado->anio + 1 }} (Rentas {{ $certificado->anio }})</p>
        <p>N° {{ $certificado->numero_certificado }}</p>
    </div>

    <div class="content">
        <p>Mediante el presente documento, la comunidad <strong>{{ $certificado->edificio }}</strong>, certifica que:</p>

        <table class="data-table">
            <tr>
                <td>Nombre/Razón Social</td>
                <td>{{ $certificado->nombre_completo }}</td>
            </tr>
            <tr>
                <td>RUT</td>
                <td>{{ $certificado->rut }}</td>
            </tr>
            <tr>
                <td>Unidad</td>
                <td>{{ $certificado->numero }}</td>
            </tr>
            <tr>
                <td>Período</td>
                <td>Enero a Diciembre {{ $certificado->anio }}</td>
            </tr>
        </table>

        <p>Ha percibido durante el año {{ $certificado->anio }} las siguientes rentas por concepto de distribución de ingresos de bienes comunes:</p>

        <table class="data-table">
            <tr>
                <td>Renta Total Percibida</td>
                <td>${{ number_format($certificado->renta_total, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Renta Art. 17 N°3 (No Renta)</td>
                <td>${{ number_format($certificado->renta_articulo_17, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Renta Art. 20 (Afecta)</td>
                <td>${{ number_format($certificado->renta_articulo_20, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Retenciones</td>
                <td>${{ number_format($certificado->retenciones, 0, ',', '.') }}</td>
            </tr>
        </table>

        <div class="legal-box">
            <strong>Base Legal:</strong><br>
            Conforme a lo establecido en el Artículo 17 N°3 de la Ley sobre Impuesto a la Renta y las modificaciones introducidas por la Ley 21.713, los montos distribuidos proporcionalmente a los derechos de cada copropietario no constituyen renta para efectos tributarios.
        </div>

        <p>Se extiende el presente certificado para los fines tributarios que el interesado estime conveniente.</p>
    </div>

    <div class="signature">
        <p>Santiago, {{ \Carbon\Carbon::parse($certificado->fecha_emision)->format('d \d\e F \d\e Y') }}</p>
        <br><br>
        <div style="border-top: 1px solid #333; width: 200px; margin: 0 auto; padding-top: 5px;">
            Administrador
        </div>
    </div>

    <div class="verification">
        <p>Código de Verificación</p>
        <code>{{ $certificado->codigo_verificacion }}</code>
        <p style="font-size: 10px; color: #666; margin-top: 10px;">
            Verifique la autenticidad en: https://datapolis.cl/verificar/{{ $certificado->codigo_verificacion }}
        </p>
    </div>
</body>
</html>
