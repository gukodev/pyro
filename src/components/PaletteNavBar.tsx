'use client'

import { ArrowsCounterClockwise, House } from '@phosphor-icons/react'
import Link from 'next/link'
import Button from './Button'

interface PaletteNavBarProps {
    onRegenerate: () => void
}

export default function PaletteNavBar({ onRegenerate }: PaletteNavBarProps) {
    return (
        <nav className='w-screen absolute top-0 left-0 z-30 flex items-center justify-center px-4'>
            <div className='max-w-screen-lg w-full bg-zinc-50 border-x-2 border-b-2 rounded-b-3xl border-zinc-200 flex items-center justify-between xl:p-4 p-2'>
                <Link href='/' className='xl:text-4xl text-3xl font-bold select-none'>
                    🔥 pyro
                </Link>
                <div className='flex items-center justify-center gap-4'>
                    <Button onClick={onRegenerate}>
                        <ArrowsCounterClockwise size={22} weight='bold' />
                        <span className='xl:inline hidden'>Regenerar</span>
                    </Button>
                    <Link href='/'>
                        <Button ghost>
                            <House size={22} weight='bold' />
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
