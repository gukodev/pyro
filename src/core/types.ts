export interface ICachedFile {
    info: IColorInfo
    generatedAt: string
}

export interface IColorNames {
    [hex: string]: string
}

export interface HexAndName {
    hex: string
    name: string
}

export interface ISuggestion extends HexAndName {
    href: string
}

export interface IColorTheory {
    complementary: string[]
    splitComplementary: string[]
    analogous: string[]
    triadic: string[]
    tetradic: string[]
}

export interface IPalettes {
    theory: IColorTheory
    shades: string[]
    tints: string[]
    hues: string[]
}

export interface IRandomPalette {
    colors: HexAndName[]
    type: string
}

export interface IColorInfo {
    hex: string
    name: string
    nearestNamedColor: string
    related: string[]
    palettes: IPalettes
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
