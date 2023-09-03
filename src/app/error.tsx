'use client'

import Button from '@/components/Button'
import Metadata from '@/components/Metadata'
import NavBar from '@/components/NavBar'
import { ErrorReportBody } from '@/util/errorHandling/types'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

const metadata = {
    title: 'pyro - um erro ocorreu!',
    favicon: `/favicon?hex=ef4444`,
}

export default function Error({ error }: { error: Error }) {
    const [message, setMessage] = useState<string>('')
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)

    const [err, setErr] = useState<Error | null>(null)

    useEffect(() => {
        if (!error) return
        setErr(error)
    }, [error])

    const parseMessage = (msg: string) => {
        msg = msg.trim()
        if (msg.length > 1024) {
            return msg.slice(0, 1021) + '...'
        }
        return msg === '' ? undefined : msg
    }

    const parseReferrer = (referrer: string) => {
        return referrer === '' ? undefined : referrer
    }

    const reportError = async () => {
        if (!err) return
        setButtonLoading(true)

        const date = new Date()
        const body: ErrorReportBody = {
            error: {
                name: err.name || 'Nenhum nome disponível',
                message: err.message || 'Nenhuma mensagem disponível',
                stack: err.stack || 'Nenhuma stack disponível',
            },
            info: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                referrer: parseReferrer(document.referrer),
                isoDate: date.toISOString(),
                timestamp: date.getTime(),
            },
            message: parseMessage(message),
        }

        axios
            .post('/api/reportError', body)
            .then((res) => {
                const data = res.data

                if (data.success) {
                    toast.success(
                        'Erro reportado com sucesso! Obrigado por nos ajudar a melhorar o site :)'
                    )
                    return
                } else {
                    toast.error('Ocorreu um erro ao reportar o erro. Tente novamente mais tarde.')
                    console.log(data)
                }
            })
            .catch((err) => {
                const data = err.response?.data
                if (data && data.rateLimited) {
                    toast.error(
                        'Você já reportou um erro recentemente. Tente novamente mais tarde!'
                    )
                    return
                }

                toast.error('Ocorreu um erro ao reportar o erro. Tente novamente mais tarde.')
                console.log(err)
            })
            .finally(() => {
                setButtonLoading(false)
            })
    }

    return (
        <>
            <Metadata data={metadata} />
            <main className='mb-48'>
                <div className='w-full max-w-screen-lg mx-auto px-4'>
                    <NavBar />
                    <div className='w-full max-w-screen-sm mx-auto flex flex-col gap-8'>
                        <div className='flex flex-col gap-10'>
                            <h1 className='text-8xl font-bold'>Ops...</h1>
                            <div className='flex flex-col gap-4 text-slate-800 text-lg text-justify'>
                                <p>
                                    Um erro interno ocorreu! Deseja reportá-lo? Todas as informações
                                    enviadas são anônimas. Você também pode optar por enviar uma
                                    mensagem detalhando o que aconteceu.
                                </p>
                            </div>
                            <div>
                                <textarea
                                    className='w-full h-48 p-4 rounded-md bg-slate-50 text-slate-700 border-2 border-slate-200 focus:border-slate-400 focus:outline-none transition-colors'
                                    placeholder='Descreva o que aconteceu (opcional)'
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                            <div className='w-full flex items-center justify-center'>
                                <div className='flex flex-col gap-4 w-fit items-center'>
                                    <Button
                                        onClick={reportError}
                                        loading={buttonLoading}
                                        className='w-36'
                                    >
                                        Reportar erro
                                    </Button>
                                    <Link
                                        href='/'
                                        className='text-slate-600 hover:text-red-600 hover:underline transition-colors'
                                    >
                                        Não, obrigado(a). Leve-me para a página inicial
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
