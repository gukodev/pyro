import { Hsl, Hsv, Rgb } from 'culori'

export function formatRGB(rgb: Rgb | undefined) {
    const red = Math.round((rgb?.r || 0) * 255)
    const green = Math.round((rgb?.g || 0) * 255)
    const blue = Math.round((rgb?.b || 0) * 255)
    return [red, green, blue]
}

export function formatHSL(hsl: Hsl | undefined, numbers?: boolean) {
    const hue = Math.round(hsl?.h || 0)
    const saturation = Math.round((hsl?.s || 0) * 100)
    const lightness = Math.round((hsl?.l || 0) * 100)
    if (numbers) return [hue, saturation, lightness]
    return [hue + '°', saturation + '%', lightness + '%']
}

export function formatHSV(hsv: Hsv | undefined, numbers?: boolean) {
    const hue = Math.round(hsv?.h || 0)
    const saturation = Math.round((hsv?.s || 0) * 100)
    const value = Math.round((hsv?.v || 0) * 100)
    if (numbers) return [hue, saturation, value]
    return [hue + '°', saturation + '%', value + '%']
}

export function removeHash(hex: string) {
    if (hex.startsWith('#')) hex = hex.slice(1)
    return hex
}

export function addHash(hex: string) {
    if (!hex.startsWith('#')) hex = '#' + hex
    return hex
}
