import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(categories)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name } = await request.json()
  
  if (!name) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 })
  }

  try {
    const category = await prisma.category.create({
      data: {
        name,
        userId: session.user.id,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Category already exists' }, { status: 400 })
  }
}