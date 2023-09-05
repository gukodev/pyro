import FooterLink from './FooterLink'

interface ItemType {
    label: string
    type: string
    href: string
    legacy?: boolean
}

export type FooterItemType = {
    title: string
    items: ItemType[]
}

interface FooterItemProps {
    item: FooterItemType
}

export default function FooterItem({ item }: FooterItemProps) {
    return (
        <div className='flex flex-col gap-4 text-black'>
            <h1 className='text-3xl font-bold'>{item.title}</h1>
            <div className='flex flex-col gap-1.5 text-xl'>
                {item.items.map((x) => {
                    return (
                        <FooterLink
                            href={x.href}
                            legacy={x.legacy || false}
                            key={x.label}
                            target='_self'
                        >
                            {x.label}
                        </FooterLink>
                    )
                })}
            </div>
        </div>
    )
}
