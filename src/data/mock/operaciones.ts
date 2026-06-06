import type { Producto } from './tipos'

export type EstadoNegociacion =
  | 'en_negociacion'   // corredor está negociando con ambas partes
  | 'acordada'         // precio y condiciones cerradas, falta logística/boleto
  | 'en_transito'      // mercadería en movimiento
  | 'liquidada'        // operación completamente cerrada y pagada
  | 'cancelada'

export type PendienteDe = 'vendedor' | 'comprador' | 'corredor' | null

export interface NotaNegociacion {
  id: string
  fecha: string
  autor: 'corredor' | 'vendedor' | 'comprador' | 'sistema'
  autorNombre: string
  texto: string
}

export interface Negociacion {
  id: string
  posId: string
  necId: string
  // denormalized
  vendedorNombre: string
  compradorNombre: string
  vendedorTelefono: string
  compradorContacto: string
  producto: Producto
  volumen: number
  precioFASAcordado: number
  netoPorTn: number
  comisionPorTn: number
  comisionTotal: number
  estado: EstadoNegociacion
  fechaInicio: string
  fechaUltimaAccion: string
  accionPendiente?: string
  pendienteDe: PendienteDe
  notas: NotaNegociacion[]
}

export const MOCK_NEGOCIACIONES: Negociacion[] = [
  {
    id: 'neg-1',
    posId: 'pos-5',
    necId: 'nec-2',
    vendedorNombre: 'Est. Don Ángel',
    compradorNombre: 'Cargill Argentina',
    vendedorTelefono: '+54 236 456-7890',
    compradorContacto: '+54 11 4321-0000',
    producto: 'maiz',
    volumen: 800,
    precioFASAcordado: 182,
    netoPorTn: 156.3,
    comisionPorTn: 2.73,
    comisionTotal: 2184,
    estado: 'en_negociacion',
    fechaInicio: '2026-06-04',
    fechaUltimaAccion: '2026-06-05',
    accionPendiente: 'Vendedor debe confirmar precio FAS USD 182 y ventana de entrega julio',
    pendienteDe: 'vendedor',
    notas: [
      { id: 'n1', fecha: '2026-06-04T10:00', autor: 'sistema',   autorNombre: 'Sistema',            texto: 'Negociación iniciada desde match Est. Don Ángel → Cargill' },
      { id: 'n2', fecha: '2026-06-04T11:30', autor: 'corredor',  autorNombre: 'Vos',                texto: 'Llamé a Carlos Ángel. Interesado en el precio. Va a confirmar mañana.' },
      { id: 'n3', fecha: '2026-06-05T09:15', autor: 'corredor',  autorNombre: 'Vos',                texto: 'Cargill confirmó la ventana de embarque julio. Esperando respuesta del vendedor.' },
    ],
  },
  {
    id: 'neg-2',
    posId: 'pos-1',
    necId: 'nec-1',
    vendedorNombre: 'Juan Traverso',
    compradorNombre: 'AGD',
    vendedorTelefono: '+54 358 456-7890',
    compradorContacto: '+54 341 459-0000',
    producto: 'soja',
    volumen: 500,
    precioFASAcordado: 274,
    netoPorTn: 243.1,
    comisionPorTn: 4.11,
    comisionTotal: 2055,
    estado: 'acordada',
    fechaInicio: '2026-06-01',
    fechaUltimaAccion: '2026-06-05',
    accionPendiente: 'Emitir boleto de compraventa y coordinar fecha de entrega con transportista',
    pendienteDe: 'corredor',
    notas: [
      { id: 'n4', fecha: '2026-06-01T09:00', autor: 'sistema',   autorNombre: 'Sistema',            texto: 'Negociación iniciada desde match Juan Traverso → AGD' },
      { id: 'n5', fecha: '2026-06-02T14:00', autor: 'corredor',  autorNombre: 'Vos',                texto: 'Traverso acepta USD 274 FAS. Dice que puede cargar la primera semana de julio.' },
      { id: 'n6', fecha: '2026-06-03T10:00', autor: 'vendedor',  autorNombre: 'Juan Traverso',      texto: 'Confirmo condiciones. Necesito el boleto antes del viernes.' },
      { id: 'n7', fecha: '2026-06-05T16:00', autor: 'comprador', autorNombre: 'AGD',                texto: 'Precio aceptado. Esperamos documentación para reservar posición en planta.' },
    ],
  },
  {
    id: 'neg-3',
    posId: 'pos-2',
    necId: 'nec-3',
    vendedorNombre: 'Coop. Agrop. del Norte',
    compradorNombre: 'Molinos Río de la Plata',
    vendedorTelefono: '+54 2477 42-3456',
    compradorContacto: '+54 11 4310-0000',
    producto: 'trigo',
    volumen: 500,
    precioFASAcordado: 212,
    netoPorTn: 193.6,
    comisionPorTn: 3.18,
    comisionTotal: 1590,
    estado: 'en_transito',
    fechaInicio: '2026-05-28',
    fechaUltimaAccion: '2026-06-04',
    accionPendiente: 'Comprador debe confirmar recepción y calidad del lote en planta',
    pendienteDe: 'comprador',
    notas: [
      { id: 'n8',  fecha: '2026-05-28T09:00', autor: 'sistema',   autorNombre: 'Sistema',            texto: 'Negociación iniciada' },
      { id: 'n9',  fecha: '2026-05-29T11:00', autor: 'corredor',  autorNombre: 'Vos',                texto: 'Ambas partes acordaron precio y condiciones de calidad.' },
      { id: 'n10', fecha: '2026-06-02T08:30', autor: 'sistema',   autorNombre: 'Sistema',            texto: 'Estado actualizado a En tránsito' },
      { id: 'n11', fecha: '2026-06-04T14:00', autor: 'corredor',  autorNombre: 'Vos',                texto: 'Camiones salieron de Pergamino. ETA Rosario: 06/06.' },
    ],
  },
  {
    id: 'neg-4',
    posId: 'pos-4',
    necId: 'nec-1',
    vendedorNombre: 'Los Robles SA',
    compradorNombre: 'AGD',
    vendedorTelefono: '+54 342 123-4567',
    compradorContacto: '+54 341 459-0000',
    producto: 'soja',
    volumen: 350,
    precioFASAcordado: 274,
    netoPorTn: 244.2,
    comisionPorTn: 4.11,
    comisionTotal: 1438.5,
    estado: 'liquidada',
    fechaInicio: '2026-05-15',
    fechaUltimaAccion: '2026-06-03',
    pendienteDe: null,
    notas: [
      { id: 'n12', fecha: '2026-05-15T09:00', autor: 'sistema',  autorNombre: 'Sistema',  texto: 'Negociación iniciada' },
      { id: 'n13', fecha: '2026-06-01T10:00', autor: 'sistema',  autorNombre: 'Sistema',  texto: 'Estado actualizado a En tránsito' },
      { id: 'n14', fecha: '2026-06-03T12:00', autor: 'sistema',  autorNombre: 'Sistema',  texto: 'Operación liquidada. Pago confirmado por AGD.' },
    ],
  },
  {
    id: 'neg-5',
    posId: 'pos-3',
    necId: 'nec-2',
    vendedorNombre: 'Coop. Agrop. del Norte',
    compradorNombre: 'Cargill Argentina',
    vendedorTelefono: '+54 2477 42-3456',
    compradorContacto: '+54 11 4321-0000',
    producto: 'maiz',
    volumen: 600,
    precioFASAcordado: 180,
    netoPorTn: 154.8,
    comisionPorTn: 2.7,
    comisionTotal: 1620,
    estado: 'liquidada',
    fechaInicio: '2026-05-10',
    fechaUltimaAccion: '2026-05-25',
    pendienteDe: null,
    notas: [
      { id: 'n15', fecha: '2026-05-10T09:00', autor: 'sistema', autorNombre: 'Sistema', texto: 'Negociación iniciada' },
      { id: 'n16', fecha: '2026-05-25T15:00', autor: 'sistema', autorNombre: 'Sistema', texto: 'Operación liquidada.' },
    ],
  },
]

