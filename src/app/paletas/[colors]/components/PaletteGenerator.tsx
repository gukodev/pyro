'use client'

import { HexAndName } from '@/common/types'
import PaletteNavBar from '@/components/PaletteNavBar'
import { removeHash } from '@/util/colorFormat'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Advice from './Advice'
import Colors from './Colors'
import ShortcutHandler from './ShortcutHandler'

interface PaletteGeneratorProps {
    colors: HexAndName[]
    validParam: string
}

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

export default function PaletteGenerator({
    colors: colorsParam,
    validParam,
}: PaletteGeneratorProps) {
    const [colors, setColors] = useState<HexAndName[]>(colorsParam)
    const [loading, setLoading] = useState<boolean>(false)
    const [showAdvice, setShowAdvice] = useState<boolean>(true)

    const handleSetPalette = (colors: HexAndName[]) => {
        setColors(colors)
        window.history.replaceState(
            null,
            '',
            `/paletas/${colors.map(({ hex }) => removeHash(hex)).join('-')}`
        )
    }

    const handleCopyColor = (hex: string) => {
        navigator.clipboard.writeText(hex).then(() => {
            toast.success('Copiado!')
        })
    }

    const generateNewPalette = () => {
        if (loading) return
        setLoading(true)
        if (showAdvice) setShowAdvice(false)

        const length = colors.length
        axios
            .get(`/api/random-palette?length=${length}`)
            .then((res) => {
                const newColors = res.data.colors as HexAndName[]
                handleSetPalette(newColors)
            })
            .catch((err) => {
                console.log(err)
                const colors = Array.from({ length }, () => {
                    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
                })
                handleSetPalette(colors.map((hex) => ({ hex, name: hex })))
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (colors[0]) setFavicon(colors[0].hex)
    }, [colors])

    useEffect(() => {
        const history = window.location.pathname
        if (history !== `/paletas/${validParam}`)
            window.history.pushState(null, '', `/paletas/${validParam}`)
    }, [])

    return (
        <>
            <PaletteNavBar onRegenerate={() => generateNewPalette()} />
            <Advice show={showAdvice} onClose={() => setShowAdvice(false)} />
            <Colors colors={colors} onCopy={handleCopyColor} loading={loading} />
            <ShortcutHandler onNewPalette={() => generateNewPalette()} />
        </>
    )
}
