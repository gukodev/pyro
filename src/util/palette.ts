import { Color, Hsv, formatHex, hsv } from 'culori'
import { choose, getRandomColor } from './random'

export interface Palettes {
    theory: {
        complementary: string[]
        splitComplementary: string[]
        analogous: string[]
        triadic: string[]
        tetradic: string[]
    }
    shades: string[]
    tints: string[]
    hues: string[]
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

export function analogous(hsv: Hsv, length: number = 3, angle: number = 30): string[] {
    const H = hsv?.h || 0
    const analogousColors: string[] = []

    for (let i = 0; i < length; i++) {
        const newHSV = { ...hsv, h: (H + angle * i) % 360 }
        const hex = formatHex(newHSV as Color)
        analogousColors.push(hex)
    }

    return analogousColors
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

// Generates 10 hues of a color
// Shade => mix with black
export function shades(hsv: Hsv, length: number = 10) {
    let res = []

    const V = hsv?.v || 0
    const toSubtract = V / length

    for (let i = 0; i < length; i++) {
        const newHSV = { ...hsv, v: V - toSubtract * i }
        const newHex = formatHex(newHSV as Color)
        res.push(newHex)
    }

    return res
}

// Generates 10 tints of a color
// Tint => mix with white
export function tints(hsv: Hsv, length: number = 10) {
    let res = []

    const S = hsv?.s || 0
    const V = hsv?.v || 0
    const subtractS = S / length
    const addV = (1 - V) / length

    for (let i = 0; i < length; i++) {
        const newHSV = { ...hsv, s: S - subtractS * i, v: V + addV * i }
        const newHex = formatHex(newHSV as Color)
        res.push(newHex)
    }

    return res
}

// Generates 10 hues of a color
export function colorHues(hsv: Hsv, length: number = 10) {
    let res = []

    const H = hsv?.h || 0
    const toAdd = 360 / length

    for (let i = 0; i < length; i++) {
        const newHSV = { ...hsv, h: H + toAdd * i }
        const newHex = formatHex(newHSV as Color)
        res.push(newHex)
    }

    return res
}

export function generateAll(color: string, length?: number): Palettes {
    const _hsv = hsv(color) as Hsv
    const comp = complementary(_hsv)
    const splitComp = splitComplementary(_hsv)
    const analog = length ? analogous(_hsv, length) : analogous(_hsv)
    const triad = triadic(_hsv)
    const tetra = tetradic(_hsv)
    const shade = length ? shades(_hsv, length) : shades(_hsv)
    const tint = length ? tints(_hsv, length) : tints(_hsv)
    const hues = length ? colorHues(_hsv, length) : colorHues(_hsv)

    return {
        theory: {
            complementary: comp,
            splitComplementary: splitComp,
            analogous: analog,
            triadic: triad,
            tetradic: tetra,
        },
        shades: shade,
        tints: tint,
        hues: hues,
    }
}

export function randomPalette(length: number = 5) {
    const color = getRandomColor()
    const type = choose(['tints', 'shades', 'analogous', 'random'])

    const HSV = hsv(color) as Hsv

    switch (type) {
        case 'tints':
            return tints(HSV, length)
        case 'shades':
            return shades(HSV, length)
        case 'analogous':
            return analogous(HSV, length)
        case 'random':
            const randomAngle = choose([60, 90, 120])
            return analogous(HSV, length, randomAngle)
    }
}
