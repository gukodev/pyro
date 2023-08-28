import Link from 'next/link'

interface MobileNavLinkProps {
    children: React.ReactNode
    href: string
    legacy?: boolean
    button?: false
    onClick?: never
}

interface MobileNavLinkPropsIfButton {
    children: React.ReactNode
    button: true
    onClick?: () => void
}

export function MobileNavLink(props: MobileNavLinkProps | MobileNavLinkPropsIfButton) {
    const { children, button } = props
    const classes = 'text-5xl font-bold text-white text-left inline-block'

    if (button) {
        return (
            <button className={classes} onClick={props.onClick}>
                {children}
            </button>
        )
    }

    if (props.legacy) {
        return (
            <a href={props.href} className={classes}>
                {children}
            </a>
        )
    }

    return (
        <Link href={props.href} className={classes}>
            {children}
        </Link>
    )
}
