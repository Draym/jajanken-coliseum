'use client'

import type {ReactNode} from 'react'

type MatchScreenLayoutProps = {
    top: ReactNode
    center: ReactNode
    bottom?: ReactNode | null
}

const playerProfileSlot =
    'w-[min(88%,17.5rem)] shrink-0 self-start sm:w-full sm:max-w-sm lg:max-w-md'

const opponentProfileSlot =
    'w-[min(88%,17.5rem)] shrink-0 self-end sm:ml-auto sm:w-full sm:max-w-sm lg:max-w-md'

export default function MatchScreenLayout({top, center, bottom}: MatchScreenLayoutProps) {
    return (
        <section className="game-section flex h-full flex-col justify-between">
            <div className={playerProfileSlot}>{top}</div>
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:gap-5 lg:gap-6">
                {center}
            </div>
            <div className={opponentProfileSlot}>
                {bottom ?? <div className="h-12 sm:h-14" aria-hidden="true" />}
            </div>
        </section>
    )
}
