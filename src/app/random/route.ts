import { getRandomNamedColorHex } from '@/util/color'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
    const hex = getRandomNamedColorHex()

    const url = req.nextUrl.clone()
    url.pathname = `/${hex}`

    return new NextResponse(null, {
        status: 302,
        headers: {
            Location: url.toString() + '?r',
        },
    })
}
