import { Transition } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'

interface AdviceProps {
    show: boolean
    onClose: () => void
}

export default function Advice({ show, onClose }: AdviceProps) {
    return (
        <Transition
            show={show}
            appear={true}
            enterFrom='scale-0 opacity-0'
            enter='transition duration-200 ease-bounce-in'
            enterTo='scale-100 opacity-100'
            leaveFrom='scale-100 opacity-100'
            leave='transition duration-200 ease-bounce-out'
            leaveTo='scale-0 opacity-0'
            onClick={onClose}
            className={twMerge(
                'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-4',
                'text-zinc-900 bg-zinc-50 border-2 border-zinc-200'
            )}
            as='button'
        >
            <b>Dica:</b> Aperte espaço para gerar uma nova paleta!
        </Transition>
    )
}
