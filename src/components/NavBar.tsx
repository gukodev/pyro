import { Palette, Shuffle } from '@/assets/icons'
import Link from 'next/link'
import Button from './Button'

export default function NavBar() {
    return (
        <div className='py-6 border-b-4 border-slate-200 flex items-center justify-between mb-8'>
            <Link href='/'>
                <h1 className='text-4xl font-bold'>🔥 pyro</h1>
            </Link>
            <div className='flex items-center gap-4'>
                <Button ghost>
                    <Palette size={22} weight='bold' />
                    Paletas
                </Button>
                <Link href='/random'>
                    <Button>
                        <Shuffle size={22} weight='bold' />
                        Cor aleatória
                    </Button>
                </Link>
            </div>
        </div>
    )
}
