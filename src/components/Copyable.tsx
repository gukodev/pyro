import { Copy } from '@/assets/icons'
import { toast } from 'react-hot-toast'

type CopyableProps = {
    value: string
    label?: string
    side?: 'left' | 'right'
    successMessage?: string
    errorMessage?: string
}

const icon = <Copy size={18} weight='fill' />

export default function Copyable({
    value,
    label = value,
    side = 'left',
    successMessage = 'Copiado!',
    errorMessage = 'Ocorreu um erro ao copiar!',
}: CopyableProps) {
    const copy = () => {
        navigator.clipboard
            .writeText(value)
            .then(() => {
                toast.success(successMessage)
            })
            .catch((err) => {
                console.log(err)
                toast.error(errorMessage)
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
