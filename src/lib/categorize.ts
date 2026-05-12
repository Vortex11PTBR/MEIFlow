import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CATEGORIES = [
  'Serviços',
  'Marketing',
  'Transporte',
  'Alimentação',
  'Equipamento',
  'Ferramentas',
  'Educação',
  'Infraestrutura',
  'Escritório',
  'Impostos',
  'Treinamento',
  'Outros',
] as const

export type Category = (typeof CATEGORIES)[number]

export async function categorizeTransaction(description: string): Promise<Category> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return heuristicCategorize(description)
  }

  try {
    const msg = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 20,
      messages: [
        {
          role: 'user',
          content: `Categorize esta transação financeira de um MEI em UMA das seguintes categorias: ${CATEGORIES.join(', ')}.
Responda APENAS com o nome da categoria, sem explicação.
Transação: "${description}"`,
        },
      ],
    })

    const raw = (msg.content[0] as { text: string }).text.trim()
    const found = CATEGORIES.find(c => raw.toLowerCase().includes(c.toLowerCase()))
    return found ?? 'Outros'
  } catch {
    return heuristicCategorize(description)
  }
}

function heuristicCategorize(desc: string): Category {
  const d = desc.toLowerCase()
  if (d.match(/uber|taxi|combustivel|gasolina|estacionamento|viagem|ônibus/)) return 'Transporte'
  if (d.match(/almoço|jantar|café|restaurante|lanche|refeição/)) return 'Alimentação'
  if (d.match(/google ads|meta ads|instagram|facebook|marketing|publicidade|campanha/)) return 'Marketing'
  if (d.match(/curso|treinamento|livro|workshop|bootcamp|educação|estudo/)) return 'Educação'
  if (d.match(/monitor|teclado|mouse|notebook|computador|equipamento|hardware/)) return 'Equipamento'
  if (d.match(/saas|software|ferramenta|assinatura|vscode|figma|notion|slack/)) return 'Ferramentas'
  if (d.match(/hospedagem|servidor|cloud|aws|gcp|azure|domínio|infra/)) return 'Infraestrutura'
  if (d.match(/das|imposto|inss|irpf|guia|tributo|taxa/)) return 'Impostos'
  if (d.match(/papel|caneta|material|escritório|impressora/)) return 'Escritório'
  if (d.match(/consultoria|desenvolvimento|sistema|api|app|site|software|manutenção|integração/)) return 'Serviços'
  if (d.match(/treinamento|capacitação/)) return 'Treinamento'
  return 'Outros'
}
