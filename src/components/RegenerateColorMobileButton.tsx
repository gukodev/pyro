'use client'

import { ArrowsClockwise } from '@/assets/icons'
import Button from './Button'

interface RegenerateColorMobileButtonProps {
    fromRandom: boolean
}

export default function RegenerateColorMobileButton({
    fromRandom,
}: RegenerateColorMobileButtonProps) {
    return fromRandom ? (
        <div className='fixed z-30 md:hidden block bottom-0 p-4 w-screen'>
            <a href='/random'>
                <Button className='!text-xl !w-full !p-4 shadow-xl'>
                    <ArrowsClockwise size={24} />
                    Gerar outra cor
                </Button>
            </a>
        </div>
    ) : null
}
