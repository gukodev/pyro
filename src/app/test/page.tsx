'use client'

import Palette from '@/components/Palette'
import { isValidColor } from '@/util/colorFormat'
import * as palette from '@/util/palette'
import { useEffect, useState } from 'react'

export default function Page() {
    const [color, setColor] = useState('#976aeb')
    const [size, setSize] = useState(4)
    const [palettes, setPalettes] = useState<palette.ColorTheory | null>(null)

    const sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    useEffect(() => {
        if (!color || !isValidColor(color)) return
        const pal = palette.generateAll(color, size)
        setPalettes(pal)
    }, [color, size])

    return (
        <main className='w-full max-w-screen-md mx-auto p-4'>
            <div className='flex flex-col gap-8'>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-2 items-center'>
                        <h1 className='text-2xl font-bold'>Cor</h1>
                        <div
                            className='w-6 h-6 rounded-lg transition-colors'
                            style={{ backgroundColor: color }}
                        ></div>
                    </div>
                    <input
                        type='text'
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className='w-full p-2 rounded-md border outline-none focus:border-blue-500'
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-2xl font-bold'>Tamanho</h1>
                    <div className='flex items-center gap-2 flex-wrap'>
                        {sizes.map((s) => (
                            <button
                                key={s}
                                className={`w-14 h-14 p-2 rounded-md border border-gray-300 ${
                                    size === s ? 'bg-gray-200' : ''
                                }`}
                                onClick={() => setSize(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-2xl font-bold'>Paletas</h1>
                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-xl font-bold'>random</h1>
                            <Palette colors={palette.randomPalette(size) as string[]} linkColors />
                        </div>
                        {palettes &&
                            Object.entries(palettes).map(([key, value]) => (
                                <div key={key} className='flex flex-col gap-2'>
                                    <h1 className='text-xl font-bold'>{key}</h1>
                                    <Palette colors={value} linkColors />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
