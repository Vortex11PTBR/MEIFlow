import { describe, it, expect } from 'vitest'

// Importa apenas a função heurística (sem depender da API Anthropic)
// A função é exportada internamente; testamos o comportamento via categorizeTransaction
// com ANTHROPIC_API_KEY ausente para acionar o fallback heurístico.
import { categorizeTransaction } from '../categorize'

// Garante que nenhuma API key está definida para usar o fallback
delete process.env.ANTHROPIC_API_KEY

describe('categorizeTransaction — heurística', () => {
  it('categoriza Uber como Transporte', async () => {
    expect(await categorizeTransaction('Uber viagem centro')).toBe('Transporte')
  })

  it('categoriza iFood como Alimentação', async () => {
    expect(await categorizeTransaction('Pedido iFood pizza')).toBe('Alimentação')
  })

  it('categoriza Google Ads como Marketing', async () => {
    expect(await categorizeTransaction('Google Ads campanha março')).toBe('Marketing')
  })

  it('categoriza DAS como Impostos', async () => {
    expect(await categorizeTransaction('Pagamento DAS mensal')).toBe('Impostos')
  })

  it('categoriza AWS como Infraestrutura', async () => {
    expect(await categorizeTransaction('Fatura AWS EC2')).toBe('Infraestrutura')
  })

  it('categoriza Udemy como Educação', async () => {
    expect(await categorizeTransaction('Curso Udemy React')).toBe('Educação')
  })

  it('categoriza Notion como Ferramentas', async () => {
    expect(await categorizeTransaction('Assinatura Notion')).toBe('Ferramentas')
  })

  it('retorna Outros para descrição desconhecida', async () => {
    expect(await categorizeTransaction('xyz abc 123')).toBe('Outros')
  })
})
