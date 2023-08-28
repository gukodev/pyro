import { getRandomNamedColorHex } from '@/util/color'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const maxDuration = 0

export async function GET() {
    const hex = getRandomNamedColorHex()
    return new NextResponse(hex, {
        headers: {
            'content-type': 'text/plain',
        },
    })
}
