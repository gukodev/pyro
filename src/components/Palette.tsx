import { removeHash } from '@/util/colorFormat'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

interface PalleteProps {
    colors: string[]
    linkColors?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export default function Palette({ colors, linkColors = false, size = 'md' }: PalleteProps) {
    const height = size === 'sm' ? 64 : size === 'md' ? 96 : 128

    const commonStyles = (color: string, index: number, button?: boolean) => {
        return {
            className: twMerge(
                'w-full flex flex-1 transition-all',
                index === 0 ? 'rounded-l-2xl' : '',
                index === colors.length - 1 ? 'rounded-r-2xl' : '',
                button ? 'hover:opacity-75 hover:p-2' : ''
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
