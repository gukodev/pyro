import { RandomColorLoadingProvider } from '@/contexts/RandomColorLoading'
import { Alexandria } from 'next/font/google'
import { twMerge } from 'tailwind-merge'
import './globals.css'

const font = Alexandria({ subsets: ['latin'] })

export const metadata = {
    title: 'pyro',
    themeColor: '#ef4444',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='pt-BR'>
            <body className={twMerge(font.className, 'bg-slate-100')}>
                <RandomColorLoadingProvider>{children}</RandomColorLoadingProvider>
            </body>
        </html>
    )
}
