import { Hsl, Hsv, Rgb } from 'culori'

export function formatRGB(rgb: Rgb) {
    const red = Math.round(rgb.r * 255)
    const green = Math.round(rgb.b * 255)
    const blue = Math.round(rgb.b * 255)
    return [red, green, blue]
}

export function formatHSL(hsl: Hsl) {
    const hue = Math.round(hsl.h || 1) + '°'
    const saturation = Math.round(hsl.s * 100) + '%'
    const lightness = Math.round(hsl.l * 100) + '%'
    return [hue, saturation, lightness]
}

export function formatHSV(hsv: Hsv) {
    const hue = Math.round(hsv.h || 1) + '°'
    const saturation = Math.round(hsv.s * 100) + '%'
    const value = Math.round(hsv.v * 100) + '%'
    return [hue, saturation, value]
}
