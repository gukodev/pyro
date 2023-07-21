export function choose<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}

export function getRandomColor(): string {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16)
    const paddedColor = randomColor.padStart(6, '0')
    return `#${paddedColor}`
}
