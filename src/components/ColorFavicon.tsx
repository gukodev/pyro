'use client'

import { removeHash } from '@/util/colorFormat'
import { useEffect } from 'react'

interface ColorFaviconProps {
    color: string
}

export default function ColorFavicon({ color }: ColorFaviconProps) {
    useEffect(() => {
        const link = document.createElement('link')
        link.rel = 'icon'
        link.href = `/icon/${removeHash(color)}`
        link.type = 'image/png'
        document.head.appendChild(link)
    }, [])

    return null
}
