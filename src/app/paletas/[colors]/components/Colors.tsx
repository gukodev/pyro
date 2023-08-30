'use client'

interface ColorsProps {
    colors: string[]
}

function Color(props: { color: string }) {
    return <div className='w-full h-full' style={{ backgroundColor: props.color }}></div>
}

export default function Colors({ colors }: ColorsProps) {
    return (
        <>
            {colors.map((color, i) => (
                <Color key={`${color}-${i}`} color={color} />
            ))}
        </>
    )
}
