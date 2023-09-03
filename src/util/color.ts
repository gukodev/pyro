import { ISuggestion } from '@/common/types'
import { isValidColor, removeHash } from '@/util/colorFormat'
import { differenceCiede2000, hsl, hsv, nearest, rgb } from 'culori'
import fs from 'fs'
import path from 'path'
import { HSL, HSV, RGB, addHash, formatHSL, formatHSV, formatRGB } from './colorFormat'
import { getTodayDate } from './date'
import { createCacheFile, getCacheFile } from './file'
import * as palette from './palette'

interface CachedFile {
    info: ColorInfo
    generatedAt: string
}

export interface ColorNames {
    [hex: string]: string
}

export interface DarkColor {
    hex: string
    name: string
}

export interface ColorInfo {
    hex: string
    name: string
    nearestNamedColor: string
    related: string[]
    palettes: palette.Palettes
    percent: {
        r: number
        g: number
        b: number
    }
    rgb: {
        r: number
        g: number
        b: number
    }
    hsl: {
        h: number
        s: number
        l: number
    }
    hsv: {
        h: number
        s: number
        v: number
    }
    cmyk: {
        c: number
        m: number
        y: number
        k: number
    }
}

export interface ColorTheory {
    complementary: string[]
    splitComplementary: string[]
    analogous: string[]
    triadic: string[]
    tetradic: string[]
}

export const COLORNAMES_PATH = path.resolve('src/assets/data/colornames.min.json')
export const DARKCOLORS_PATH = path.resolve('src/assets/data/dark-colors.json')

// Memory cache
let colorNames: ColorNames | null = null
let darkColors: DarkColor[] | null = null

export function getDarkColors(): DarkColor[] {
    if (!darkColors) {
        const data = JSON.parse(fs.readFileSync(DARKCOLORS_PATH, 'utf-8'))
        darkColors = data
        return data
    }
    return darkColors
}

export function getRandomDarkColor(): DarkColor {
    const darkColors = getDarkColors()
    const rndIndex = Math.floor(Math.random() * darkColors.length)
    const color = darkColors[rndIndex]
    return color
}

export function getColorNames(): ColorNames {
    if (!colorNames) {
        const data = JSON.parse(fs.readFileSync(COLORNAMES_PATH, 'utf-8'))
        colorNames = data
        return data
    }
    return colorNames
}

export function getColorName(hex: string): string {
    const colorNames = getColorNames()
    const name = colorNames[hex]
    return name
}

export function getNearestColorName(hex: string): string {
    const colorNames = getColorNames()
    if (colorNames[hex]) return colorNames[hex]

    const colors = Object.keys(colorNames)
    const getNearestColors = nearest(colors, differenceCiede2000())

    const nearestColors = getNearestColors(hex, 250)
    const cNearest = nearestColors[0]

    return colorNames[cNearest]
}

export function getRandomNamedColorHex(): string {
    const colorNames = Object.keys(getColorNames())
    const rndIndex = Math.floor(Math.random() * colorNames.length)
    const hex = colorNames[rndIndex]
    return hex
}

// Generates a random named color and return its info
export function getRandomNamedColor(): ColorInfo {
    const colorNames = Object.entries(getColorNames())
    const rndIndex = Math.floor(Math.random() * colorNames.length)
    const [hex] = colorNames[rndIndex]
    return getColorInfo(hex)
}

// Generates a list of unique random named colors and return its hex values
export function getRandomUniqueNamedColorsHex(length: number): string[] {
    let colors: string[] = []

    while (colors.length < length) {
        const generatedHex = getRandomNamedColorHex()
        const hasInTheList = colors.filter((x) => x === generatedHex).length
        if (!hasInTheList) colors.push(generatedHex)
    }

    return colors
}

// Generates a random hex color value
export function getRandomColor(): string {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16)
    const paddedColor = randomColor.padStart(6, '0')
    return `#${paddedColor}`
}

export function getColorInfo(hex: string): ColorInfo {
    hex = addHash(hex)

    const rawColors = getColorNames()
    const colors = Object.keys(rawColors)
    const getNearestColors = nearest(colors, differenceCiede2000())

    const nearestColors = getNearestColors(hex, 250)
    const cNearest = nearestColors[0]

    const related = nearestColors.slice(-30).map((color) => addHash(color))

    const _rgb = rgb(hex) as RGB
    const rgbFormatted = formatRGB(_rgb)
    const _hsv = formatHSV(hsv(hex) as HSV, false) as [number, number, number]
    const _hsl = formatHSL(hsl(hex) as HSL, false) as [number, number, number]

    const colorInfo: ColorInfo = {
        hex: hex.toLowerCase(),
        name: rawColors[cNearest],
        nearestNamedColor: addHash(cNearest),
        related,
        palettes: palette.generateAll(hex),
        percent: {
            r: Math.round((_rgb?.r || 0) * 100),
            g: Math.round((_rgb?.g || 0) * 100),
            b: Math.round((_rgb?.b || 0) * 100),
        },
        rgb: {
            r: rgbFormatted[0],
            g: rgbFormatted[1],
            b: rgbFormatted[2],
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
        cmyk: getCmyk(hex),
    }

    return colorInfo
}

// Converts a hex color to CMYK
export function getCmyk(hex: string) {
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

// Generates a random named color and caches it for the day
export function getDailyColor(): ColorInfo {
    const date = getTodayDate()
    const unixTs = Math.floor(date.getTime() / 1000)
    const cachedFile = getCacheFile(`daily-color-${unixTs}.json`)

    if (fs.existsSync(cachedFile)) {
        const { info } = JSON.parse(fs.readFileSync(cachedFile, 'utf-8')) as CachedFile
        return info
    }

    const colorNames = Object.entries(getColorNames())

    const rndIndex = unixTs % colorNames.length
    const [hex] = colorNames[rndIndex]

    const data: CachedFile = {
        info: getColorInfo(hex),
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

export function getSuggestions(query: string, size: number = 5): ISuggestion[] {
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
                name: getColorName(lowerQuery),
                hex: lowerQuery,
                href: `/${normalizedQuery}`,
            },
        ]
    }

    return suggestions.slice(0, size)
}
