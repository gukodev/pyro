'use client'

import { removeHash } from '@/util/colorFormat'
import { useEffect, useState } from 'react'
import ShortcutHandler from './ShortcutHandler'

interface ColorsProps {
    colors: string[]
    length: number
    validParam: string
}

function Color(props: { color: string }) {
    return <div className='w-full h-full' style={{ backgroundColor: props.color }}></div>
}

export default function Colors({ colors: colorsParam, length, validParam }: ColorsProps) {
    const [colors, setColors] = useState<string[]>(colorsParam)

    useEffect(() => {
        // check if history === validParam
        const history = window.location.pathname
        console.log(history, validParam)
        if (history !== `/paletas/${validParam}`)
            window.history.pushState(null, '', `/paletas/${validParam}`)
    }, [])

    const handleNewPallete = (newColors: string[]) => {
        setColors(newColors)
        window.history.pushState(
            null,
            '',
            `/paletas/${newColors.map((c) => removeHash(c)).join('-')}`
        )
    }

    return (
        <>
            {colors.map((color, i) => (
                <Color key={`${color}-${i}`} color={color} />
            ))}
            <ShortcutHandler onNewPalette={handleNewPallete} length={length} />
        </>
    )
}
