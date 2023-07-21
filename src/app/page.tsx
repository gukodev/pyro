import ColorCard from '@/components/ColorCard'
import ColorDetails from '@/components/ColorDetails'
import ColorList from '@/components/ColorList'
import ColorTheory from '@/components/ColorTheory'
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import Palette from '@/components/Palette'
import ResetTimer from '@/components/ResetTimer'
import { ColorInfo, getDailyColor } from '@/util/color'
import { removeHash } from '@/util/colorFormat'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
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
    data = await getDailyColor()

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

    dayjs.locale('pt-br')
    dayjs.extend(relativeTime)

    const getRemainingTime = () => {
        const now = new Date()
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
        return dayjs(tomorrow).fromNow(true)
    }

    return (
        <>
            <main className='mb-48'>
                <div className='w-full max-w-screen-lg mx-auto px-4'>
                    <NavBar />
                    <div className='flex flex-col gap-8'>
                        <div className='flex items-center gap-4 justify-between md:justify-normal'>
                            <h1 className='text-4xl md:text-6xl font-bold'>Cor destaque</h1>
                            <ResetTimer remaining={getRemainingTime()} />
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
            <Footer />
        </>
    )
}
