'use client'
import Button from '@/components/Button'
import OutlineButton from '@/components/OutlineButton'
import { copy } from '@/util/clipboard'
import { Copy } from '@phosphor-icons/react'
import Link from 'next/link'
import { useState } from 'react'
import { Palette, Shuffle } from './../assets/icons'

export default function Home() {
    // Featured color
    const [color, setColor] = useState<string>('#f87171')
    const [colorName, setColorName] = useState<string>('Flory')

    const copyFeaturedColor = async () => {
        const success = await copy(color)
        if (success) return alert('Cor copiada com sucesso!')
        alert('Não foi possível copiar a cor.')
    }

    return (
        <main>
            <div className='w-full max-w-screen-lg mx-auto px-4'>
                <div className='py-6 border-b-4 border-slate-200 flex items-center justify-between mb-10'>
                    <h1 className='text-4xl font-bold'>🔥 pyro</h1>
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
                <div>
                    <div className='flex flex-col gap-4'>
                        <div className='flex items-center gap-4'>
                            <h1 className='text-6xl font-bold'>Cor destaque</h1>
                            <p className='text-slate-400'>reseta em 2 horas</p>
                        </div>
                        <div
                            className='relative w-full h-72 rounded-3xl p-4'
                            style={{ backgroundColor: color }}
                        >
                            <div className='flex w-full items-center justify-between text-white font-semibold text-lg'>
                                <Link
                                    className='text-4xl hover:opacity-75 transition-opacity'
                                    href={`/${color.replace('#', '')}`}
                                >
                                    {colorName}
                                </Link>
                                <button
                                    className='inline-flex items-center gap-2 hover:opacity-75 transition-opacity'
                                    onClick={() => copyFeaturedColor()}
                                >
                                    <Copy weight='fill' size={18} />
                                    {color}
                                </button>
                            </div>
                            <div className='absolute bottom-0 left-0 p-4 w-full'>
                                <div className='float-right'>
                                    <OutlineButton>Saiba mais</OutlineButton>
                                </div>
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>
        </main>
    )
}
