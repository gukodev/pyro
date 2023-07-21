import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    ghost?: boolean
    children: React.ReactNode
    className?: string
}

export default function Button({ children, ghost, className, ...rest }: ButtonProps) {
    const primary = [
        'enabled:bg-red-500 enabled:hover:bg-red-400 disabled:bg-gray-300',
        'enabled:text-white disabled:text-gray-500',
    ]

    const ghostStyle = [
        'enabled:bg-transparent enabled:hover:bg-slate-200/50 disabled:bg-transparent',
        'enabled:text-red-500 disabled:text-gray-500',
    ]

    return (
        <button
            {...rest}
            className={clsx(
                'inline-flex gap-2 p-3 items-center justify-center text-center leading-0 rounded-2xl font-semibold selection-none transition-colors',
                'enabled:cursor-pointer disabled:cursor-not-allowed',
                ghost ? ghostStyle : primary,
                className
            )}
        >
            {children}
        </button>
    )
}
