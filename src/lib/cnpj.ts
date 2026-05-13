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

  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${clean}`, {
    next: { revalidate: 3600 },
    headers: {
      Accept: 'application/json',
      'User-Agent': 'MEIFlow/1.0',
    },
  })

  if (res.status === 404) throw new Error('CNPJ não encontrado')
  if (!res.ok) throw new Error('Erro ao consultar a Receita Federal')

  const data = await res.json()
  const abertura = data.data_inicio_atividade
    ? new Date(data.data_inicio_atividade).toLocaleDateString('pt-BR')
    : null

  return {
    cnpj: data.cnpj ?? clean,
    razaoSocial: data.razao_social ?? '—',
    nomeFantasia: data.nome_fantasia || null,
    situacao: data.descricao_situacao_cadastral ?? '—',
    ativa: data.descricao_situacao_cadastral === 'ATIVA',
    abertura,
    municipio: data.municipio ?? null,
    uf: data.uf ?? null,
    natureza: data.natureza_juridica ?? null,
    porte: data.porte ?? null,
    cnae: data.cnae_fiscal_descricao ?? null,
    email: data.email ?? null,
  }
}
