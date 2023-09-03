import ColorGenerator from '@/core/ColorGenerator'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    const hex = new ColorGenerator().getRandomColor('named')
    return new NextResponse(hex, {
        headers: {
            'content-type': 'text/plain',
        },
    })
}
