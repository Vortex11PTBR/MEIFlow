export const MEI_ANNUAL_LIMIT = 81_000

export const DEMO_TENANT_CNPJ = '12345678000190'

export function calcDASCountdown(dueDay = 20): number {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  let due = new Date(year, month, dueDay)
  if (due <= now) due = new Date(year, month + 1, dueDay)
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatCNPJ(cnpj: string): string {
  const c = cnpj.replace(/\D/g, '')
  return c.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}
