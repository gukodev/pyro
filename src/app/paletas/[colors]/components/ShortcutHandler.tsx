'use client'

import { removeHash } from '@/util/colorFormat'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface ShortcutHandlerProps {
    onNewPalette: (newColors: string[]) => void
    length: number
}

export default function ShortcutHandler({ onNewPalette, length }: ShortcutHandlerProps) {
    const [loading, setLoading] = useState<boolean>(false)

    const setFavicon = (color: string) => {
        // Remove existing favicon
        const findShortcut = document.querySelectorAll<HTMLLinkElement>('link[rel="shortcut icon"]')
        const findFavicon = document.querySelectorAll<HTMLLinkElement>('link[rel="icon"]')
        if (findShortcut.length) findShortcut.forEach((x) => x.remove())
        if (findFavicon.length) findFavicon.forEach((x) => x.remove())

        // Set theme color
        const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
        if (themeColor) themeColor.content = color

        // New favicons
        const newFaviconUrl = `/favicon?hex=${removeHash(color)}`

        const shortcutIcon = document.createElement('link')
        shortcutIcon.rel = 'shortcut icon'
        shortcutIcon.href = newFaviconUrl
        document.head.appendChild(shortcutIcon)

        const favicon = document.createElement('link')
        favicon.rel = 'icon'
        favicon.href = newFaviconUrl
        document.head.appendChild(favicon)
    }

    const newPaletteHandler = (colors: string[]) => {
        onNewPalette(colors)
        setFavicon(colors[0])
    }

    const generateNewPalette = () => {
        if (loading) return
        setLoading(true)

        axios
            .get(`/api/random-palette?length=${length}`)
            .then((res) => {
                const newColors = res.data.colors
                newPaletteHandler(newColors)
            })
            .catch((err) => {
                const colors = Array.from({ length }, () => {
                    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
                })
                newPaletteHandler(colors)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.code === 'Space') generateNewPalette()
        }

        window.addEventListener('keyup', listener)
        return () => window.removeEventListener('keyup', listener)
    }, [])

    return null
}
