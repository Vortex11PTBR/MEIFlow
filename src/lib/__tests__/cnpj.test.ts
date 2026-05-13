import { describe, it, expect } from 'vitest'

// Testa lógica de validação de CNPJ sem depender do fetch (apenas sanitização)
// A função lookupCNPJ faz fetch externo — testamos apenas o contrato de input inválido

async function importLookupCNPJ() {
  const mod = await import('../cnpj')
  return mod.lookupCNPJ
}

describe('lookupCNPJ — validação de input', () => {
  it('lança erro para CNPJ com menos de 14 dígitos', async () => {
    const lookupCNPJ = await importLookupCNPJ()
    await expect(lookupCNPJ('123')).rejects.toThrow('CNPJ inválido')
  })

  it('lança erro para CNPJ vazio', async () => {
    const lookupCNPJ = await importLookupCNPJ()
    await expect(lookupCNPJ('')).rejects.toThrow('CNPJ inválido')
  })

  it('lança erro para CNPJ com letras (não numérico)', async () => {
    const lookupCNPJ = await importLookupCNPJ()
    await expect(lookupCNPJ('ABCDEFGHIJKLMN')).rejects.toThrow('CNPJ inválido')
  })
})
