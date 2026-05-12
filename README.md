# MEIFlow 🧾

> SaaS de gestão financeira para Microempreendedores Individuais (MEI) — com categorização por IA, integração com a Receita Federal e alertas de DAS automáticos.

**Demo ao vivo →** _[em breve após deploy]_

---

## Funcionalidades

- **Categorização automática por IA** — Claude (Anthropic) categoriza cada lançamento em 12 categorias com fallback heurístico
- **Alerta de DAS** — notificação por e-mail 5 dias antes do vencimento via Vercel Cron + Resend
- **API da Receita Federal** — consulta de CNPJ em tempo real (publica.cnpj.ws)
- **Controle de limite MEI** — alerta progressivo ao atingir R$81.000/ano
- **Dashboard interativo** — gráficos de receita vs despesa, categorias, transações recentes
- **Multi-tenant** — cada MEI tem dados completamente isolados
- **Demo público** — tenant demo pré-populado com 28 transações, sem cadastro

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14 App Router + TypeScript strict + Tailwind CSS |
| Backend | Next.js API Routes |
| Banco de dados | PostgreSQL via Neon (free tier) + Prisma ORM |
| IA | Claude claude-3-haiku (Anthropic) |
| E-mail | Resend |
| Cron | Vercel Cron Jobs |
| CI/CD | GitHub Actions + Vercel |

## Deploy gratuito

### 1. Banco de dados — Neon
1. Crie conta em [neon.tech](https://neon.tech) → novo projeto → copie a connection string
2. A connection string tem formato: `postgresql://user:pass@host/db?sslmode=require`

### 2. Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Vortex11PTBR/MEIFlow)

Configure as variáveis de ambiente no painel da Vercel:

```env
DATABASE_URL=postgresql://...    # Neon connection string (com pgbouncer=true para prod)
DIRECT_URL=postgresql://...      # Neon direct connection (para migrations)
ANTHROPIC_API_KEY=sk-ant-...     # opcional — fallback heurístico funciona sem
RESEND_API_KEY=re_...            # para alertas de DAS por e-mail
CRON_SECRET=um-segredo-qualquer  # protege o endpoint /api/cron/das
```

### 3. Executar migrations e seed

No terminal da Vercel ou localmente com as variáveis configuradas:
```bash
npm run db:push    # aplica schema
npm run db:seed    # popula tenant demo
```

## Desenvolvimento local

```bash
git clone https://github.com/Vortex11PTBR/MEIFlow
cd MEIFlow
npm install

# Suba o PostgreSQL com Docker
docker compose up -d

# Configure variáveis
cp .env.example .env.local

# Migrations + seed
npm run db:push
npm run db:seed

# Dev server
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

## Estrutura

```
src/
  app/
    api/
      dashboard/       # KPIs e dados para o dashboard
      cnpj/[cnpj]/     # Proxy para API da Receita Federal
      transactions/    # CRUD de lançamentos
      categorize/      # Categorização por IA
      cron/das/        # Envio de alertas de DAS
    demo/              # Dashboard demo (Server Component)
    page.tsx           # Landing page
  components/
    dashboard/         # KPIRow, RevenueChart, ExpenseChart, LimitBar, DASCard, TransactionList
    CNPJLookup.tsx     # Consulta interativa de CNPJ
    AddTransaction.tsx # Formulário com sugestão de categoria por IA
  lib/
    categorize.ts      # Claude API + fallback heurístico
    cnpj.ts            # Wrapper da API da Receita Federal
    utils.ts           # Utilitários financeiros (limite MEI, DAS countdown)
    db.ts              # Prisma singleton
prisma/
  schema.prisma        # Modelos: Tenant, Transaction, Client
  seed.ts              # Dados demo (28 transações, 5 meses)
```

---

Construído por [João Lacerda](https://joaolacerda.dev) · 15 milhões de MEIs merecem ferramentas melhores.
