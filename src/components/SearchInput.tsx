'use client'

import { ISuggestion } from '@/common/types'
import { isValidColor, removeHash } from '@/util/colorFormat'
import { formatQuery } from '@/util/format'
import { Transition } from '@headlessui/react'
import { EyedropperSample } from '@phosphor-icons/react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
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

const transitionProps = {
    enter: 'transition ease-out duration-200',
    enterFrom: 'opacity-0 translate-y-0.5',
    enterTo: 'opacity-100 translate-y-0',
    leave: 'transition ease-in duration-100',
    leaveFrom: 'opacity-100 translate-y-0',
    leaveTo: 'opacity-0 translate-y-0.5',
}

export default function SearchInput() {
    const router = useRouter()
    const [focused, setFocused] = useState<boolean>(false)
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false)

    const [suggestions, setSuggestions] = useState<ISuggestion[]>([])
    const [query, setQuery] = useState<string>('')

    const _showSuggestions = showSuggestions && focused

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!query) return
        if (query.startsWith('#') && isValidColor(query))
            router.push(`/${removeHash(query.toLowerCase())}`)
    }

    useEffect(() => {
        const escListener = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowColorPicker(false)
                setShowSuggestions(false)
            }
        }

        const clickOutsideColorPickerListener = (e: MouseEvent) => {
            if (e.target instanceof HTMLElement && !e.target.closest('#color-picker')) {
                setShowColorPicker(false)
            }
        }

        document.addEventListener('keydown', escListener)
        document.addEventListener('click', clickOutsideColorPickerListener)

        return () => {
            document.removeEventListener('keydown', escListener)
            document.removeEventListener('click', clickOutsideColorPickerListener)
        }
    }, [])

    useEffect(() => {
        if (focused) setShowColorPicker(false)
        if (showColorPicker) return

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
    }, [query, showColorPicker])

    return (
        <div className='relative w-60'>
            <form
                className={twMerge(
                    'w-full inline-flex items-center justify-between p-2 rounded-2xl selection-none transition-all',
                    'border-2 border-red-500 bg-white text-black',
                    focused ? 'ring-2 ring-red-300/50' : 'ring-0'
                )}
                onSubmit={handleSubmit}
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
                <button
                    type='button'
                    className='transition-opacity hover:opacity-50 focus:opacity-50 outline-none'
                    onClick={() => {
                        setShowColorPicker((prev) => !prev)
                        setShowSuggestions(false)
                    }}
                >
                    <EyedropperSample size={26} />
                </button>
            </form>
            <Transition
                show={_showSuggestions}
                className='absolute z-30 left-0 mt-2 w-full flex flex-col gap-2 bg-white border-2 rounded-lg border-zinc-300 overflow-hidden'
                {...transitionProps}
            >
                {suggestions.length ? (
                    suggestions.map((suggestion) => <Suggestion data={suggestion} />)
                ) : (
                    <div className='p-2 text-center text-gray-400 text-md'>
                        Nenhum resultado encontrado.
                    </div>
                )}
            </Transition>
            <Transition
                show={showColorPicker}
                className='absolute z-30 left-0 mt-2 w-fit gap-2 bg-white border-2 rounded-xl border-zinc-300 p-4'
                {...transitionProps}
                id='color-picker'
            >
                <HexColorPicker
                    color={query.startsWith('#') ? query : '#fff'}
                    onChange={setQuery}
                />
            </Transition>
        </div>
    )
}
