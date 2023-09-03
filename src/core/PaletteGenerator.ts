import { chooseWeighted } from '@/util/random'
import { Color, Hsv, formatHex, hsv } from 'culori'
import ColorGenerator from './ColorGenerator'
import ColorInfo from './ColorInfo'
import { IPalettes, IRandomPalette } from './types'

export default class PaletteGenerator {
    public complementary(hsv: Hsv): string[] {
        const H = hsv?.h || 0
        const newHSV = { ...hsv, h: (H + 180) % 360 }
        const baseColor = formatHex(hsv as Color)
        return [baseColor, formatHex(newHSV as Color)]
    }

    public splitComplementary(hsv: Hsv): string[] {
        const H = hsv?.h || 0

        const hsv1 = { ...hsv, h: (H + 150) % 360 }
        const hsv2 = { ...hsv, h: (H + 210) % 360 }

        const baseColor = formatHex(hsv as Color)
        return [baseColor, formatHex(hsv1 as Color), formatHex(hsv2 as Color)]
    }

    public analogous(hsv: Hsv, length: number = 3, angle: number = 30): string[] {
        const H = hsv?.h || 0
        const analogousColors: string[] = []

        for (let i = 0; i < length; i++) {
            const newHsv = { ...hsv, h: (H + angle * i) % 360 }
            const hex = formatHex(newHsv as Color)
            analogousColors.push(hex)
        }

        return analogousColors
    }

    public triadic(hsv: Hsv): string[] {
        const H = hsv?.h || 0

        const hsv1 = { ...hsv, h: (H + 120) % 360 }
        const hsv2 = { ...hsv, h: (H + 240) % 360 }

        const baseColor = formatHex(hsv as Color)
        return [baseColor, formatHex(hsv1 as Color), formatHex(hsv2 as Color)]
    }

    public tetradic(hsv: Hsv): string[] {
        const H = hsv?.h || 0

        const hsv1 = { ...hsv, h: (H + 60) % 360 }
        const hsv2 = { ...hsv, h: (H + 180) % 360 }
        const hsv3 = { ...hsv, h: (H + 240) % 360 }

        const baseColor = formatHex(hsv as Color)
        return [
            baseColor,
            formatHex(hsv1 as Color),
            formatHex(hsv2 as Color),
            formatHex(hsv3 as Color),
        ]
    }

    public shades(hsv: Hsv, length: number = 10) {
        let colorShades = []
        const V = hsv?.v || 0

        const toSubtract = V / length

        for (let i = 0; i < length; i++) {
            const newHSV = { ...hsv, v: V - toSubtract * i }
            const newHex = formatHex(newHSV as Color)
            colorShades.push(newHex)
        }

        return colorShades
    }

    public tints(hsv: Hsv, length: number = 10) {
        let colorTints = []
        const S = hsv?.s || 0
        const V = hsv?.v || 0

        const subtractS = S / length
        const addV = (1 - V) / length

        for (let i = 0; i < length; i++) {
            const newHSV = { ...hsv, s: S - subtractS * i, v: V + addV * i }
            const newHex = formatHex(newHSV as Color)
            colorTints.push(newHex)
        }

        return colorTints
    }

    public hues(hsv: Hsv, length: number = 10) {
        let colorHues = []

        const H = hsv?.h || 0
        const toAdd = 360 / length

        for (let i = 0; i < length; i++) {
            const newHSV = { ...hsv, h: H + toAdd * i }
            const newHex = formatHex(newHSV as Color)
            colorHues.push(newHex)
        }

        return colorHues
    }

    public generateAll(color: string, length?: number): IPalettes {
        const _hsv = hsv(color) as Hsv
        const comp = this.complementary(_hsv)
        const splitComp = this.splitComplementary(_hsv)
        const analog = length ? this.analogous(_hsv, length) : this.analogous(_hsv)
        const triad = this.triadic(_hsv)
        const tetra = this.tetradic(_hsv)
        const shade = length ? this.shades(_hsv, length) : this.shades(_hsv)
        const tint = length ? this.tints(_hsv, length) : this.tints(_hsv)
        const hues = length ? this.hues(_hsv, length) : this.hues(_hsv)

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

    public getRandomPalette(length: number = 5): IRandomPalette {
        const colorGen = new ColorGenerator()

        const color = colorGen.getRandomColor('hex')
        const HSV = hsv(color) as Hsv

        type Options = 'tints' | 'shades' | 'random'
        const options: Options[] = ['tints', 'shades', 'random']

        const weights = {
            tints: 0.15,
            shades: 0.15,
            random: 0.7,
        }

        const type = chooseWeighted<Options>(options, weights)

        const colorInfo = new ColorInfo()
        const mapColors = (colors: string[]) => {
            return colors.map((x) => ({
                hex: x,
                name: colorInfo.getNearestColorName(x),
            }))
        }

        switch (type) {
            case 'tints':
                return {
                    type,
                    colors: mapColors(this.tints(HSV, length)),
                }
            case 'shades':
                return {
                    type,
                    colors: mapColors(this.shades(HSV, length)),
                }
            case 'random':
                return {
                    type,
                    colors: mapColors(
                        colorGen.getRandomColors({ type: 'hex', count: length, unique: true })
                    ),
                }
        }
    }
}
