import ColorCard from '@/components/ColorCard'
import ColorDetails from '@/components/ColorDetails'
import ColorList from '@/components/ColorList'
import ColorTheory from '@/components/ColorTheory'
import NavBar from '@/components/NavBar'
import Pallete from '@/components/Pallete'
import { ColorInfo, getRandomNamedColor } from '@/util/color'
import { removeHash } from '@/util/colorFormat'
import { Metadata } from 'next'

export interface Item {
    id?: string
    label?: string
    component: React.ReactNode
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

export default async function Home() {
    data = await getRandomNamedColor()

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
                    <div className='flex items-center gap-4 justify-between md:justify-normal'>
                        <h1 className='text-4xl md:text-6xl font-bold'>Cor destaque</h1>
                        <p className='text-slate-400'>reseta em 2 horas</p>
                    </div>
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
