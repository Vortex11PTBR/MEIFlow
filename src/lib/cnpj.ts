export interface CNPJData {
  cnpj: string
  razaoSocial: string
  nomeFantasia: string | null
  situacao: string
  ativa: boolean
  abertura: string | null
  municipio: string | null
  uf: string | null
  natureza: string | null
  porte: string | null
  cnae: string | null
  email: string | null
}

export async function lookupCNPJ(cnpj: string): Promise<CNPJData> {
  const clean = cnpj.replace(/\D/g, '')
  if (clean.length !== 14) throw new Error('CNPJ inválido')

  const res = await fetch(`https://publica.cnpj.ws/cnpj/${clean}`, {
    next: { revalidate: 3600 }, // cache 1h
    headers: { Accept: 'application/json' },
  })

  if (res.status === 404) throw new Error('CNPJ não encontrado na Receita Federal')
  if (res.status === 429) throw new Error('Limite de consultas atingido. Tente novamente em alguns segundos.')
  if (!res.ok) throw new Error('Erro ao consultar a Receita Federal')

  const d = await res.json()

  const abertura = d.estabelecimento?.data_inicio_atividade
    ? new Date(d.estabelecimento.data_inicio_atividade).toLocaleDateString('pt-BR')
    : null

  return {
    cnpj: clean,
    razaoSocial: d.razao_social ?? '—',
    nomeFantasia: d.estabelecimento?.nome_fantasia ?? null,
    situacao: d.estabelecimento?.situacao_cadastral ?? '—',
    ativa: (d.estabelecimento?.situacao_cadastral ?? '').toLowerCase().includes('ativa'),
    abertura,
    municipio: d.estabelecimento?.cidade?.nome ?? null,
    uf: d.estabelecimento?.estado?.sigla ?? null,
    natureza: d.natureza_juridica?.descricao ?? null,
    porte: d.porte?.descricao ?? null,
    cnae: d.estabelecimento?.atividade_principal?.descricao ?? null,
    email: d.estabelecimento?.email ?? null,
  }
}
