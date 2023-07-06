import { Copy } from '@/assets/icons'
import { copy } from '@/util/clipboard'

type CopyableProps = {
    text: string
    toCopy?: string
    copyText?: boolean
}

export default function Copyable({ text, toCopy, copyText }: CopyableProps) {
    const doCopy = async () => {
        const success = await copy(copyText ? text : toCopy || text)
        if (success) return alert('Cor copiada com sucesso!')
        alert('Não foi possível copiar a cor.')
    }

    return (
        <button
            className='inline-flex items-center gap-2 hover:opacity-75 transition-opacity'
            onClick={() => doCopy()}
        >
            <Copy weight='fill' size={18} />
            {text}
        </button>
    )
}
