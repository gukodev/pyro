import { getColorInfo, randomHexColor } from '@/util/color'
import { getExecTime, initExecTime } from '@/util/date'
import chalk from 'chalk'

function main(colorLength: number = 10) {
    const colors = randomHexColor(colorLength)

    initExecTime('main')
    for (const color of colors) {
        const c = chalk.hex(color)('█')
        console.log(chalk.cyan(`${chalk.bold('Color:')} ${color} ${c}`))
        const infos = getColorInfo(color, true)
        const n = chalk.hex(infos.nearestNamedColor)('█')

        Object.entries(infos).forEach(([key, value]) => {
            if (key === 'nearestNamedColor') {
                console.log(chalk.gray(`  ${chalk.bold(key)}: #${value} ${n}`))
                return
            }

            console.log(
                chalk.gray(`  ${chalk.bold(key)}: ${value}${key.endsWith('ExecTime') ? 'ms' : ''}`)
            )
        })

        console.log(chalk.gray(`  ${chalk.bold('comparison')}: ${c}${n}`))
        console.log('')
    }

    const endTime = getExecTime('main')
    console.log(chalk.cyan(`${chalk.bold('Total execution time:')} ${endTime}ms`))
    console.log(chalk.cyan(`${chalk.bold('Average execution time:')} ${endTime / colorLength}ms`))
}

main()
