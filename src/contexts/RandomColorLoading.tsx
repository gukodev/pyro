'use client'

import React, { PropsWithChildren, createContext, useContext, useState } from 'react'

export interface RandomColorLoadingContextProps {
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const RandomColorLoadingContext = createContext<RandomColorLoadingContextProps | null>(null)

export function useRandomColorLoading() {
    const context = useContext(RandomColorLoadingContext)
    if (!context) {
        throw new Error('useRandomColorLoading must be used within a RandomColorLoadingProvider')
    }
    return context
}

export function RandomColorLoadingProvider({ children }: PropsWithChildren) {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    return (
        <RandomColorLoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </RandomColorLoadingContext.Provider>
    )
}
