'use client'

import { HexAndName } from '@/common/types'
import { removeHash } from '@/util/colorFormat'
import Color from './Color'

interface ColorsProps {
    colors: HexAndName[]
    onCopy: (hex: string) => void
}

export default function Colors({ colors, onCopy }: ColorsProps) {
    return (
        <>
            {colors.map((color, i) => (
                <Color
                    key={`${color}-${i}`}
                    hex={color.hex}
                    name={color.name}
                    href={`/${removeHash(color.hex)}`}
                    onCopy={onCopy}
                />
            ))}
        </>
    )
}
