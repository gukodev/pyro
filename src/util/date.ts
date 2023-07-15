// interface Times {
//     start: number
// }

// const times = new Map<string, Times>()

// export function initExecTime(name: string) {
//     times.set(name, {
//         start: Date.now(),
//     })
// }

// export function getExecTime(name: string) {
//     const startTime = times.get(name)?.start
//     if (startTime === undefined) return 0

//     const endTime = Date.now()
//     times.delete(name)

//     return endTime - startTime
// }

export function getTodayDate() {
    const date = new Date()
    date.setUTCHours(0, 0, 0, 0)
    return date
}

export function unix(date: Date) {
    return Math.floor(date.getTime() / 1000)
}
