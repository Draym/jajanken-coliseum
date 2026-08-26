'use client'

import Link from 'next/link'
import AppLoadingScreen from '@/components/app-loading-screen'
import {useColiseumChain} from '@/contexts/coliseum-chain-context'
import {useArenaBootstrap} from '@/hooks/use-arena-bootstrap'
import {useColiseumArena} from '@/hooks/use-coliseum-arena'
import {useColiseumMatch} from '@/hooks/use-coliseum-match'
import {useColiseumPlayer} from '@/contexts/coliseum-player-context'
import ArenaGamePanel from '@/views/arena/components/arena-game-panel'
import ArenaLobbyPanel from '@/views/arena/components/arena-lobby-panel'
import MatchPanel from '@/views/arena/components/match/match-panel'
import {PostMatchEliminated} from '@/views/arena/components/match/post-match-screens'

export default function ArenaView() {
    const {isBootstrapping, loadingMessage} = useArenaBootstrap()
    const {profile, isPlayerInArena} = useColiseumPlayer()
    const {alivePlayers, techniqueSupply, isLoading: isArenaLoading} = useColiseumArena()
    const {joinMatch, isJoinMatchButtonLoading, isSearchingForMatch, activeMatchId} = useColiseumChain()
    const matchState = useColiseumMatch()
    const {isInMatch, uiPhase, postMatchScreen, dismissPostMatch} = matchState

    const showMatch =
        profile &&
        (isInMatch ||
            Boolean(activeMatchId) ||
            uiPhase === 'resolution' ||
            (uiPhase === 'post_match' && postMatchScreen !== null))

    if (isBootstrapping) {
        return <AppLoadingScreen message={loadingMessage} />
    }

    if (!isPlayerInArena || !profile) {
        if (uiPhase === 'post_match' && postMatchScreen === 'eliminated') {
            return (
                <div className="arena-layout">
                    <PostMatchEliminated onDismiss={dismissPostMatch} />
                    <ArenaLobbyPanel
                        alivePlayers={alivePlayers}
                        techniqueSupply={techniqueSupply}
                        isLoading={isArenaLoading}
                    />
                </div>
            )
        }

        return (
            <div className="arena-layout flex-col items-center justify-center px-4 text-center">
                <p className="text-sm text-white/55">You are not in the arena yet.</p>
                <Link
                    href="/game"
                    className="mt-4 inline-flex rounded-xl bg-brand-gold px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-brand-bg transition-opacity hover:opacity-90"
                >
                    Back to mode select
                </Link>
            </div>
        )
    }

    return (
        <div className="arena-layout">
            {showMatch ? (
                <MatchPanel profile={profile} match={matchState} />
            ) : (
                <ArenaGamePanel
                    profile={profile}
                    isJoinMatchButtonLoading={isJoinMatchButtonLoading}
                    isSearchingForMatch={isSearchingForMatch}
                    onJoinMatch={() => {
                        void joinMatch()
                    }}
                />
            )}
            <ArenaLobbyPanel
                alivePlayers={alivePlayers}
                techniqueSupply={techniqueSupply}
                isLoading={isArenaLoading}
            />
        </div>
    )
}
