'use client'

import {useState} from 'react'
import type {TechniqueId} from '@/lib/techniques'
import MatchClashAnimation, {type ClashOutcome} from '@/views/arena/components/match/match-clash-animation'

const SELF_TECHNIQUE: TechniqueId = 'guu'
const OPPONENT_TECHNIQUE: TechniqueId = 'chi'

const outcomes: {id: ClashOutcome; label: string; className: string}[] = [
    {id: 'win', label: 'Win', className: 'bg-[#b8f04a] text-[#0f0d14] hover:opacity-90'},
    {id: 'lose', label: 'Lose', className: 'bg-[#ff6b6b] text-white hover:opacity-90'},
    {id: 'draw', label: 'Draw', className: 'bg-[#f7d436] text-[#0f0d14] hover:opacity-90'},
]

export default function ClashPlayground() {
    const [outcome, setOutcome] = useState<ClashOutcome | null>(null)
    const [playKey, setPlayKey] = useState(0)

    const play = (next: ClashOutcome) => {
        setOutcome(next)
        setPlayKey((key) => key + 1)
    }

    return (
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
            <div className="relative z-10 flex shrink-0 flex-wrap items-center justify-center gap-3 border-b border-white/10 bg-[#120f1c]/80 px-4 py-4 backdrop-blur-md">
                <p className="m-0 w-full text-center text-xs font-bold uppercase tracking-[0.18em] text-white/45 sm:mr-4 sm:w-auto sm:text-left">
                    Clash playground · {SELF_TECHNIQUE.toUpperCase()} vs {OPPONENT_TECHNIQUE.toUpperCase()}
                </p>
                {outcomes.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => play(item.id)}
                        className={`rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-[0.08em] transition-opacity ${item.className}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center">
                {outcome ? (
                    <MatchClashAnimation
                        key={`${outcome}-${playKey}`}
                        playKey={playKey}
                        selfTechnique={SELF_TECHNIQUE}
                        opponentTechnique={OPPONENT_TECHNIQUE}
                        outcome={outcome}
                        autoDismiss={false}
                    />
                ) : (
                    <p className="m-0 text-sm text-white/40">Pick a result to play the clash animation</p>
                )}
            </div>
        </div>
    )
}
