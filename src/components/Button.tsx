import { CircleNotch } from '@/assets/icons'
import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    loading?: boolean
    ghost?: boolean
    className?: string
}

export default function Button({
    children,
    ghost,
    className,
    loading = false,
    ...rest
}: ButtonProps) {
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
            disabled={loading || rest.disabled}
            className={clsx(
                'inline-flex gap-2 p-3 items-center justify-center text-center leading-0 rounded-2xl font-semibold selection-none transition-colors',
                'enabled:cursor-pointer disabled:cursor-not-allowed',
                ghost ? ghostStyle : primary,
                className
            )}
        >
            {loading ? <CircleNotch size={24} weight='bold' className='animate-spin' /> : children}
        </button>
    )
}