export const ESTADO_NEG_CONFIG: Record<EstadoNegociacion, {
  label: string
  color: string
  bgColor: string
  orden: number
  descripcion: string
}> = {
  en_negociacion: { label: 'En negociación', color: 'text-orange-600',   bgColor: 'bg-orange-50',           orden: 1, descripcion: 'Partes acordando condiciones' },
  acordada:       { label: 'Acordada',       color: 'text-blue-600',     bgColor: 'bg-blue-50',             orden: 2, descripcion: 'Condiciones cerradas, pendiente logística' },
  en_transito:    { label: 'En tránsito',    color: 'text-purple-600',   bgColor: 'bg-purple-50',           orden: 3, descripcion: 'Mercadería en movimiento' },
  liquidada:      { label: 'Liquidada',      color: 'text-success',      bgColor: 'bg-success/10',          orden: 4, descripcion: 'Operación completamente cerrada' },
  cancelada:      { label: 'Cancelada',      color: 'text-destructive',  bgColor: 'bg-destructive/10',      orden: 5, descripcion: 'Negociación no concretada' },
}

export const PENDIENTE_DE_CONFIG: Record<NonNullable<PendienteDe>, { label: string; color: string }> = {
  vendedor:   { label: 'Espera: Vendedor',  color: 'text-orange-600 bg-orange-50' },
  comprador:  { label: 'Espera: Comprador', color: 'text-blue-600 bg-blue-50' },
  corredor:   { label: 'Acción tuya',       color: 'text-destructive bg-destructive/10' },
}
