'use client'

import TechniqueHandCard from '@/components/technique-hand-card'
import TechniqueSelectionCarousel from '@/views/arena/components/match/technique-selection-carousel'
import type {TechniqueId} from '@/lib/techniques'

type SelectableTechniqueHandProps = {
    counts: Partial<Record<TechniqueId, number>>
    selected?: TechniqueId | null
    onSelect?: (techniqueId: TechniqueId | null) => void
    disabled?: boolean
}

const handOrder: TechniqueId[] = ['guu', 'paa', 'chi']

export default function SelectableTechniqueHand({
    counts,
    selected,
    onSelect,
    disabled,
}: SelectableTechniqueHandProps) {
    return (
        <>
            <div className="w-full sm:hidden">
                <TechniqueSelectionCarousel
                    counts={counts}
                    selected={selected}
                    onSelect={onSelect}
                    disabled={disabled}
                />
            </div>
            <div className="hidden w-full max-w-3xl items-end justify-center gap-3 sm:flex md:gap-8 lg:gap-10">
                {handOrder.map((techniqueId) => {
                    const count = counts[techniqueId] ?? 0
                    const canSelect = count > 0 && !disabled

                    return (
                        <TechniqueHandCard
                            key={techniqueId}
                            techniqueId={techniqueId}
                            count={count}
                            size="match"
                            selected={selected === techniqueId && count > 0}
                            interactive
                            disabled={!canSelect}
                            onSelect={() => {
                                if (canSelect) {
                                    onSelect?.(techniqueId)
                                }
                            }}
                        />
                    )
                })}
            </div>
        </>
    )
}
