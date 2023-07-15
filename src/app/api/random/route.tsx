import { getRandomNamedColorHex } from '@/util/color'
import { NextResponse } from 'next/server'

export async function GET() {
    const hex = getRandomNamedColorHex()
    return new NextResponse(hex, {
        headers: {
            'content-type': 'text/plain',
        },
    })
}
