export type EstadoReserva = 'confirmada' | 'cancelada' | 'no_show'

export interface Reserva {
  id: string
  claseId: string
  claseNombre: string
  alumnoId: string
  alumnoNombre: string
  fecha: string
  hora: string
  estado: EstadoReserva
  fechaReserva: string
}

const HOY = '2026-06-10'
const AYER = '2026-06-09'
const MANANA = '2026-06-11'

export const MOCK_RESERVAS: Reserva[] = [
  // Hoy — Pilates Reformer 08:00 (cls-001) — ya finalizada
  { id: 'res-001', claseId: 'cls-001', claseNombre: 'Pilates Reformer', alumnoId: 'alu-001', alumnoNombre: 'Camila Torres',     fecha: HOY, hora: '08:00', estado: 'confirmada', fechaReserva: '2026-06-08' },
  { id: 'res-002', claseId: 'cls-001', claseNombre: 'Pilates Reformer', alumnoId: 'alu-003', alumnoNombre: 'Lucía Ramírez',     fecha: HOY, hora: '08:00', estado: 'confirmada', fechaReserva: '2026-06-08' },
  { id: 'res-003', claseId: 'cls-001', claseNombre: 'Pilates Reformer', alumnoId: 'alu-005', alumnoNombre: 'Florencia Mendez',  fecha: HOY, hora: '08:00', estado: 'no_show',    fechaReserva: '2026-06-08' },
  { id: 'res-004', claseId: 'cls-001', claseNombre: 'Pilates Reformer', alumnoId: 'alu-007', alumnoNombre: 'Martina Díaz',      fecha: HOY, hora: '08:00', estado: 'confirmada', fechaReserva: '2026-06-09' },
  { id: 'res-005', claseId: 'cls-001', claseNombre: 'Pilates Reformer', alumnoId: 'alu-009', alumnoNombre: 'Julia Acosta',      fecha: HOY, hora: '08:00', estado: 'confirmada', fechaReserva: '2026-06-07' },

  // Hoy — Yoga 19:00 (cls-003) — programada
  { id: 'res-006', claseId: 'cls-003', claseNombre: 'Yoga', alumnoId: 'alu-001', alumnoNombre: 'Camila Torres',   fecha: HOY, hora: '19:00', estado: 'confirmada', fechaReserva: '2026-06-09' },
  { id: 'res-007', claseId: 'cls-003', claseNombre: 'Yoga', alumnoId: 'alu-003', alumnoNombre: 'Lucía Ramírez',   fecha: HOY, hora: '19:00', estado: 'confirmada', fechaReserva: '2026-06-09' },
  { id: 'res-008', claseId: 'cls-003', claseNombre: 'Yoga', alumnoId: 'alu-007', alumnoNombre: 'Martina Díaz',    fecha: HOY, hora: '19:00', estado: 'cancelada',  fechaReserva: '2026-06-08' },
  { id: 'res-009', claseId: 'cls-003', claseNombre: 'Yoga', alumnoId: 'alu-013', alumnoNombre: 'Antonella Giménez',fecha: HOY, hora: '19:00', estado: 'confirmada', fechaReserva: '2026-06-10' },
  { id: 'res-010', claseId: 'cls-003', claseNombre: 'Yoga', alumnoId: 'alu-015', alumnoNombre: 'Micaela Peralta', fecha: HOY, hora: '19:00', estado: 'confirmada', fechaReserva: '2026-06-10' },

  // Hoy — Spinning 20:00 (cls-007) — programada
  { id: 'res-011', claseId: 'cls-007', claseNombre: 'Spinning', alumnoId: 'alu-002', alumnoNombre: 'Nicolás Álvarez', fecha: HOY, hora: '20:00', estado: 'confirmada', fechaReserva: '2026-06-09' },
  { id: 'res-012', claseId: 'cls-007', claseNombre: 'Spinning', alumnoId: 'alu-004', alumnoNombre: 'Sebastián López', fecha: HOY, hora: '20:00', estado: 'confirmada', fechaReserva: '2026-06-09' },
  { id: 'res-013', claseId: 'cls-007', claseNombre: 'Spinning', alumnoId: 'alu-006', alumnoNombre: 'Agustín Herrera', fecha: HOY, hora: '20:00', estado: 'confirmada', fechaReserva: '2026-06-10' },

  // Ayer — Spinning (cls-011) — finalizada
  { id: 'res-014', claseId: 'cls-011', claseNombre: 'Spinning', alumnoId: 'alu-001', alumnoNombre: 'Camila Torres',     fecha: AYER, hora: '09:00', estado: 'confirmada', fechaReserva: '2026-06-07' },
  { id: 'res-015', claseId: 'cls-011', claseNombre: 'Spinning', alumnoId: 'alu-005', alumnoNombre: 'Florencia Mendez',  fecha: AYER, hora: '09:00', estado: 'confirmada', fechaReserva: '2026-06-07' },
  { id: 'res-016', claseId: 'cls-011', claseNombre: 'Spinning', alumnoId: 'alu-009', alumnoNombre: 'Julia Acosta',      fecha: AYER, hora: '09:00', estado: 'no_show',    fechaReserva: '2026-06-06' },
  { id: 'res-017', claseId: 'cls-011', claseNombre: 'Spinning', alumnoId: 'alu-013', alumnoNombre: 'Antonella Giménez', fecha: AYER, hora: '09:00', estado: 'confirmada', fechaReserva: '2026-06-07' },

  // Mañana — Pilates (cls-012)
  { id: 'res-018', claseId: 'cls-012', claseNombre: 'Pilates Reformer', alumnoId: 'alu-001', alumnoNombre: 'Camila Torres', fecha: MANANA, hora: '08:00', estado: 'confirmada', fechaReserva: '2026-06-10' },
  { id: 'res-019', claseId: 'cls-012', claseNombre: 'Pilates Reformer', alumnoId: 'alu-015', alumnoNombre: 'Micaela Peralta', fecha: MANANA, hora: '08:00', estado: 'confirmada', fechaReserva: '2026-06-10' },
]

export const ESTADO_RESERVA_CONFIG: Record<EstadoReserva, { label: string; color: string; bgColor: string }> = {
  confirmada: { label: 'Confirmada', color: 'text-green-700', bgColor: 'bg-green-100' },
  cancelada:  { label: 'Cancelada',  color: 'text-red-700',   bgColor: 'bg-red-100'   },
  no_show:    { label: 'No show',    color: 'text-gray-600',  bgColor: 'bg-gray-100'  },
}
