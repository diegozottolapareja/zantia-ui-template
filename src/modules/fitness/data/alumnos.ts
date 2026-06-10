export type EstadoAlumno = 'activo' | 'inactivo' | 'suspendido'
export type TipoMembresia = 'mensual' | 'trimestral' | 'anual' | 'libre'

export interface Alumno {
  id: string
  nombre: string
  email: string
  telefono: string
  estado: EstadoAlumno
  membresia: TipoMembresia
  fechaAlta: string
  ultimaAsistencia?: string
  asistenciasMes: number
}

export const MOCK_ALUMNOS: Alumno[] = [
  { id: 'alu-001', nombre: 'Camila Torres',       email: 'camila@mail.com',    telefono: '+54 11 5500-1001', estado: 'activo',   membresia: 'mensual',     fechaAlta: '2024-03-15', ultimaAsistencia: '2026-06-09', asistenciasMes: 12 },
  { id: 'alu-002', nombre: 'Nicolás Álvarez',     email: 'nico@mail.com',      telefono: '+54 11 5500-1002', estado: 'activo',   membresia: 'trimestral',  fechaAlta: '2023-11-01', ultimaAsistencia: '2026-06-10', asistenciasMes: 9  },
  { id: 'alu-003', nombre: 'Lucía Ramírez',       email: 'lucia@mail.com',     telefono: '+54 11 5500-1003', estado: 'activo',   membresia: 'anual',       fechaAlta: '2023-08-20', ultimaAsistencia: '2026-06-08', asistenciasMes: 15 },
  { id: 'alu-004', nombre: 'Sebastián López',     email: 'sebas@mail.com',     telefono: '+54 11 5500-1004', estado: 'activo',   membresia: 'mensual',     fechaAlta: '2025-01-10', ultimaAsistencia: '2026-06-07', asistenciasMes: 6  },
  { id: 'alu-005', nombre: 'Florencia Mendez',    email: 'flor@mail.com',      telefono: '+54 11 5500-1005', estado: 'activo',   membresia: 'anual',       fechaAlta: '2024-06-05', ultimaAsistencia: '2026-06-10', asistenciasMes: 18 },
  { id: 'alu-006', nombre: 'Agustín Herrera',     email: 'agus@mail.com',      telefono: '+54 11 5500-1006', estado: 'activo',   membresia: 'mensual',     fechaAlta: '2025-09-01', ultimaAsistencia: '2026-06-05', asistenciasMes: 4  },
  { id: 'alu-007', nombre: 'Martina Díaz',        email: 'marti@mail.com',     telefono: '+54 11 5500-1007', estado: 'activo',   membresia: 'trimestral',  fechaAlta: '2024-12-15', ultimaAsistencia: '2026-06-09', asistenciasMes: 11 },
  { id: 'alu-008', nombre: 'Franco Villanueva',   email: 'franco@mail.com',    telefono: '+54 11 5500-1008', estado: 'inactivo', membresia: 'mensual',     fechaAlta: '2024-02-28', ultimaAsistencia: '2026-04-20', asistenciasMes: 0  },
  { id: 'alu-009', nombre: 'Julia Acosta',        email: 'julia@mail.com',     telefono: '+54 11 5500-1009', estado: 'activo',   membresia: 'anual',       fechaAlta: '2023-05-10', ultimaAsistencia: '2026-06-10', asistenciasMes: 20 },
  { id: 'alu-010', nombre: 'Tomás Fernández',     email: 'tomas@mail.com',     telefono: '+54 11 5500-1010', estado: 'activo',   membresia: 'libre',       fechaAlta: '2025-03-01', ultimaAsistencia: '2026-06-06', asistenciasMes: 7  },
  { id: 'alu-011', nombre: 'Valentina Castro',    email: 'vale@mail.com',      telefono: '+54 11 5500-1011', estado: 'suspendido',membresia: 'mensual',    fechaAlta: '2024-07-20', ultimaAsistencia: '2026-05-15', asistenciasMes: 0  },
  { id: 'alu-012', nombre: 'Ignacio Morales',     email: 'nacho@mail.com',     telefono: '+54 11 5500-1012', estado: 'activo',   membresia: 'trimestral',  fechaAlta: '2025-02-14', ultimaAsistencia: '2026-06-09', asistenciasMes: 8  },
  { id: 'alu-013', nombre: 'Antonella Giménez',   email: 'anto@mail.com',      telefono: '+54 11 5500-1013', estado: 'activo',   membresia: 'anual',       fechaAlta: '2023-10-01', ultimaAsistencia: '2026-06-10', asistenciasMes: 16 },
  { id: 'alu-014', nombre: 'Santiago Romero',     email: 'santi@mail.com',     telefono: '+54 11 5500-1014', estado: 'activo',   membresia: 'mensual',     fechaAlta: '2025-05-20', ultimaAsistencia: '2026-06-08', asistenciasMes: 5  },
  { id: 'alu-015', nombre: 'Micaela Peralta',     email: 'mica@mail.com',      telefono: '+54 11 5500-1015', estado: 'activo',   membresia: 'anual',       fechaAlta: '2024-01-08', ultimaAsistencia: '2026-06-10', asistenciasMes: 22 },
]

export const ESTADO_ALUMNO_CONFIG: Record<EstadoAlumno, { label: string; color: string; bgColor: string }> = {
  activo:     { label: 'Activo',     color: 'text-green-700',  bgColor: 'bg-green-100' },
  inactivo:   { label: 'Inactivo',   color: 'text-gray-600',   bgColor: 'bg-gray-100'  },
  suspendido: { label: 'Suspendido', color: 'text-red-700',    bgColor: 'bg-red-100'   },
}

export const MEMBRESIA_CONFIG: Record<TipoMembresia, { label: string; color: string }> = {
  mensual:     { label: 'Mensual',     color: 'text-blue-600'   },
  trimestral:  { label: 'Trimestral', color: 'text-purple-600' },
  anual:       { label: 'Anual',       color: 'text-indigo-600' },
  libre:       { label: 'Libre',       color: 'text-gray-600'   },
}
