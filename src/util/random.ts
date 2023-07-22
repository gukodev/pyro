import { RandomColorLoadingContextProps } from '@/contexts/RandomColorLoading'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'

export function choose<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}

export function getRandomColor(): string {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16)
    const paddedColor = randomColor.padStart(6, '0')
    return `#${paddedColor}`
}

export async function randomColorRedirect(
    router: AppRouterInstance,
    hooks: RandomColorLoadingContextProps
) {
    const { isLoading, setIsLoading } = hooks
    if (isLoading) return
    setIsLoading(true)

    try {
        const req = await fetch('/api/random')
        const hex = await req.text()
        router.push(`/${hex}`)
        setTimeout(() => setIsLoading(false), 500) // Cooldown
    } catch (err) {
        console.log(err)
        setIsLoading(false)
    }
}
