'use client'

import { ArrowsClockwise } from '@/assets/icons'
import { useRandomColorLoading } from '@/contexts/RandomColorLoading'
import { randomColorRedirect } from '@/util/random'
import { useRouter } from 'next/navigation'
import Button from './Button'

export default function RegenerateColorMobileButton() {
    const router = useRouter()
    const hooks = useRandomColorLoading()

    return (
        <div className='fixed z-30 md:hidden block bottom-0 p-4 w-screen'>
            <Button
                className='!text-xl !w-full !p-4 shadow-xl'
                onClick={() => randomColorRedirect(router, hooks)}
            >
                <ArrowsClockwise size={24} />
                Gerar outra cor
            </Button>
        </div>
    )
}
