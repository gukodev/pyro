import PaletteGenerator from '@/core/PaletteGenerator'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const lenParam = req.nextUrl.searchParams.get('length')
    const length = lenParam ? parseInt(lenParam) : undefined

    if (length && (length < 3 || length > 8)) {
        return NextResponse.json({
            error: 'Length must be between 3 and 8',
        })
    }

    const palette = new PaletteGenerator().getRandomPalette()
    return NextResponse.json(palette)
}
