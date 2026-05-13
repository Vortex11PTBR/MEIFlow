import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db'

const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = RegisterSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { name, email, password } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

  if (existing) {
    return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), password: hashed },
    select: { id: true, email: true, name: true },
  })

  return NextResponse.json(user, { status: 201 })
}
