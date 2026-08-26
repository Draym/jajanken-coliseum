'use client'

import {useEffect} from 'react'
import type {TechniqueId} from '@/lib/techniques'
import {useArenaUi} from '@/contexts/arena-ui-context'
import {ArenaLobbyPanelContent} from '@/views/arena/components/arena-lobby-panel-content'

type ArenaLobbyPanelProps = {
    alivePlayers?: number
    techniqueSupply: Partial<Record<TechniqueId, number>>
    isLoading?: boolean
}

export default function ArenaLobbyPanel({alivePlayers, techniqueSupply, isLoading}: ArenaLobbyPanelProps) {
    const {isLobbyOpen, closeLobby} = useArenaUi()

    useEffect(() => {
        if (!isLobbyOpen) {
            return
        }

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [isLobbyOpen])

    const panelContent = (
        <ArenaLobbyPanelContent
            alivePlayers={alivePlayers}
            techniqueSupply={techniqueSupply}
            isLoading={isLoading}
        />
    )

    return (
        <>
            {isLobbyOpen && (
                <button
                    type="button"
                    className="arena-lobby-overlay lg:hidden"
                    onClick={closeLobby}
                    aria-label="Close lobby panel overlay"
                />
            )}

            <aside
                id="arena-lobby-drawer"
                className={`arena-sidebar arena-sidebar--mobile-drawer lg:hidden ${isLobbyOpen ? 'arena-sidebar--open' : ''}`}
                aria-hidden={!isLobbyOpen}
            >
                {panelContent}
            </aside>

            <aside className="arena-sidebar hidden lg:flex">{panelContent}</aside>
        </>
    )
}
