import fs from 'fs'
import path from 'path'
import { HexAndName, IColorNames } from './types'

export const COLORNAMES_PATH = path.resolve('src/assets/data/colornames.min.json')
export const DARKCOLORS_PATH = path.resolve('src/assets/data/dark-colors.json')

let colorNames: IColorNames | null = null
let darkColors: HexAndName[] | null = null

export function getDarkColors(): HexAndName[] {
    if (!darkColors) {
        const data = JSON.parse(fs.readFileSync(DARKCOLORS_PATH, 'utf-8'))
        darkColors = data
        return data
    }
    return darkColors
}

export function getColorNames(): IColorNames {
    if (!colorNames) {
        const data = JSON.parse(fs.readFileSync(COLORNAMES_PATH, 'utf-8'))
        colorNames = data
        return data
    }
    return colorNames
}

function setupColors() {
    getColorNames()
    getDarkColors()
}

setupColors()
