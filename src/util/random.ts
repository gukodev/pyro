type WeightedOptions<T extends string> = {
    [key in T]: number
}

// Função que escolhe um elemento aleatório de um array
export function choose<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}

// Função que escolhe um elemento aleatório de um array, com pesos
// Ex: chooseWeighted(['a', 'b', 'c'], { a: 0.1, b: 0.1, c: 0.8 }) > 'c' (80%)
export function chooseWeighted<T extends string>(options: T[], weights: WeightedOptions<T>): T {
    const totalWeight = options.reduce((acc, option) => acc + weights[option], 0)

    const randomWeight = Math.random() * totalWeight
    let cumulativeWeight = 0

    for (const option of options) {
        cumulativeWeight += weights[option]
        if (randomWeight <= cumulativeWeight) {
            return option
        }
    }

    return options[options.length - 1]
}
