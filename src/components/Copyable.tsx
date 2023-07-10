import { Copy } from '@/assets/icons'
import { copy } from '@/util/clipboard'

type CopyableProps = {
    value: string
    label?: string
    side?: 'left' | 'right'
}

const icon = <Copy size={18} weight='fill' />

export default function Copyable({ value, label = value, side = 'left' }: CopyableProps) {
    const doCopy = async () => {
        const success = await copy(value)
        if (success) return alert('✅ Copiado com sucesso.')
        alert('Não foi possível copiar a cor.')
    }

    return (
        <button
            className='inline-flex items-center gap-2 hover:opacity-75 transition-opacity'
            onClick={() => doCopy()}
        >
            {side === 'left' && icon}
            {label}
            {side === 'right' && icon}
        </button>
    )
}
