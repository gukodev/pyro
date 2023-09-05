'use client'

import { useEffect } from 'react'

interface ShortcutHandlerProps {
    onNewPalette: () => void
}

export default function ShortcutHandler({ onNewPalette }: ShortcutHandlerProps) {
    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            e.preventDefault()
            if (e.code === 'Space') onNewPalette()
        }

        window.addEventListener('keyup', listener)
        return () => window.removeEventListener('keyup', listener)
    }, [])
    return null
}
