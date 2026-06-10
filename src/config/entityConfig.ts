// ─── Entidad principal: Clase — ORIGEN Fitness ────────────────────────────────

export type FieldType = 'text' | 'number' | 'currency' | 'date' | 'time' | 'select' | 'badge' | 'phone' | 'textarea'

export interface EntityField {
  key: string
  label: string
  type: FieldType
  sortable?: boolean
  filterable?: boolean
  showInTable?: boolean
  showInCard?: boolean
  showInForm?: boolean
  required?: boolean
  options?: Array<{ value: string; label: string }>
}

export interface EntityStatus {
  key: string
  label: string
  color: string
  bgColor: string
}

export const entityConfig = {
  nameSingular: 'Clase',
  namePlural: 'Clases',
  primaryKey: 'id',

  fields: [
    { key: 'nombre',    label: 'Nombre',           type: 'text',   required: true,  showInTable: true, showInCard: true, showInForm: true },
    { key: 'profesor',  label: 'Profesor',          type: 'text',   required: true,  showInTable: true, showInCard: true, showInForm: true },
    { key: 'fecha',     label: 'Fecha',             type: 'date',   required: true,  showInTable: true, showInCard: true, showInForm: true, sortable: true, filterable: true },
    { key: 'hora',      label: 'Hora',              type: 'time',   required: true,  showInTable: true, showInCard: true, showInForm: true },
    { key: 'duracion',  label: 'Duración (min)',    type: 'number', required: true,  showInTable: true, showInForm: true },
    { key: 'capacidad', label: 'Capacidad',         type: 'number', required: true,  showInTable: true, showInCard: true, showInForm: true },
    { key: 'cupos',     label: 'Cupos disponibles', type: 'number', showInTable: true, showInCard: true },
    { key: 'estado',    label: 'Estado',            type: 'badge',  showInTable: true, showInCard: true, filterable: true },
  ] as EntityField[],

  statuses: [
    { key: 'programada',  label: 'Programada',  color: 'text-blue-700',   bgColor: 'bg-blue-100' },
    { key: 'en_curso',    label: 'En curso',    color: 'text-green-700',  bgColor: 'bg-green-100' },
    { key: 'finalizada',  label: 'Finalizada',  color: 'text-gray-600',   bgColor: 'bg-gray-100' },
    { key: 'cancelada',   label: 'Cancelada',   color: 'text-red-700',    bgColor: 'bg-red-100' },
  ] as EntityStatus[],

  tableColumns: ['nombre', 'profesor', 'fecha', 'hora', 'capacidad', 'cupos', 'estado'],
  cardFields:   ['profesor', 'hora', 'duracion', 'cupos'],
  formFields:   ['nombre', 'profesor', 'fecha', 'hora', 'duracion', 'capacidad'],
} as const
