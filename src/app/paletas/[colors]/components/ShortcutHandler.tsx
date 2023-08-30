'use client'

import { useEffect } from 'react'

interface ShortcutHandlerProps {
    onNewPalette: () => void
    length: number
}

export default function ShortcutHandler({ onNewPalette, length }: ShortcutHandlerProps) {
    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.code === 'Space') onNewPalette()
        }

        window.addEventListener('keyup', listener)
        return () => window.removeEventListener('keyup', listener)
    }, [])
    return null
}
