import { Color, Hsv, differenceCiede2000, formatHex, hsl, hsv, nearest, rgb } from 'culori'
import fs from 'fs'
import path from 'path'
import { HSL, HSV, RGB, addHash, formatHSL, formatHSV, formatRGB } from './colorFormat'
import { getTodayDate } from './date'
import { createCacheFile, getCacheFile } from './file'

interface CachedFile {
    info: ColorInfo
    generatedAt: string
}

export interface ColorNames {
    [hex: string]: string
}

export interface ColorInfo {
    hex: string
    name: string
    nearestNamedColor: string
    shades: string[]
    tints: string[]
    hues: string[]
    related: string[]
    theory: ColorTheory
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

// Generates a random hex color value
export function getRandomColor(length?: number): string[] | string {
    function generateRandomHexColor(): string {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16)
        const paddedColor = randomColor.padStart(6, '0')
        return `#${paddedColor}`
    }

    if (!length) {
        return generateRandomHexColor()
    }

    const colors: string[] = []
    for (let i = 0; i < length; i++) {
        const color = generateRandomHexColor()
        colors.push(color)
    }

    return colors
}

export function getColorInfo(hex: string): ColorInfo {
    hex = addHash(hex)

    const rawColors = getColorNames()
    const colors = Object.keys(rawColors)
    const getNearestColors = nearest(colors, differenceCiede2000())

    const nearestColors = getNearestColors(hex, 500)
    const cNearest = nearestColors[0]

    const related = nearestColors.slice(-20).map((color) => addHash(color))

    const _rgb = rgb(hex) as RGB
    const rgbFormatted = formatRGB(_rgb)
    const _hsv = formatHSV(hsv(hex) as HSV, false) as [number, number, number]
    const _hsl = formatHSL(hsl(hex) as HSL, false) as [number, number, number]

    const colorInfo: ColorInfo = {
        hex: hex.toLowerCase(),
        name: rawColors[cNearest],
        nearestNamedColor: addHash(cNearest),
        shades: colorShades(hex),
        tints: colorTints(hex),
        hues: colorHues(hex),
        related,
        theory: colorTheory(hex),
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

// Generates 10 hues of a color
// Shade => mix with black
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

// Generates 10 tints of a color
// Tint => mix with white
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

// Generates 10 hues of a color
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

export function complementary(hsv: Hsv): string[] {
    const H = hsv?.h || 0
    const newHSV = { ...hsv, h: (H + 180) % 360 }
    const orig = formatHex(hsv as Color)
    return [orig, formatHex(newHSV as Color)]
}

export function splitComplementary(hsv: Hsv): string[] {
    const H = hsv?.h || 0
    const newHSV1 = { ...hsv, h: (H + 150) % 360 }
    const newHSV2 = { ...hsv, h: (H + 210) % 360 }
    const color = formatHex(hsv as Color)
    return [color, formatHex(newHSV1 as Color), formatHex(newHSV2 as Color)]
}

export function analogous(hsv: Hsv): string[] {
    const H = hsv?.h || 0
    const newHSV1 = { ...hsv, h: (H + 30) % 360 }
    const newHSV2 = { ...hsv, h: (H + 330) % 360 }
    const color = formatHex(hsv as Color)
    return [color, formatHex(newHSV1 as Color), formatHex(newHSV2 as Color)]
}

export function triadic(hsv: Hsv): string[] {
    const H = hsv?.h || 0
    const newHSV1 = { ...hsv, h: (H + 120) % 360 }
    const newHSV2 = { ...hsv, h: (H + 240) % 360 }
    const color = formatHex(hsv as Color)
    return [color, formatHex(newHSV1 as Color), formatHex(newHSV2 as Color)]
}

export function tetradic(hsv: Hsv): string[] {
    const H = hsv?.h || 0
    const newHSV1 = { ...hsv, h: (H + 60) % 360 }
    const newHSV2 = { ...hsv, h: (H + 180) % 360 }
    const newHSV3 = { ...hsv, h: (H + 240) % 360 }
    const color = formatHex(hsv as Color)
    return [
        color,
        formatHex(newHSV1 as Color),
        formatHex(newHSV2 as Color),
        formatHex(newHSV3 as Color),
    ]
}

export function colorTheory(color: string): ColorTheory {
    const _hsv = hsv(color) as Hsv
    const comp = complementary(_hsv)
    const splitComp = splitComplementary(_hsv)
    const analog = analogous(_hsv)
    const triad = triadic(_hsv)
    const tetra = tetradic(_hsv)

    return {
        complementary: comp,
        splitComplementary: splitComp,
        analogous: analog,
        triadic: triad,
        tetradic: tetra,
    }
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
