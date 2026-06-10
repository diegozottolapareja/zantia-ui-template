export type EstadoAsistencia = 'presente' | 'ausente' | 'pendiente'
export type EstadoRevision = 'aprobada' | 'rechazada' | 'pendiente'

export interface Asistencia {
  id: string
  claseId: string
  claseNombre: string
  alumnoId: string
  alumnoNombre: string
  profesorId: string
  profesorNombre: string
  fecha: string
  hora: string
  estado: EstadoAsistencia
  estadoRevision: EstadoRevision
  nota?: string
}

const HOY = '2026-06-10'
const AYER = '2026-06-09'

export const MOCK_ASISTENCIAS: Asistencia[] = [
  // Clase cls-001 (Pilates Reformer 08:00 Hoy — Sofía) — FINALIZADA, con pendientes
  { id: 'asi-001', claseId: 'cls-001', claseNombre: 'Pilates Reformer', alumnoId: 'alu-001', alumnoNombre: 'Camila Torres',     profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: HOY, hora: '08:00', estado: 'presente', estadoRevision: 'pendiente' },
  { id: 'asi-002', claseId: 'cls-001', claseNombre: 'Pilates Reformer', alumnoId: 'alu-003', alumnoNombre: 'Lucía Ramírez',     profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: HOY, hora: '08:00', estado: 'presente', estadoRevision: 'pendiente' },
  { id: 'asi-003', claseId: 'cls-001', claseNombre: 'Pilates Reformer', alumnoId: 'alu-005', alumnoNombre: 'Florencia Mendez',  profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: HOY, hora: '08:00', estado: 'ausente',  estadoRevision: 'pendiente', nota: 'Avisó por WhatsApp' },
  { id: 'asi-004', claseId: 'cls-001', claseNombre: 'Pilates Reformer', alumnoId: 'alu-007', alumnoNombre: 'Martina Díaz',      profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: HOY, hora: '08:00', estado: 'presente', estadoRevision: 'pendiente' },
  { id: 'asi-005', claseId: 'cls-001', claseNombre: 'Pilates Reformer', alumnoId: 'alu-009', alumnoNombre: 'Julia Acosta',      profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: HOY, hora: '08:00', estado: 'presente', estadoRevision: 'pendiente' },
  { id: 'asi-006', claseId: 'cls-001', claseNombre: 'Pilates Reformer', alumnoId: 'alu-013', alumnoNombre: 'Antonella Giménez', profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: HOY, hora: '08:00', estado: 'presente', estadoRevision: 'pendiente' },
  { id: 'asi-007', claseId: 'cls-001', claseNombre: 'Pilates Reformer', alumnoId: 'alu-015', alumnoNombre: 'Micaela Peralta',   profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: HOY, hora: '08:00', estado: 'presente', estadoRevision: 'pendiente' },
  { id: 'asi-008', claseId: 'cls-001', claseNombre: 'Pilates Reformer', alumnoId: 'alu-002', alumnoNombre: 'Nicolás Álvarez',   profesorId: 'prof-001', profesorNombre: 'Sofía Martínez', fecha: HOY, hora: '08:00', estado: 'presente', estadoRevision: 'pendiente' },

  // Clase cls-004 (Funcional 07:00 Hoy — Lucas) — FINALIZADA, pendientes
  { id: 'asi-009', claseId: 'cls-004', claseNombre: 'Funcional', alumnoId: 'alu-002', alumnoNombre: 'Nicolás Álvarez',   profesorId: 'prof-002', profesorNombre: 'Lucas Fernández', fecha: HOY, hora: '07:00', estado: 'presente', estadoRevision: 'pendiente' },
  { id: 'asi-010', claseId: 'cls-004', claseNombre: 'Funcional', alumnoId: 'alu-004', alumnoNombre: 'Sebastián López',   profesorId: 'prof-002', profesorNombre: 'Lucas Fernández', fecha: HOY, hora: '07:00', estado: 'ausente',  estadoRevision: 'pendiente' },
  { id: 'asi-011', claseId: 'cls-004', claseNombre: 'Funcional', alumnoId: 'alu-006', alumnoNombre: 'Agustín Herrera',   profesorId: 'prof-002', profesorNombre: 'Lucas Fernández', fecha: HOY, hora: '07:00', estado: 'presente', estadoRevision: 'pendiente' },
  { id: 'asi-012', claseId: 'cls-004', claseNombre: 'Funcional', alumnoId: 'alu-010', alumnoNombre: 'Tomás Fernández',   profesorId: 'prof-002', profesorNombre: 'Lucas Fernández', fecha: HOY, hora: '07:00', estado: 'presente', estadoRevision: 'pendiente' },
  { id: 'asi-013', claseId: 'cls-004', claseNombre: 'Funcional', alumnoId: 'alu-012', alumnoNombre: 'Ignacio Morales',   profesorId: 'prof-002', profesorNombre: 'Lucas Fernández', fecha: HOY, hora: '07:00', estado: 'presente', estadoRevision: 'pendiente' },
  { id: 'asi-014', claseId: 'cls-004', claseNombre: 'Funcional', alumnoId: 'alu-014', alumnoNombre: 'Santiago Romero',   profesorId: 'prof-002', profesorNombre: 'Lucas Fernández', fecha: HOY, hora: '07:00', estado: 'presente', estadoRevision: 'pendiente' },

  // Ayer — Spinning — Aprobadas
  { id: 'asi-015', claseId: 'cls-011', claseNombre: 'Spinning', alumnoId: 'alu-001', alumnoNombre: 'Camila Torres',    profesorId: 'prof-003', profesorNombre: 'Valentina Ruiz', fecha: AYER, hora: '09:00', estado: 'presente', estadoRevision: 'aprobada' },
  { id: 'asi-016', claseId: 'cls-011', claseNombre: 'Spinning', alumnoId: 'alu-005', alumnoNombre: 'Florencia Mendez', profesorId: 'prof-003', profesorNombre: 'Valentina Ruiz', fecha: AYER, hora: '09:00', estado: 'presente', estadoRevision: 'aprobada' },
  { id: 'asi-017', claseId: 'cls-011', claseNombre: 'Spinning', alumnoId: 'alu-009', alumnoNombre: 'Julia Acosta',     profesorId: 'prof-003', profesorNombre: 'Valentina Ruiz', fecha: AYER, hora: '09:00', estado: 'ausente',  estadoRevision: 'aprobada', nota: 'No show' },
  { id: 'asi-018', claseId: 'cls-011', claseNombre: 'Spinning', alumnoId: 'alu-013', alumnoNombre: 'Antonella Giménez',profesorId: 'prof-003', profesorNombre: 'Valentina Ruiz', fecha: AYER, hora: '09:00', estado: 'presente', estadoRevision: 'aprobada' },
]

export const ESTADO_ASISTENCIA_CONFIG: Record<EstadoAsistencia, { label: string; color: string; bgColor: string }> = {
  presente: { label: 'Presente', color: 'text-green-700', bgColor: 'bg-green-100' },
  ausente:  { label: 'Ausente',  color: 'text-red-700',   bgColor: 'bg-red-100'   },
  pendiente:{ label: 'Pendiente',color: 'text-yellow-700',bgColor: 'bg-yellow-100'},
}

export const ESTADO_REVISION_CONFIG: Record<EstadoRevision, { label: string; color: string; bgColor: string }> = {
  aprobada:  { label: 'Aprobada',  color: 'text-green-700', bgColor: 'bg-green-100' },
  rechazada: { label: 'Rechazada', color: 'text-red-700',   bgColor: 'bg-red-100'   },
  pendiente: { label: 'Pendiente', color: 'text-yellow-700',bgColor: 'bg-yellow-100'},
}
