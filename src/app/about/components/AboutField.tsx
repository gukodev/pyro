interface AboutFieldProps {
    title: string
    children: React.ReactNode
    id?: string
}

export default function AboutField({ children, title, id }: AboutFieldProps) {
    return (
        <div className='flex flex-col gap-3' id={id || undefined}>
            <h1 className='text-4xl font-bold'>{title}</h1>
            <div className='flex flex-col gap-2 text-lg text-justify text-zinc-700'>{children}</div>
        </div>
    )
}
