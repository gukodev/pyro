'use client'

import { ColorInfo } from '@/util/color'
import { formatCMYK, formatHSL, formatHSV } from '@/util/colorFormat'
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
            value: Object.values(data.rgb).join(', '),
        },
        {
            label: 'HSL',
            value: Object.values(formatHSL(data.hsl, true, false)).join(', '),
        },
        {
            label: 'HSV',
            value: Object.values(formatHSV(data.hsv, true, false)).join(', '),
        },
        {
            label: 'CMYK',
            value: Object.values(formatCMYK(data.cmyk)).join(', '),
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
