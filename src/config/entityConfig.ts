// ─── Configuración de entidad principal ───────────────────────────────────────
// Define el schema de la entidad central del negocio.
// Ejemplos: Posición (granos), Propiedad (inmobiliaria), Clase (gimnasio), Producto (catálogo).
//
// Para customizar para un nuevo rubro:
//   1. Cambiar nameSingular / namePlural
//   2. Definir los campos en `fields`
//   3. Definir los estados en `statuses`
//   4. Elegir qué campos van en tabla (tableColumns) y en card (cardFields)

export type FieldType = 'text' | 'number' | 'currency' | 'date' | 'select' | 'badge' | 'phone' | 'textarea'

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
  options?: Array<{ value: string; label: string }>  // para type: 'select'
}

export interface EntityStatus {
  key: string
  label: string
  color: string   // clase de Tailwind o color CSS
  bgColor: string
}

export const entityConfig = {
  // ── Nombres de la entidad ────────────────────────────────────────────────
  nameSingular: 'Elemento',    // Cambiar: 'Posición', 'Propiedad', 'Alumno', 'Producto'
  namePlural: 'Elementos',     // Cambiar: 'Posiciones', 'Propiedades', 'Alumnos', 'Productos'
  primaryKey: 'id',

  // ── Campos ───────────────────────────────────────────────────────────────
  // Actualmente vacío — se completará en Fase 5 con schema real o genérico.
  // Para granos, los campos están en data/mock/posiciones.ts (Posicion interface).
  fields: [] as EntityField[],

  // ── Estados posibles ─────────────────────────────────────────────────────
  statuses: [
    { key: 'active',    label: 'Activo',    color: 'text-green-700',  bgColor: 'bg-green-100' },
    { key: 'inactive',  label: 'Inactivo',  color: 'text-gray-600',   bgColor: 'bg-gray-100' },
    { key: 'pending',   label: 'Pendiente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
    { key: 'closed',    label: 'Cerrado',   color: 'text-red-700',    bgColor: 'bg-red-100' },
  ] as EntityStatus[],

  // ── Columnas visibles en tabla ───────────────────────────────────────────
  tableColumns: [] as string[],   // keys de fields a mostrar en listado

  // ── Campos visibles en card (mobile) ────────────────────────────────────
  cardFields: [] as string[],     // keys de fields a mostrar en EntityCard

  // ── Campos del formulario de creación/edición ────────────────────────────
  formFields: [] as string[],     // keys de fields que aparecen en EntityForm
} as const
