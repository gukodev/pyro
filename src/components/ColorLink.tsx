import { ColorInfo, DarkColor } from '@/util/color'
import { removeHash } from '@/util/colorFormat'
import Link from 'next/link'

interface ColorLinkProps {
    info: ColorInfo | DarkColor
    center?: boolean
}

export default function ColorLink({ info, center }: ColorLinkProps) {
    const svgSize = 16
    const svg = (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width={svgSize}
            height={svgSize}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
            <rect width='100%' height='100%' fill={info.hex} rx='33.33%' />
        </svg>
    )

    const component = (
        <span className='inline-flex items-center gap-2 translate-y-[2px]'>
            {svg}
            <Link
                href={`/${removeHash(info.hex)}`}
                style={{ color: info.hex }}
                className='underline'
            >
                {info.name}
            </Link>
        </span>
    )

    if (center) {
        return <div className='w-full flex items-center justify-center'>{component}</div>
    }

    return component
}
