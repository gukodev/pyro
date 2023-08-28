'use client'

import { Heart } from '@/assets/icons'
import { useRandomColorLoading } from '@/contexts/RandomColorLoading'
import { randomColorRedirect } from '@/util/random'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

interface FooterLinkProps {
    href: string
    target?: string
    children: React.ReactNode
    underline?: boolean
}

function Link({ children, href, target, underline = false }: FooterLinkProps) {
    return (
        <NextLink
            href={href}
            target={target || '_blank'}
            className={twMerge(
                'hover:text-red-600 text-black transition-colors',
                underline ? 'hover:underline' : ''
            )}
        >
            {children}
        </NextLink>
    )
}

type FooterItemType = {
    title: string
    items: (
        | {
              label: string
              type: string
              href: string
              onClick?: undefined
          }
        | {
              label: string
              type: string
              onClick: () => Promise<void>
              href?: undefined
          }
    )[]
}

interface FooterItemProps {
    item: FooterItemType
}

function FooterItem({ item }: FooterItemProps) {
    return (
        <div className='flex flex-col gap-4 text-black'>
            <h1 className='text-3xl font-bold'>{item.title}</h1>
            <div className='flex flex-col gap-1.5 text-xl'>
                {item.items.map((x) => {
                    if (x.type === 'link') {
                        return (
                            <Link href={x?.href || '#'} key={x.label} target='_self'>
                                {x.label}
                            </Link>
                        )
                    }

                    return (
                        <button
                            className='hover:text-red-600 text-left transition-colors'
                            onClick={x.onClick}
                            key={x.label}
                        >
                            {x.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default function Footer() {
    const router = useRouter()
    const hooks = useRandomColorLoading()

    const footerItems: FooterItemType[] = [
        {
            title: 'Ferramentas',
            items: [
                {
                    label: 'Paletas',
                    type: 'link',
                    href: '/paletas',
                },
                {
                    label: 'Cor aleatória',
                    type: 'button',
                    onClick: () => randomColorRedirect(router, hooks),
                },
            ],
        },
    ]

    return (
        <footer className='bg-slate-200 py-24'>
            <div className='w-full max-w-screen-xl mx-auto px-4 text-slate-500'>
                <div className='grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {footerItems.map((x) => (
                        <FooterItem item={x} key={x.title} />
                    ))}
                </div>
                <div className='w-full h-[2px] bg-slate-300 my-16' />
                <div className='block text-sm'>
                    <span>
                        Criado com <Heart weight='fill' className='inline text-red-500 text-xl' />{' '}
                        por{' '}
                        <Link href={process.env.GITHUB_AUTHOR} underline>
                            {process.env.AUTHOR_NAME}
                        </Link>
                        , distribuído livremente no{' '}
                        <Link href={process.env.GITHUB_REPO} underline>
                            GitHub
                        </Link>{' '}
                        😊
                    </span>
                </div>
            </div>
        </footer>
    )
}
