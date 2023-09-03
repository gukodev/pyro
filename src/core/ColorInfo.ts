import {
    HSL,
    HSV,
    RGB,
    addHash,
    formatHSL,
    formatHSV,
    formatRGB,
    isValidColor,
    removeHash,
} from '@/util/colorFormat'
import { today, unix } from '@/util/date'
import { differenceCiede2000, hsl, hsv, nearest, rgb } from 'culori'
import fs from 'fs'
import PaletteGenerator from './PaletteGenerator'
import { getColorNames } from './cache'
import { createCacheFile, getCacheFile } from './file'
import { ICachedFile, IColorInfo, ISuggestion } from './types'

export default class ColorInfo {
    public colorNames = getColorNames()
    public colorKeys = Object.keys(this.colorNames)

    public getNearestColors(hex: string, count: number = 1): string[] {
        const getNearestColors = nearest(this.colorKeys, differenceCiede2000())
        const nearestColors = getNearestColors(hex, count)
        return nearestColors
    }

    public getNearestColorName(hex: string): string {
        if (this.colorNames[hex]) return this.colorNames[hex]
        const nearest = this.getNearestColors(hex, 1)[0]
        return this.colorNames[nearest]
    }

    public getExactColorName(hex: string): string | undefined {
        return this.colorNames[hex]
    }

    public getCmyk(hex: string) {
        const RGB = rgb(hex)
        const r = Math.round((RGB?.r || 0) * 255)
        const g = Math.round((RGB?.g || 0) * 255)
        const b = Math.round((RGB?.b || 0) * 255)

        const c = 1 - r / 255
        const m = 1 - g / 255
        const y = 1 - b / 255

        const k = Math.min(c, m, y)
        const cmyk = {
            c: Math.round(((c - k) / (1 - k)) * 100) || 0,
            m: Math.round(((m - k) / (1 - k)) * 100) || 0,
            y: Math.round(((y - k) / (1 - k)) * 100) || 0,
            k: Math.round(k * 100) || 0,
        }

        return { ...cmyk }
    }

    public getColorInfo(hex: string): IColorInfo {
        // Ensure hex is in the correct format
        hex = addHash(hex)

        // Get the 250 nearest colors to get related colors later
        const nearestColors = this.getNearestColors(hex, 250)

        // Get the nearest color
        const nearestColor = nearestColors[0]

        // Get the last 30 colors from the 250 nearest colors to be used as related colors
        const related = nearestColors.slice(-30).map((color) => addHash(color))

        // Get the formatted RGB => [255, 255, 255]
        const _rgb = rgb(hex) as RGB
        const formattedRGB = formatRGB(_rgb)

        // Get the formatted HSV and HSL => 0°, 0%, 0%
        const _hsv = formatHSV(hsv(hex) as HSV, false) as [number, number, number]
        const _hsl = formatHSL(hsl(hex) as HSL, false) as [number, number, number]

        const palettes = new PaletteGenerator().generateAll(hex)

        const colorInfo: IColorInfo = {
            hex: hex.toLowerCase(),
            name: this.colorNames[nearestColor],
            nearestNamedColor: addHash(nearestColor),
            related,
            palettes,
            percent: {
                r: Math.round((_rgb?.r || 0) * 100),
                g: Math.round((_rgb?.g || 0) * 100),
                b: Math.round((_rgb?.b || 0) * 100),
            },
            rgb: {
                r: formattedRGB[0],
                g: formattedRGB[1],
                b: formattedRGB[2],
            },
            hsl: {
                h: _hsl[0],
                s: _hsl[1],
                l: _hsl[2],
            },
            hsv: {
                h: _hsv[0],
                s: _hsv[1],
                v: _hsv[2],
            },
            cmyk: this.getCmyk(hex),
        }

        return colorInfo
    }

    public getDailyColor(): IColorInfo {
        const date = today() // Get today's date at 00:00:00
        const unixTs = unix(date) // Convert to unix timestamp

        // Get file name
        const cachedFile = getCacheFile(`daily-color-${unixTs}.json`)

        // Check if file exists, if it does, return the info
        if (fs.existsSync(cachedFile)) {
            const { info } = JSON.parse(fs.readFileSync(cachedFile, 'utf-8')) as ICachedFile
            return info
        }

        const hex = this.colorKeys[unixTs % this.colorKeys.length]

        const data: ICachedFile = {
            info: this.getColorInfo(hex),
            generatedAt: new Date().toISOString(),
        }

        try {
            createCacheFile(`daily-color-${unixTs}.json`, JSON.stringify(data))
        } catch (err) {
            console.log('Could not create daily color cache file')
            console.log(err)
        }

        return data.info
    }

    public getSuggestions(query: string, size: number = 5): ISuggestion[] {
        if (!query) return []

        const colorNamesMap = getColorNames()
        const hexes = Object.keys(colorNamesMap)
        const suggestions: ISuggestion[] = []

        const lowerQuery = query.toLowerCase()
        const isHexQuery = lowerQuery.startsWith('#')
        const normalizedQuery = removeHash(lowerQuery)

        for (const hex of hexes) {
            if (
                (isHexQuery && hex.startsWith(normalizedQuery)) ||
                (!isHexQuery && colorNamesMap[hex].toLowerCase().includes(lowerQuery))
            ) {
                suggestions.push({
                    name: colorNamesMap[hex],
                    hex: addHash(hex),
                    href: `/${removeHash(hex)}`,
                })
            }
        }

        // Sort by name
        suggestions.sort((a, b) => {
            const aLower = a.name.toLowerCase()
            const bLower = b.name.toLowerCase()

            const aEqualsQuery = aLower === lowerQuery
            const bEqualsQuery = bLower === lowerQuery

            if (aEqualsQuery && !bEqualsQuery) return -1
            if (!aEqualsQuery && bEqualsQuery) return 1

            const aNameStartsWithQuery = aLower.startsWith(lowerQuery)
            const bNameStartsWithQuery = bLower.startsWith(lowerQuery)

            if (aNameStartsWithQuery && !bNameStartsWithQuery) return -1
            if (!aNameStartsWithQuery && bNameStartsWithQuery) return 1

            return 0
        })

        if (isHexQuery && suggestions.length === 0 && isValidColor(lowerQuery)) {
            return [
                {
                    name: this.getExactColorName(lowerQuery) || lowerQuery,
                    hex: lowerQuery,
                    href: `/${normalizedQuery}`,
                },
            ]
        }

        return suggestions.slice(0, size)
    }
}
