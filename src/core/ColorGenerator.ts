import { getColorNames, getDarkColors } from './cache'
import { HexAndName } from './types'

type ColorGeneratorType = 'hex' | 'named'

interface GetRandomColorsConfig {
    type: ColorGeneratorType
    count: number
    unique?: boolean
}

export default class ColorGenerator {
    public colorNames = getColorNames()
    public darkColors = getDarkColors()

    private getRandomColorHex() {
        const hex = Math.random().toString(16).slice(2, 8)
        return `#${hex}`
    }

    /**
     * Generates a random color
     * @param {ColorGeneratorType} type - type of color to generate
     * @returns {string} color hex value
     * @example
     * const color = getRandomColor('hex')
     * console.log(color)
     */
    public getRandomColor(type: ColorGeneratorType): string {
        switch (type) {
            case 'hex':
                return this.getRandomColorHex()
            case 'named':
                const colorNames = Object.keys(this.colorNames)
                const rndIndex = Math.floor(Math.random() * colorNames.length)
                const hex = colorNames[rndIndex]
                return hex
        }
    }

    /**
     * Generates a random dark color hex value
     * @returns {string} color hex value
     * @example
     * const color = getRandomDarkColor()
     * console.log(color)
     */
    public getRandomDarkColor(): HexAndName {
        const rndIndex = Math.floor(Math.random() * this.darkColors.length)
        const color = this.darkColors[rndIndex]
        return color
    }

    /**
     * Generates a list of random colors
     * @param {GetRandomColorsConfig} config - config object
     * @returns {string[]} list of color hex values
     * @example
     * const colors = getRandomColors({ type: 'hex', count: 5, unique: true })
     * console.log(colors)
     */
    public getRandomColors(config: GetRandomColorsConfig): string[] {
        const { type, count, unique: _unique } = config
        const unique = _unique || false

        const colors: string[] = []
        while (colors.length < count) {
            const color = this.getRandomColor(type)
            if (unique && colors.includes(color)) continue
            colors.push(color)
        }

        return colors
    }
}
