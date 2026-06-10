export type Producto = 'soja' | 'maiz' | 'trigo' | 'girasol' | 'sorgo' | 'cebada'
export type Puerto = 'rosario' | 'up_river' | 'bahia_blanca' | 'quequen' | 'planta'
export type TipoComprador = 'exportador' | 'aceitera' | 'molino' | 'feedlot'

export const PRODUCTO_CONFIG: Record<Producto, { label: string; color: string; bg: string; textColor: string }> = {
  soja:    { label: 'Soja',    color: 'from-lime-600 to-green-700',    bg: 'bg-lime-100',   textColor: 'text-lime-700' },
  maiz:    { label: 'Maíz',   color: 'from-yellow-500 to-amber-600',  bg: 'bg-yellow-100', textColor: 'text-yellow-700' },
  trigo:   { label: 'Trigo',  color: 'from-amber-500 to-orange-600',  bg: 'bg-amber-100',  textColor: 'text-amber-700' },
  girasol: { label: 'Girasol',color: 'from-yellow-400 to-amber-500',  bg: 'bg-yellow-50',  textColor: 'text-amber-600' },
  sorgo:   { label: 'Sorgo',  color: 'from-orange-600 to-red-600',    bg: 'bg-orange-100', textColor: 'text-orange-700' },
  cebada:  { label: 'Cebada', color: 'from-emerald-500 to-teal-600',  bg: 'bg-emerald-100',textColor: 'text-emerald-700' },
}

export const PUERTO_LABEL: Record<Puerto, string> = {
  rosario:      'Rosario (km 451)',
  up_river:     'Up-River / San Lorenzo',
  bahia_blanca: 'Bahía Blanca',
  quequen:      'Quequén / Necochea',
  planta:       'Planta local',
}

export const TIPO_COMPRADOR_LABEL: Record<TipoComprador, string> = {
  exportador: 'Exportador',
  aceitera:   'Aceitera',
  molino:     'Molino',
  feedlot:    'Feedlot',
}
