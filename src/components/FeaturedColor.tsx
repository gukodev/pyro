'use client'

import { copy } from '@/util/clipboard'
import { ColorInfo } from '@/util/color'
import { Copy } from '@phosphor-icons/react'
import clsx from 'clsx'
import { wcagContrast } from 'culori'
import Link from 'next/link'
import OutlineButton from './OutlineButton'

interface FeaturedColorProps {
    data: ColorInfo
}

export default function FeaturedColor({ data }: FeaturedColorProps) {
    const { hex, name, hsl } = data
    const lightness = hsl?.l ?? 0
    const theme = wcagContrast(hex, '#ffffff') > 4.5 ? 'light' : 'dark'
    const borderColor = `hsl(${hsl?.h}, ${(hsl?.s || 0) * 100}%, ${(lightness - 0.066) * 100}%)`

    const copyFeaturedColor = async () => {
        const success = await copy(hex)
        if (success) return alert('Cor copiada com sucesso!')

        alert('Não foi possível copiar a cor.')
    }

    return (
        <div
            className='relative w-full h-72 rounded-3xl p-4 border-2'
            style={{ backgroundColor: `#${hex}`, borderColor }}
        >
            <div
                className={clsx(
                    'flex w-full items-center justify-between font-semibold text-lg',
                    theme === 'dark' ? 'text-black/90' : 'text-white/90'
                )}
            >
                <Link className='text-4xl hover:opacity-75 transition-opacity' href={`/${hex}`}>
                    {name}
                </Link>
                <button
                    className='inline-flex items-center gap-2 hover:opacity-75 transition-opacity'
                    onClick={() => copyFeaturedColor()}
                >
                    <Copy weight='fill' size={18} />
                    {`#${hex}`}
                </button>
            </div>
            <div className='absolute bottom-0 left-0 p-4 w-full'>
                <div className='float-right opacity-90'>
                    <OutlineButton theme={theme}>Saiba mais</OutlineButton>
                </div>
            </div>
        </div>
    )
}
