'use client'

import { ColorInfo } from '@/util/color'
import clsx from 'clsx'
import { wcagContrast } from 'culori'
import Link from 'next/link'
import Copyable from '../Copyable'
import OutlineButton from '../OutlineButton'

interface ColorCardProps {
    data: ColorInfo
}

export default function ColorCard({ data }: ColorCardProps) {
    const { hex, name, hsl } = data
    const theme = wcagContrast(hex, '#fff') > 3 ? 'light' : 'dark'

    const lightness = hsl?.l ?? 0
    const borderColor = `hsl(${hsl?.h}, ${(hsl?.s || 0) * 100}%, ${(lightness - 0.066) * 100}%)`

    return (
        <div
            className='relative w-full h-72 rounded-3xl p-4 border-4'
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
                <Copyable value={`#${hex}`} />
            </div>
            <div className='absolute bottom-0 left-0 p-4 w-full'>
                <div className='float-right opacity-90'>
                    <OutlineButton theme={theme}>Saiba mais</OutlineButton>
                </div>
            </div>
        </div>
    )
}
