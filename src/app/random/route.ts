import ColorGenerator from '@/core/ColorGenerator'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
    const hex = new ColorGenerator().getRandomColor('named')

    const url = req.nextUrl.clone()
    url.pathname = `/${hex}`

    return new NextResponse(null, {
        status: 302,
        headers: {
            Location: url.toString() + '?r',
        },
    })
}
