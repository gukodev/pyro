import { removeHash } from '@/util/colorFormat'
import { randomPalette } from '@/util/palette'
import { NextRequest, NextResponse } from 'next/server'

const getPaletteParam = () => {
    const palette = randomPalette(5).colors
    return palette.map(({ hex }) => removeHash(hex)).join('-')
}

export async function GET(req: NextRequest) {
    const url = req.nextUrl.clone()
    url.pathname = `/paletas/${getPaletteParam()}`

    return new NextResponse(null, {
        status: 302,
        headers: {
            Location: url.toString(),
        },
    })
}
