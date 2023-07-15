import { removeHash } from '@/util/colorFormat'
import Link from 'next/link'

interface ColorListProps {
    colors: string[]
}

export default function ColorList({ colors }: ColorListProps) {
    return (
        <div className='grid gap-4 grid-cols-4 sm:grid-cols-5 md:grid-cols-9 lg:grid-cols-10'>
            {colors.map((color, index) => (
                <Link
                    href={`/${removeHash(color)}`}
                    key={index}
                    className='w-20 h-20 md:w-20 md:h-20 rounded-2xl hover:opacity-75 transition-opacity'
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>
    )
}
