import colorTheoryLabels from '@/assets/data/colorTheoryLabels.json'
import { ColorTheory } from '@/util/color'
import Palette from './Palette'

interface ColorTheoryProps {
    colors: ColorTheory
}

type Labels = keyof typeof colorTheoryLabels

function getLabel(label: Labels) {
    return colorTheoryLabels[label]
}

export default function ColorTheory({ colors }: ColorTheoryProps) {
    return (
        <div className='grid gap-8 grid-cols-1 md:grid-cols-2'>
            {Object.entries(colors).map((x) => (
                <div className='flex flex-col gap-2' key={x[0]}>
                    <h1 className='text-xl md:text-2xl font-bold'>{getLabel(x[0] as Labels)}</h1>
                    <Palette colors={x[1]} linkColors />
                </div>
            ))}
        </div>
    )
}
