'use client'

import {createContext, useCallback, useContext, useMemo, useState, type ReactNode} from 'react'

type ArenaUiContextValue = {
    isLobbyOpen: boolean
    openLobby: () => void
    closeLobby: () => void
    toggleLobby: () => void
}

const ArenaUiContext = createContext<ArenaUiContextValue | null>(null)

export function ArenaUiProvider({children}: {children: ReactNode}) {
    const [isLobbyOpen, setIsLobbyOpen] = useState(false)

    const openLobby = useCallback(() => setIsLobbyOpen(true), [])
    const closeLobby = useCallback(() => setIsLobbyOpen(false), [])
    const toggleLobby = useCallback(() => setIsLobbyOpen((open) => !open), [])

    const value = useMemo(
        () => ({
            isLobbyOpen,
            openLobby,
            closeLobby,
            toggleLobby,
        }),
        [isLobbyOpen, openLobby, closeLobby, toggleLobby],
    )

    return <ArenaUiContext.Provider value={value}>{children}</ArenaUiContext.Provider>
}

export function useArenaUi() {
    const context = useContext(ArenaUiContext)
    if (!context) {
        throw new Error('useArenaUi must be used within ArenaUiProvider')
    }
    return context
}
