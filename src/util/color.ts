import { Hsl, Hsv, Rgb, differenceCiede2000, hsl, hsv, nearest, rgb } from 'culori'
import fs from 'fs'
import path from 'path'
import { getExecTime, initExecTime } from './date'

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

let colorNames: ColorNames | null = null

export const COLORNAMES_PATH = path.resolve('src/assets/data/colornames.min.json')

export function getColorNames(): ColorNames {
    if (!colorNames) {
        const data = JSON.parse(fs.readFileSync(COLORNAMES_PATH, 'utf-8'))
        colorNames = data
        return data
    }
    return colorNames
}

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

export function getColorInfo(hex: string, benchmark: boolean = false): ColorInfo {
    if (hex.startsWith('#')) hex.slice(1)

    if (benchmark) initExecTime('cInfoGeneral')
    let getColorNamesExecTime: number | undefined,
        colorObjectKeysExecTime: number | undefined,
        returnNamedColorExecTime: number | undefined

    if (benchmark) initExecTime('getColorNames')
    const rawColors = getColorNames()
    if (benchmark) getColorNamesExecTime = getExecTime('getColorNames')

    if (benchmark) initExecTime('colorObjectKeys')
    const colors = Object.keys(rawColors)
    if (benchmark) colorObjectKeysExecTime = getExecTime('colorObjectKeys')

    if (benchmark) initExecTime('nearestNamedColor')
    const nearestNamedColor = nearest(colors, differenceCiede2000())
    const cNearest = nearestNamedColor(hex, 1)[0]

    if (benchmark) returnNamedColorExecTime = getExecTime('nearestNamedColor')

    const colorInfo: ColorInfo = {
        name: rawColors[cNearest],
        nearestNamedColor: cNearest,
        hex: hex.toLowerCase(),
        rgb: rgb(hex),
        hsl: hsl(hex),
        hsv: hsv(hex),
    }

    if (benchmark) {
        colorInfo.totalExecTime = getExecTime('cInfoGeneral')
        colorInfo.getColorNamesExecTime = getColorNamesExecTime
        colorInfo.colorObjectKeysExecTime = colorObjectKeysExecTime
        colorInfo.returnNamedColorExecTime = returnNamedColorExecTime
    }

    return colorInfo
}
