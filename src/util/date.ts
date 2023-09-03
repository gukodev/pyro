export function today() {
    const now = new Date()
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    return date
}

export function unix(date: Date) {
    return Math.floor(date.getTime() / 1000)
}
