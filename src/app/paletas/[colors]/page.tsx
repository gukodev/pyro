import { addHash, isValidColor, removeHash } from '@/util/colorFormat'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import PaletteGenerator from './components/PaletteGenerator'

interface Context {
    params: {
        colors: string
    }
}

const parseColors = (colors: string) => {
    return colors
        .trim()
        .split('-')
        .filter((color) => isValidColor(color))
        .map((color) => addHash(color))
}

let faviconColor: null | string = null

export async function generateMetadata(): Promise<Metadata> {
    if (!faviconColor) return {}

    const icon = {
        url: `/favicon?hex=${removeHash(faviconColor)}`,
        type: 'image/svg+xml',
    }

    return {
        title: `pyro`,
        themeColor: faviconColor,
        icons: {
            icon,
            shortcut: icon,
        },
    }
}

export default function Page(ctx: Context) {
    let colors = parseColors(ctx.params.colors)
    if (colors.length < 3 || colors.length > 8) return redirect('/paletas')

    const validParam = colors.map((x) => removeHash(x)).join('-')
    faviconColor = colors[0]

    return (
        <>
            <main className='w-screen h-screen'>
                <PaletteGenerator colors={colors} validParam={validParam} />
            </main>
        </>
    )
}
