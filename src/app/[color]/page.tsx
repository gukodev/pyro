import ColorCard from '@/components/ColorCard'
import ColorDetails from '@/components/ColorDetails'
import ColorList from '@/components/ColorList'
import ColorTheory from '@/components/ColorTheory'
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import Palette from '@/components/Palette'
import RegenerateColorMobileButton from '@/components/RegenerateColorMobileButton'
import ColorInfo from '@/core/ColorInfo'
import { IColorInfo } from '@/core/types'
import { getFullLengthHex, isValidColor, removeHash } from '@/util/colorFormat'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Item } from '../page'

interface ColorPageProps {
    params: {
        color: string
    }
    searchParams?: {
        r?: string
    }
}

let data: IColorInfo | null = null

export async function generateMetadata(): Promise<Metadata> {
    if (!data) return {}

    const icon = {
        url: `/favicon?hex=${removeHash(data.hex)}`,
        type: 'image/svg+xml',
    }

    return {
        title: `pyro - ${data.hex}`,
        themeColor: data.hex,
        icons: {
            icon,
            shortcut: icon,
        },
    }
}

export default async function ColorPage({ params, searchParams }: ColorPageProps) {
    const { color } = params
    const fromRandom = searchParams?.r === '' || !!searchParams?.r

    if (!isValidColor(color)) return notFound()
    if (removeHash(color).length === 3) return redirect(`/${getFullLengthHex(color)}`)

    data = new ColorInfo().getColorInfo(color)

    const items: Item[] = [
        {
            label: 'Tons escuros',
            component: <Palette colors={data.palettes.shades} linkColors />,
        },
        {
            label: 'Tons claros',
            component: <Palette colors={data.palettes.tints} linkColors />,
        },
        {
            label: 'Hue',
            component: <Palette colors={data.palettes.hues} linkColors />,
        },
        {
            id: 'theory',
            component: <ColorTheory colors={data.palettes.theory} />,
        },
        {
            label: 'Cores relacionadas',
            component: <ColorList colors={data.related} />,
        },
    ]

    return (
        <>
            <main className='mb-48'>
                <RegenerateColorMobileButton fromRandom={fromRandom} />
                <NavBar />
                <div className='w-full max-w-screen-lg mx-auto px-4'>
                    <div className='flex flex-col gap-8'>
                        <ColorCard data={data} />
                        <ColorDetails data={data} />
                        {items.map((x) => (
                            <div className='flex flex-col gap-2' key={x.id || x.label}>
                                {x.label && <h1 className='text-2xl font-bold'>{x.label}</h1>}
                                {x.component}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
