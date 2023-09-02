import { addHash } from '@/util/colorFormat'
import { wcagContrast } from 'culori'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

export interface ColorProps {
    hex: string
    name: string
    href: string
    onCopy: (hex: string) => void
}

export default function Color({ hex, name, href, onCopy }: ColorProps) {
    const hexWithHash = addHash(hex)
    const contrast = wcagContrast(hexWithHash, '#fff')

    const textColor = contrast > 3 ? 'text-white' : 'text-black'

    return (
        <div className='w-full h-full flex xl:p-16 p-8' style={{ backgroundColor: hex }}>
            <div className={twMerge('flex flex-col gap-2 mt-auto', textColor)}>
                <div>
                    <h1
                        className='text-2xl font-bold opacity-90 border-none focus:outline-none block bg-transparent transition-opacity hover:opacity-50 cursor-pointer'
                        onClick={() => onCopy(hexWithHash)}
                    >
                        {hexWithHash}
                    </h1>
                    <Link className='opacity-50 select-none hover:underline' href={href}>
                        {name}
                    </Link>
                </div>
            </div>
        </div>
    )
}
