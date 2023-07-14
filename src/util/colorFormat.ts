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

function hslHsv(x: number, y: number, z: number, symbols = true, multiply = true) {
    x = Math.round(x)
    y = Math.round(y * (multiply ? 100 : 1))
    z = Math.round(z * (multiply ? 100 : 1))
    if (symbols) return [x + '°', y + '%', z + '%']
    return [x, y, z]
}

export function formatHSL(hsl: HSL, symbols: boolean = true, multiply: boolean = true) {
    return hslHsv(hsl.h, hsl.s, hsl.l, symbols, multiply)
}

export function formatHSV(hsv: HSV, symbols: boolean = true, multiply: boolean = true) {
    return hslHsv(hsv.h, hsv.s, hsv.v, symbols, multiply)
}

export function removeHash(hex: string) {
    if (hex.startsWith('#')) hex = hex.slice(1)
    return hex
}

export function addHash(hex: string) {
    if (!hex.startsWith('#')) hex = '#' + hex
    return hex
}
