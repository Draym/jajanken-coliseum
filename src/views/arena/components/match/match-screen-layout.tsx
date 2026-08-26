'use client'

import type {ReactNode} from 'react'

type MatchScreenLayoutProps = {
    top: ReactNode
    center: ReactNode
    bottom?: ReactNode | null
}

const playerProfileSlot =
    'w-[min(88%,17.5rem)] shrink-0 justify-self-start sm:w-full sm:max-w-sm lg:max-w-md'

const opponentProfileSlot =
    'w-[min(88%,17.5rem)] shrink-0 justify-self-end sm:w-full sm:max-w-sm lg:max-w-md'

const profileBarSlotMinHeight = 'min-h-[3.25rem] sm:min-h-16 lg:min-h-[4.5rem]'

export default function MatchScreenLayout({top, center, bottom}: MatchScreenLayoutProps) {
    return (
        <section className="game-section grid h-full grid-rows-[auto_1fr_auto]">
            <div className={`${playerProfileSlot} ${profileBarSlotMinHeight}`}>{top}</div>
            <div className="flex min-h-0 w-full flex-col items-center justify-center gap-4 sm:gap-5 lg:gap-6">
                {center}
            </div>
            <div className={`${opponentProfileSlot} ${profileBarSlotMinHeight}`}>
                {bottom ?? <div className="h-full" aria-hidden="true" />}
            </div>
        </section>
    )
}
