'use client'

import Image from 'next/image'
import {techniqueCardAspectClass, techniques, type TechniqueId} from '@/lib/techniques'

export const MATCH_BATTLE_CARD_WIDTH_CLASS = 'w-[110px] sm:w-[150px] md:w-[175px] lg:w-[200px]' as const
export const MATCH_BATTLE_VS_FRAME_CLASS = 'h-20 w-[8rem] sm:h-24 sm:w-32 md:h-28 md:w-36' as const
const MATCH_BATTLE_CARD_IMAGE_SIZE = '200px'

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
                className={`relative flex items-center justify-center ${MATCH_BATTLE_CARD_WIDTH_CLASS} ${techniqueCardAspectClass} overflow-hidden rounded-2xl border border-dashed border-white/20 bg-black/25`}
            >
                {placeholder && (
                    <span
                        aria-hidden="true"
                        className="select-none text-4xl font-black leading-none text-white/30 sm:text-5xl md:text-6xl"
                    >
                        ?
                    </span>
                )}
            </div>
        )
    }

    const technique = techniques[techniqueId]

    return (
        <div className={`relative ${MATCH_BATTLE_CARD_WIDTH_CLASS} ${techniqueCardAspectClass}`}>
            <div
                className={`relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-black/40 ${dimmed ? 'opacity-55' : ''}`}
            >
                <Image
                    className="object-cover"
                    src={technique.image}
                    alt={technique.name}
                    fill
                    sizes={MATCH_BATTLE_CARD_IMAGE_SIZE}
                />
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
    const opponentIsPlaceholder = showOpponentPlaceholder && !opponentTechnique

    return (
        <div
            className={`flex w-full max-w-3xl flex-col items-center justify-center gap-6 py-4 sm:flex-row sm:gap-8 md:gap-12 ${
                animate ? 'transition-all duration-500' : ''
            }`}
        >
            <TechniqueSlot techniqueId={selfTechnique} placeholder={!selfTechnique} />

            <div className={`flex shrink-0 items-center justify-center ${MATCH_BATTLE_VS_FRAME_CLASS}`}>
                {centerLabel === 'VS' ? (
                    <Image
                        className="h-full w-auto max-w-full object-contain"
                        src="/rule4-img.png"
                        alt="VS"
                        width={96}
                        height={96}
                        priority
                    />
                ) : (
                    <p className="m-0 text-3xl font-black uppercase tracking-[0.2em] text-[#f7d436] sm:text-4xl">Draw</p>
                )}
            </div>

            <TechniqueSlot
                techniqueId={opponentTechnique}
                placeholder={opponentIsPlaceholder}
            />
        </div>
    )
}

export function MatchBattleCard({
    techniqueId,
    used,
    winner,
    loser,
    plain = false,
}: {
    techniqueId: TechniqueId
    used?: boolean
    winner?: boolean
    loser?: boolean
    plain?: boolean
}) {
    const technique = techniques[techniqueId]
    const image = used ? technique.imageUsed : technique.image

    const outcomeClass = plain
        ? ''
        : winner
          ? 'z-10 scale-110'
          : loser
            ? 'z-0 -rotate-6 scale-95 opacity-70'
            : ''

    return (
        <div className={`relative ${MATCH_BATTLE_CARD_WIDTH_CLASS} ${techniqueCardAspectClass} ${outcomeClass} transition-all duration-700`}>
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-black/40">
                <Image className="object-cover" src={image} alt={technique.name} fill sizes={MATCH_BATTLE_CARD_IMAGE_SIZE} />
            </div>
        </div>
    )
}

export function MatchBattlePlaceholder() {
    return (
        <div
            className={`${MATCH_BATTLE_CARD_WIDTH_CLASS} ${techniqueCardAspectClass} rounded-2xl border border-dashed border-white/20 bg-black/25`}
        />
    )
}
