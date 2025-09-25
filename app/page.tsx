import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { LoginButton } from '@/components/login-button'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Caixa-Preta</h1>
        <p className="text-muted-foreground">Organize seus arquivos com segurança</p>
        <LoginButton />
      </div>
    </div>
  )
}