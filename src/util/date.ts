export function getTodayDate() {
    const date = new Date()
    date.setUTCHours(0, 0, 0, 0)
    return date
}

export function unix(date: Date) {
    return Math.floor(date.getTime() / 1000)
}
