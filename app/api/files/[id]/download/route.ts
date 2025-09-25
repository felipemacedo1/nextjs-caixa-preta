import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const file = await prisma.file.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  const { data } = await supabase.storage
    .from('files')
    .createSignedUrl(file.path, 60) // 60 seconds

  if (!data?.signedUrl) {
    return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}