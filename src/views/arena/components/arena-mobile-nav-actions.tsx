'use client'

import {useArenaUi} from '@/contexts/arena-ui-context'

const historyClassName =
    'inline-flex h-8 items-center justify-center rounded-lg border border-[#b8f04a] bg-[#b8f04a] px-2.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#0a1204] transition-colors'

const lobbyClassName =
    'inline-flex h-8 items-center gap-2 rounded-lg border border-[#b8f04a]/50 bg-[#110e19]/95 px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#d7ff7a] shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors'

export default function ArenaMobileNavActions() {
    const {isLobbyOpen, toggleLobby} = useArenaUi()

    return (
        <div className="flex items-center gap-1.5">
            <button type="button" className={historyClassName} disabled>
                History
            </button>
            <button
                type="button"
                className={`${lobbyClassName} ${isLobbyOpen ? 'border-[#b8f04a] bg-[#110e19]' : ''}`}
                onClick={toggleLobby}
                aria-pressed={isLobbyOpen}
                aria-expanded={isLobbyOpen}
                aria-controls="arena-lobby-drawer"
            >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                </svg>
                Lobby
            </button>
        </div>
    )
}
