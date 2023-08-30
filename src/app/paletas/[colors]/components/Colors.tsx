'use client'

import { addHash } from '@/util/colorFormat'
import { wcagContrast } from 'culori'
import { twMerge } from 'tailwind-merge'

interface ColorsProps {
    colors: string[]
    onCopy: (hex: string) => void
}

interface ColorProps {
    hex: string
    name: string
    href: string
    onCopy: (hex: string) => void
}

function Color({ hex, name, href, onCopy }: ColorProps) {
    const hexWithHash = addHash(hex)
    const contrast = wcagContrast(hexWithHash, '#fff')

    const textColor = contrast > 3 ? 'text-white' : 'text-black'

    return (
        <div className='w-full h-full flex p-16' style={{ backgroundColor: hex }}>
            <div className={twMerge('flex flex-col gap-2 mt-auto', textColor)}>
                <div>
                    <button
                        className='text-2xl font-bold opacity-90 border-none focus:outline-none block bg-transparent transition-opacity hover:opacity-50'
                        onClick={() => onCopy(hexWithHash)}
                    >
                        {hexWithHash}
                    </button>
                    <span className='opacity-50 select-none'>{name}</span>
                </div>
            </div>
        </div>
    )
}

export default function Colors({ colors, onCopy }: ColorsProps) {
    return (
        <>
            {colors.map((color, i) => (
                <Color
                    key={`${color}-${i}`}
                    hex={color}
                    name={color}
                    href={`/paletas/${color}`}
                    onCopy={onCopy}
                />
            ))}
        </>
    )
}
