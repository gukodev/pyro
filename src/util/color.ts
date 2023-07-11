import {
    Color,
    Hsl,
    Hsv,
    Rgb,
    differenceCiede2000,
    formatHex,
    hsl,
    hsv,
    nearest,
    rgb,
} from 'culori'
import fs from 'fs'
import path from 'path'
import { addHash, removeHash } from './colorFormat'
import { getTodayDate } from './date'
import { createCacheFile, getCacheFile } from './file'

export interface ColorNames {
    [hex: string]: string
}

export interface Cmyk {
    mode: 'cmyk'
    c: number
    m: number
    y: number
    k: number
    alpha?: number
}

export interface ColorInfo {
    hex: string
    name: string
    nearestNamedColor: string
    shades: string[]
    tints: string[]
    hues: string[]
    relatedColors: string[]
    rgb: Rgb | undefined
    hsl: Hsl | undefined
    hsv: Hsv | undefined
    cmyk: Cmyk | undefined
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

export function getCmyk(hex: string): Cmyk {
    hex = removeHash(hex)

    const RGB = rgb(hex)
    const red = RGB?.r || 255
    const green = RGB?.g || 255
    const blue = RGB?.b || 255

    const max = Math.max(red, green, blue)

    const cyan = (max - red) / max
    const magenta = (max - green) / max
    const yellow = (max - blue) / max
    const black = 1 - max

    return {
        mode: 'cmyk',
        c: Math.round(cyan * 100),
        m: Math.round(magenta * 100),
        y: Math.round(yellow * 100),
        k: Math.round(black * 100),
    }
}

export function getColorInfo(hex: string): ColorInfo {
    hex = addHash(hex)

    const rawColors = getColorNames()
    const colors = Object.keys(rawColors)
    const getNearestColors = nearest(colors, differenceCiede2000())

    const nearestColors = getNearestColors(hex, 10)
    const cNearest = nearestColors[0]

    const colorInfo: ColorInfo = {
        hex: hex.toLowerCase(),
        name: rawColors[cNearest],
        nearestNamedColor: addHash(cNearest),
        shades: colorShades(hex),
        tints: colorTints(hex),
        hues: colorHues(hex),
        relatedColors: nearestColors.map((color) => addHash(color)),
        rgb: rgb(hex),
        hsl: hsl(hex),
        hsv: hsv(hex),
        cmyk: getCmyk(hex),
    }

    return colorInfo
}

interface CachedFile {
    info: ColorInfo
    generatedAt: string
}

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

// Generates a random named color
export function getRandomColor(): ColorInfo {
    const colorNames = Object.entries(getColorNames())
    const rndIndex = Math.floor(Math.random() * colorNames.length)
    const [hex] = colorNames[rndIndex]
    return getColorInfo(hex)
}

export function colorShades(color: string) {
    const length = 10
    const HSV = hsv(color)
    let res = []

    const V = HSV?.v || 0
    const toSubtract = V / length

    for (let i = 0; i < length; i++) {
        const newHSV = { ...HSV, v: V - toSubtract * i }
        const newHex = formatHex(newHSV as Color)
        res.push(newHex)
    }

    return res
}

export function colorTints(color: string) {
    const length = 10
    const HSV = hsv(color)
    let res = []

    const S = HSV?.s || 0
    const V = HSV?.v || 0
    const subtractS = S / length
    const addV = (1 - V) / length

    for (let i = 0; i < length; i++) {
        const newHSV = { ...HSV, s: S - subtractS * i, v: V + addV * i }
        const newHex = formatHex(newHSV as Color)
        res.push(newHex)
    }

    return res
}

export function colorHues(color: string) {
    const length = 10
    const HSV = hsv(color)
    let res = []

    const H = HSV?.h || 0
    const toAdd = 360 / length

    for (let i = 0; i < length; i++) {
        const newHSV = { ...HSV, h: H + toAdd * i }
        const newHex = formatHex(newHSV as Color)
        res.push(newHex)
    }

    return res
}

// function test(type: 'hue' | 'shade' | 'tint', color: string) {
//     const colors =
//         type === 'hue'
//             ? colorHues(color)
//             : type === 'shade'
//             ? colorShades(color)
//             : colorTints(color)

//     const strings = []
//     for (const color of colors) {
//         strings.push(chalk.bgHex(color).hex(color)('  '))
//     }
//     console.log(strings.join(''))
// }

// function logInfo(color: ColorInfo | string) {
//     const blocks = '██████████████████████'
//     if (typeof color === 'string') {
//         console.log(`${chalk.bgHex(color).hex(color)(blocks)}`)
//         return
//     }
//     console.log(`${chalk.bgHex(color.hex).hex(color.hex)(blocks)} ${color.name}`)
// }

// for (let i = 0; i < 10; i++) {
//     const rnd = randomHexColor(1)[0]
//     logInfo(rnd)
//     test('hue', rnd)
//     test('shade', rnd)
//     test('tint', rnd)
//     console.log()
// }
