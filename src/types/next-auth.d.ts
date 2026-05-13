import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      email: string
      tenantId: string | null
    }
  }

  interface User extends DefaultUser {
    tenantId?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    tenantId?: string | null
  }
}
