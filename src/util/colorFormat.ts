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

export function sanitizeColor(color: string) {
    return color.replace(/[^a-f0-9]/gi, '')
}

export function isValidColor(color: string) {
    const rgx = /^#?([0-9A-Fa-f]{3}){1,2}$/
    return rgx.test(color)
}

function hslHsv(x: number, y: number, z: number, symbols = true, multiply = true) {
    x = Math.round(x)
    y = Math.round(y * (multiply ? 100 : 1))
    z = Math.round(z * (multiply ? 100 : 1))
    if (symbols) return [x + '°', y + '%', z + '%']
    return [x, y, z]
}

export function formatHSL(hsl: HSL | undefined, symbols: boolean = true, multiply: boolean = true) {
    return hslHsv(hsl?.h || 0, hsl?.s || 0, hsl?.l || 0, symbols, multiply)
}

export function formatHSV(hsv: HSV | undefined, symbols: boolean = true, multiply: boolean = true) {
    return hslHsv(hsv?.h || 0, hsv?.s || 0, hsv?.v || 0, symbols, multiply)
}

export function removeHash(hex: string) {
    if (hex.startsWith('#')) hex = hex.slice(1)
    return hex
}

export function formatCMYK(cmyk: { c: number; m: number; y: number; k: number }) {
    return [cmyk.c + '%', cmyk.m + '%', cmyk.y + '%', cmyk.k + '%']
}

export function addHash(hex: string) {
    if (!hex.startsWith('#')) hex = '#' + hex
    return hex
}
