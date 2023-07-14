import { sanitizeColor } from '@/util/colorFormat'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const hex = sanitizeColor(searchParams.get('hex') || 'ef4444')

    const svgMarkup = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <rect width="100%" height="100%" fill="#${hex}" rx="33.33%"/>
        </svg>
    `

    return new NextResponse(svgMarkup, {
        headers: {
            'Content-Type': 'image/svg+xml',
        },
    })
}
