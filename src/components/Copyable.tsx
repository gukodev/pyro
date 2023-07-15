import { Copy } from '@/assets/icons'

type CopyableProps = {
    value: string
    label?: string
    side?: 'left' | 'right'
}

const icon = <Copy size={18} weight='fill' />

export default function Copyable({ value, label = value, side = 'left' }: CopyableProps) {
    const copy = () => {
        navigator.clipboard
            .writeText(value)
            .then(() => {
                return alert('✅ Copiado com sucesso.')
            })
            .catch((err) => {
                console.log(err)
                alert('Não foi possível copiar a cor.')
            })
    }

    return (
        <button
            className='inline-flex items-center gap-2 hover:opacity-75 transition-opacity'
            onClick={() => copy()}
        >
            {side === 'left' && icon}
            {label}
            {side === 'right' && icon}
        </button>
    )
}
