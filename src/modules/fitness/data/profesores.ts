export interface Profesor {
  id: string
  nombre: string
  email: string
  telefono: string
  especialidades: string[]
  estado: 'activo' | 'inactivo'
  avatarUrl?: string
  clasesImpartidas: number
  calificacion: number   // 1-5
}

export const MOCK_PROFESORES: Profesor[] = [
  {
    id: 'prof-001',
    nombre: 'Sofía Martínez',
    email: 'sofia@origen.com',
    telefono: '+54 11 4521-0001',
    especialidades: ['Pilates Reformer', 'Yoga'],
    estado: 'activo',
    avatarUrl: 'https://i.pravatar.cc/300?img=47',
    clasesImpartidas: 142,
    calificacion: 4.9,
  },
  {
    id: 'prof-002',
    nombre: 'Lucas Fernández',
    email: 'lucas@origen.com',
    telefono: '+54 11 4521-0002',
    especialidades: ['Funcional', 'Musculación guiada'],
    estado: 'activo',
    avatarUrl: 'https://i.pravatar.cc/300?img=15',
    clasesImpartidas: 98,
    calificacion: 4.7,
  },
  {
    id: 'prof-003',
    nombre: 'Valentina Ruiz',
    email: 'valentina@origen.com',
    telefono: '+54 11 4521-0003',
    especialidades: ['Spinning', 'Funcional'],
    estado: 'activo',
    avatarUrl: 'https://i.pravatar.cc/300?img=44',
    clasesImpartidas: 211,
    calificacion: 4.8,
  },
  {
    id: 'prof-004',
    nombre: 'Martín Gómez',
    email: 'martin@origen.com',
    telefono: '+54 11 4521-0004',
    especialidades: ['Musculación guiada', 'Funcional'],
    estado: 'activo',
    avatarUrl: 'https://i.pravatar.cc/300?img=13',
    clasesImpartidas: 76,
    calificacion: 4.6,
  },
]

export const PROFESOR_MAP: Record<string, Profesor> = Object.fromEntries(
  MOCK_PROFESORES.map(p => [p.id, p])
)
