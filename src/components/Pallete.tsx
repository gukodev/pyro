import { removeHash } from '@/util/colorFormat'
import clsx from 'clsx'
import Link from 'next/link'

interface PalleteProps {
    colors: string[]
    linkColors?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export default function Pallete({ colors, linkColors = false, size = 'md' }: PalleteProps) {
    const height = size === 'sm' ? 64 : size === 'md' ? 96 : 128

    const commonStyles = (color: string, index: number, button?: boolean) => {
        return {
            className: clsx(
                'w-full flex flex-1 transition-opacity',
                index === 0 ? 'rounded-l-lg' : '',
                index === colors.length - 1 ? 'rounded-r-lg' : '',
                button ? 'hover:opacity-75 group items-center justify-center' : ''
            ),
            style: { backgroundColor: color, height: `${height}px` },
        }
    }

    return (
        <div className='flex w-full'>
            {linkColors
                ? colors.map((color, index) => (
                      <Link
                          key={index}
                          href={`/${removeHash(color)}`}
                          {...commonStyles(color, index, true)}
                      />
                  ))
                : colors.map((color, index) => <div key={index} {...commonStyles(color, index)} />)}
        </div>
    )
}
