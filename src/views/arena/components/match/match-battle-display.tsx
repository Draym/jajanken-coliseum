'use client'

import Image from 'next/image'
import {getTechniqueImage, techniqueCardAspectClass, techniques, type TechniqueId} from '@/lib/techniques'

type MatchBattleDisplayProps = {
    selfTechnique?: TechniqueId | null
    opponentTechnique?: TechniqueId | null
    showOpponentPlaceholder?: boolean
    centerLabel?: 'VS' | 'DRAW'
    animate?: boolean
}

function TechniqueSlot({
    techniqueId,
    placeholder,
    dimmed,
}: {
    techniqueId?: TechniqueId | null
    placeholder?: boolean
    dimmed?: boolean
}) {
    if (placeholder || !techniqueId) {
        return (
            <div
                className={`relative w-[88px] sm:w-[120px] md:w-[140px] ${techniqueCardAspectClass} overflow-hidden rounded-2xl border border-dashed border-white/20 bg-black/25`}
            />
        )
    }

    const technique = techniques[techniqueId]

    return (
        <div className={`relative w-[88px] sm:w-[120px] md:w-[140px] ${techniqueCardAspectClass}`}>
            <div
                className={`relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-black/40 ${dimmed ? 'opacity-55' : ''}`}
            >
                <Image className="object-cover" src={technique.image} alt={technique.name} fill sizes="140px" />
            </div>
        </div>
    )
}

export default function MatchBattleDisplay({
    selfTechnique,
    opponentTechnique,
    showOpponentPlaceholder = true,
    centerLabel = 'VS',
    animate = false,
}: MatchBattleDisplayProps) {
    return (
        <div
            className={`flex w-full max-w-3xl flex-col items-center justify-center gap-6 py-4 sm:flex-row sm:gap-8 md:gap-12 ${
                animate ? 'transition-all duration-500' : ''
            }`}
        >
            <TechniqueSlot techniqueId={selfTechnique} placeholder={!selfTechnique} />

            <div className="flex shrink-0 flex-col items-center justify-center">
                {centerLabel === 'VS' ? (
                    <Image
                        className="h-16 w-auto sm:h-20 md:h-24"
                        src="/rule4-img.png"
                        alt="VS"
                        width={96}
                        height={96}
                    />
                ) : (
                    <p className="m-0 text-3xl font-black uppercase tracking-[0.2em] text-[#f7d436] sm:text-4xl">Draw</p>
                )}
            </div>

            <TechniqueSlot
                techniqueId={opponentTechnique}
                placeholder={showOpponentPlaceholder && !opponentTechnique}
            />
        </div>
    )
}

export function MatchBattleCard({
    techniqueId,
    used,
    winner,
    loser,
}: {
    techniqueId: TechniqueId
    used?: boolean
    winner?: boolean
    loser?: boolean
}) {
    const technique = techniques[techniqueId]
    const image = used ? technique.imageUsed : technique.image

    return (
        <div
            className={`relative w-[88px] sm:w-[120px] md:w-[140px] ${techniqueCardAspectClass} ${
                winner ? 'z-10 scale-110' : loser ? 'z-0 -rotate-6 scale-95 opacity-70' : ''
            } transition-all duration-700`}
        >
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-black/40">
                <Image className="object-cover" src={image} alt={technique.name} fill sizes="140px" />
            </div>
        </div>
    )
}
