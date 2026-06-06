export type PlanTenant = 'trial' | 'starter' | 'pro' | 'enterprise'
export type EstadoTenant = 'activo' | 'trial' | 'suspendido' | 'configurando'

export interface Tenant {
  id: string
  nombre: string
  razonSocial: string
  cuit: string
  plan: PlanTenant
  estado: EstadoTenant
  usuarios: number
  operacionesMes: number
  volumenMes: number       // toneladas
  comisionMes: number      // USD
  creadoEn: string
  adminEmail: string
  region: string
  logo?: string
}

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'tenant-1',
    nombre: 'Mesa Don Pepe',
    razonSocial: 'Traverso & Hnos. SRL',
    cuit: '30-71234567-8',
    plan: 'pro',
    estado: 'activo',
    usuarios: 4,
    operacionesMes: 18,
    volumenMes: 12400,
    comisionMes: 9840,
    creadoEn: '2025-03-15',
    adminEmail: 'admin@mesadonpepe.com.ar',
    region: 'Rosario, Santa Fe',
  },
  {
    id: 'tenant-2',
    nombre: 'Grainflow Mendoza',
    razonSocial: 'Rodríguez Cereales SA',
    cuit: '30-68765432-1',
    plan: 'enterprise',
    estado: 'activo',
    usuarios: 8,
    operacionesMes: 34,
    volumenMes: 28600,
    comisionMes: 21450,
    creadoEn: '2024-11-01',
    adminEmail: 'admin@grainfmendoza.com.ar',
    region: 'Mendoza',
  },
  {
    id: 'tenant-3',
    nombre: 'Corredor del Sur',
    razonSocial: 'García & Asociados',
    cuit: '20-32145678-9',
    plan: 'starter',
    estado: 'activo',
    usuarios: 2,
    operacionesMes: 5,
    volumenMes: 3200,
    comisionMes: 2560,
    creadoEn: '2026-01-20',
    adminEmail: 'admin@corredordelsur.com.ar',
    region: 'Bahía Blanca, Buenos Aires',
  },
  {
    id: 'tenant-4',
    nombre: 'Agro Norte SA',
    razonSocial: 'Agro Norte SA',
    cuit: '30-55432198-7',
    plan: 'pro',
    estado: 'suspendido',
    usuarios: 3,
    operacionesMes: 0,
    volumenMes: 0,
    comisionMes: 0,
    creadoEn: '2025-07-10',
    adminEmail: 'admin@agronorte.com.ar',
    region: 'Salta',
  },
  {
    id: 'tenant-5',
    nombre: 'Broker Cuyo',
    razonSocial: 'Martínez Granos SAS',
    cuit: '33-87654321-0',
    plan: 'trial',
    estado: 'configurando',
    usuarios: 1,
    operacionesMes: 0,
    volumenMes: 0,
    comisionMes: 0,
    creadoEn: '2026-06-01',
    adminEmail: 'admin@brokercuyo.com.ar',
    region: 'San Luis',
  },
]

export const PLAN_CONFIG: Record<PlanTenant, { label: string; color: string; maxUsers: number; precio: number }> = {
  trial:      { label: 'Trial',      color: 'bg-gray-100 text-gray-600',       maxUsers: 1,  precio: 0 },
  starter:    { label: 'Starter',    color: 'bg-blue-100 text-blue-700',       maxUsers: 3,  precio: 49 },
  pro:        { label: 'Pro',        color: 'bg-primary/10 text-primary',      maxUsers: 10, precio: 129 },
  enterprise: { label: 'Enterprise', color: 'bg-amber-100 text-amber-700',     maxUsers: 999, precio: 349 },
}

export const ESTADO_CONFIG: Record<EstadoTenant, { label: string; color: string }> = {
  activo:        { label: 'Activo',        color: 'bg-success/10 text-success' },
  trial:         { label: 'Trial',         color: 'bg-blue-50 text-blue-600' },
  suspendido:    { label: 'Suspendido',    color: 'bg-destructive/10 text-destructive' },
  configurando:  { label: 'Configurando',  color: 'bg-orange-50 text-orange-600' },
}
