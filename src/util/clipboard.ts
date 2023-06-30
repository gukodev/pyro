export async function copy(text: string) {
    try {
        // Use the new navigator clipboard API
        await navigator.clipboard.writeText(text)
        return true
    } catch (err) {
        // Fallback to the old document.execCommand('copy') [deprecated]
        const input = document.createElement('input')

        input.style.position = 'fixed'
        input.style.opacity = '0'
        input.value = text

        document.body.appendChild(input)
        input.select()

        document.execCommand('copy')
        document.body.removeChild(input)

        return true
    }
}
