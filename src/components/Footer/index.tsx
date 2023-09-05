'use client'

import { Heart } from '@/assets/icons'
import FooterItem, { FooterItemType } from './FooterItem'
import FooterLink from './FooterLink'

const footerItems: FooterItemType[] = [
    {
        title: 'Ferramentas',
        items: [
            {
                label: 'Paletas',
                type: 'link',
                href: '/palette',
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
        title: 'Sobre',
        items: [
            {
                label: 'Sobre o projeto',
                type: 'link',
                href: '/about',
            },
            {
                label: 'Código-fonte',
                type: 'link',
                href: '/about#source-code',
            },
            {
                label: 'Atribuições',
                type: 'link',
                href: '/about#attributions',
            },
        ],
    },
    // {
    //     title: 'API',
    //     items: [
    //         {
    //             label: 'Documentação',
    //             type: 'link',
    //             href: '/docs',
    //         },
    //     ],
    // },
]

export default function Footer() {
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
                        <FooterLink href={process.env.GITHUB_AUTHOR} underline>
                            {process.env.AUTHOR_NAME}
                        </FooterLink>
                        , distribuído livremente no{' '}
                        <FooterLink href={process.env.GITHUB_REPO} underline>
                            GitHub
                        </FooterLink>{' '}
                        😊
                    </span>
                    <span className='block'>
                        Dados de cores fornecidos por{' '}
                        <FooterLink href={process.env.COLORNAMES_REPO} underline>
                            color-names
                        </FooterLink>{' '}
                        🎨
                    </span>
                </div>
            </div>
        </footer>
    )
}
