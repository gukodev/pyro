import ColorCard from '@/components/ColorCard'
import ColorDetails from '@/components/ColorDetails'
import ColorList from '@/components/ColorList'
import ColorTheory from '@/components/ColorTheory'
import NavBar from '@/components/NavBar'
import Pallete from '@/components/Pallete'
import { ColorInfo, getColorInfo } from '@/util/color'
import { getFullLengthHex, isValidColor, removeHash } from '@/util/colorFormat'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Item } from '../page'

interface ColorPageProps {
    params: {
        color: string
    }
}

let data: ColorInfo | null = null

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

export default async function ColorPage({ params }: ColorPageProps) {
    const { color } = params

    if (!isValidColor(color)) return notFound()
    if (removeHash(color).length === 3) return redirect(`/${getFullLengthHex(color)}`)

    data = await getColorInfo(color)

    const items: Item[] = [
        {
            label: 'Tons escuros',
            component: <Pallete colors={data.shades} linkColors />,
        },
        {
            label: 'Tons claros',
            component: <Pallete colors={data.tints} linkColors />,
        },
        {
            label: 'Hue',
            component: <Pallete colors={data.hues} linkColors />,
        },
        {
            id: 'theory',
            component: <ColorTheory colors={data.theory} />,
        },
        {
            label: 'Cores relacionadas',
            component: <ColorList colors={data.related} />,
        },
    ]

    return (
        <main className='mb-48'>
            <div className='w-full max-w-screen-lg mx-auto px-4'>
                <NavBar />
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
    )
}
