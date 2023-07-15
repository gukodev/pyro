'use client'

import { Palette, Shuffle } from '@/assets/icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Button from './Button'

export default function NavBar() {
    const [btnLoading, setBtnLoading] = useState(false)
    const router = useRouter()

    const handleRandomColor = async () => {
        if (btnLoading) return
        setBtnLoading(true)

        try {
            const req = await fetch('/api/random')
            const hex = await req.text()
            return router.push(`/${hex}`)
        } catch (err) {
            console.log(err)
            setBtnLoading(false)
        }
    }

    return (
        <div className='py-6 border-b-4 border-slate-200 flex items-center justify-between mb-8'>
            <Link href='/'>
                <h1 className='text-4xl font-bold'>🔥 pyro</h1>
            </Link>
            <div className='flex items-center gap-4'>
                <Button ghost>
                    <Palette size={22} weight='bold' />
                    Paletas
                </Button>
                <Button onClick={handleRandomColor}>
                    <Shuffle size={22} weight='bold' />
                    Cor aleatória
                </Button>
            </div>
        </div>
    )
}
