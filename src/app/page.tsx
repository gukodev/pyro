import Button from '@/components/Button'
import ColorList from '@/components/ColorList'
import ColorTheory from '@/components/ColorTheory'
import ColorCard from '@/components/FeaturedColor/ColorCard'
import FeaturedColorInfo from '@/components/FeaturedColor/FeaturedColorInfo'
import Pallete from '@/components/Pallete'
import { ColorInfo, getRandomColor } from '@/util/color'
import { removeHash } from '@/util/colorFormat'
import { Metadata } from 'next'
import Link from 'next/link'
import { Palette, Shuffle } from './../assets/icons'

interface Items {
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
    data = await getRandomColor()

    const items: Items[] = [
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
                <div className='py-6 border-b-4 border-slate-200 flex items-center justify-between mb-8'>
                    <Link href='/'>
                        <h1 className='text-4xl font-bold'>🔥 pyro</h1>
                    </Link>
                    <div className='flex items-center gap-4'>
                        <Button ghost>
                            <Palette size={22} weight='bold' />
                            Paletas
                        </Button>
                        <Button>
                            <Shuffle size={22} weight='bold' />
                            Cor aleatória
                        </Button>
                    </div>
                </div>
                <div className='flex flex-col gap-8'>
                    <div className='flex items-center gap-4'>
                        <h1 className='text-6xl font-bold'>Cor destaque</h1>
                        <p className='text-slate-400'>reseta em 2 horas</p>
                    </div>
                    <ColorCard data={data} />
                    <FeaturedColorInfo data={data} />
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
