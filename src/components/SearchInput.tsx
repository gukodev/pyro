'use client'

import { ISuggestion } from '@/common/types'
import { formatQuery } from '@/util/format'
import { Transition } from '@headlessui/react'
import { EyedropperSample } from '@phosphor-icons/react'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export function Suggestion({ data }: { data: ISuggestion }) {
    return (
        <Link
            className='p-2 flex items-center gap-2 transition-colors hover:bg-zinc-100'
            href={data.href}
        >
            <div
                className='w-8 h-8 rounded-xl'
                style={{
                    backgroundColor: data.hex,
                }}
            />
            <div>
                <span className='block text-sm font-bold'>{data.hex}</span>
                <span className='block text-xs text-gray-500'>{data.name}</span>
            </div>
        </Link>
    )
}

export default function SearchInput() {
    const [focused, setFocused] = useState<boolean>(false)
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
    const [suggestions, setSuggestions] = useState<ISuggestion[]>([
        // {
        //     name: 'Vermelho',
        //     hex: '#FF0000',
        //     href: '/ff0000',
        // },
    ])
    const [query, setQuery] = useState<string>('')

    const _showSuggestions = showSuggestions && focused

    useEffect(() => {
        const formattedQuery = formatQuery(query)
        if (!formattedQuery) return setShowSuggestions(false)

        const encoded = encodeURIComponent(formattedQuery)

        axios
            .get(`/api/suggestions/${encoded}`)
            .then((res) => {
                const { data } = res
                if (!data.suggestions) return
                setSuggestions(data.suggestions)
            })
            .catch()
            .finally(() => {
                setShowSuggestions(true)
            })

        return
    }, [query])

    return (
        <div className='relative w-60'>
            <div
                className={twMerge(
                    'w-full inline-flex items-center justify-between p-2 rounded-2xl selection-none transition-all',
                    'border-2 border-red-500 bg-white text-black',
                    focused ? 'ring-2 ring-red-300/50' : 'ring-0'
                )}
            >
                <input
                    type='text'
                    placeholder='Pesquise uma cor'
                    className='flex w-full outline-none'
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => {
                        setQuery(e.target.value)
                    }}
                    value={query}
                />
                <button className='transition-opacity hover:opacity-50 focus:opacity-50 outline-none'>
                    <EyedropperSample size={26} />
                </button>
            </div>
            <Transition
                className='absolute z-30 left-0 mt-2 w-full flex flex-col gap-2 bg-white border-2 rounded-lg border-zinc-300 overflow-hidden'
                show={_showSuggestions}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-0.5'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-75'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-0.5'
            >
                {suggestions.length ? (
                    suggestions.map((suggestion, index) => <Suggestion data={suggestion} />)
                ) : (
                    <div className='p-2 text-center text-gray-400 text-md'>
                        Nenhum resultado encontrado.
                    </div>
                )}
            </Transition>
        </div>
    )
}
