import Link from 'next/link'

interface AboutLinkProps {
    href: string
    target?: string
    children: React.ReactNode
}

export default function AboutLink({ children, href, target = '_blank' }: AboutLinkProps) {
    return (
        <Link
            href={href}
            target={target}
            className='text-red-500 underline hover:text-red-400 transition-colors'
        >
            {children}
        </Link>
    )
}
