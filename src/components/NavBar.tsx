'use client'

import { List, Palette, Shuffle, X } from '@/assets/icons'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'
import Button from './Button'
import { MobileNavLink } from './MobileNavLink'

export default function NavBar() {
    // Mobile navbar
    const [open, setOpen] = useState(false)

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

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
    }, [open])

    return (
        <>
            <Transition
                show={open}
                enter='transition-opacity duration-150'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='transition-opacity duration-150'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
                as={Fragment}
            >
                <div className='fixed md:hidden top-0 left-0 w-screen h-screen z-40'>
                    <div className='w-full h-full max-w-screen-lg mx-auto px-4 py-6 absolute top-0 left-0 z-50'>
                        <div className='w-full'>
                            <div className='ml-auto w-fit'>
                                <Button onClick={() => setOpen(false)}>
                                    <X size={26} weight='bold' />
                                </Button>
                            </div>
                        </div>
                        <div className='flex flex-col gap-8 mt-8'>
                            <MobileNavLink href='/'>Início</MobileNavLink>
                            <MobileNavLink href='#'>Paletas</MobileNavLink>
                            <MobileNavLink button onClick={handleRandomColor}>
                                Cor aleatória
                            </MobileNavLink>
                        </div>
                    </div>
                    <div className='bg-black/90 w-screen h-screen absolute top-0 left-0 z-40' />
                </div>
            </Transition>
            <div className='py-6 border-b-4 border-slate-200 flex items-center justify-between mb-8'>
                <Link href='/'>
                    <h1 className='text-4xl font-bold'>🔥 pyro</h1>
                </Link>
                <div className='hidden md:flex items-center gap-4'>
                    <Button ghost>
                        <Palette size={22} weight='bold' />
                        Paletas
                    </Button>
                    <Button onClick={handleRandomColor}>
                        <Shuffle size={22} weight='bold' />
                        Cor aleatória
                    </Button>
                </div>
                <div className='flex md:hidden items-center gap-4'>
                    <Button onClick={() => setOpen(!open)}>
                        <List size={26} weight='bold' />
                    </Button>
                </div>
            </div>
        </>
    )
}
