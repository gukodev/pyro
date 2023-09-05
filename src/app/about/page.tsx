import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import { Metadata } from 'next'
import AboutField from './components/AboutField'
import AboutLink from './components/AboutLink'

function pyro() {
    return <b className='text-black'>🔥 pyro</b>
}

export const metadata: Metadata = {
    title: 'pyro - sobre',
    icons: {
        shortcut: '/favicon',
        icon: '/favicon',
    },
}

export default function About() {
    return (
        <>
            <main className='mb-24 md:mb-48'>
                <NavBar />
                <div className='w-full max-w-screen-md mx-auto px-4 flex flex-col gap-8'>
                    <AboutField title='Sobre' id='about'>
                        <p>
                            O {pyro()} é um projeto pessoal que tem o objetivo de indexar as mais
                            diversas cores que existem. Além disso, esse app também possibilita a
                            geração de cores e paletas aleatórias, o que é útil para designers e
                            desenvolvedores que precisam de inspiração.
                        </p>
                        <p>
                            Na página principal, você pode ver a cor destaque, que é uma cor
                            aleatória que é gerada a cada 24 horas.
                        </p>
                        <p>
                            Tanto na página principal quanto na página de uma cor específica, há
                            informações úteis sobre a cor apresentada, como o nome, o código
                            hexadecimal, o código RGB, paletas com base na teoria das cores e outras
                            demais informações.
                        </p>
                    </AboutField>
                    <AboutField title='Código-fonte' id='source-code'>
                        <p>
                            Este projeto é distribuído livremente sob a licença <b>MIT</b>. Você
                            pode conferir o código-fonte{' '}
                            <AboutLink href={process.env.GITHUB_REPO}>
                                neste repositório do GitHub
                            </AboutLink>
                            .
                        </p>
                    </AboutField>
                    <AboutField title='Atribuições' id='attributions'>
                        <p>
                            O {pyro()} não seria possível sem o repositório{' '}
                            <AboutLink href={process.env.COLORNAMES_REPO}>color-names</AboutLink>,
                            que fornece o nome de cerca de 30.000 cores, e está sendo constantemente
                            atualizado.
                        </p>
                    </AboutField>
                </div>
            </main>
            <Footer />
        </>
    )
}
