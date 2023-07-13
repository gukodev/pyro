import clsx from 'clsx'
import { Alexandria } from 'next/font/google'
import './globals.css'

const font = Alexandria({ subsets: ['latin'] })

export const metadata = {
    title: 'pyro',
    themeColor: '#ef4444',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='pt-BR'>
            <body className={clsx(font.className, 'bg-slate-100')}>{children}</body>
        </html>
    )
}
