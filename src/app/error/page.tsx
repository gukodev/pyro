export default function ErrorPage() {
    const russianRoulette = Math.floor(Math.random() * 10)
    if (russianRoulette === 0) {
        throw new Error('Oh no! Something went wrong!')
    }

    return <h1>yay</h1>
}
