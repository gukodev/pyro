import Button from '@/components/Button'
import ColorLink from '@/components/ColorLink'
import NavBar from '@/components/NavBar'
import { DarkColor, getRandomDarkColor } from '@/util/color'
import { removeHash } from '@/util/colorFormat'
import { Metadata } from 'next'
import Link from 'next/link'

let rndColor: DarkColor | null = null

// metadata not supported at the moment
// => https://github.com/vercel/next.js/issues/45620
export async function generateMetadata(): Promise<Metadata> {
    if (!rndColor) return {}

    const icon = {
        url: `/favicon?hex=${removeHash(rndColor.hex)}`,
        type: 'image/svg+xml',
    }

    return {
        title: 'pyro - página não encontrada',
        themeColor: rndColor.hex,
        icons: {
            icon,
            shortcut: icon,
        },
    }
}

export default function Page404() {
    rndColor = getRandomDarkColor()

    return (
        <main className='mb-48'>
            <div className='w-full max-w-screen-lg mx-auto px-4'>
                <NavBar />
                <div className='w-full max-w-screen-sm mx-auto flex flex-col gap-8'>
                    <div className='flex flex-col gap-10'>
                        <h1 className='text-8xl font-bold'>Ops...</h1>
                        <div className='flex flex-col gap-4 text-slate-800 text-lg text-justify'>
                            <p>
                                Você encontrou uma cor tão única que está além do espectro visível
                                de cores! Infelizmente nossos olhos ainda não conseguem enxergá-la
                                😓
                            </p>
                            <p>
                                Que tal explorar outras cores? Essa aqui, por exemplo, se chama{' '}
                                <ColorLink info={rndColor} /> e é bem bonita!
                            </p>
                        </div>
                        <div className='w-full flex items-center justify-center'>
                            <Link href='/'>
                                <Button>Voltar para a página inicial</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
