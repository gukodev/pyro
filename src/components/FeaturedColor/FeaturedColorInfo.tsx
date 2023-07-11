'use client'

import { ColorInfo } from '@/util/color'
import { formatHSL, formatHSV, formatRGB } from '@/util/colorFormat'
import { Hsl, Hsv, Rgb } from 'culori'
import Copyable from '../Copyable'

interface FeaturedColorInfoProps {
    data: ColorInfo
}

interface InfoItem {
    label: string
    value: string
}

export default function FeaturedColorInfo({ data }: FeaturedColorInfoProps) {
    const info: InfoItem[] = [
        {
            label: 'Nome',
            value: data.name,
        },
        {
            label: 'Hex',
            value: data.hex,
        },
        {
            label: 'RGB',
            value: formatRGB(data.rgb as Rgb).join(', '),
        },
        {
            label: 'HSL',
            value: formatHSL(data.hsl as Hsl).join(', '),
        },
        {
            label: 'HSV',
            value: formatHSV(data.hsv as Hsv).join(', '),
        },
    ]

    return (
        <table className='w-full'>
            <tbody>
                {info.map((item, index) => (
                    <tr key={index}>
                        <td className='w-fit pr-10'>
                            <h2 className='text-2xl font-bold'>{item.label}</h2>
                        </td>
                        <td className='w-full text-lg'>
                            <Copyable value={item.value} side='right' />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
