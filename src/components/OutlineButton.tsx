import { twMerge } from 'tailwind-merge'

interface OutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    theme?: 'red' | 'light' | 'dark'
    children: React.ReactNode
    className?: string
}

const themes = {
    red: ['enabled:hover:bg-red-200/25', 'enabled:text-red-500 enabled:border-red-500'],
    light: ['enabled:hover:bg-slate-200/25', 'enabled:text-white enabled:border-slate-200'],
    dark: ['enabled:hover:bg-black/25', 'enabled:text-black enabled:border-black'],
}

export default function OutlineButton({ children, className, theme, ...rest }: OutlineButtonProps) {
    const currentTheme = themes[theme ?? 'light']

    return (
        <button
            {...rest}
            className={twMerge(
                'inline-flex gap-2 p-3 items-center leading-0 rounded-2xl font-semibold selection-none border-2 transition-colors',
                'enabled:cursor-pointer disabled:cursor-not-allowed bg-transparent disabled:text-gray-500',
                currentTheme,
                className
            )}
        >
            {children}
        </button>
    )
}
