'use client'

import {type ReactNode, useEffect} from 'react'
import {useAccount} from 'wagmi'
import type {PlayerProfile} from '@/lib/coliseum-contract'
import type {ColiseumMatchState, OpponentSnapshot} from '@/hooks/use-coliseum-match'
import {totalTechniques} from '@/lib/match/player-status'
import MatchActionButton from '@/views/arena/components/match/match-action-button'
import MatchBattleDisplay from '@/views/arena/components/match/match-battle-display'
import MatchPickScreen from '@/views/arena/components/match/match-pick-screen'
import MatchProfileBar from '@/views/arena/components/match/match-profile-bar'
import MatchResolution from '@/views/arena/components/match/match-resolution'
import MatchScreenLayout from '@/views/arena/components/match/match-screen-layout'
import {PostMatchCashout, PostMatchEliminated} from '@/views/arena/components/match/post-match-screens'

type MatchPanelProps = {
    profile: PlayerProfile
    match: ColiseumMatchState
}

function MatchStatusSlot({children}: {children: React.ReactNode}) {
    return (
        <div className="flex w-full max-w-md min-h-[5.125rem] flex-col items-center justify-center gap-3 sm:min-h-[5.625rem]">
            {children}
        </div>
    )
}

function WaitingBanner({message, canSkip, onSkip, isSkipLoading}: {
    message: string
    canSkip?: boolean
    onSkip?: () => void
    isSkipLoading?: boolean
}) {
    return (
        <div className="flex w-full max-w-md flex-col items-center gap-3">
            <p className="m-0 min-h-[1.25rem] text-center text-sm text-white/50">{message}</p>
            <div className="flex min-h-[2.875rem] items-center justify-center sm:min-h-[3.125rem]">
                {canSkip ? (
                    <MatchActionButton
                        label="Skip AFK opponent"
                        isLoading={isSkipLoading}
                        onClick={onSkip}
                        className="!mt-0"
                    />
                ) : null}
            </div>
        </div>
    )
}

export default function MatchPanel({profile, match}: MatchPanelProps) {
    const {address} = useAccount()
    const {
        matchId,
        opponent,
        uiPhase,
        postMatchScreen,
        selectedTechnique,
        setSelectedTechnique,
        committedTechnique,
        selfTechnique,
        opponentTechnique,
        resolutionData,
        canSkipPlay,
        canSkipReveal,
        isPlayMatchLoading,
        isRevealMatchLoading,
        isSkipAfkLoading,
        playMatch,
        revealMatch,
        skipAfkDuringPlay,
        skipAfkDuringReveal,
        finishResolution,
        dismissPostMatch,
        sessionSelf,
    } = match

    useEffect(() => {
        if (!selectedTechnique) {
            return
        }

        const supplyByTechnique = {
            guu: profile.guu,
            paa: profile.paa,
            chi: profile.chi,
        } as const

        if (supplyByTechnique[selectedTechnique] <= 0) {
            setSelectedTechnique(null)
        }
    }, [profile.chi, profile.guu, profile.paa, selectedTechnique, setSelectedTechnique])

    if (!address || !matchId) return null

    const enemy = opponent as OpponentSnapshot | undefined
    const selfLives = uiPhase === 'resolution' && sessionSelf ? sessionSelf.nen : profile.nen
    const selfTechniqueCount =
        uiPhase === 'resolution' && sessionSelf ? sessionSelf.totalTechniques : totalTechniques(profile)
    const selfBar = (
        <MatchProfileBar address={address} lives={selfLives} totalTechniques={selfTechniqueCount} />
    )
    const opponentBar = enemy ? (
        <MatchProfileBar address={enemy.address} lives={enemy.nen} totalTechniques={enemy.totalTechniques} />
    ) : (
        <div className="invisible pointer-events-none" aria-hidden="true">
            <MatchProfileBar address={address} lives={selfLives} totalTechniques={selfTechniqueCount} />
        </div>
    )

    if (uiPhase === 'post_match' && postMatchScreen === 'eliminated') {
        return <PostMatchEliminated onDismiss={dismissPostMatch} />
    }

    if (uiPhase === 'post_match' && postMatchScreen === 'cashout') {
        return <PostMatchCashout onDismiss={dismissPostMatch} />
    }

    if (uiPhase === 'resolution' && resolutionData) {
        return (
            <div className="arena-game-panel">
                <MatchScreenLayout
                    top={selfBar}
                    bottom={opponentBar}
                    center={
                        <MatchResolution matchId={matchId} resolution={resolutionData} onComplete={() => void finishResolution()} />
                    }
                />
            </div>
        )
    }

    return (
        <div className="arena-game-panel">
            <MatchScreenLayout
                top={selfBar}
                bottom={opponentBar}
                center={
                    <>
                        {uiPhase === 'select' && (
                            <MatchPickScreen
                                profile={profile}
                                selectedTechnique={selectedTechnique}
                                onSelect={setSelectedTechnique}
                                onFight={() => {
                                    if (selectedTechnique) {
                                        void playMatch(selectedTechnique)
                                    }
                                }}
                                isFightLoading={isPlayMatchLoading}
                            />
                        )}

                        {(uiPhase === 'commit_pending' ||
                            uiPhase === 'waiting_commit' ||
                            uiPhase === 'reveal_ready' ||
                            uiPhase === 'reveal_pending' ||
                            uiPhase === 'waiting_reveal') && (
                            <>
                                <MatchBattleDisplay
                                    selfTechnique={committedTechnique ?? selfTechnique}
                                    opponentTechnique={opponentTechnique}
                                    showOpponentPlaceholder={!opponentTechnique}
                                />

                                <MatchStatusSlot>
                                    {uiPhase === 'waiting_commit' && (
                                        <WaitingBanner
                                            message="Waiting for opponent to commit..."
                                            canSkip={canSkipPlay}
                                            isSkipLoading={isSkipAfkLoading}
                                            onSkip={() => void skipAfkDuringPlay()}
                                        />
                                    )}

                                    {uiPhase === 'reveal_ready' && (
                                        <MatchActionButton
                                            label="Reveal"
                                            isLoading={isRevealMatchLoading}
                                            onClick={() => void revealMatch()}
                                            className="!mt-0"
                                        />
                                    )}

                                    {uiPhase === 'waiting_reveal' && (
                                        <WaitingBanner
                                            message="Waiting for opponent to reveal..."
                                            canSkip={canSkipReveal}
                                            isSkipLoading={isSkipAfkLoading}
                                            onSkip={() => void skipAfkDuringReveal()}
                                        />
                                    )}

                                    {uiPhase === 'commit_pending' && (
                                        <p className="m-0 text-center text-sm text-white/50">Committing your move...</p>
                                    )}

                                    {uiPhase === 'reveal_pending' && (
                                        <p className="m-0 text-center text-sm text-white/50">Revealing your move...</p>
                                    )}
                                </MatchStatusSlot>
                            </>
                        )}
                    </>
                }
            />
        </div>
    )
}
