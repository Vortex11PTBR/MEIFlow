import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  MEI_ANNUAL_LIMIT,
  calcDASCountdown,
  formatCurrency,
  formatCNPJ,
} from '../utils'

describe('MEI_ANNUAL_LIMIT', () => {
  it('deve ser R$ 81.000', () => {
    expect(MEI_ANNUAL_LIMIT).toBe(81_000)
  })
})

describe('formatCurrency', () => {
  it('formata valor em BRL corretamente', () => {
    const result = formatCurrency(1500)
    expect(result).toContain('1.500')
    expect(result).toContain('R$')
  })

  it('formata zero como R$ 0', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
    expect(result).toContain('R$')
  })

  it('formata valor com centavos', () => {
    const result = formatCurrency(81000.5)
    expect(result).toContain('81.000')
  })
})

describe('formatCNPJ', () => {
  it('formata CNPJ de 14 dígitos corretamente', () => {
    expect(formatCNPJ('12345678000190')).toBe('12.345.678/0001-90')
  })

  it('formata CNPJ que já contém pontuação', () => {
    expect(formatCNPJ('12.345.678/0001-90')).toBe('12.345.678/0001-90')
  })

  it('formata CNPJ com zeros à esquerda', () => {
    expect(formatCNPJ('00000000000191')).toBe('00.000.000/0001-91')
  })
})

describe('calcDASCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('retorna número positivo de dias', () => {
    // Dia 5 do mês — próximo vencimento dia 20 = 15 dias
    vi.setSystemTime(new Date(2026, 4, 5, 12, 0, 0)) // 05/mai/2026
    const days = calcDASCountdown(20)
    expect(days).toBe(15)
  })

  it('retorna dias para o próximo mês quando já passou o vencimento', () => {
    // Dia 25 do mês — vencimento dia 20 já passou, próximo é dia 20 do mês seguinte
    vi.setSystemTime(new Date(2026, 4, 25, 12, 0, 0)) // 25/mai/2026
    const days = calcDASCountdown(20)
    // de 25/mai até 20/jun = 26 dias
    expect(days).toBe(26)
  })

  it('retorna pelo menos 1 dia quando hoje é o dia do vencimento', () => {
    vi.setSystemTime(new Date(2026, 4, 20, 12, 0, 0)) // 20/mai/2026
    const days = calcDASCountdown(20)
    // vencimento é hoje mas `due <= now` então vai pro próximo mês
    expect(days).toBeGreaterThan(0)
  })
})
