import '@/styles/global.css'
import { Alexandria } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'

const font = Alexandria({ subsets: ['latin'] })

export const metadata = {
    title: 'pyro',
    themeColor: '#ef4444',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='pt-BR'>
            <body className={twMerge(font.className, 'bg-slate-100')}>
                {children}
                <Toaster />
            </body>
        </html>
    )
}
