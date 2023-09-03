'use client'

import { Heart } from '@/assets/icons'
import NextLink from 'next/link'
import { twMerge } from 'tailwind-merge'

interface FooterLinkProps {
    href: string
    legacy?: boolean
    target?: string
    children: React.ReactNode
    underline?: boolean
}

function Link({ children, href, target, underline = false, legacy = false }: FooterLinkProps) {
    const commonProps = {
        href: href,
        target: target || '_blank',
        className: twMerge(
            'hover:text-red-600 text-black transition-colors',
            underline ? 'hover:underline' : ''
        ),
    }

    if (legacy) {
        return <a {...commonProps}>{children}</a>
    }

    return <NextLink {...commonProps}>{children}</NextLink>
}

interface ItemType {
    label: string
    type: string
    href: string
    legacy?: boolean
}
type FooterItemType = {
    title: string
    items: ItemType[]
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
                    return (
                        <Link href={x.href} legacy={x.legacy || false} key={x.label} target='_self'>
                            {x.label}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default function Footer() {
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
                    type: 'link',
                    href: '/random',
                    legacy: true,
                },
            ],
        },
        {
            title: 'API',
            items: [
                {
                    label: 'Documentação',
                    type: 'link',
                    href: '/docs',
                },
            ],
        },
    ]

    return (
        <footer className='bg-slate-200 py-12 md:py-24'>
            <div className='w-full max-w-screen-xl mx-auto px-4 text-slate-500'>
                <div className='grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {footerItems.map((x) => (
                        <FooterItem item={x} key={x.title} />
                    ))}
                </div>
                <div className='w-full h-[2px] bg-slate-300 my-16' />
                <div className='block text-sm'>
                    <span className='block'>
                        Criado com{' '}
                        <Heart weight='fill' className='inline text-red-500 text-xl heart-pulse' />{' '}
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
                    <span className='block'>
                        Dados de cores fornecidos por{' '}
                        <Link href='https://github.com/meodai/color-names' underline>
                            color-names
                        </Link>{' '}
                        🎨
                    </span>
                </div>
            </div>
        </footer>
    )
}
