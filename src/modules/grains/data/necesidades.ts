import type { Producto, Puerto, TipoComprador } from './tipos'

export interface Necesidad {
  id: string
  compradorId: string
  compradorNombre: string
  tipoComprador: TipoComprador
  producto: Producto
  volumen: number           // toneladas
  destino: Puerto
  precioFAS: number         // USD/tn ofrecido FAS en destino
  humedadMax: number        // %
  gradoMin: number          // grado mínimo aceptado (1 = mejor)
  proteinaMin?: number
  ventanaDesde: string
  ventanaHasta: string
  estado: 'activa' | 'cerrada'
  notas?: string
}

export const MOCK_NECESIDADES: Necesidad[] = [
  {
    id: 'nec-1',
    compradorId: 'c1',
    compradorNombre: 'AGD',
    tipoComprador: 'aceitera',
    producto: 'soja',
    volumen: 2000,
    destino: 'rosario',
    precioFAS: 275,
    humedadMax: 13.5,
    gradoMin: 1,
    proteinaMin: 34,
    ventanaDesde: '2026-06-01',
    ventanaHasta: '2026-08-31',
    estado: 'activa',
    notas: 'Pago a 48hs de entrega. Requiere certificado de calidad.',
  },
  {
    id: 'nec-2',
    compradorId: 'c2',
    compradorNombre: 'Cargill Argentina',
    tipoComprador: 'exportador',
    producto: 'maiz',
    volumen: 3000,
    destino: 'up_river',
    precioFAS: 182,
    humedadMax: 14.5,
    gradoMin: 2,
    ventanaDesde: '2026-05-01',
    ventanaHasta: '2026-07-31',
    estado: 'activa',
    notas: 'Ventana de embarque julio. Flexible en grado.',
  },
  {
    id: 'nec-3',
    compradorId: 'c3',
    compradorNombre: 'Molinos Río de la Plata',
    tipoComprador: 'molino',
    producto: 'trigo',
    volumen: 1500,
    destino: 'rosario',
    precioFAS: 215,
    humedadMax: 13.0,
    gradoMin: 1,
    proteinaMin: 12,
    ventanaDesde: '2026-07-01',
    ventanaHasta: '2026-09-30',
    estado: 'activa',
    notas: 'Calidad molinera obligatoria. Falling number > 350.',
  },
  {
    id: 'nec-4',
    compradorId: 'c4',
    compradorNombre: 'Bunge (Oleaginosa Moreno)',
    tipoComprador: 'aceitera',
    producto: 'girasol',
    volumen: 800,
    destino: 'bahia_blanca',
    precioFAS: 355,
    humedadMax: 10.0,
    gradoMin: 1,
    ventanaDesde: '2026-06-01',
    ventanaHasta: '2026-08-31',
    estado: 'activa',
    notas: 'Solo alto oleico. Aceite mínimo 44%.',
  },
]
