import { removeHash } from '@/util/colorFormat'
import Link from 'next/link'

interface ColorListProps {
    colors: string[]
}

export default function ColorList({ colors }: ColorListProps) {
    return (
        <div className='grid grid-cols-10 gap-4'>
            {colors.map((color, index) => (
                <Link
                    href={`/${removeHash(color)}`}
                    key={index}
                    className='w-[86px] h-[86px] rounded-2xl hover:opacity-75 transition-opacity'
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>
    )
}
