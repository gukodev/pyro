import { Hsl, Hsv, Rgb, differenceCiede2000, hsl, hsv, nearest, rgb } from 'culori'
import fs from 'fs'
import path from 'path'
import { getTodayDate } from './date'
import { createCacheFile, getCacheFile } from './file'

export interface ColorNames {
    [hex: string]: string
}

export interface ColorInfo {
    name: string
    nearestNamedColor: string
    hex: string
    rgb: Rgb | undefined
    hsl: Hsl | undefined
    hsv: Hsv | undefined
    totalExecTime?: number
    getColorNamesExecTime?: number
    colorObjectKeysExecTime?: number
    returnNamedColorExecTime?: number
}

export interface DailyColorData {
    info: ColorInfo
    refreshAt: number
}

export const COLORNAMES_PATH = path.resolve('src/assets/data/colornames.min.json')

// Memory cache
let colorNames: ColorNames | null = null

export function getColorNames(): ColorNames {
    if (!colorNames) {
        const data = JSON.parse(fs.readFileSync(COLORNAMES_PATH, 'utf-8'))
        colorNames = data
        return data
    }
    return colorNames
}

// Generates a random color by generating a random hex value
export function randomHexColor(length: number): string[] {
    function generateRandomHexColor(): string {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16)
        const paddedColor = randomColor.padStart(6, '0')
        return `#${paddedColor}`
    }

    const colors: string[] = []
    for (let i = 0; i < length; i++) {
        const color = generateRandomHexColor()
        colors.push(color)
    }

    return colors
}

export function getColorInfo(hex: string): ColorInfo {
    if (hex.startsWith('#')) hex.slice(1)

    const rawColors = getColorNames()
    const colors = Object.keys(rawColors)

    const nearestNamedColor = nearest(colors, differenceCiede2000())
    const cNearest = nearestNamedColor(hex, 1)[0]

    const colorInfo: ColorInfo = {
        name: rawColors[cNearest],
        nearestNamedColor: cNearest,
        hex: hex.toLowerCase(),
        rgb: rgb(hex),
        hsl: hsl(hex),
        hsv: hsv(hex),
    }

    return colorInfo
}

interface CachedFile {
    info: ColorInfo
    generatedAt: string
}

export function getDailyColor(): DailyColorData {
    const date = getTodayDate()
    const unixTs = Math.floor(date.getTime() / 1000)

    const cachedFile = getCacheFile(`daily-color-${unixTs}.json`)
    const refreshAt = unixTs + 86400

    if (fs.existsSync(cachedFile)) {
        const { info } = JSON.parse(fs.readFileSync(cachedFile, 'utf-8')) as CachedFile
        return {
            info,
            refreshAt,
        }
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

    return {
        info: data.info,
        refreshAt,
    }
}

// Generates a random named color
export function getRandomColor(): ColorInfo {
    const colorNames = Object.entries(getColorNames())
    const rndIndex = Math.floor(Math.random() * colorNames.length)
    const [hex] = colorNames[rndIndex]
    return getColorInfo(hex)
}
