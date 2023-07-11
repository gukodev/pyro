export interface RGB {
    r: number
    g: number
    b: number
}

export interface HSL {
    h: number
    s: number
    l: number
}

export interface HSV {
    h: number
    s: number
    v: number
}

export function formatRGB(rgb: RGB) {
    const red = Math.round(rgb.r * 255)
    const green = Math.round(rgb.g * 255)
    const blue = Math.round(rgb.b * 255)
    return [red, green, blue]
}

export function formatHSL(hsl: HSL, numbers?: boolean) {
    const hue = Math.round(hsl.h)
    const saturation = Math.round(hsl.s * 100)
    const lightness = Math.round(hsl.l * 100)
    if (numbers) return [hue, saturation, lightness]
    return [hue + '°', saturation + '%', lightness + '%']
}

export function formatHSV(hsv: HSV, numbers?: boolean) {
    const hue = Math.round(hsv.h)
    const saturation = Math.round(hsv.s * 100)
    const value = Math.round(hsv.v * 100)
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
