'use client'

// This component is a workaround for the not-found page.
// Currently, it doesn't support the legacy Metadata API from Next.

import { useEffect, useState } from 'react'

interface MetadataProps {
    data: {
        title?: string
        favicon?: string
        themeColor?: string
    }
}

export default function Metadata({ data }: MetadataProps) {
    const { title, favicon } = data

    // Hydration check
    const [metadataSet, setMetadataSet] = useState<boolean>(false)

    useEffect(() => {
        if (metadataSet) return

        const head = document.head

        if (title) {
            const titleEl = document.createElement('title')
            titleEl.innerText = title
            head.appendChild(titleEl)
        }

        if (favicon) {
            const icon = {
                href: favicon,
                type: 'image/svg+xml',
            }

            const faviconEl = document.createElement('link')
            const shortcutEl = document.createElement('link')

            faviconEl.rel = 'icon'
            faviconEl.href = icon.href
            faviconEl.type = icon.type

            shortcutEl.rel = 'shortcut icon'
            shortcutEl.href = icon.href
            shortcutEl.type = icon.type

            head.appendChild(faviconEl)
            head.appendChild(shortcutEl)
        }

        if (data.themeColor) {
            const themeColorEl = document.createElement('meta')
            themeColorEl.name = 'theme-color'
            themeColorEl.content = data.themeColor
            head.appendChild(themeColorEl)
        }

        setMetadataSet(true)
    }, [])

    return null
}
