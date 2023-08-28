export default async function ErrorPage() {
    const russianRoulette = Math.floor(Math.random() * 10)
    if (russianRoulette === 0) {
        throw new Error('Oh no! Something went wrong!')
    }

    // prevent static rendering
    const data = await fetch('https://fakerapi.it/api/v1/persons?_locale=pt_BR', {
        method: 'GET',
        cache: 'no-store',
    })
    const json = await data.json()

    return (
        <div>
            <pre>{JSON.stringify(json, null, 2)}</pre>
        </div>
    )
}
