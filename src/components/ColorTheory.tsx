import colorTheoryLabels from '@/assets/data/colorTheoryLabels.json'
import { ColorTheory } from '@/util/color'
import Pallete from './Pallete'

interface ColorTheoryProps {
    colors: ColorTheory
}

type Labels = keyof typeof colorTheoryLabels

function getLabel(label: Labels) {
    return colorTheoryLabels[label]
}

export default function ColorTheory({ colors }: ColorTheoryProps) {
    return (
        <div className='grid grid-cols-2 gap-8'>
            {Object.entries(colors).map((x) => (
                <div className='flex flex-col gap-2' key={x[0]}>
                    <h1 className='text-2xl font-bold'>{getLabel(x[0] as Labels)}</h1>
                    <Pallete colors={x[1]} linkColors />
                </div>
            ))}
        </div>
    )
}
