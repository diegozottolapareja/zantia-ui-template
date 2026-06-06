import type { Posicion } from '@/data/mock/posiciones'
import type { Necesidad } from '@/data/mock/necesidades'
import type { Producto } from '@/data/mock/tipos'
import type { Parametros } from '@/app/contexts/ParametrosContext'

export interface CalcInput {
  producto: Producto
  fasComprador: number          // USD/tn ofrecido FAS en destino
  volumen: number               // toneladas
  distanciaKm: number           // lote → puerto
  humedad: number               // %
  proteina?: number
  grado: number                 // 1 = mejor
  precioBaseVendedor?: number   // USD/tn pretendido por el vendedor
  fobReferencia?: number        // USD/tn FOB para cálculo teórico
}

export interface LineaBreakdown {
  concepto: string
  valorTn: number         // USD/tn (negativo = descuento)
  detalle?: string
}

export interface CalcBreakdown {
  // Input
  fasComprador: number
  volumen: number
  distanciaKm: number

  // Breakdown lines (para mostrar desglose)
  lineas: LineaBreakdown[]

  // Resultados
  flete: number
  descuentoHumedad: number
  descuentoZarandeo: number
  ajusteGrado: number
  comisionTn: number
  netoPorTn: number
  netoTotal: number
  comisionTotal: number

  // Calidad
  cumpleCalidad: boolean

  // Referencia FOB (opcional)
  fobReferencia?: number
  retencionesTn?: number
  fasTeoricoTn?: number
  deltaFas?: number             // fasComprador − fasTeórico (positivo = buena oferta)

  // Viabilidad comercial
  aceptaPrecio: boolean         // neto ≥ precioBaseVendedor
  diferenciaPrecio: number      // neto − precioBase (positivo = acepta)
}

export function calcular(input: CalcInput, params: Parametros): CalcBreakdown {
  const { producto, fasComprador, volumen, distanciaKm, humedad, grado, precioBaseVendedor, fobReferencia } = input

  // ── 1. Flete ────────────────────────────────────────────────────────────────
  const flete = distanciaKm <= 100
    ? params.fleteBase
    : params.fleteBase + (distanciaKm - 100) * params.fletePorKm

  // ── 2. Calidad ───────────────────────────────────────────────────────────────
  const humStd = params.humedadStd[producto]
  const excessHumedad = Math.max(0, humedad - humStd)
  const descuentoHumedad = excessHumedad * params.secadoPorPorcentaje * fasComprador

  const descuentoZarandeo = excessHumedad > 0 || grado > 1 ? params.zarandeo : 0

  const ajusteGrado = (grado - 1) * 0.005 * fasComprador  // 0.5% por grado por debajo de G1

  // ── 3. Comisión ──────────────────────────────────────────────────────────────
  const comisionTn = fasComprador * params.comisionPorc

  // ── 4. Neto al vendedor ──────────────────────────────────────────────────────
  const netoPorTn = fasComprador - flete - descuentoHumedad - descuentoZarandeo - ajusteGrado - comisionTn
  const netoTotal = netoPorTn * volumen
  const comisionTotal = comisionTn * volumen

  // ── 5. Desglose para UI ──────────────────────────────────────────────────────
  const lineas: LineaBreakdown[] = [
    {
      concepto: 'FAS comprador',
      valorTn: fasComprador,
      detalle: `Precio ofrecido en destino`,
    },
    {
      concepto: `Flete (${distanciaKm} km → puerto)`,
      valorTn: -flete,
      detalle: `Base USD ${params.fleteBase} + USD ${params.fletePorKm}/km`,
    },
  ]

  if (descuentoHumedad > 0) {
    lineas.push({
      concepto: `Secado / humedad (${excessHumedad.toFixed(1)}% exceso)`,
      valorTn: -descuentoHumedad,
      detalle: `Humedad ${humedad}% vs estándar ${humStd}%`,
    })
  }

  if (descuentoZarandeo > 0) {
    lineas.push({ concepto: 'Zarandeo / mermas', valorTn: -descuentoZarandeo })
  }

  if (ajusteGrado > 0) {
    lineas.push({
      concepto: `Ajuste grado (G${grado})`,
      valorTn: -ajusteGrado,
      detalle: `Descuento 0.5% por grado por debajo de G1`,
    })
  }

  lineas.push({
    concepto: `Comisión corredor (${(params.comisionPorc * 100).toFixed(1)}%)`,
    valorTn: -comisionTn,
  })

  // ── 6. Referencia FOB ────────────────────────────────────────────────────────
  let fobRef: number | undefined
  let retencionesTn: number | undefined
  let fasTeoricoTn: number | undefined
  let deltaFas: number | undefined

  if (fobReferencia) {
    fobRef = fobReferencia
    retencionesTn = fobReferencia * params.retenciones[producto]
    fasTeoricoTn = fobReferencia - retencionesTn
    deltaFas = fasComprador - fasTeoricoTn
  }

  // ── 7. Viabilidad ────────────────────────────────────────────────────────────
  const aceptaPrecio = precioBaseVendedor != null ? netoPorTn >= precioBaseVendedor : true
  const diferenciaPrecio = precioBaseVendedor != null ? netoPorTn - precioBaseVendedor : 0

  return {
    fasComprador,
    volumen,
    distanciaKm,
    lineas,
    flete,
    descuentoHumedad,
    descuentoZarandeo,
    ajusteGrado,
    comisionTn,
    netoPorTn,
    netoTotal,
    comisionTotal,
    cumpleCalidad: true,  // populated by match engine
    fobReferencia: fobRef,
    retencionesTn,
    fasTeoricoTn,
    deltaFas,
    aceptaPrecio,
    diferenciaPrecio,
  }
}

// ── Match calculation: posicion × necesidad ──────────────────────────────────
export function calcularMatch(pos: Posicion, nec: Necesidad, params: Parametros): CalcBreakdown {
  const result = calcular({
    producto: pos.producto,
    fasComprador: nec.precioFAS,
    volumen: pos.volumen,
    distanciaKm: pos.distanciaRosario,
    humedad: pos.humedad,
    proteina: pos.proteina,
    grado: pos.grado,
    precioBaseVendedor: pos.precioBase,
  }, params)

  // Quality compliance check
  const cumpleCalidad =
    pos.humedad <= nec.humedadMax &&
    pos.grado <= nec.gradoMin &&
    (!nec.proteinaMin || !pos.proteina || pos.proteina >= nec.proteinaMin)

  return { ...result, cumpleCalidad }
}
