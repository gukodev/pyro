import clsx from 'clsx'

interface OutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    primary?: boolean
    children: React.ReactNode
    className?: string
}

export default function OutlineButton({
    children,
    className,
    primary,
    ...rest
}: OutlineButtonProps) {
    const outlineRed = [
        'enabled:hover:bg-red-200/25',
        'enabled:text-red-500 enabled:border-red-500',
    ]

    const outlineGray = [
        'enabled:hover:bg-slate-200/25',
        'enabled:text-white enabled:border-slate-200',
    ]

    return (
        <button
            {...rest}
            className={clsx(
                'inline-flex gap-2 p-3 items-center leading-0 rounded-2xl font-semibold selection-none border-2 transition-colors',
                'enabled:cursor-pointer disabled:cursor-not-allowed bg-transparent disabled:text-gray-500',
                primary ? outlineRed : outlineGray,
                className
            )}
        >
            {children}
        </button>
    )
}
