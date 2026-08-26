'use client'

import type {PlayerProfile} from '@/lib/coliseum-contract'
import ArenaJoinMatchCta from '@/views/arena/components/arena-join-match-cta'
import ArenaGameHeader from '@/views/arena/components/arena-game-header'
import ArenaSearchingState from '@/views/arena/components/arena-searching-state'
import ArenaTechniqueHand from '@/views/arena/components/arena-technique-hand'

type ArenaGamePanelProps = {
    profile: PlayerProfile
    isJoinMatchButtonLoading?: boolean
    isSearchingForMatch?: boolean
    onJoinMatch?: () => void
}

export default function ArenaGamePanel({
    profile,
    isJoinMatchButtonLoading,
    isSearchingForMatch,
    onJoinMatch,
}: ArenaGamePanelProps) {
    return (
        <section className="arena-game">
            <ArenaGameHeader lives={profile.nen} />
            {isSearchingForMatch ? (
                <ArenaSearchingState />
            ) : (
                <div className="flex flex-1 flex-col items-center justify-start pt-28 pb-4 sm:justify-center sm:pt-0 sm:pb-0">
                    <div className="w-full max-w-6xl">
                        <ArenaTechniqueHand
                            counts={{
                                guu: profile.guu,
                                paa: profile.paa,
                                chi: profile.chi,
                            }}
                        />
                    </div>
                    <ArenaJoinMatchCta
                        isLoading={isJoinMatchButtonLoading}
                        disabled={isJoinMatchButtonLoading}
                        onClick={onJoinMatch}
                    />
                </div>
            )}
        </section>
    )
}
