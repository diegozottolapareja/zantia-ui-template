export type EstadoClase = 'programada' | 'en_curso' | 'finalizada' | 'cancelada'
export type TipoClase = 'pilates_reformer' | 'funcional' | 'spinning' | 'yoga' | 'musculacion'

export interface Clase {
  id: string
  nombre: string
  tipo: TipoClase
  profesorId: string
  profesorNombre: string
  fecha: string          // YYYY-MM-DD
  hora: string           // HH:mm
  duracionMin: number
  capacidad: number
  cuposDisponibles: number
  estado: EstadoClase
  sala?: string
}

const HOY = '2026-06-10'
const AYER = '2026-06-09'
const MANANA = '2026-06-11'

export const MOCK_CLASES: Clase[] = [
  // Hoy — Sofía
  { id: 'cls-001', nombre: 'Pilates Reformer', tipo: 'pilates_reformer', profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: HOY, hora: '08:00', duracionMin: 55, capacidad: 10, cuposDisponibles: 2,  estado: 'finalizada', sala: 'Sala 1' },
  { id: 'cls-002', nombre: 'Pilates Reformer', tipo: 'pilates_reformer', profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: HOY, hora: '10:00', duracionMin: 55, capacidad: 10, cuposDisponibles: 0,  estado: 'finalizada', sala: 'Sala 1' },
  { id: 'cls-003', nombre: 'Yoga',             tipo: 'yoga',             profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: HOY, hora: '19:00', duracionMin: 60, capacidad: 15, cuposDisponibles: 5,  estado: 'programada', sala: 'Sala 2' },
  // Hoy — Lucas
  { id: 'cls-004', nombre: 'Funcional',         tipo: 'funcional',        profesorId: 'prof-002', profesorNombre: 'Lucas Fernández', fecha: HOY, hora: '07:00', duracionMin: 50, capacidad: 12, cuposDisponibles: 1,  estado: 'finalizada', sala: 'Patio' },
  { id: 'cls-005', nombre: 'Musculación guiada',tipo: 'musculacion',      profesorId: 'prof-002', profesorNombre: 'Lucas Fernández', fecha: HOY, hora: '18:00', duracionMin: 60, capacidad: 8,  cuposDisponibles: 3,  estado: 'programada', sala: 'Sala 3' },
  // Hoy — Valentina
  { id: 'cls-006', nombre: 'Spinning',          tipo: 'spinning',         profesorId: 'prof-003', profesorNombre: 'Valentina Ruiz',  fecha: HOY, hora: '09:00', duracionMin: 45, capacidad: 20, cuposDisponibles: 0,  estado: 'finalizada', sala: 'Sala Cycling' },
  { id: 'cls-007', nombre: 'Spinning',          tipo: 'spinning',         profesorId: 'prof-003', profesorNombre: 'Valentina Ruiz',  fecha: HOY, hora: '20:00', duracionMin: 45, capacidad: 20, cuposDisponibles: 7,  estado: 'programada', sala: 'Sala Cycling' },
  // Hoy — Martín
  { id: 'cls-008', nombre: 'Funcional',         tipo: 'funcional',        profesorId: 'prof-004', profesorNombre: 'Martín Gómez',   fecha: HOY, hora: '17:00', duracionMin: 50, capacidad: 12, cuposDisponibles: 4,  estado: 'programada', sala: 'Patio' },
  // Ayer
  { id: 'cls-009', nombre: 'Pilates Reformer', tipo: 'pilates_reformer', profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: AYER, hora: '08:00', duracionMin: 55, capacidad: 10, cuposDisponibles: 0, estado: 'finalizada', sala: 'Sala 1' },
  { id: 'cls-010', nombre: 'Funcional',         tipo: 'funcional',        profesorId: 'prof-002', profesorNombre: 'Lucas Fernández', fecha: AYER, hora: '07:00', duracionMin: 50, capacidad: 12, cuposDisponibles: 2, estado: 'finalizada', sala: 'Patio' },
  { id: 'cls-011', nombre: 'Spinning',          tipo: 'spinning',         profesorId: 'prof-003', profesorNombre: 'Valentina Ruiz',  fecha: AYER, hora: '09:00', duracionMin: 45, capacidad: 20, cuposDisponibles: 3, estado: 'finalizada', sala: 'Sala Cycling' },
  // Mañana
  { id: 'cls-012', nombre: 'Pilates Reformer', tipo: 'pilates_reformer', profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: MANANA, hora: '08:00', duracionMin: 55, capacidad: 10, cuposDisponibles: 4, estado: 'programada', sala: 'Sala 1' },
  { id: 'cls-013', nombre: 'Yoga',             tipo: 'yoga',             profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: MANANA, hora: '10:00', duracionMin: 60, capacidad: 15, cuposDisponibles: 8, estado: 'programada', sala: 'Sala 2' },
  { id: 'cls-014', nombre: 'Funcional',         tipo: 'funcional',        profesorId: 'prof-002', profesorNombre: 'Lucas Fernández', fecha: MANANA, hora: '07:00', duracionMin: 50, capacidad: 12, cuposDisponibles: 3, estado: 'programada', sala: 'Patio' },
  { id: 'cls-015', nombre: 'Spinning',          tipo: 'spinning',         profesorId: 'prof-003', profesorNombre: 'Valentina Ruiz',  fecha: MANANA, hora: '09:00', duracionMin: 45, capacidad: 20, cuposDisponibles: 5, estado: 'programada', sala: 'Sala Cycling' },
]

export const ESTADO_CLASE_CONFIG: Record<EstadoClase, { label: string; color: string; bgColor: string }> = {
  programada: { label: 'Programada', color: 'text-blue-700',  bgColor: 'bg-blue-100'  },
  en_curso:   { label: 'En curso',   color: 'text-green-700', bgColor: 'bg-green-100' },
  finalizada: { label: 'Finalizada', color: 'text-gray-600',  bgColor: 'bg-gray-100'  },
  cancelada:  { label: 'Cancelada',  color: 'text-red-700',   bgColor: 'bg-red-100'   },
}

export const TIPO_CLASE_CONFIG: Record<TipoClase, { label: string; color: string; bg: string; textColor: string }> = {
  pilates_reformer: { label: 'Pilates Reformer', color: 'from-purple-500 to-violet-600', bg: 'bg-purple-100', textColor: 'text-purple-700' },
  funcional:        { label: 'Funcional',         color: 'from-orange-500 to-red-500',    bg: 'bg-orange-100', textColor: 'text-orange-700' },
  spinning:         { label: 'Spinning',           color: 'from-blue-500 to-cyan-500',     bg: 'bg-blue-100',   textColor: 'text-blue-700'   },
  yoga:             { label: 'Yoga',               color: 'from-green-500 to-teal-500',    bg: 'bg-green-100',  textColor: 'text-green-700'  },
  musculacion:      { label: 'Musculación',        color: 'from-gray-600 to-gray-800',     bg: 'bg-gray-100',   textColor: 'text-gray-700'   },
}
